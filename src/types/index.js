// Type definitions for the podcast app

/**
 * @typedef {Object} Preview
 * @property {number} id - Unique identifier for the show
 * @property {string} title - Title of the show
 * @property {string} description - Description of the show
 * @property {number} seasons - Number of seasons
 * @property {string} image - URL to the show's image
 * @property {number[]} genres - Array of genre IDs
 * @property {string} updated - ISO date string of last update
 */

/**
 * @typedef {Object} Genre
 * @property {number} id - Unique identifier for the genre
 * @property {string} title - Title of the genre
 * @property {string} description - Description of the genre
 * @property {string[]} shows - Array of show IDs
 */

/**
 * @typedef {Object} Episode
 * @property {number} episode - Episode number
 * @property {string} title - Title of the episode
 * @property {string} description - Description of the episode
 * @property {string} file - URL to the audio file
 */

/**
 * @typedef {Object} Season
 * @property {number} season - Season number
 * @property {string} title - Title of the season
 * @property {string} image - URL to the season's image
 * @property {Episode[]} episodes - Array of episodes in this season
 */

/**
 * @typedef {Object} Show
 * @property {number} id - Unique identifier for the show
 * @property {string} title - Title of the show
 * @property {string} description - Description of the show
 * @property {Season[]} seasons - Array of seasons
 * @property {string} image - URL to the show's image
 * @property {string[]} genres - Array of genre titles
 * @property {string} updated - ISO date string of last update
 */

/**
 * @typedef {Object} FavoriteEpisode
 * @property {number} showId - ID of the show
 * @property {string} showTitle - Title of the show
 * @property {number} seasonNumber - Season number
 * @property {string} seasonTitle - Title of the season
 * @property {number} episodeNumber - Episode number
 * @property {string} episodeTitle - Title of the episode
 * @property {string} episodeDescription - Description of the episode
 * @property {string} audioFile - URL to the audio file
 * @property {string} addedAt - ISO date string when added to favorites
 */

/**
 * @typedef {Object} ListeningProgress
 * @property {number} showId - ID of the show
 * @property {number} seasonNumber - Season number
 * @property {number} episodeNumber - Episode number
 * @property {number} currentTime - Current playback time in seconds
 * @property {number} duration - Total duration in seconds
 * @property {boolean} completed - Whether the episode was completed
 * @property {string} lastListened - ISO date string of last listen
 */

// Genre mapping
export const GENRE_MAP = {
  1: 'Personal Growth',
  2: 'Investigative Journalism',
  3: 'History',
  4: 'Comedy',
  5: 'Entertainment',
  6: 'Business',
  7: 'Fiction',
  8: 'News',
  9: 'Kids and Family'
};

// API endpoints
export const API_ENDPOINTS = {
  SHOWS: 'https://podcast-api.netlify.app',
  SHOW_DETAIL: (id) => `https://podcast-api.netlify.app/id/${id}`,
  GENRE: (id) => `https://podcast-api.netlify.app/genre/${id}`
};

export default {};

