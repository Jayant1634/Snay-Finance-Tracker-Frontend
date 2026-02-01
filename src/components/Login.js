import React, { useState } from 'react';
import axios from 'axios';
import { DotLottieReact } from '@lottiefiles/dotlottie-react'; // Correct import
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { API_URL } from '../services/api';
import './Login.css'; // Custom CSS for further styling

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${API_URL}/users/login`, { username, password });
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Invalid credentials');  
    }
  };

  return (
    <Container fluid className="login-page bg-light">
      <Row className="vh-100">
        {/* Left side with animation */}
        <Col md={6} className="d-none d-md-block p-0">
          <div className="login-image-container">
            <DotLottieReact
              src={require('../lottie_animations/login.lottie')} // Adjusted path for importing the Lottie file
              loop
              autoplay
            />
          </div>
        </Col>

        {/* Right side with login form */}
        <Col md={6} className="d-flex justify-content-center align-items-center">
          <div className="login-box shadow p-5 rounded border bg-white animated-login-box">
            <h3 className="text-center mb-4 text-primary">Login</h3>
            {error && <Alert variant="danger" className="text-center">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicUsername" className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter your username"
                  className="py-2 animated-input"
                />
              </Form.Group>
              <Form.Group controlId="formBasicPassword" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="py-2 animated-input"
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100 py-2 btn-animated">
                Login
              </Button>
              <div className="mt-3 text-center">
                <Button variant="link" className="text-primary link-animated" onClick={() => navigate('/register')}>
                  New user? Register here
                </Button>
                <br />
                <Button variant="link" className="text-primary link-animated" onClick={() => navigate('/forgot-password')}>
                  Forgot Password?
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
