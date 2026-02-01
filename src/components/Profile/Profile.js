import React, { useState, useEffect } from "react";
import { Container, Card, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { API_URL } from "../../services/api";
import "./Profile.css";

const Profile = () => {
  const { theme } = useTheme();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    profilePicture: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
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
        setFormData({
          name: response.data.name || "",
          email: response.data.email || "",
          bio: response.data.bio || "",
          profilePicture: response.data.profilePicture || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setErrorMessage("Failed to load user data.");
      }
    };

    fetchUserData();
  }, [userId, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture" && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`${API_URL}/users/${userId}`, formData);
      console.log("User data updated:", response.data);
      setUser(response.data);
      setEditing(false);
      setSuccessMessage("Profile updated successfully!");
      setErrorMessage("");
    } catch (error) {
      console.error("Error updating user profile:", error);
      setErrorMessage("Failed to update profile. Please try again.");
    }
  };

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
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
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
