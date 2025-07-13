import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Heart, Calendar, Clock, Users } from 'lucide-react';
import { Button, Card, Badge, Tabs, Tab, Container, Row, Col } from 'react-bootstrap';
import { LazyImage } from '@/components/LazyImage';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useApi } from '@/hooks/useApi';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { formatDate, getGenreTitles } from '@/lib/utils';

export function ShowDetailPage({ onPlayEpisode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSeason, setSelectedSeason] = useState('1'); // Bootstrap Tabs use string keys
  const [favorites, setFavorites] = useLocalStorage('podcast-favorites', []);
  
  const { data: show, loading, error } = useApi(`https://podcast-api.netlify.app/id/${id}`);

  useEffect(() => {
    if (show && show.seasons && show.seasons.length > 0) {
      setSelectedSeason(show.seasons[0].season.toString()); // Set initial selected season to the first one
    }
  }, [show]);

  const handlePlayEpisode = (episode, seasonNumber) => {
    const episodeData = {
      id: `${show.id}-${seasonNumber}-${episode.episode}`,
      title: episode.title,
      description: episode.description,
      showTitle: show.title,
      showId: show.id,
      season: seasonNumber,
      episode: episode.episode,
      file: episode.file
    };
    onPlayEpisode(episodeData);
  };

  const toggleFavorite = (episode, seasonNumber) => {
    const episodeId = `${show.id}-${seasonNumber}-${episode.episode}`;
    const favoriteData = {
      id: episodeId,
      title: episode.title,
      description: episode.description,
      showTitle: show.title,
      showId: show.id,
      season: seasonNumber,
      episode: episode.episode,
      addedAt: new Date().toISOString()
    };

    const existingIndex = favorites.findIndex(fav => fav.id === episodeId);
    if (existingIndex >= 0) {
      // Remove from favorites
      setFavorites(favorites.filter(fav => fav.id !== episodeId));
    } else {
      // Add to favorites
      setFavorites([...favorites, favoriteData]);
    }
  };

  const isFavorite = (episode, seasonNumber) => {
    const episodeId = `${show.id}-${seasonNumber}-${episode.episode}`;
    return favorites.some(fav => fav.id === episodeId);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !show) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <h2 className="h4 mb-2">Show not found</h2>
          <p className="text-muted mb-4">
            The show you're looking for doesn't exist or couldn't be loaded.
          </p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft size={16} className="me-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const currentSeason = show.seasons?.find(season => season.season.toString() === selectedSeason);
  const genreTitles = getGenreTitles(show.genres);

  return (
    <div className="show-detail-page">
      {/* Header */}
      <div className="bg-light py-4">
        <Container>
          <Button
            variant="link"
            onClick={() => navigate('/')}
            className="mb-4 ps-0"
          >
            <ArrowLeft size={16} className="me-2" />
            Back to Shows
          </Button>

          <Row>
            {/* Show Image */}
            <Col md={4}>
              <div className="ratio ratio-1x1 rounded overflow-hidden shadow-sm">
                <LazyImage
                  src={show.image}
                  alt={show.title}
                  className="w-100 h-100 object-cover"
                />
              </div>
            </Col>

            {/* Show Info */}
            <Col md={8} className="mt-4 mt-md-0">
              <div>
                <h1 className="h2 mb-3">{show.title}</h1>
                <p className="text-muted lead">
                  {show.description}
                </p>
              </div>

              {/* Genres */}
              {genreTitles.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {genreTitles.map((genre) => (
                    <Badge key={genre} bg="secondary">
                      {genre}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Metadata */}
              <Row className="g-3 text-muted small">
                <Col xs={6} md={4} className="d-flex align-items-center">
                  <Users size={16} className="me-2" />
                  <span>{show.seasons?.length || 0} Seasons</span>
                </Col>
                <Col xs={6} md={4} className="d-flex align-items-center">
                  <Calendar size={16} className="me-2" />
                  <span>Updated {formatDate(show.updated)}</span>
                </Col>
                <Col xs={6} md={4} className="d-flex align-items-center">
                  <Clock size={16} className="me-2" />
                  <span>
                    {show.seasons?.reduce((total, season) => total + (season.episodes?.length || 0), 0) || 0} Episodes
                  </span>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Seasons and Episodes */}
      <Container className="py-4">
        {show.seasons && show.seasons.length > 0 ? (
          <Tabs activeKey={selectedSeason} onSelect={(k) => setSelectedSeason(k)} className="mb-4 custom-tabs">
            {/* Season Tabs */}
            {show.seasons.map((season) => (
              <Tab 
                key={season.season} 
                eventKey={season.season.toString()} 
                title={
                  <span className="d-flex align-items-center">
                    Season {season.season} <Badge pill bg="primary" className="ms-2">{season.episodes?.length || 0}</Badge>
                  </span>
                }
              >
                <Card className="mb-4 shadow-sm">
                  <Card.Body>
                    <div className="d-flex align-items-start gap-3">
                      {season.image && (
                        <div className="flex-shrink-0" style={{ width: '120px', height: '120px' }}>
                          <LazyImage
                            src={season.image}
                            alt={`Season ${season.season}`}
                            className="w-100 h-100 object-cover rounded"
                          />
                        </div>
                      )}
                      <div className="flex-grow-1">
                        <Card.Title className="h4 mb-2 text-primary">
                          Season {season.season}
                        </Card.Title>
                        <Card.Text className="text-muted mb-2">
                          {season.episodes?.length || 0} episodes
                        </Card.Text>
                        {season.title && (
                          <h5 className="font-weight-bold mb-2">{season.title}</h5>
                        )}
                      </div>
                    </div>
                  </Card.Body>
                </Card>

                {/* Episodes List */}
                <div className="list-group">
                  {currentSeason?.episodes && currentSeason.episodes.length > 0 ? (
                    currentSeason.episodes.map((episode) => (
                      <Card key={episode.episode} className="mb-3 shadow-sm episode-card">
                        <Card.Body>
                          <div className="d-flex align-items-center gap-3">
                            <div className="flex-shrink-0 d-flex justify-content-center align-items-center bg-primary text-white rounded-circle" style={{ width: '48px', height: '48px' }}>
                              <span className="font-weight-bold">
                                {episode.episode}
                              </span>
                            </div>
                            
                            <div className="flex-grow-1 min-w-0">
                              <Card.Title className="h5 mb-1 text-truncate">
                                {episode.title}
                              </Card.Title>
                              <Card.Text className="text-muted small mb-2 text-truncate-3-lines">
                                {episode.description}
                              </Card.Text>
                              
                              <div className="d-flex gap-2 align-items-center">
                                <Button
                                  onClick={() => handlePlayEpisode(episode, season.season)}
                                  size="sm"
                                  variant="primary"
                                  className="d-flex align-items-center gap-1"
                                >
                                  <Play size={16} />
                                  Play Episode
                                </Button>
                                
                                <Button
                                  variant={isFavorite(episode, season.season) ? "success" : "outline-secondary"}
                                  size="sm"
                                  onClick={() => toggleFavorite(episode, season.season)}
                                  className="d-flex align-items-center gap-1"
                                >
                                  <Heart size={16} className={isFavorite(episode, season.season) ? 'text-danger' : ''} />
                                  {isFavorite(episode, season.season) ? 'Favorited' : 'Add to Favorites'}
                                </Button>
                                <span className="text-muted small ms-auto">Added {formatDate(episode.addedAt)}</span>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    ))
                  ) : (
                    <Card className="text-center p-4 shadow-sm">
                      <Card.Text className="text-muted">No episodes available for this season.</Card.Text>
                    </Card>
                  )}
                </div>
              </Tab>
            ))}
          </Tabs>
        ) : (
          <Card className="text-center p-4 shadow-sm">
            <Card.Text className="text-muted">No seasons available for this show.</Card.Text>
          </Card>
        )}
      </Container>
    </div>
  );
}


