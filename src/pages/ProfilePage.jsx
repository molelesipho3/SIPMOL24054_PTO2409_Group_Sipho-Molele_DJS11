import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Alert, Row, Col, Badge } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { User, Edit3, Save, X, Heart, Play, Calendar, Mail, LogOut } from 'lucide-react';
import { formatDate } from '../lib/utils';

export function ProfilePage({ onPlayEpisode }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    bio: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) {
      setCurrentUser(storedUser);
      setEditData({ name: storedUser.profile.name, bio: storedUser.profile.bio });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const updateProfile = (updatedProfile) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const updatedUsers = users.map(user =>
      user.username === currentUser.username
        ? { ...user, profile: updatedProfile }
        : user
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    const updatedCurrentUser = { ...currentUser, profile: updatedProfile };
    localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
    setCurrentUser(updatedCurrentUser);
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSave = () => {
    setError('');
    setSuccess('');

    if (!editData.name.trim()) {
      setError('Name is required');
      return;
    }

    updateProfile(editData);
    setIsEditing(false);
    setSuccess('Profile updated successfully!');
  };

  const handleCancel = () => {
    setEditData({ name: currentUser.profile.name, bio: currentUser.profile.bio });
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  if (!currentUser) {
    return null; // Or a loading spinner
  }

  const favorites = currentUser.favoritePodcasts || [];

  // Group favorites by show
  const favoritesByShow = favorites.reduce((acc, favorite) => {
    const key = favorite.showTitle;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(favorite);
    return acc;
  }, {});

  return (
    <Container className="py-4">
      {/* Profile Header */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div className="me-3" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(45deg, #8A2BE2, #00BFFF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={40} color="white" />
              </div>
              <div>
                <h2 className="mb-0">{currentUser.profile.name}</h2>
                <p className="text-muted mb-0">@{currentUser.username}</p>
                {currentUser.profile.bio && <p className="text-muted mt-2">{currentUser.profile.bio}</p>}
              </div>
            </div>
            <div>
              <Button
                variant="outline-primary"
                onClick={() => setIsEditing(true)}
                disabled={isEditing}
                className="me-2"
              >
                <Edit3 size={16} className="me-1" />
                Edit Profile
              </Button>
              <Button variant="outline-danger" onClick={handleLogout}>
                <LogOut size={16} className="me-1" />
                Logout
              </Button>
            </div>
          </div>

          {isEditing && (
            <div className="mt-4 pt-4 border-top">
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleEditChange}
                    placeholder="Enter your name"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="bio"
                    value={editData.bio}
                    onChange={handleEditChange}
                    placeholder="Tell us about yourself"
                    rows={3}
                  />
                </Form.Group>
                <Button variant="primary" onClick={handleSave} className="me-2">
                  <Save size={16} className="me-1" />
                  Save Changes
                </Button>
                <Button variant="outline-secondary" onClick={handleCancel}>
                  <X size={16} className="me-1" />
                  Cancel
                </Button>
              </Form>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Favorite Podcasts */}
      <Card className="shadow-sm">
        <Card.Header className="h5">
          <Heart size={20} className="me-2 text-danger" />
          Your Favorite Podcasts
        </Card.Header>
        <Card.Body>
          {favorites.length === 0 ? (
            <div className="text-center py-5">
              <Heart size={64} className="text-muted mb-3" />
              <p className="text-muted mb-3">You haven't added any favorites yet. Start exploring shows to add episodes to your favorites!</p>
              <Button as={Link} to="/">
                Browse Shows
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(favoritesByShow).map(([showTitle, showFavorites]) => (
                <Card key={showTitle} className="mb-3">
                  <Card.Header className="h6">{showTitle}</Card.Header>
                  <Card.Body>
                    {showFavorites.map((favorite) => (
                      <div
                        key={favorite.id}
                        className="d-flex align-items-center justify-content-between p-3 mb-2 bg-light rounded"
                      >
                        <div className="flex-grow-1 me-3">
                          <h6 className="mb-1 text-truncate">{favorite.title}</h6>
                          <p className="text-muted small mb-1 text-truncate-2-lines">
                            {favorite.description}
                          </p>
                          <Badge bg="secondary" className="me-2">
                            Season {favorite.season}, Episode {favorite.episode}
                          </Badge>
                          <span className="text-muted small">
                            Added {formatDate(favorite.addedAt)}
                          </span>
                        </div>
                        <div className="d-flex align-items-center">
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => onPlayEpisode && onPlayEpisode(favorite)}
                            className="me-2"
                          >
                            <Play size={14} className="me-1" />
                            Play
                          </Button>
                          <Button size="sm" variant="outline-secondary" as={Link} to={`/show/${favorite.showId}`}>
                            View Show
                          </Button>
                        </div>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}


