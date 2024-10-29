'use client'

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';

export default function Home() {
  const [userId, setUserId] = useState('');
  const router = useRouter();

  function handleStartQuiz(e) {
    e.preventDefault();
    if (userId) {
      router.push(`/quiz?userId=${userId}`);
    } else {
      alert("Please enter a user ID");
    }
  }

  return (
    <Container className="d-flex flex-column align-items-center mt-5">
      <h2>Welcome to the Quiz App</h2>
      <Form onSubmit={handleStartQuiz} className="w-50 mt-4">
        <Form.Group controlId="userId">
          <Form.Label>Enter User ID</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter a user ID (e.g., 1, 2, 3)"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            min="1"
            max="10"
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Start Quiz
        </Button>
      </Form>
    </Container>
  );
}