import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { Episode, ListeningProgress } from '@/types/podcast';

interface AudioPlayerState {
  currentEpisode: Episode | null;
  showId: number | null;
  seasonNumber: number | null;
  episodes: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
}

interface AudioPlayerContextType extends AudioPlayerState {
  audioRef: React.RefObject<HTMLAudioElement>;
  playEpisode: (episode: Episode, showId: number, seasonNumber: number, episodes: Episode[]) => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  endAudio: () => void;
  skipForward: (seconds?: number) => void;
  skipBackward: (seconds?: number) => void;
  playNextEpisode: () => void;
  playPreviousEpisode: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};

interface AudioPlayerProviderProps {
  children: ReactNode;
}

export const AudioPlayerProvider: React.FC<AudioPlayerProviderProps> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState<AudioPlayerState>({
    currentEpisode: null,
    showId: null,
    seasonNumber: null,
    episodes: [],
    currentEpisodeIndex: -1,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isLoading: false
  });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setState(prev => ({ ...prev, currentTime: audio.currentTime }));
    };

    const handleDurationChange = () => {
      setState(prev => ({ ...prev, duration: audio.duration }));
    };

    const handleLoadStart = () => {
      setState(prev => ({ ...prev, isLoading: true }));
    };

    const handleCanPlay = () => {
      setState(prev => ({ ...prev, isLoading: false }));
    };

    const handlePlay = () => {
      setState(prev => ({ ...prev, isPlaying: true }));
    };

    const handlePause = () => {
      setState(prev => ({ ...prev, isPlaying: false }));
    };

    const handleEnded = () => {
      setState(prev => ({ ...prev, isPlaying: false }));
      // Mark as completed in listening progress
      if (state.currentEpisode && state.showId && state.seasonNumber) {
        saveProgress({
          showId: state.showId,
          seasonNumber: state.seasonNumber,
          episodeNumber: state.currentEpisode.episode,
          currentTime: audio.duration,
          duration: audio.duration,
          completed: true,
          lastListened: new Date().toISOString()
        });
      }
      // Play next episode if available
      if (state.currentEpisodeIndex < state.episodes.length - 1) {
        playNextEpisode();
      } else {
        endAudio(); // End audio if no next episode
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [state.currentEpisode, state.showId, state.seasonNumber]);

  const saveProgress = (progress: ListeningProgress) => {
    const progressList = JSON.parse(localStorage.getItem('podcast-progress') || '[]');
    const existingIndex = progressList.findIndex((p: ListeningProgress) => 
      p.showId === progress.showId && 
      p.seasonNumber === progress.seasonNumber && 
      p.episodeNumber === progress.episodeNumber
    );

    if (existingIndex >= 0) {
      progressList[existingIndex] = progress;
    } else {
      progressList.push(progress);
    }

    localStorage.setItem('podcast-progress', JSON.stringify(progressList));
  };

  const playEpisode = (episode: Episode, showId: number, seasonNumber: number, episodes: Episode[]) => {
    console.log("playEpisode called with:", { episode: episode.title, showId, seasonNumber, episodes });
    const audio = audioRef.current;
    if (!audio) {
      console.log("Audio ref is null");
      return;
    }

    const currentEpisodeIndex = episodes.findIndex(e => e.episode === episode.episode);

    console.log("Setting state with episode:", episode.title);
    setState(prev => ({
      ...prev,
      currentEpisode: episode,
      showId,
      seasonNumber,
      episodes,
      currentEpisodeIndex,
      isLoading: true
    }));

    // Load saved progress if exists
    const progressList = JSON.parse(localStorage.getItem('podcast-progress') || '[]');
    const savedProgress = progressList.find((p: ListeningProgress) => 
      p.showId === showId && 
      p.seasonNumber === seasonNumber && 
      p.episodeNumber === episode.episode
    );

    audio.src = episode.file;
    audio.load();
    console.log('Attempting to load audio from:', episode.file);
    
    audio.oncanplay = () => {
      console.log('Audio can play, attempting to play');
      if (savedProgress && savedProgress.currentTime < savedProgress.duration) {
        audio.currentTime = savedProgress.currentTime;
        console.log('Seeking to saved progress:', savedProgress.currentTime);
      }
      // Try to play, but handle autoplay restrictions
      audio.play().then(() => {
        console.log('Audio started playing successfully');
      }).catch((error) => {
        console.log('Autoplay prevented, user interaction required:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      });
    };

    audio.onerror = (e) => {
      console.error('Audio error:', e);
      setState(prev => ({ ...prev, isLoading: false }));
    };
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) {
      console.log("Audio element not found for togglePlay");
      return;
    }

    if (state.isPlaying) {
      audio.pause();
      console.log("Audio paused");
      // Save progress when pausing
      if (state.currentEpisode && state.showId && state.seasonNumber) {
        saveProgress({
          showId: state.showId,
          seasonNumber: state.seasonNumber,
          episodeNumber: state.currentEpisode.episode,
          currentTime: audio.currentTime,
          duration: audio.duration,
          completed: false,
          lastListened: new Date().toISOString()
        });
      }
    } else {
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
      console.log("Audio play requested");
    }
  };

  const seek = (time: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = time;
    setState(prev => ({ ...prev, currentTime: time }));
  };

  const setVolume = (volume: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    setState(prev => ({ ...prev, volume }));
  };

  const endAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    audio.src = ""; // Clear the audio source
    
    // Save final progress
    if (state.currentEpisode && state.showId && state.seasonNumber) {
      saveProgress({
        showId: state.showId,
        seasonNumber: state.seasonNumber,
        episodeNumber: state.currentEpisode.episode,
        currentTime: audio.currentTime,
        duration: audio.duration,
        completed: false,
        lastListened: new Date().toISOString()
      });
    }

    setState(prev => ({ 
      ...prev, 
      currentEpisode: null,
      showId: null,
      seasonNumber: null,
      episodes: [],
      currentEpisodeIndex: -1,
      isPlaying: false,
      currentTime: 0
    }));
  };

  const skipForward = (seconds: number = 15) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Math.min(audio.currentTime + seconds, audio.duration);
    audio.currentTime = newTime;
    setState(prev => ({ ...prev, currentTime: newTime }));
  };

  const skipBackward = (seconds: number = 15) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Math.max(audio.currentTime - seconds, 0);
    audio.currentTime = newTime;
    setState(prev => ({ ...prev, currentTime: newTime }));
  };

  const value: AudioPlayerContextType = {
    ...state,
    audioRef,
    playEpisode,
    togglePlay,
    seek,
    setVolume,
    endAudio,
    skipForward,
    skipBackward,
    playNextEpisode,
    playPreviousEpisode
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
};



  const playNextEpisode = () => {
    const { episodes, currentEpisodeIndex, showId, seasonNumber } = state;
    if (currentEpisodeIndex < episodes.length - 1) {
      const nextEpisode = episodes[currentEpisodeIndex + 1];
      if (nextEpisode && showId && seasonNumber) {
        playEpisode(nextEpisode, showId, seasonNumber, episodes);
      }
    }
  };

  const playPreviousEpisode = () => {
    const { episodes, currentEpisodeIndex, showId, seasonNumber } = state;
    if (currentEpisodeIndex > 0) {
      const previousEpisode = episodes[currentEpisodeIndex - 1];
      if (previousEpisode && showId && seasonNumber) {
        playEpisode(previousEpisode, showId, seasonNumber, episodes);
      }
    }
  };

