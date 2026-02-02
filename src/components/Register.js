import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { API_URL } from '../services/api';
import registerImage from '../images/register.jpg'; // Adjust the path according to your folder structure
import './Register.css'; // Custom CSS for further styling

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Gmail validation
    if (!email.endsWith('@gmail.com')) {
      setError('Please use a Gmail address');
      return;
    }

    try {
      // Step 1: Register the user and trigger OTP sending from the backend
      await axios.post(API_URL + '/users/register', {
        name,
        email,
        username,
        password,
      });

      // Step 2: Redirect to the OTP verification page after registration
      toast.success('User registered successfully. Please enter the OTP sent to your email.');
      navigate('/otp-verification', { state: { email } }); // Pass the email as state
    } catch (err) {
      console.error(err);
      setError('Failed to register user');
    }
  };

  return (
    <Container fluid className="register-page">
      <Row className="vh-100">
        {/* Left side with image */}
        <Col md={6} className="d-none d-md-block p-0">
          <div className="register-image-container">
            <img src={registerImage} alt="Register Visual" className="register-image" />
          </div>
        </Col>

        {/* Right side with registration form */}
        <Col md={6} className="d-flex justify-content-center align-items-center">
          <div className="register-box shadow-lg p-4 rounded bg-white">
            <h2 className="text-center text-primary mb-4">Register</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleRegister}>
              <Form.Group controlId="formBasicName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your name"
                  className="py-2"
                />
              </Form.Group>
              <Form.Group controlId="formBasicEmail" className="mt-3">
                <Form.Label>Gmail</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your Gmail address"
                  className="py-2"
                />
              </Form.Group>
              <Form.Group controlId="formBasicUsername" className="mt-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Choose a username"
                  className="py-2"
                />
              </Form.Group>
              <Form.Group controlId="formBasicPassword" className="mt-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="py-2"
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100 mt-4 py-2">
                Register
              </Button>
              <div className="mt-3 text-center">
                <Button
                  variant="link"
                  className="no-underline"
                  onClick={() => navigate('/login')}
                >
                  Already have an account? Login here
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;
