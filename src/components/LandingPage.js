import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Row, Col, Card } from 'react-bootstrap';
import { FaChartBar, FaRegClock, FaShieldAlt } from 'react-icons/fa';
import Lottie from 'react-lottie';
import animationData from '../lottie_animations/landingPage.json';
import styles from './LandingPage.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function LandingPage() {
  const navigate = useNavigate();

  const redirectToSignup = () => navigate('/register');
  const redirectToLogin = () => navigate('/login');

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const features = [
    {
      icon: <FaChartBar />,
      title: 'Financial Analytics',
      text: 'Get detailed insights into your spending patterns with interactive charts and reports.',
      btnText: 'Learn More'
    },
    {
      icon: <FaRegClock />,
      title: 'Real-time Tracking',
      text: 'Monitor your expenses and income in real-time with automatic categorization.',
      btnText: 'Start Tracking'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Secure & Private',
      text: 'Your financial data is protected with enterprise-grade security measures.',
      btnText: 'View Security'
    }
  ];

  return (
    <div className={styles.landingPage}>
      <main>
        <section className={styles.heroSection}>
          <Container fluid="lg">
            <Row className={styles.heroRow}>
              <Col lg={6} className={styles.heroContent}>
                <h1 className={styles.heroTitle}>
                  Manage Your Finances with Confidence
                </h1>
                <p className={styles.heroSubtitle}>
                  Take control of your financial future with our comprehensive expense tracking and analytics platform.
                </p>
                <div className={styles.buttonGroup}>
                  <Button 
                    onClick={redirectToSignup} 
                    className={`${styles.signupButton} btn`}
                  >
                    Get Started Free
                  </Button>
                  <Button 
                    onClick={redirectToLogin} 
                    variant="outline-primary"
                    className={`${styles.loginButton} btn`}
                  >
                    Sign In
                  </Button>
                </div>
              </Col>
              <Col lg={6} className={styles.heroAnimation}>
                <div className={styles.animationWrapper}>
                  <Lottie options={defaultOptions} />
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        <section className={styles.featureCardsSection}>
          <Container>
            <h2 className={styles.sectionTitle}>Why Choose Us</h2>
            <Row>
              {features.map((feature, idx) => (
                <Col md={4} className={styles.featureCol} key={idx}>
                  <Card className={styles.featureCard}>
                    <Card.Body>
                      <div className={styles.featureIcon}>{feature.icon}</div>
                      <Card.Title className={styles.featureTitle}>{feature.title}</Card.Title>
                      <Card.Text className={styles.featureText}>{feature.text}</Card.Text>
                      <Button 
                        variant="primary" 
                        onClick={redirectToSignup}
                        className={styles.featureButton}
                      >
                        {feature.btnText}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      </main>

      <footer className={styles.footerSection}>
        <Container>
          <p className={styles.footcont}>
            © 2024 FinanceTracker by Snay Corporation | Made by Jayant Khandelwal
          </p>
        </Container>
      </footer>
    </div>
  );
}

export default LandingPage;