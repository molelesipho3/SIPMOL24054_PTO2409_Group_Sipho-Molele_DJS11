import { Filter, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SimpleSelect } from '@/components/SimpleSelect';
import { Badge } from '@/components/ui/badge';
import { GENRE_MAP } from '@/types/index';

/**
 * Filter and sort component
 * @param {Object} props - Component props
 * @param {string} props.sortBy - Current sort option
 * @param {Function} props.onSortChange - Sort change handler
 * @param {number} props.selectedGenre - Selected genre ID
 * @param {Function} props.onGenreChange - Genre change handler
 * @param {number} props.totalShows - Total number of shows
 * @param {number} props.filteredShows - Number of filtered shows
 * @returns {JSX.Element}
 */
export function FilterSort({ 
  sortBy, 
  onSortChange, 
  selectedGenre, 
  onGenreChange, 
  totalShows, 
  filteredShows 
}) {
  const sortOptions = [
    { value: 'title-asc', label: 'Title A-Z' },
    { value: 'title-desc', label: 'Title Z-A' },
    { value: 'date-desc', label: 'Recently Updated' },
    { value: 'date-asc', label: 'Oldest Updated' }
  ];

  const genreOptions = [
    { value: '', label: 'All Genres' },
    ...Object.entries(GENRE_MAP).map(([id, title]) => ({
      value: id,
      label: title
    }))
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
      {/* Results count */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          Showing {filteredShows} of {totalShows} shows
        </span>
        {selectedGenre && (
          <Badge variant="secondary" className="text-xs">
            {GENRE_MAP[selectedGenre]}
          </Badge>
        )}
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        {/* Genre Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <SimpleSelect 
            value={selectedGenre?.toString() || ''} 
            onValueChange={onGenreChange}
            options={genreOptions}
            placeholder="Filter by genre"
            className="w-[180px]"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <SimpleSelect 
            value={sortBy} 
            onValueChange={onSortChange}
            options={sortOptions}
            placeholder="Sort by"
            className="w-[180px]"
          />
        </div>

        {/* Clear Filters */}
        {(selectedGenre || sortBy !== 'title-asc') && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onGenreChange('');
              onSortChange('title-asc');
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}

export default FilterSort;

