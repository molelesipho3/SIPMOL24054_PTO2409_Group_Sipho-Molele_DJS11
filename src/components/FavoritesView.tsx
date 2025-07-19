import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFavorites } from '@/hooks/useFavorites';
import { Heart, Play, Trash2, Filter, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FavoritesViewProps {
  onShowSelect: (showId: number) => void;
}

export const FavoritesView = ({ onShowSelect }: FavoritesViewProps) => {
  const { favorites, removeFavorite, sortFavorites, clearAllFavorites } = useFavorites();
  const { toast } = useToast();
  const [sortBy, setSortBy] = useState<'title-asc' | 'title-desc' | 'newest' | 'oldest'>('newest');

  const handleSort = (value: 'title-asc' | 'title-desc' | 'newest' | 'oldest') => {
    setSortBy(value);
    sortFavorites(value);
  };

  const handleRemoveFavorite = (favoriteId: string, episodeTitle: string) => {
    removeFavorite(favoriteId);
    toast({
      title: 'Removed from Favorites',
      description: `${episodeTitle} removed from your favorites`
    });
  };

  const handleClearAll = () => {
    clearAllFavorites();
    toast({
      title: 'All Favorites Cleared',
      description: 'All your favorite episodes have been removed'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Group favorites by show
  const groupedFavorites = favorites.reduce((acc, favorite) => {
    const key = `${favorite.showId}-${favorite.showTitle}`;
    if (!acc[key]) {
      acc[key] = {
        showId: favorite.showId,
        showTitle: favorite.showTitle,
        episodes: []
      };
    }
    acc[key].episodes.push(favorite);
    return acc;
  }, {} as Record<string, { showId: number; showTitle: string; episodes: typeof favorites }>);

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold mb-2">No Favorites Yet</h3>
        <p className="text-muted-foreground mb-4">
          Start exploring podcasts and add episodes to your favorites!
        </p>
        <Button onClick={() => {}}>Browse Podcasts</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Your Favorites</h2>
          <p className="text-muted-foreground">
            {favorites.length} favorite episode{favorites.length !== 1 ? 's' : ''} 
            {Object.keys(groupedFavorites).length > 0 && 
              ` from ${Object.keys(groupedFavorites).length} show${Object.keys(groupedFavorites).length !== 1 ? 's' : ''}`
            }
          </p>
        </div>
        
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={handleSort}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest Added</SelectItem>
              <SelectItem value="oldest">Oldest Added</SelectItem>
              <SelectItem value="title-asc">Title A-Z</SelectItem>
              <SelectItem value="title-desc">Title Z-A</SelectItem>
            </SelectContent>
          </Select>
          
          {favorites.length > 0 && (
            <Button variant="outline" onClick={handleClearAll}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Grouped Favorites */}
      <div className="space-y-6">
        {Object.values(groupedFavorites).map(({ showId, showTitle, episodes }) => (
          <Card key={`${showId}-${showTitle}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Button
                    variant="link"
                    onClick={() => onShowSelect(showId)}
                    className="p-0 h-auto text-lg font-semibold"
                  >
                    {showTitle}
                  </Button>
                  <Badge variant="secondary">
                    {episodes.length} episode{episodes.length !== 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {episodes.map((favorite) => (
                  <div
                    key={favorite.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium truncate">{favorite.episodeTitle}</h4>
                        <Badge variant="outline" className="text-xs shrink-0">
                          Episode {favorite.episodeNumber}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {favorite.seasonTitle} (Season {favorite.seasonNumber})
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Added {formatDate(favorite.addedAt)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFavorite(favorite.id, favorite.episodeTitle)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Heart className="h-4 w-4 fill-current" />
                      </Button>
                      <Button
                        onClick={() => onShowSelect(favorite.showId)}
                        size="sm"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Listen
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};