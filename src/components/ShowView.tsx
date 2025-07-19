import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { podcastApi } from '@/services/podcastApi';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { useFavorites } from '@/hooks/useFavorites';
import { Show, Episode } from '@/types/podcast';
import { ArrowLeft, Play, Heart, Calendar, Clock, Loader2, ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShowViewProps {
  showId: number;
  onBack: () => void;
}

export const ShowView = ({ showId, onBack }: ShowViewProps) => {
  const [show, setShow] = useState<Show | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { playEpisode } = useAudioPlayer();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { toast } = useToast();

  useEffect(() => {
    loadShow();
  }, [showId]);

  const loadShow = async () => {
    try {
      const data = await podcastApi.getShow(showId);
      setShow(data);
      if (data.seasons.length > 0) {
        setSelectedSeason(data.seasons[0].season);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load show details. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlayEpisode = (episode: Episode) => {
    if (show && currentSeason) {
      playEpisode(episode, show.id, selectedSeason, currentSeason.episodes);
      toast({
        title: 'Now Playing',
        description: `${episode.title} - Episode ${episode.episode}`
      });
    }
  };

  const handleFavoriteToggle = (episode: Episode) => {
    if (!show) return;

    const currentSeason = show.seasons.find(s => s.season === selectedSeason);
    if (!currentSeason) return;

    const isCurrentlyFavorite = isFavorite(show.id, selectedSeason, episode.episode);
    
    if (isCurrentlyFavorite) {
      const favoriteId = `${show.id}-${selectedSeason}-${episode.episode}`;
      removeFavorite(favoriteId);
      toast({
        title: 'Removed from Favorites',
        description: `${episode.title} removed from your favorites`
      });
    } else {
      addFavorite(
        show.id,
        show.title,
        selectedSeason,
        currentSeason.title,
        episode.episode,
        episode.title
      );
      toast({
        title: 'Added to Favorites',
        description: `${episode.title} added to your favorites`
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading show details...</p>
        </div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Show not found.</p>
        <Button onClick={onBack} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Browse
        </Button>
      </div>
    );
  }

  const currentSeason = show.seasons.find(s => s.season === selectedSeason);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button onClick={onBack} variant="outline">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Browse
      </Button>

      {/* Show Header */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="relative">
          <div className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden">
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground animate-pulse" />
              </div>
            )}
            {imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            <img 
              src={currentSeason?.image || show.seasons[0]?.image} 
              alt={show.title}
              loading="lazy"
              className={`w-full h-full object-cover rounded-lg shadow-lg transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </div>
        </div>
        <div className="md:col-span-2 space-y-4">
          <h1 className="text-3xl font-bold">{show.title}</h1>
          <p className="text-muted-foreground">{show.description}</p>
          <div className="flex items-center gap-4 text-sm">
            <Badge variant="secondary">
              {show.seasons.length} season{show.seasons.length !== 1 ? 's' : ''}
            </Badge>
            {currentSeason && (
              <Badge variant="outline">
                {currentSeason.episodes.length} episode{currentSeason.episodes.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Season Selection */}
      <Tabs value={selectedSeason.toString()} onValueChange={(value) => setSelectedSeason(parseInt(value))}>
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${show.seasons.length}, 1fr)` }}>
          {show.seasons.map((season) => (
            <TabsTrigger key={season.season} value={season.season.toString()}>
              Season {season.season}
            </TabsTrigger>
          ))}
        </TabsList>

        {show.seasons.map((season) => (
          <TabsContent key={season.season} value={season.season.toString()} className="mt-6">
            <div className="grid gap-4">
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={season.image} 
                  alt={season.title}
                  className="w-16 h-16 rounded object-cover"
                />
                <div>
                  <h3 className="font-semibold">{season.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {season.episodes.length} episode{season.episodes.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                {season.episodes.map((episode) => (
                  <Card key={episode.episode} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg flex items-center gap-2">
                            Episode {episode.episode}: {episode.title}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {episode.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFavoriteToggle(episode)}
                            className={isFavorite(show.id, selectedSeason, episode.episode) ? 'text-red-500' : ''}
                          >
                            <Heart 
                              className={`h-4 w-4 ${
                                isFavorite(show.id, selectedSeason, episode.episode) 
                                  ? 'fill-current' 
                                  : ''
                              }`} 
                            />
                          </Button>
                          <Button onClick={() => handlePlayEpisode(episode)}>
                            <Play className="h-4 w-4 mr-2" />
                            Play
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};