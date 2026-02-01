import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Form } from 'react-bootstrap';
import { API_URL } from '../services/api';
import './AddTransactionForm.css';

function getDefaultDate() {
  const now = new Date();
  return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
}
function getDefaultTime() {
  const now = new Date();
  return (
    String(now.getHours()).padStart(2, '0') +
    ':' +
    String(now.getMinutes()).padStart(2, '0') +
    ':' +
    String(now.getSeconds()).padStart(2, '0')
  );
}

function AddTransactionForm({ onClose, isOpen }) {
  const [category, setCategory] = useState('');
  const [type, setType] = useState('expense'); // Default to 'expense'
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  // Set date/time on mount so the field is never empty
  useEffect(() => {
    setDate(getDefaultDate());
    setTime(getDefaultTime());
  }, []);

  // Refresh date/time to "now" whenever the modal is opened
  useEffect(() => {
    if (isOpen) {
      setDate(getDefaultDate());
      setTime(getDefaultTime());
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !user.id) {
      alert('User not found. Please log in again.');
      return;
    }

    const dateVal = date || getDefaultDate();
    const timeVal = time || getDefaultTime();
    // timeVal is HH:MM:SS; append :00 only if it's HH:MM (legacy)
    const dateTime = timeVal.split(':').length === 3 ? `${dateVal}T${timeVal}` : `${dateVal}T${timeVal}:00`;
    try {
      await axios.post(API_URL +  '/transactions', {
        userId: user.id,
        category,
        type,
        amount: parseFloat(amount),
        date: dateTime,
        description,
      });
      alert('Transaction added successfully');
      setCategory('');
      setType('expense');
      setAmount('');
      setDate(getDefaultDate());
      setTime(getDefaultTime());
      setDescription('');
      if (onClose) onClose(); // Close the modal if onClose is provided
    } catch (err) {
      console.error(err);
      alert(`Failed to add transaction: ${err.response?.data?.message || 'An error occurred'}`);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="add-transaction-form">
      <Form.Group controlId="formType">
        <Form.Label>Type:</Form.Label>
        <Form.Control 
          as="select" 
          value={type} 
          onChange={(e) => setType(e.target.value)} 
          required
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="formCategory">
        <Form.Label>Category:</Form.Label>
        <Form.Control 
          type="text" 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          required 
        />
      </Form.Group>
      <Form.Group controlId="formDescription">
        <Form.Label>Description:</Form.Label>
        <Form.Control 
          as="textarea"
          rows={2}
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Optional notes about this transaction"
        />
      </Form.Group>
      <Form.Group controlId="formAmount">
        <Form.Label>Amount:</Form.Label>
        <Form.Control 
          type="number" 
          step="0.01"
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          required 
        />
      </Form.Group>
      <Form.Group controlId="formDate">
        <Form.Label>Date:</Form.Label>
        <Form.Control 
          type="date" 
          value={date || getDefaultDate()} 
          onChange={(e) => setDate(e.target.value)} 
          required 
        />
      </Form.Group>
      <Form.Group controlId="formTime">
        <Form.Label>Time:</Form.Label>
        <Form.Control 
          type="time" 
          step="1"
          value={time || getDefaultTime()} 
          onChange={(e) => setTime(e.target.value)} 
          required 
        />
      </Form.Group>
      <Button variant="primary" type="submit" className="mt-3">
        Add Transaction
      </Button>
    </Form>
  );
}

export default AddTransactionForm;