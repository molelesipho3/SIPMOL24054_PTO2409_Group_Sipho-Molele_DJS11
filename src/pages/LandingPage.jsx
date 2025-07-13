import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Heart, Search, Headphones, Star, Users, TrendingUp } from 'lucide-react';
import { Button, Card, Row, Col, Container } from 'react-bootstrap';
import { useApi } from '@/hooks/useApi';

export function LandingPage() {
  const { data: shows, loading } = useApi('https://podcast-api.netlify.app');
  const [featuredShows, setFeaturedShows] = useState([]);

  useEffect(() => {
    if (shows && shows.length > 0) {
      const shuffled = [...shows].sort(() => 0.5 - Math.random());
      setFeaturedShows(shuffled.slice(0, 6));
    }
  }, [shows]);

  const features = [
    {
      icon: Headphones,
      title: "High-Quality Audio",
      description: "Stream your favorite podcasts in crystal clear audio quality with our advanced player."
    },
    {
      icon: Heart,
      title: "Save Favorites",
      description: "Mark your favorite episodes and create personalized playlists for easy access."
    },
    {
      icon: Search,
      title: "Smart Discovery",
      description: "Find new podcasts with our intelligent search and recommendation system."
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Keep track of your listening progress and never lose your place in an episode."
    }
  ];

  const stats = [
    { icon: Users, value: shows?.length || 0, label: "Podcast Shows" },
    { icon: Play, value: "1000+", label: "Episodes" },
    { icon: Star, value: "4.8", label: "User Rating" },
    { icon: TrendingUp, value: "50K+", label: "Active Listeners" }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section text-center py-5">
        <Container>
          <h1 className="display-4 font-weight-bold mb-3">
            Your Ultimate Podcast Destination
          </h1>
          <p className="lead mb-4">
            Discover, listen, and enjoy thousands of podcasts from around the world. 
            Your next favorite show is just a click away.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button variant="primary" size="lg" as={Link} to="/shows">
              <Play size={20} className="me-2" />
              Start Listening
            </Button>
            <Button variant="outline-primary" size="lg" as={Link} to="/shows">
              <Search size={20} className="me-2" />
              Browse Shows
            </Button>
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-5 bg-light">
        <Container>
          <Row className="text-center">
            {stats.map((stat, index) => (
              <Col key={index} xs={6} md={3} className="mb-4">
                <div className="icon-circle mx-auto mb-3">
                  <stat.icon size={30} />
                </div>
                <div className="h3 font-weight-bold">{stat.value}</div>
                <div className="text-muted">{stat.label}</div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="h1 font-weight-bold mb-3">
              Why Choose PodCast?
            </h2>
            <p className="lead">
              Experience podcasting like never before with our feature-rich platform designed for true podcast enthusiasts.
            </p>
          </div>
          
          <Row>
            {features.map((feature, index) => (
              <Col key={index} md={6} lg={3} className="mb-4">
                <Card className="text-center h-100">
                  <Card.Body>
                    <div className="icon-circle mx-auto mb-3">
                      <feature.icon size={30} />
                    </div>
                    <Card.Title className="h5">{feature.title}</Card.Title>
                    <Card.Text className="text-muted">
                      {feature.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Featured Shows Section */}
      <section className="featured-shows-section py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="h1 font-weight-bold mb-3">
              Featured Shows
            </h2>
            <p className="lead">
              Discover some of the most popular and trending podcast shows on our platform.
            </p>
          </div>

          {loading ? (
            <Row>
              {[...Array(6)].map((_, i) => (
                <Col key={i} md={6} lg={4} className="mb-4">
                  <Card>
                    <div className="placeholder-glow ratio ratio-1x1">
                      <div className="placeholder w-100 h-100"></div>
                    </div>
                    <Card.Body>
                      <div className="placeholder-glow">
                        <div className="placeholder w-75 mb-2"></div>
                        <div className="placeholder w-50"></div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Row>
              {featuredShows.map((show) => (
                <Col key={show.id} md={6} lg={4} className="mb-4">
                  <Card className="h-100">
                    <div className="position-relative">
                      <Card.Img variant="top" src={show.image} alt={show.title} className="ratio ratio-1x1" />
                      <span className="badge bg-secondary position-absolute top-0 end-0 m-2">
                        {show.seasons} Season{show.seasons !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <Card.Body>
                      <Card.Title className="h5">{show.title}</Card.Title>
                      <Card.Text className="text-muted">
                        {show.description}
                      </Card.Text>
                      <Button variant="primary" as={Link} to={`/show/${show.id}`} className="w-100">
                        <Play size={16} className="me-2" />
                        Listen Now
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          <div className="text-center mt-4">
            <Button variant="primary" size="lg" as={Link} to="/shows">
              View All Shows
            </Button>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section bg-primary text-white text-center py-5">
        <Container>
          <h2 className="h1 font-weight-bold mb-3">
            Ready to Start Your Podcast Journey?
          </h2>
          <p className="lead mb-4">
            Join thousands of listeners who have already discovered their next favorite show. 
            Start exploring our vast collection of podcasts today.
          </p>
          <Button variant="light" size="lg" as={Link} to="/shows">
            <Headphones size={20} className="me-2" />
            Explore Podcasts
          </Button>
        </Container>
      </section>
    </div>
  );
}


