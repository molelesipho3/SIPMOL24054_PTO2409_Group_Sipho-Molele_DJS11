import { Preview, Show, Genre } from '@/types/podcast';

const BASE_URL = 'https://podcast-api.netlify.app';

export const podcastApi = {
  async getAllShows(): Promise<Preview[]> {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch shows');
    }
    return response.json();
  },

  async getShow(id: number): Promise<Show> {
    const response = await fetch(`${BASE_URL}/id/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch show ${id}`);
    }
    return response.json().then(data => {
      data.seasons.forEach((season: any) => {
        season.episodes.forEach((episode: any) => {
          episode.file = 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3';
        });
      });
      return data;
    });
  },

  async getGenre(id: number): Promise<Genre> {
    const response = await fetch(`${BASE_URL}/genre/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch genre ${id}`);
    }
    return response.json();
  }
};