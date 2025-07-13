import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X } from 'lucide-react';
import { Button, Card, ProgressBar, InputGroup, FormControl } from 'react-bootstrap';
import { Howl } from 'howler';

export function AudioPlayer({ currentEpisode, isVisible, onClose, onProgressUpdate }) {
  const soundRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const intervalRef = useRef(null);

  // Initialize and update Howl instance when episode changes
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.unload(); // Stop and unload previous sound
    }

    if (currentEpisode && currentEpisode.file) {
      setIsLoading(true);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);

      const sound = new Howl({
        src: [currentEpisode.file],
        html5: true, // Force HTML5 Audio to prevent issues with some URLs
        volume: isMuted ? 0 : volume,
        onplay: () => {
          setIsPlaying(true);
          setIsLoading(false);
          setDuration(sound.duration());
          intervalRef.current = setInterval(() => {
            setCurrentTime(sound.seek());
            if (onProgressUpdate && currentEpisode) {
              onProgressUpdate(currentEpisode.id, sound.seek(), sound.duration());
            }
          }, 1000);
        },
        onpause: () => {
          setIsPlaying(false);
          clearInterval(intervalRef.current);
        },
        onend: () => {
          setIsPlaying(false);
          setCurrentTime(0);
          clearInterval(intervalRef.current);
        },
        onload: () => {
          setIsLoading(false);
          setDuration(sound.duration());
          // Auto-play if desired, or just set up for manual play
          // sound.play();
        },
        onloaderror: (id, error) => {
          console.error("Howler.js load error:", error);
          setIsLoading(false);
        },
        onplayerror: (id, error) => {
          console.error("Howler.js play error:", error);
          setIsLoading(false);
        },
      });
      soundRef.current = sound;
    }

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
      clearInterval(intervalRef.current);
    };
  }, [currentEpisode]);

  // Handle play/pause
  const togglePlay = () => {
    if (!soundRef.current) return;

    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
  };

  // Handle seek
  const handleSeek = (e) => {
    if (!soundRef.current || !duration) return;
    const seekTo = (e.target.value / 100) * duration;
    soundRef.current.seek(seekTo);
    setCurrentTime(seekTo);
  };

  // Handle skip forward/backward
  const skipForward = () => {
    if (!soundRef.current) return;
    const newTime = Math.min(soundRef.current.seek() + 15, duration);
    soundRef.current.seek(newTime);
    setCurrentTime(newTime);
  };

  const skipBackward = () => {
    if (!soundRef.current) return;
    const newTime = Math.max(soundRef.current.seek() - 15, 0);
    soundRef.current.seek(newTime);
    setCurrentTime(newTime);
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (soundRef.current) {
      soundRef.current.volume(newVolume);
    }
    setIsMuted(newVolume === 0);
  };

  // Handle mute/unmute
  const toggleMute = () => {
    if (!soundRef.current) return;
    
    if (isMuted) {
      soundRef.current.volume(volume); // Restore previous volume
      setIsMuted(false);
    } else {
      soundRef.current.volume(0);
      setIsMuted(true);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isVisible || !currentEpisode) {
    return null;
  }

  return (
    <div className="fixed-bottom bg-light border-top shadow-lg p-3">
      <Card className="border-0">
        <Card.Body>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="flex-grow-1 me-3">
              <h5 className="mb-0 text-truncate">{currentEpisode.title}</h5>
              <p className="text-muted mb-0 text-truncate">
                {currentEpisode.showTitle} • Season {currentEpisode.season}, Episode {currentEpisode.episode}
              </p>
            </div>
            <Button variant="light" onClick={onClose} className="ms-auto">
              <X size={20} />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <ProgressBar
              now={(currentTime / duration) * 100}
              onClick={handleSeek}
              style={{ cursor: 'pointer' }}
            />
            <div className="d-flex justify-content-between small text-muted mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <Button variant="light" onClick={skipBackward} className="me-2">
                <SkipBack size={20} />
              </Button>
              
              <Button 
                variant="primary" 
                className="rounded-circle d-flex align-items-center justify-content-center" 
                style={{ width: '48px', height: '48px' }}
                onClick={togglePlay} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : isPlaying ? (
                  <Pause size={24} />
                ) : (
                  <Play size={24} />
                )}
              </Button>
              
              <Button variant="light" onClick={skipForward} className="ms-2">
                <SkipForward size={20} />
              </Button>
            </div>

            {/* Volume Control */}
            <InputGroup className="w-25">
              <Button variant="light" onClick={toggleMute}>
                {isMuted || volume === 0 ? (
                  <VolumeX size={20} />
                ) : (
                  <Volume2 size={20} />
                )}
              </Button>
              <FormControl
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="form-range"
              />
            </InputGroup>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}


