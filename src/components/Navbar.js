import React, { useState, useEffect } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import styles from './Navbar.module.css';
import '../styles/SharedNavbar.css';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    setUser(stored ? JSON.parse(stored) : null);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <BootstrapNavbar expand="lg" className="navbar-custom" fixed="top">
      <Container>
        <BootstrapNavbar.Brand
          onClick={() => navigate(user ? '/home' : '/')}
          style={{ cursor: 'pointer' }}
        >
          SnayExpTracker
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />

        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user ? (
              <>
                <Nav.Link as={Link} to="/home" className={isActive('/home') ? 'active' : ''}>
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/transactions" className={isActive('/transactions') ? 'active' : ''}>
                  Transactions
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/" className={isActive('/') ? 'active' : ''}>
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/features" className={isActive('/features') ? 'active' : ''}>
                  Features
                </Nav.Link>
                <Nav.Link as={Link} to="/about" className={isActive('/about') ? 'active' : ''}>
                  About
                </Nav.Link>
              </>
            )}
          </Nav>

          {user ? (
            <div className="d-flex align-items-center gap-2">
              <Button
                variant="outline-secondary"
                size="sm"
                className="navbar-theme-btn border-0"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <FaMoon /> : <FaSun />}
              </Button>
              <Dropdown>
                <Dropdown.Toggle className="user-dropdown">
                  {user.username || user.name || 'User'}
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <Button
                variant="outline-secondary"
                size="sm"
                className="navbar-theme-btn border-0"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <FaMoon /> : <FaSun />}
              </Button>
              <div className={styles.authButtons}>
              <Button
                onClick={() => navigate('/login')}
                variant="outline-primary"
                className={styles.loginButton}
              >
                Log In
              </Button>
              <Button
                onClick={() => navigate('/register')}
                variant="primary"
                className={styles.signupButton}
              >
                Sign Up
              </Button>
              </div>
            </div>
          )}
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;
