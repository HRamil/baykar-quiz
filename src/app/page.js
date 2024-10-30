'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  const [userId, setUserId] = useState('');
  const [maxUserId, setMaxUserId] = useState(10); // Default max value is 10
  const router = useRouter();

  useEffect(() => {
    // Fetch data from the server to find the highest userId
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((response) => response.json())
      .then((data) => {
        const maxId = Math.max(...data.map(item => item.userId));
        setMaxUserId(maxId);
      });
  }, []);

  function handleStartQuiz(e) {
    e.preventDefault();
    if (userId) {
      router.push(`/quiz?userId=${userId}`);
    } else {
      alert("Lütfen bir kullanıcı ID&apos;si girin");
    }
  }

  function handleUserIdChange(e) {
    const value = parseInt(e.target.value, 10);
    if (value > maxUserId) {
      setUserId(maxUserId); // Set to the highest value if entered value exceeds max
    } else {
      setUserId(value);
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: '#f5f7fa' }}>
      <div className="card p-4 shadow-lg text-center" style={{ width: '400px', borderRadius: '8px' }}>
        <h2 className="mb-4">Quiz Uygulamasına Hoş Geldiniz</h2>
        <form onSubmit={handleStartQuiz}>
          <div className="form-group mb-3">
            <label htmlFor="userId">Kullanıcı ID&apos;si Girin</label>
            <input
              type="number"
              id="userId"
              className="form-control mt-2"
              placeholder={`Kullanıcı ID&apos;si girin (1 - ${maxUserId})`}
              min="1"
              max={maxUserId}
              value={userId}
              onChange={handleUserIdChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-3">
            Quiz&apos;e Başla
          </button>
        </form>
      </div>
    </div>
  );
}
