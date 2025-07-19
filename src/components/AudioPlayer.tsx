import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { Play, Pause, Volume2, VolumeX, Loader2, SkipForward, SkipBack, X, ChevronLeft, ChevronRight } from 'lucide-react';

export const AudioPlayer = () => {
  const {
    currentEpisode,
    episodes,
    currentEpisodeIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    isLoading,
    audioRef,
    togglePlay,
    seek,
    setVolume,
    endAudio,
    skipForward,
    skipBackward,
    playNextEpisode,
    playPreviousEpisode
  } = useAudioPlayer();

  // Warning before closing when audio is playing
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isPlaying) {
        e.preventDefault();
        e.returnValue = 'Audio is currently playing. Are you sure you want to leave?';
        return 'Audio is currently playing. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isPlaying]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (value: number[]) => {
    seek(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  return (
    <>
      {/* The actual audio element, always rendered but hidden */}
      <audio ref={audioRef} className="hidden" />
      
      {currentEpisode && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50">
          <Card className="rounded-none border-0">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate">{currentEpisode.title}</h4>
                  <p className="text-xs text-muted-foreground truncate">Episode {currentEpisode.episode}</p>
                </div>
                
                {/* End Audio Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={endAudio}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Audio Controls */}
              <div className="flex items-center justify-center gap-4 mb-3">
                {/* Previous Episode */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={playPreviousEpisode}
                  disabled={isLoading || currentEpisodeIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Skip Backward */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => skipBackward(15)}
                  disabled={isLoading}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>

                {/* Play/Pause Button */}
                <Button
                  variant="default"
                  size="lg"
                  onClick={togglePlay}
                  disabled={isLoading}
                  className="shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>

                {/* Skip Forward */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => skipForward(15)}
                  disabled={isLoading}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>

                {/* Next Episode */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={playNextEpisode}
                  disabled={isLoading || currentEpisodeIndex === episodes.length - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs text-muted-foreground tabular-nums">
                  {formatTime(currentTime)}
                </span>
                <Slider
                  value={[currentTime]}
                  onValueChange={handleSeek}
                  max={duration || 100}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground tabular-nums">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Volume Control */}
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setVolume(volume > 0 ? 0 : 1)}
                >
                  {volume > 0 ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
                <Slider
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                  max={1}
                  step={0.1}
                  className="w-24"
                />
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

