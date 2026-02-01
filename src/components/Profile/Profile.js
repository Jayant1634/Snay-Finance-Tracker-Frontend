import React, { useState, useEffect } from "react";
import { Container, Card, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { API_URL } from "../../services/api";
import "./Profile.css";

const Profile = () => {
  const { theme } = useTheme();
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    if (!userId) {
      console.error("User ID not found, redirecting...");
      navigate("/");
      return;
    }

    const fetchUserData = async () => {
      try {
        console.log("Fetching user data from:", `${API_URL}/users/${userId}`);
        const response = await axios.get(`${API_URL}/users/${userId}`);
        console.log("User data fetched:", response.data);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setErrorMessage("Failed to load user data.");
      }
    };

    fetchUserData();
  }, [userId, navigate]);

  if (!userId) {
    return (
      <Container>
        <Alert variant="danger">
          User not logged in. Redirecting to login page...
        </Alert>
      </Container>
    );
  }

  if (!user && !errorMessage) {
    return <p>Loading user data...</p>;
  }

  if (errorMessage) {
    return (
      <Container>
        <Alert variant="danger">{errorMessage}</Alert>
      </Container>
    );
  }

  return (
    <div className={theme}>
      {/* Profile Section */}
      <Container className="profile-container mt-5 pt-5">
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Profile</Card.Title>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            {/* Add other fields here */}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Profile;
