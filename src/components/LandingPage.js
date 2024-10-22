import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Row, Col, Navbar, Nav, Card } from 'react-bootstrap'; // Bootstrap components
import { FaWallet, FaChartLine, FaLightbulb } from 'react-icons/fa'; // Icons for feature cards
import './LandingPage.css'; // Custom CSS for styling
import heroImage from '../images/landingPage.png'; // Importing hero image

function LandingPage() {
  const navigate = useNavigate();

  // Function to handle redirecting to the login and signup pages
  const redirectToSignup = () => {
    navigate('/register'); // Redirect to signup page
  };
  const redirectToLogin = () => {
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="landing-page">
      {/* Navbar */}
      <Navbar expand="lg" className="navbar navbar-light fixed-top">
        <Container>
          {/* Brand aligned to the left */}
          <Navbar.Brand href="#" className="text-white">
            Snay Expense Tracker
          </Navbar.Brand>

          {/* Navbar toggle button for mobile view */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          {/* Navbar items and alignment */}
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Button variant="primary" className="login-button" onClick={redirectToLogin}>
                Log In
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="arrows">
          <div className="arrow"></div>
          <div className="arrow"></div>
          <div className="arrow"></div>
        </div>

        <Container className="d-flex align-items-center vh-100">
          <Row className="w-100 align-items-center">
            <Col md={6} className="text-left order-md-1 order-2">
              <h1 className="display-4">Track Your Expense Effortlessly</h1>
              <p className="lead">Gain full control of your finances with real-time insights.</p>
              <Button onClick={redirectToSignup} variant="primary" className="signup-button mt-3">
                Sign Up
              </Button>
            </Col>
            <Col md={6} className="order-md-2 order-1">
              <img src={heroImage} alt="Hero" className="img-fluid" />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Feature Cards Section */}
      <Container className="feature-cards-section my-5">
        <Row className="justify-content-center">
          <Col xs={12} sm={6} md={4} className="mb-4">
            <Card className="feature-card">
              <Card.Body>
                <FaWallet className="feature-icon" />
                <Card.Title>Manage Transactions</Card.Title>
                <Card.Text>
                  Add, view, and filter your daily expenses and incomes in a simple, intuitive interface.
                </Card.Text>
                <Button variant="primary" onClick={redirectToLogin} className="mt-3">
                  View Transactions
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4} className="mb-4">
            <Card className="feature-card">
              <Card.Body>
                <FaChartLine className="feature-icon" />
                <Card.Title>Dashboard Overview</Card.Title>
                <Card.Text>
                  Get a quick overview of your current balance and spending patterns in the dashboard.
                </Card.Text>
                <Button variant="primary" onClick={redirectToLogin} className="mt-3">
                  Go to Dashboard
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4} className="mb-4">
            <Card className="feature-card">
              <Card.Body>
                <FaLightbulb className="feature-icon" />
                <Card.Title>Expense Predictions</Card.Title>
                <Card.Text>
                  Use advanced algorithms to predict your future expenses and plan ahead.
                </Card.Text>
                <Button variant="primary" onClick={redirectToLogin} className="mt-3">
                  See Predictions
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Footer Section */}
      <footer className="footer-section text-center py-3">
        <Container>
          <p>Made by Snay Corporation | Owner: Jayant Khandelwal</p>
        </Container>
      </footer>
    </div>
  );
}

export default LandingPage;

