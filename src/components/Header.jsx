import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';
import { Search, Home, Heart, User, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function Header({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const { currentUser } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/shows', label: 'Shows', icon: Search },
    ...(currentUser ? [
      { path: '/favorites', label: 'Favorites', icon: Heart },
      { path: '/profile', label: 'Profile', icon: User }
    ] : [])
  ];

  const authItems = currentUser ? [] : [
    { path: '/login', label: 'Login', icon: LogIn },
    { path: '/signup', label: 'Sign Up', icon: UserPlus }
  ];

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <div className="container">
        <Navbar.Brand as={Link} to="/">
          <div className="d-flex align-items-center">
            <div className="w-8 h-8 bg-primary rounded-circle d-flex align-items-center justify-content-center me-2">
              <div className="w-4 h-4 bg-white rounded-circle"></div>
            </div>
            <span className="font-weight-bold text-primary">PodCast</span>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {navItems.map((item) => (
              <Nav.Link
                key={item.path}
                as={Link}
                to={item.path}
                active={location.pathname === item.path}
              >
                <item.icon size={16} className="me-1" />{item.label}
              </Nav.Link>
            ))}
          </Nav>
          <Form className="d-flex" onSubmit={handleSearch}>
            <FormControl
              type="search"
              placeholder="Search podcasts..."
              className="me-2"
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="outline-success" type="submit">
              <Search size={16} />
            </Button>
          </Form>
          <Nav>
            {authItems.map((item) => (
              <Nav.Link
                key={item.path}
                as={Link}
                to={item.path}
              >
                <item.icon size={16} className="me-1" />{item.label}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}


