import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { GENRE_MAP } from '../types/index.js';

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string to a human-readable format
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format duration in seconds to MM:SS or HH:MM:SS format
 * @param {number} seconds - Duration in seconds
 * @returns {string} - Formatted duration
 */
export function formatDuration(seconds) {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get genre titles from genre IDs
 * @param {number[]} genreIds - Array of genre IDs
 * @returns {string[]} - Array of genre titles
 */
export function getGenreTitles(genreIds) {
  return genreIds.map(id => GENRE_MAP[id]).filter(Boolean);
}

/**
 * Sort shows alphabetically by title
 * @param {Array} shows - Array of shows
 * @param {string} direction - 'asc' or 'desc'
 * @returns {Array} - Sorted shows
 */
export function sortShowsByTitle(shows, direction = 'asc') {
  return [...shows].sort((a, b) => {
    const comparison = a.title.localeCompare(b.title);
    return direction === 'asc' ? comparison : -comparison;
  });
}

/**
 * Sort shows by update date
 * @param {Array} shows - Array of shows
 * @param {string} direction - 'asc' or 'desc'
 * @returns {Array} - Sorted shows
 */
export function sortShowsByDate(shows, direction = 'asc') {
  return [...shows].sort((a, b) => {
    const dateA = new Date(a.updated);
    const dateB = new Date(b.updated);
    const comparison = dateA - dateB;
    return direction === 'asc' ? comparison : -comparison;
  });
}

/**
 * Filter shows by title (fuzzy search)
 * @param {Array} shows - Array of shows
 * @param {string} searchTerm - Search term
 * @returns {Array} - Filtered shows
 */
export function filterShowsByTitle(shows, searchTerm) {
  if (!searchTerm.trim()) return shows;
  
  const term = searchTerm.toLowerCase();
  return shows.filter(show => 
    show.title.toLowerCase().includes(term) ||
    show.description.toLowerCase().includes(term)
  );
}

/**
 * Filter shows by genre
 * @param {Array} shows - Array of shows
 * @param {number} genreId - Genre ID to filter by
 * @returns {Array} - Filtered shows
 */
export function filterShowsByGenre(shows, genreId) {
  if (!genreId) return shows;
  
  return shows.filter(show => show.genres.includes(genreId));
}

/**
 * Generate a unique ID for favorites
 * @param {number} showId - Show ID
 * @param {number} seasonNumber - Season number
 * @param {number} episodeNumber - Episode number
 * @returns {string} - Unique ID
 */
export function generateFavoriteId(showId, seasonNumber, episodeNumber) {
  return `${showId}-${seasonNumber}-${episodeNumber}`;
}

/**
 * Parse favorite ID back to components
 * @param {string} favoriteId - Favorite ID
 * @returns {Object} - { showId, seasonNumber, episodeNumber }
 */
export function parseFavoriteId(favoriteId) {
  const [showId, seasonNumber, episodeNumber] = favoriteId.split('-').map(Number);
  return { showId, seasonNumber, episodeNumber };
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Check if the user is on a mobile device
 * @returns {boolean} - True if mobile
 */
export function isMobile() {
  return window.innerWidth <= 768;
}

/**
 * Truncate text to a specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

