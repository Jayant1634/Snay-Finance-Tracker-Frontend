import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Row, Col, Card } from 'react-bootstrap';
import { FaWallet, FaChartLine, FaLightbulb } from 'react-icons/fa';
import Lottie from 'react-lottie';
import animationData from '../lottie_animations/landingPage.json';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div className="home-page-bg">
      <section className="hero-section">
        <Container>
          <Row className="hero-row align-items-center justify-content-between">
            <Col xs={12} lg={6} className="hero-text-col order-2 order-lg-1">
              <h1 className="hero-title">Track Your Expenses Effortlessly</h1>
              <p className="hero-lead">
                Gain full control of your finances with real-time insights.
              </p>
              <p className="hero-description">
                Join us to manage your expenses, set budgets, and achieve your financial goals with ease.
              </p>
              <div className="arrow-container">
                <div className="arrow arrow-1"></div>
                <div className="arrow arrow-2"></div>
                <div className="arrow arrow-3"></div>
              </div>
            </Col>
            <Col xs={12} lg={6} className="hero-lottie-col order-1 order-lg-2">
              <div className="lottie-wrapper">
                <Lottie options={defaultOptions} height="100%" width="100%" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      
      {/* Feature Cards */}
      <Container className="feature-cards-section my-5">
        <Row className="justify-content-center">
          <Col xs={12} sm={6} md={4} className="mb-4">
            <Card className="feature-card futuristic-card">
              <Card.Body>
                <FaWallet className="feature-icon animated-icon" />
                <Card.Title>Manage Transactions</Card.Title>
                <Card.Text>
                  Add, view, and filter your daily expenses and incomes in a simple, intuitive interface.
                </Card.Text>
                <Button variant="primary" onClick={() => navigate("/transactions")} className="futuristic-button">
                  View Transactions
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4} className="mb-4">
            <Card className="feature-card futuristic-card">
              <Card.Body>
                <FaChartLine className="feature-icon animated-icon" />
                <Card.Title>Dashboard Overview</Card.Title>
                <Card.Text>
                  Get a quick overview of your current balance and spending patterns in the dashboard.
                </Card.Text>
                <Button variant="primary" onClick={() => navigate("/dashboard")} className="futuristic-button">
                  Go to Dashboard
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4} className="mb-4">
            <Card className="feature-card futuristic-card">
              <Card.Body>
                <FaLightbulb className="feature-icon animated-icon" />
                <Card.Title>Financial Goals</Card.Title>
                <Card.Text>
                  Set savings targets and track your progress toward achieving your financial objectives.
                </Card.Text>
                <Button variant="primary" onClick={() => navigate("/goals")} className="futuristic-button">
                  Manage Goals
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
{/* Footer Section */}
<footer className="footer-section text-center py-3">
        <Container>
          <p>Made by Snay Corporation | Owner : Jayant Khandelwal</p>
        </Container>
      </footer>
      
    </div>
  );
}

export default HomePage;
