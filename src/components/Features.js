import React from 'react';
import { Container } from 'react-bootstrap';
import { FaWallet, FaChartBar, FaRegClock, FaChartLine, FaShieldAlt } from 'react-icons/fa';
import styles from './Features.module.css';

function Features() {
  const features = [
    {
      icon: <FaWallet />,
      title: "Expense Tracking",
      description: "Easily log and categorize your daily expenses",
      details: [
        "Automatic categorization",
        "Receipt scanning",
        "Custom categories",
        "Real-time tracking"
      ]
    },
    {
      icon: <FaChartBar />,
      title: "Financial Analytics",
      description: "Gain insights through detailed reports",
      details: [
        "Spending patterns",
        "Budget tracking",
        "Custom reports",
        "Trend analysis"
      ]
    },
    {
      icon: <FaChartLine />,
      title: "Financial Goals",
      description: "Set and track your savings targets",
      details: [
        "Savings targets",
        "Budget tracking",
        "Goal progress",
        "Milestone alerts"
      ]
    },
    {
      icon: <FaRegClock />,
      title: "Real-time Updates",
      description: "Stay on top of your finances",
      details: [
        "Instant notifications",
        "Live balance updates",
        "Budget alerts",
        "Transaction monitoring"
      ]
    },
    {
      icon: <FaShieldAlt />,
      title: "Security",
      description: "Your data is safe with us",
      details: [
        "Bank-grade encryption",
        "Secure authentication",
        "Data backup",
        "Privacy protection"
      ]
    }
  ];

  return (
    <div className={styles.featuresPage}>
      <div className={styles.featuresContent}>
        <Container>
          <div className={styles.pageHeader}>
            <h1>Our Features</h1>
            <p>Discover the powerful tools that make SnayExpTracker your ideal financial companion</p>
          </div>

          <div className={styles.featuresList}>
            {features.map((feature, index) => (
              <div className={styles.featureCard} key={index}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h2>{feature.title}</h2>
                <p>{feature.description}</p>
                <ul>
                  {feature.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </div>
  );
}

export default Features; 