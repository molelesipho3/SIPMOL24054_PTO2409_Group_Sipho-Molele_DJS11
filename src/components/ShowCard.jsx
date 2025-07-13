import { Link } from 'react-router-dom';
import { Calendar, Layers } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LazyImage } from './LazyImage';
import { formatDate, getGenreTitles, truncateText } from '@/lib/utils';

/**
 * Show card component for displaying show previews
 * @param {Object} props - Component props
 * @param {Object} props.show - Show data
 * @returns {JSX.Element}
 */
export function ShowCard({ show }) {
  const genreTitles = getGenreTitles(show.genres);

  return (
    <Link to={`/show/${show.id}`} className="block group">
      <Card className="h-full transition-all duration-200 hover:shadow-lg hover:scale-[1.02] group-hover:border-primary/50">
        <div className="aspect-square relative overflow-hidden rounded-t-lg">
          <LazyImage
            src={show.image}
            alt={show.title}
            className="w-full h-full transition-transform duration-200 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>
        
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {show.title}
          </CardTitle>
          <CardDescription className="line-clamp-3 text-sm">
            {truncateText(show.description, 120)}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-0 space-y-3">
          {/* Genres */}
          {genreTitles.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {genreTitles.slice(0, 2).map((genre) => (
                <Badge key={genre} variant="secondary" className="text-xs">
                  {genre}
                </Badge>
              ))}
              {genreTitles.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{genreTitles.length - 2}
                </Badge>
              )}
            </div>
          )}
          
          {/* Metadata */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Layers className="h-4 w-4" />
              <span>{show.seasons} season{show.seasons !== 1 ? 's' : ''}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(show.updated)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default ShowCard;

