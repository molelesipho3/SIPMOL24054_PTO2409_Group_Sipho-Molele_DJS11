import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Play, Trash2, SortAsc, SortDesc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SimpleSelect } from '@/components/SimpleSelect';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { formatDate } from '@/lib/utils';

export function FavoritesPage({ onPlayEpisode }) {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useLocalStorage('podcast-favorites', []);
  const [sortBy, setSortBy] = useState('dateAdded');
  const [sortOrder, setSortOrder] = useState('desc');

  const sortOptions = [
    { value: 'title', label: 'Episode Title' },
    { value: 'showTitle', label: 'Show Title' },
    { value: 'dateAdded', label: 'Date Added' }
  ];

  const sortedFavorites = useMemo(() => {
    const sorted = [...favorites].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'showTitle':
          aValue = a.showTitle.toLowerCase();
          bValue = b.showTitle.toLowerCase();
          break;
        case 'dateAdded':
          aValue = new Date(a.addedAt);
          bValue = new Date(b.addedAt);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [favorites, sortBy, sortOrder]);

  // Group favorites by show
  const groupedFavorites = useMemo(() => {
    const groups = {};
    sortedFavorites.forEach(favorite => {
      const key = `${favorite.showTitle}-${favorite.season}`;
      if (!groups[key]) {
        groups[key] = {
          showTitle: favorite.showTitle,
          showId: favorite.showId,
          season: favorite.season,
          episodes: []
        };
      }
      groups[key].episodes.push(favorite);
    });
    return Object.values(groups);
  }, [sortedFavorites]);

  const removeFavorite = (episodeId) => {
    setFavorites(favorites.filter(fav => fav.id !== episodeId));
  };

  const clearAllFavorites = () => {
    if (window.confirm('Are you sure you want to remove all favorites? This action cannot be undone.')) {
      setFavorites([]);
    }
  };

  const handlePlayEpisode = (favorite) => {
    onPlayEpisode(favorite);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shows
            </Button>
            <div>
              <h1 className="text-3xl font-bold">My Favorites</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {favorites.length} favorite episode{favorites.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {favorites.length > 0 && (
            <Button
              variant="destructive"
              onClick={clearAllFavorites}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>

        {favorites.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-2xl font-semibold mb-2">No favorites yet</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start exploring shows and add episodes to your favorites to see them here.
              </p>
              <Button onClick={() => navigate('/')}>
                Browse Shows
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Sort Controls */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Sort by:</span>
                <SimpleSelect
                  value={sortBy}
                  onValueChange={setSortBy}
                  options={sortOptions}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSortOrder}
                  className="flex items-center gap-2"
                >
                  {sortOrder === 'asc' ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  )}
                  {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
                </Button>
              </div>
            </div>

            {/* Grouped Favorites */}
            <div className="space-y-8">
              {groupedFavorites.map((group) => (
                <Card key={`${group.showTitle}-${group.season}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">{group.showTitle}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Season {group.season} • {group.episodes.length} episode{group.episodes.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/show/${group.showId}`)}
                      >
                        View Show
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {group.episodes.map((favorite) => (
                        <div
                          key={favorite.id}
                          className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="font-semibold text-primary text-sm">
                              {favorite.episode}
                            </span>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold mb-1 line-clamp-2">
                              {favorite.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                              {favorite.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Badge variant="outline" className="text-xs">
                                Episode {favorite.episode}
                              </Badge>
                              <span>Added {formatDate(favorite.addedAt)}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => handlePlayEpisode(favorite)}
                              className="flex items-center gap-2"
                            >
                              <Play className="h-4 w-4" />
                              Play
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeFavorite(favorite.id)}
                              className="flex items-center gap-2 text-red-600 hover:text-red-700"
                            >
                              <Heart className="h-4 w-4 fill-current" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

