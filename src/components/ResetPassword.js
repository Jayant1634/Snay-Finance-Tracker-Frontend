import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { API_URL } from '../services/api';
import './ResetPassword.css'; // Custom CSS for further styling

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract the token from URL parameters
  const token = new URLSearchParams(location.search).get('token');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // Send password reset request to backend
      await axios.post(API_URL + '/users/reset-password', { token, password });
      setMessage('Password reset successful. Redirecting to login...');
      setTimeout(() => {
        navigate('/login'); // Redirect to login after successful password reset
      }, 2000);
    } catch (err) {
      // Handle token expiration or invalid token
      if (err.response && err.response.status === 400) {
        setError(err.response.data.message || 'Invalid token or expired. Please try again.');
      } else {
        setError('Server error. Please try again later.');
      }
    }
  };

  return (
    <Container className="reset-password-page mt-5">
      <h2 className="text-center">Reset Password</h2>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleResetPassword} className="shadow p-4 rounded">
        <Form.Group controlId="formBasicPassword">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your new password"
            className="py-2"
          />
        </Form.Group>
        <Form.Group controlId="formBasicConfirmPassword" className="mt-3">
          <Form.Label>Confirm New Password</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm your new password"
            className="py-2"
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100 mt-4 py-2">
          Reset Password
        </Button>
      </Form>
    </Container>
  );
}

export default ResetPassword;
