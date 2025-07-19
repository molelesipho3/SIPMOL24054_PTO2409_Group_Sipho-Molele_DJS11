import { useState, useEffect, createContext, useContext, ReactNode, createElement } from 'react';
import { User } from '@/types/podcast';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('podcast-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call - in real app, this would call your backend
      const users = JSON.parse(localStorage.getItem('podcast-users') || '[]');
      const foundUser = users.find((u: any) => 
        u.username === username && u.password === password
      );

      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('podcast-user', JSON.stringify(userWithoutPassword));
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const users = JSON.parse(localStorage.getItem('podcast-users') || '[]');
      
      // Check if user already exists
      if (users.some((u: any) => u.username === username || u.email === email)) {
        return false;
      }

      const newUser = {
        id: Date.now().toString(),
        username,
        email,
        name,
        password,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('podcast-users', JSON.stringify(users));

      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('podcast-user', JSON.stringify(userWithoutPassword));
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('podcast-user');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('podcast-user', JSON.stringify(updatedUser));

      // Also update in users storage
      const users = JSON.parse(localStorage.getItem('podcast-users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem('podcast-users', JSON.stringify(users));
      }
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    isLoading
  };

  return createElement(AuthContext.Provider, { value }, children);
};