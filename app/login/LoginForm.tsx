'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import "../styles/login/login.scss";

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Даем время кукам сохраниться
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Редирект
        window.location.href = from;
      } else {
        setError(data.error || 'Неверный email или пароль');
      }
    } catch (err) {
      setError('Ошибка подключения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="login-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="login-logo">
        <div className="logotype-company" />
        <span>NEXSOL CRM</span>
      </div>
      
      <h1>Вход в CRM</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            disabled={loading}
            autoFocus
            required
          />
        </div>
        
        <div className="input-group">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            disabled={loading}
            required
          />
        </div>
        
        {error && (
          <motion.div 
            className="error-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}
        
        <button 
          type="submit" 
          disabled={loading}
          className={loading ? 'loading' : ''}
        >
          {loading ? 'Вход...' : 'Войти'}
        </button>
      </form>

      <div className="login-hint">
        <span>Доступ только для команды NEXSOL</span>
      </div>
    </motion.div>
  );
}