import { useState, useRef, useEffect } from 'react';
import { Episode, ListeningProgress } from '@/types/podcast';

interface AudioPlayerState {
  currentEpisode: Episode | null;
  showId: number | null;
  seasonNumber: number | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
}

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState<AudioPlayerState>({
    currentEpisode: null,
    showId: null,
    seasonNumber: null,
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
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
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

  const playEpisode = (episode: Episode, showId: number, seasonNumber: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    setState(prev => ({ 
      ...prev, 
      currentEpisode: episode,
      showId,
      seasonNumber,
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
    
    audio.oncanplay = () => {
      if (savedProgress && savedProgress.currentTime < savedProgress.duration) {
        audio.currentTime = savedProgress.currentTime;
      }
      audio.play();
      setState(prev => ({ ...prev, isPlaying: true, isLoading: false }));
    };
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (state.isPlaying) {
      audio.pause();
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
      audio.play();
    }
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
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

  return {
    ...state,
    audioRef,
    playEpisode,
    togglePlay,
    seek,
    setVolume
  };
};