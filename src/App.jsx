import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { AudioPlayer } from './components/AudioPlayer';
import { LandingPage } from './pages/LandingPage';
import { ShowsPage } from './pages/ShowsPage';
import { ShowDetailPage } from './pages/ShowDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { useLocalStorage } from './hooks/useLocalStorage';

function AppContent() {
  const { currentUser, login } = useAuth();
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [listeningHistory, setListeningHistory] = useLocalStorage('listening-history', []);

  const handlePlayEpisode = (episode) => {
    setCurrentEpisode(episode);
    setIsPlayerVisible(true);
  };

  const handleClosePlayer = () => {
    setIsPlayerVisible(false);
    setCurrentEpisode(null);
  };

  const handleProgressUpdate = (episodeId, currentTime, duration) => {
    const progress = {
      episodeId,
      currentTime,
      duration,
      timestamp: new Date().toISOString()
    };

    setListeningHistory(prev => {
      const existingIndex = prev.findIndex(item => item.episodeId === episodeId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = progress;
        return updated;
      }
      return [...prev, progress];
    });
  };

  // Warn user before closing if audio is playing
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isPlayerVisible && currentEpisode) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isPlayerVisible, currentEpisode]);

  return (
    <div className="container">
      <Header />
      
      <main className={isPlayerVisible ? 'pb-32' : ''}>
        <Routes>
          <Route path="/" element={<LandingPage onPlayEpisode={handlePlayEpisode} />} />
          <Route path="/shows" element={<ShowsPage onPlayEpisode={handlePlayEpisode} />} />
          <Route path="/show/:id" element={<ShowDetailPage onPlayEpisode={handlePlayEpisode} />} />
          <Route 
            path="/favorites" 
            element={
              currentUser ? (
                <FavoritesPage onPlayEpisode={handlePlayEpisode} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/profile" 
            element={
              currentUser ? (
                <ProfilePage onPlayEpisode={handlePlayEpisode} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/login" 
            element={
              currentUser ? (
                <Navigate to="/" replace />
              ) : (
                <LoginPage onLogin={login} />
              )
            } 
          />
          <Route 
            path="/signup" 
            element={
              currentUser ? (
                <Navigate to="/" replace />
              ) : (
                <SignUpPage />
              )
            } 
          />
        </Routes>
      </main>

      <AudioPlayer
        currentEpisode={currentEpisode}
        isVisible={isPlayerVisible}
        onClose={handleClosePlayer}
        onProgressUpdate={handleProgressUpdate}
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="podcast-theme">
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;


