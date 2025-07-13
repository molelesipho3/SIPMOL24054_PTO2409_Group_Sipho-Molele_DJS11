import { useState, useEffect, useMemo } from 'react';
import { useApi } from '@/hooks/useApi';
import { ShowGrid } from '@/components/ShowGrid';
import { FilterSort } from '@/components/FilterSort';
import { API_ENDPOINTS } from '@/types/index';
import { 
  sortShowsByTitle, 
  sortShowsByDate, 
  filterShowsByTitle, 
  filterShowsByGenre,
  debounce 
} from '@/lib/utils';

/**
 * Home page component
 * @param {Object} props - Component props
 * @param {string} props.searchTerm - Search term from header
 * @returns {JSX.Element}
 */
export function HomePage({ searchTerm }) {
  const [sortBy, setSortBy] = useState('title-asc');
  const [selectedGenre, setSelectedGenre] = useState('');
  
  // Fetch shows data
  const { data: shows, loading, error } = useApi(API_ENDPOINTS.SHOWS);

  // Memoized filtered and sorted shows
  const processedShows = useMemo(() => {
    if (!shows) return [];

    let filtered = shows;

    // Apply search filter
    if (searchTerm) {
      filtered = filterShowsByTitle(filtered, searchTerm);
    }

    // Apply genre filter
    if (selectedGenre) {
      filtered = filterShowsByGenre(filtered, parseInt(selectedGenre));
    }

    // Apply sorting
    const [sortField, sortDirection] = sortBy.split('-');
    if (sortField === 'title') {
      filtered = sortShowsByTitle(filtered, sortDirection);
    } else if (sortField === 'date') {
      filtered = sortShowsByDate(filtered, sortDirection);
    }

    return filtered;
  }, [shows, searchTerm, selectedGenre, sortBy]);

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Discover Podcasts</h1>
        <p className="text-muted-foreground">
          Explore thousands of podcasts across different genres and topics
        </p>
      </div>

      {/* Filter and Sort Controls */}
      <FilterSort
        sortBy={sortBy}
        onSortChange={handleSortChange}
        selectedGenre={selectedGenre}
        onGenreChange={handleGenreChange}
        totalShows={shows?.length || 0}
        filteredShows={processedShows.length}
      />

      {/* Shows Grid */}
      <ShowGrid 
        shows={processedShows} 
        loading={loading} 
        error={error} 
      />
    </div>
  );
}

export default HomePage;

