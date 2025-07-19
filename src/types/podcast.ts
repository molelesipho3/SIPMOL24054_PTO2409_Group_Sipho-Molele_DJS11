export interface Preview {
  id: number;
  title: string;
  description: string;
  seasons: number;
  image: string;
  genres: number[];
  updated: string;
}

export interface Show {
  id: number;
  title: string;
  description: string;
  seasons: Season[];
}

export interface Season {
  season: number;
  title: string;
  image: string;
  episodes: Episode[];
}

export interface Episode {
  episode: number;
  title: string;
  description: string;
  file: string;
}

export interface Genre {
  id: number;
  title: string;
  description: string;
  shows: number[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  profileImage?: string;
  createdAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  showId: number;
  showTitle: string;
  seasonNumber: number;
  seasonTitle: string;
  episodeNumber: number;
  episodeTitle: string;
  addedAt: string;
}

export interface ListeningProgress {
  showId: number;
  seasonNumber: number;
  episodeNumber: number;
  currentTime: number;
  duration: number;
  completed: boolean;
  lastListened: string;
}

export const GENRES: Record<number, string> = {
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

export type SortOption = 'title-asc' | 'title-desc' | 'updated-newest' | 'updated-oldest';