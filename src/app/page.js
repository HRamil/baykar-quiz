'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  const [userId, setUserId] = useState('');
  const [maxUserId, setMaxUserId] = useState(10); // Varsayılan max değeri 10
  const router = useRouter();

  useEffect(() => {
    // Veriyi sunucudan çekip en büyük userId'yi buluyoruz
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
      alert("Lütfen bir kullanıcı ID'si girin");
    }
  }

  function handleUserIdChange(e) {
    const value = parseInt(e.target.value, 10);
    if (value > maxUserId) {
      setUserId(maxUserId); // Maksimum değerden fazlasını girerse en yüksek değere sabitle
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
            <label htmlFor="userId">Kullanıcı ID'si Girin</label>
            <input
              type="number"
              id="userId"
              className="form-control mt-2"
              placeholder={`Kullanıcı ID'si girin (1 - ${maxUserId})`}
              min="1"
              max={maxUserId}
              value={userId}
              onChange={handleUserIdChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-3">
            Quiz'e Başla
          </button>
        </form>
      </div>
    </div>
  );
}
