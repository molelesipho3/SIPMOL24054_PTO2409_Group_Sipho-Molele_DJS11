import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (user) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentUser(user);
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  const updateProfile = (updatedProfileData) => {
    setCurrentUser(prevUser => {
      const updatedUser = {
        ...prevUser,
        profile: { ...prevUser.profile, ...updatedProfileData }
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      // Also update the user in the 'users' array in localStorage
      const allUsers = JSON.parse(localStorage.getItem('users')) || [];
      const updatedAllUsers = allUsers.map(user => 
        user.username === updatedUser.username ? updatedUser : user
      );
      localStorage.setItem('users', JSON.stringify(updatedAllUsers));

      return updatedUser;
    });
  };

  const value = {
    currentUser,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


