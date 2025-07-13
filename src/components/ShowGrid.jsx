import { ShowCard } from './ShowCard';
import { PageLoading } from './LoadingSpinner';

/**
 * Show grid component for displaying multiple shows
 * @param {Object} props - Component props
 * @param {Array} props.shows - Array of shows
 * @param {boolean} props.loading - Loading state
 * @param {string} props.error - Error message
 * @returns {JSX.Element}
 */
export function ShowGrid({ shows, loading, error }) {
  if (loading) {
    return <PageLoading text="Loading shows..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-lg font-semibold text-destructive mb-2">Error loading shows</p>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!shows || shows.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">No shows found</p>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {shows.map((show) => (
        <ShowCard key={show.id} show={show} />
      ))}
    </div>
  );
}

export default ShowGrid;

