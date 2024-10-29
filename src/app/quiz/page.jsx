'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button, Container, Row, Col, Table } from 'react-bootstrap';

export default function Quiz() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizResults, setQuizResults] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [canSelectAnswer, setCanSelectAnswer] = useState(false);

  useEffect(() => {
    if (userId) {
      fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
        .then(response => response.json())
        .then(data => {
          const quizQuestions = data.slice(0, 10).map((item, index) => ({
            id: item.id,
            question: item.title,
            options: generateOptions(item.body),
            correctAnswer: item.body.split(' ')[0] 
          }));
          setQuestions(quizQuestions);
        });
    }
  }, [userId]);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
        if (timeRemaining === 20) setCanSelectAnswer(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      handleNextQuestion();
    }
  }, [timeRemaining]);

  function generateOptions(bodyText) {
    const words = bodyText.split(' ');
    return words.slice(0, 4);
  }

  function handleAnswerSelect(option) {
    if (canSelectAnswer) {
      setSelectedAnswer(option);
    }
  }

  function handleNextQuestion() {
    setQuizResults([
      ...quizResults,
      {
        question: questions[currentQuestionIndex].question,
        selectedAnswer,
        correctAnswer: questions[currentQuestionIndex].correctAnswer,
      },
    ]);
    setSelectedAnswer(null);
    setCanSelectAnswer(false);
    setTimeRemaining(30);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert('Quiz completed!');
    }
  }

  return (
    <Container className="mt-5">
      {currentQuestionIndex < questions.length ? (
        <div>
          <h4>Question {currentQuestionIndex + 1}</h4>
          <p>{questions[currentQuestionIndex].question}</p>
          <p>Time Remaining: {timeRemaining} seconds</p>

          <Row>
            {questions[currentQuestionIndex].options?.map((option, index) => (
              <Col md={3} key={index}>
                <Button
                  variant={selectedAnswer === option ? 'primary' : 'outline-primary'}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={!canSelectAnswer}
                  className="w-100 mb-3"
                >
                  {String.fromCharCode(65 + index)}. {option}
                </Button>
              </Col>
            ))}
          </Row>

          <Button onClick={handleNextQuestion} className="mt-3" disabled={timeRemaining > 0}>
            Next Question
          </Button>
        </div>
      ) : (
        <ResultsTable results={quizResults} />
      )}
    </Container>
  );
}

function ResultsTable({ results }) {
  return (
    <Container className="mt-5">
      <h4>Quiz Results</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Question</th>
            <th>Your Answer</th>
            <th>Correct Answer</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{result.question}</td>
              <td>{result.selectedAnswer || 'No Answer'}</td>
              <td>{result.correctAnswer}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
