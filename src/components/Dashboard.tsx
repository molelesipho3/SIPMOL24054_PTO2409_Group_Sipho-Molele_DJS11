import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { PodcastCard } from './PodcastCard';
import { ShowView } from './ShowView';
import { ProfileView } from './ProfileView';
import { FavoritesView } from './FavoritesView';
import { AudioPlayer } from './AudioPlayer';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { podcastApi } from '@/services/podcastApi';
import { Preview, GENRES, SortOption } from '@/types/podcast';
import { Search, Filter, LogOut, User, Heart, Home, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('home');
  const [podcasts, setPodcasts] = useState<Preview[]>([]);
  const [filteredPodcasts, setFilteredPodcasts] = useState<Preview[]>([]);
  const [selectedShow, setSelectedShow] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('title-asc');

  useEffect(() => {
    loadPodcasts();
  }, []);

  useEffect(() => {
    filterAndSortPodcasts();
  }, [podcasts, searchTerm, selectedGenre, sortBy]);

  const loadPodcasts = async () => {
    try {
      const data = await podcastApi.getAllShows();
      setPodcasts(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load podcasts. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortPodcasts = () => {
    let filtered = [...podcasts];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(podcast =>
        podcast.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        podcast.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Genre filter
    if (selectedGenre !== 'all') {
      const genreId = parseInt(selectedGenre);
      filtered = filtered.filter(podcast =>
        podcast.genres.includes(genreId)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'updated-newest':
          return new Date(b.updated).getTime() - new Date(a.updated).getTime();
        case 'updated-oldest':
          return new Date(a.updated).getTime() - new Date(b.updated).getTime();
        default:
          return 0;
      }
    });

    setFilteredPodcasts(filtered);
  };

  const handleShowSelect = (showId: number) => {
    setSelectedShow(showId);
    setActiveTab('show');
  };

  const handleBackToHome = () => {
    setSelectedShow(null);
    setActiveTab('home');
  };

  const handleLogout = () => {
    logout();
    toast({
      title: 'Goodbye!',
      description: 'You have been logged out successfully.'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading your podcasts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                PodcastHub
              </h1>
              <Badge variant="secondary" className="text-xs">
                {favorites.length} favorites
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Welcome, {user?.name}
              </span>
              <ThemeToggle />
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="home" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Browse</span>
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Favorites</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="show" className="hidden" />
          </TabsList>

          <TabsContent value="home" className="mt-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search podcasts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  {Object.entries(GENRES).map(([id, title]) => (
                    <SelectItem key={id} value={id}>{title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title-asc">Title A-Z</SelectItem>
                  <SelectItem value="title-desc">Title Z-A</SelectItem>
                  <SelectItem value="updated-newest">Newest Updated</SelectItem>
                  <SelectItem value="updated-oldest">Oldest Updated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results Count */}
            <p className="text-sm text-muted-foreground mb-4">
              Showing {filteredPodcasts.length} of {podcasts.length} podcasts
            </p>

            {/* Podcasts Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPodcasts.map((podcast) => (
                <PodcastCard
                  key={podcast.id}
                  podcast={podcast}
                  onSelect={handleShowSelect}
                />
              ))}
            </div>

            {filteredPodcasts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No podcasts found matching your criteria.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            <FavoritesView onShowSelect={handleShowSelect} />
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <ProfileView />
          </TabsContent>

          <TabsContent value="show" className="mt-6">
            {selectedShow && (
              <ShowView showId={selectedShow} onBack={handleBackToHome} />
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Audio Player */}
      <AudioPlayer />
    </div>
  );
};