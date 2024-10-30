'use client';

import React, { useEffect, useState } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Results() {
  const router = useRouter();
  const [quizResults, setQuizResults] = useState([]);

  useEffect(() => {
    const storedResults = localStorage.getItem('quizResults');
    if (storedResults) {
      setQuizResults(JSON.parse(storedResults));
    }
  }, []);

  function handleRetakeQuiz() {
    localStorage.removeItem('quizResults'); 
    router.push('/'); 
  }

  return (
    <Container className="mt-5 text-center">
      <h4>Quiz Sonuçları</h4>
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Soru</th>
            <th>Senin Cevabın</th>
          </tr>
        </thead>
        <tbody>
          {quizResults.map((result, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{result.question}</td>
              <td>{result.selectedAnswer || 'Cevap Yok'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button variant="primary" onClick={handleRetakeQuiz} className="mt-4">
        Quiz&apos;i Tekrar Yap
      </Button>
    </Container>
  );
}
