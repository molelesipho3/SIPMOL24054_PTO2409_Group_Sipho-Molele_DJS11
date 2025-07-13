import { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ShowGrid } from '@/components/ShowGrid';
import { FilterSort } from '@/components/FilterSort';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useApi } from '@/hooks/useApi';
import { getGenreTitles } from '@/lib/utils';

export function ShowsPage() {
  const { data: shows, loading, error } = useApi('https://podcast-api.netlify.app');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');

  // Get unique genres from all shows
  const genres = useMemo(() => {
    if (!shows) return [];
    const allGenres = shows.flatMap(show => getGenreTitles(show.genres));
    return [...new Set(allGenres)].sort();
  }, [shows]);

  // Filter and sort shows
  const filteredAndSortedShows = useMemo(() => {
    if (!shows) return [];

    let filtered = shows;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(show =>
        show.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        show.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getGenreTitles(show.genres).some(genre =>
          genre.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply genre filter
    if (selectedGenre !== 'all') {
      filtered = filtered.filter(show =>
        getGenreTitles(show.genres).includes(selectedGenre)
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'updated':
          aValue = new Date(a.updated);
          bValue = new Date(b.updated);
          break;
        case 'seasons':
          aValue = a.seasons;
          bValue = b.seasons;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [shows, searchTerm, selectedGenre, sortBy, sortOrder]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Failed to load shows</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please check your internet connection and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Discover Podcasts
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Explore our collection of {shows?.length || 0} amazing podcast shows
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search shows, genres, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="mb-8">
          <FilterSort
            genres={genres}
            selectedGenre={selectedGenre}
            onGenreChange={setSelectedGenre}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
          />
        </div>

        {/* Results Info */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {filteredAndSortedShows.length === shows?.length
              ? `Showing all ${filteredAndSortedShows.length} shows`
              : `Showing ${filteredAndSortedShows.length} of ${shows?.length || 0} shows`}
            {searchTerm && ` for "${searchTerm}"`}
            {selectedGenre !== 'all' && ` in ${selectedGenre}`}
          </p>
        </div>

        {/* Shows Grid */}
        {filteredAndSortedShows.length > 0 ? (
          <ShowGrid shows={filteredAndSortedShows} />
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No shows found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedGenre !== 'all'
                  ? "Try adjusting your search terms or filters to find what you're looking for."
                  : "No shows are available at the moment."}
              </p>
              {(searchTerm || selectedGenre !== 'all') && (
                <div className="space-x-2">
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-primary hover:underline"
                    >
                      Clear search
                    </button>
                  )}
                  {selectedGenre !== 'all' && (
                    <button
                      onClick={() => setSelectedGenre('all')}
                      className="text-primary hover:underline"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

