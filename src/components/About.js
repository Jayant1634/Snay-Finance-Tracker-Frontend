import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaChartLine, FaUsers, FaLightbulb } from 'react-icons/fa';
import styles from './About.module.css';

function About() {
  return (
    <div className={styles.aboutPage}>
      <div className={styles.aboutContent}>
        <Container>
          <div className={styles.pageHeader}>
            <h1>About SnayExpTracker</h1>
            <p>Your trusted partner in financial management</p>
          </div>

          <section className={styles.missionSection}>
            <Row>
              <Col md={6}>
                <h2>Our Mission</h2>
                <p>
                  At SnayExpTracker, we're committed to empowering individuals and businesses 
                  with the tools they need to make informed financial decisions. Our platform 
                  combines cutting-edge technology with user-friendly design to make financial 
                  management accessible to everyone.
                </p>
              </Col>
              <Col md={6}>
                <div className={styles.statsCard}>
                  <div className={styles.stat}>
                    <h3>1K+</h3>
                    <p>Active Users</p>
                  </div>
                  <div className={styles.stat}>
                    <h3>100K+</h3>
                    <p>Transactions Tracked</p>
                  </div>
                  <div className={styles.stat}>
                    <h3>98%</h3>
                    <p>User Satisfaction</p>
                  </div>
                </div>
              </Col>
            </Row>
          </section>

          <section className={styles.valuesSection}>
            <h2>Our Values</h2>
            <Row>
              <Col md={4}>
                <div className={styles.valueCard}>
                  <FaUsers className={styles.valueIcon} />
                  <h3>User First</h3>
                  <p>We prioritize user experience and satisfaction in everything we do</p>
                </div>
              </Col>
              <Col md={4}>
                <div className={styles.valueCard}>
                  <FaLightbulb className={styles.valueIcon} />
                  <h3>Innovation</h3>
                  <p>Constantly improving our platform with the latest technology</p>
                </div>
              </Col>
              <Col md={4}>
                <div className={styles.valueCard}>
                  <FaChartLine className={styles.valueIcon} />
                  <h3>Growth</h3>
                  <p>Helping our users achieve their financial goals</p>
                </div>
              </Col>
            </Row>
          </section>
        </Container>
      </div>
    </div>
  );
}

export default About; 