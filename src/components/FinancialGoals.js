import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Card, Form, Button, ListGroup, Container, Modal } from 'react-bootstrap';
import { API_URL } from '../services/api';

function FinancialGoals({ user, displayOnly, onGoalAdded }) {
  const [goals, setGoals] = useState([]);
  const [goalType, setGoalType] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [editingGoal, setEditingGoal] = useState(null);
  const [editedGoalType, setEditedGoalType] = useState('');
  const [editedTargetAmount, setEditedTargetAmount] = useState('');
  const [editedDeadline, setEditedDeadline] = useState('');

  const fetchGoals = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await axios.get(API_URL + `/goals/${user.id}`);
      setGoals(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user, fetchGoals]);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL +  '/goals', {
        userId: user.id,
        goalType,
        targetAmount,
        deadline,
      });
      toast.success('Goal added successfully');
      setGoalType('');
      setTargetAmount('');
      setDeadline('');
      fetchGoals();
      if (onGoalAdded) onGoalAdded(); // Notify the dashboard to refresh goals
    } catch (err) {
      console.error(err);
      toast.error('Failed to add goal');
    }
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setEditedGoalType(goal.goalType);
    setEditedTargetAmount(goal.targetAmount);
    setEditedDeadline(goal.deadline);
  };

  const handleUpdateGoal = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_URL}/goals/${editingGoal._id}`, {
        goalType: editedGoalType,
        targetAmount: editedTargetAmount,
        deadline: editedDeadline,
      });
      setGoals(goals.map(goal => goal._id === editingGoal._id ? res.data : goal));
      setEditingGoal(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update goal');
    }
  };

  return (
    <Container>
      {!displayOnly && (
        <Card className="p-4 mb-4">
          <Card.Body>
            <h4 className="mb-4">Add New Goal</h4>
            <Form onSubmit={handleAddGoal}>
              <Form.Group className="mb-3">
                <Form.Label>Goal Type</Form.Label>
                <Form.Control
                  type="text"
                  value={goalType}
                  onChange={(e) => setGoalType(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Target Amount</Form.Label>
                <Form.Control
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Deadline</Form.Label>
                <Form.Control
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Add Goal
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}
      <Card className="p-4 mb-4">
        <Card.Body>
          <h4 className="mb-4">Your Goals</h4>
          {goals.length > 0 ? (
            <ListGroup>
              {goals.map((goal) => (
                <ListGroup.Item key={goal._id} className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{goal.goalType}</strong>: ${goal.targetAmount} by {new Date(goal.deadline).toLocaleDateString()}
                  </div>
                  <Button variant="secondary" onClick={() => handleEditGoal(goal)}>Edit</Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p>No goals added yet.</p>
          )}
        </Card.Body>
      </Card>

      {editingGoal && (
        <Modal show onHide={() => setEditingGoal(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Goal</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleUpdateGoal}>
              <Form.Group className="mb-3">
                <Form.Label>Goal Type</Form.Label>
                <Form.Control
                  type="text"
                  value={editedGoalType}
                  onChange={(e) => setEditedGoalType(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Target Amount</Form.Label>
                <Form.Control
                  type="number"
                  value={editedTargetAmount}
                  onChange={(e) => setEditedTargetAmount(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Deadline</Form.Label>
                <Form.Control
                  type="date"
                  value={editedDeadline}
                  onChange={(e) => setEditedDeadline(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">Update Goal</Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </Container>
  );
}

export default FinancialGoals;
