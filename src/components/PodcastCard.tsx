import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Preview, GENRES } from '@/types/podcast';
import { Calendar, Layers, Play, ImageIcon } from 'lucide-react';
import { useState } from 'react';

interface PodcastCardProps {
  podcast: Preview;
  onSelect: (id: number) => void;
}

export const PodcastCard = ({ podcast, onSelect }: PodcastCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getGenreTitles = (genreIds: number[]) => {
    return genreIds.map(id => GENRES[id]).filter(Boolean);
  };

  return (
    <Card className="group hover:shadow-glow transition-all duration-300 cursor-pointer overflow-hidden">
      <div className="relative">
        <div className="relative w-full h-48 bg-muted">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-muted-foreground animate-pulse" />
            </div>
          )}
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <img 
            src={podcast.image} 
            alt={podcast.title}
            loading="lazy"
            className={`w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <Button
            onClick={() => onSelect(podcast.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary/90 hover:bg-primary"
          >
            <Play className="h-4 w-4 mr-2" />
            View Show
          </Button>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{podcast.title}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-3">{podcast.description}</p>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Layers className="h-4 w-4" />
            <span>{podcast.seasons} season{podcast.seasons !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Updated {formatDate(podcast.updated)}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {getGenreTitles(podcast.genres).map((genre) => (
            <Badge key={genre} variant="secondary" className="text-xs">
              {genre}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};