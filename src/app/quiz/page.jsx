'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button, Container, Row, Col, Card, ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function QuizComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
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
        .then((response) => response.json())
        .then((data) => {
          const quizQuestions = data.slice(0, 10).map((item) => ({
            id: item.id,
            question: item.title,
            options: generateOptions(item.body),
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
      },
    ]);

    setSelectedAnswer(null);
    setCanSelectAnswer(false);
    setTimeRemaining(30);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      localStorage.setItem('quizResults', JSON.stringify(quizResults));
      router.push('/results');
    }
  }

  return (
    <Container className="mt-5">
      {currentQuestionIndex < questions.length ? (
        <Card className="p-4 shadow-sm">
          <h4 className="mb-3">Soru {currentQuestionIndex + 1}</h4>
          <p className="lead">{questions[currentQuestionIndex].question}</p>
          <ProgressBar animated now={(30 - timeRemaining) * 3.33} label={`${timeRemaining}s`} />

          <Row className="mt-4">
            {questions[currentQuestionIndex].options?.map((option, index) => (
              <Col md={6} key={index}>
                <Button
                  variant={selectedAnswer === option ? 'primary' : 'outline-primary'}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={!canSelectAnswer}
                  className="w-100 mb-3 text-start"
                >
                  {String.fromCharCode(65 + index)}. {option}
                </Button>
              </Col>
            ))}
          </Row>

          <Button
            onClick={handleNextQuestion}
            variant="success"
            className="mt-4 w-100"
            disabled={!selectedAnswer}
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </Button>
        </Card>
      ) : null}
    </Container>
  );
}

export default function Quiz() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuizComponent />
    </Suspense>
  );
}
