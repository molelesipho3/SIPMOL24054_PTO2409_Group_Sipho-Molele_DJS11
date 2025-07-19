import { useState, useEffect } from 'react';
import { Favorite } from '@/types/podcast';
import { useAuth } from './useAuth';

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    if (user) {
      const storedFavorites = JSON.parse(localStorage.getItem('podcast-favorites') || '[]');
      const userFavorites = storedFavorites.filter((fav: Favorite) => fav.userId === user.id);
      setFavorites(userFavorites);
    } else {
      setFavorites([]);
    }
  }, [user]);

  const addFavorite = (
    showId: number,
    showTitle: string,
    seasonNumber: number,
    seasonTitle: string,
    episodeNumber: number,
    episodeTitle: string
  ) => {
    if (!user) return;

    const newFavorite: Favorite = {
      id: `${user.id}-${showId}-${seasonNumber}-${episodeNumber}`,
      userId: user.id,
      showId,
      showTitle,
      seasonNumber,
      seasonTitle,
      episodeNumber,
      episodeTitle,
      addedAt: new Date().toISOString()
    };

    const allFavorites = JSON.parse(localStorage.getItem('podcast-favorites') || '[]');
    const existingIndex = allFavorites.findIndex((fav: Favorite) => fav.id === newFavorite.id);
    
    if (existingIndex === -1) {
      allFavorites.push(newFavorite);
      localStorage.setItem('podcast-favorites', JSON.stringify(allFavorites));
      setFavorites(prev => [...prev, newFavorite]);
    }
  };

  const removeFavorite = (favoriteId: string) => {
    const allFavorites = JSON.parse(localStorage.getItem('podcast-favorites') || '[]');
    const filteredFavorites = allFavorites.filter((fav: Favorite) => fav.id !== favoriteId);
    localStorage.setItem('podcast-favorites', JSON.stringify(filteredFavorites));
    setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
  };

  const isFavorite = (showId: number, seasonNumber: number, episodeNumber: number): boolean => {
    if (!user) return false;
    const favoriteId = `${user.id}-${showId}-${seasonNumber}-${episodeNumber}`;
    return favorites.some(fav => fav.id === favoriteId);
  };

  const sortFavorites = (sortBy: 'title-asc' | 'title-desc' | 'newest' | 'oldest') => {
    const sorted = [...favorites].sort((a, b) => {
      switch (sortBy) {
        case 'title-asc':
          return a.episodeTitle.localeCompare(b.episodeTitle);
        case 'title-desc':
          return b.episodeTitle.localeCompare(a.episodeTitle);
        case 'newest':
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        case 'oldest':
          return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
        default:
          return 0;
      }
    });
    setFavorites(sorted);
  };

  const clearAllFavorites = () => {
    if (!user) return;
    
    const allFavorites = JSON.parse(localStorage.getItem('podcast-favorites') || '[]');
    const otherUsersFavorites = allFavorites.filter((fav: Favorite) => fav.userId !== user.id);
    localStorage.setItem('podcast-favorites', JSON.stringify(otherUsersFavorites));
    setFavorites([]);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    sortFavorites,
    clearAllFavorites
  };
};