'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import "../../styles/achievements/achievements.scss";

interface Achievement {
  _id: string;
  title: string;
  description: string;
  rating: number;
  date: string;
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newRating, setNewRating] = useState<number>(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Добавь эти переменные рядом с другими useState
const [stats, setStats] = useState({
  total: 0,
  averageRating: 0,
  highestRated: null as Achievement | null
});

// В useEffect, после fetchAchievements добавь:
useEffect(() => {
  if (achievements.length > 0) {
    const total = achievements.length;
    const avgRating = achievements.reduce((acc, curr) => acc + curr.rating, 0) / total;
    const highest = achievements.reduce((max, curr) => curr.rating > (max?.rating || 0) ? curr : max, null);
    
    setStats({
      total,
      averageRating: Math.round(avgRating * 10) / 10,
      highestRated: highest
    });
  }
}, [achievements]);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const res = await fetch('/api/achievements');
      const data = await res.json();
      setAchievements(data);
    } catch (err) {
      setError('Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  const addAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    try {
      const res = await fetch('/api/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: newTitle, 
          description: newDescription,
          rating: newRating 
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAchievements(prev => [data.achievement, ...prev]);
        setNewTitle('');
        setNewDescription('');
        setNewRating(5);
        setError('');
      } else {
        const data = await res.json();
        setError(data.error || 'Ошибка при добавлении');
      }
    } catch (err) {
      setError('Ошибка при добавлении');
    }
  };

  const deleteAchievement = async (id: string) => {
    if (!confirm('Удалить достижение?')) return;

    try {
      const res = await fetch(`/api/achievements/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setAchievements(prev => prev.filter(a => a._id !== id));
      } else {
        const data = await res.json();
        setError(data.error || 'Ошибка при удалении');
      }
    } catch (err) {
      setError('Ошибка при удалении');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Функция для цвета шкалы в зависимости от рейтинга
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return '#ccff00'; // зеленый
    if (rating >= 5) return '#f2c94c'; // желтый
    return '#60a5fa'; // синий
  };

  return (
    <div className="achievements-page">
      <div className="achievements-header">
        <h1>Достижения бизнеса</h1>
        <p>Отмечайте важные вехи и оценивайте их значимость</p>
      </div>

      {achievements.length > 0 && (
  <div className="stats-overview">
    <div className="stat-badge">
      <div className="stat-info">
        <span className="stat-label">Всего достижений</span>
        <span className="stat-value">{stats.total}</span>
      </div>
    </div>
    <div className="stat-badge">
      <div className="stat-info">
        <span className="stat-label">Средний рейтинг</span>
        <span className="stat-value">{stats.averageRating}</span>
      </div>
    </div>
    {stats.highestRated && (
      <div className="stat-badge">
        <div className="stat-info">
          <span className="stat-label">Лучшее</span>
          <span className="stat-value">{stats.highestRated.rating}/10</span>
        </div>
      </div>
    )}
  </div>
)}

      <form onSubmit={addAchievement} className="add-form">
        <input
          type="text"
          placeholder="Название достижения"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <textarea
          placeholder="Описание"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          rows={2}
        />
        
        <div className="rating-input">
          <label>Оценка значимости: {newRating}/10</label>
          <input
            type="range"
            min="1"
            max="10"
            value={newRating}
            onChange={(e) => setNewRating(parseInt(e.target.value))}
            style={{
              background: `linear-gradient(90deg, 
                ${getRatingColor(newRating)} 0%, 
                ${getRatingColor(newRating)} ${newRating * 10}%, 
                #333 ${newRating * 10}%, 
                #333 100%)`
            }}
          />
          <div className="rating-scale">
            {[1,2,3,4,5,6,7,8,9,10].map(num => (
              <span 
                key={num} 
                className={num <= newRating ? 'active' : ''}
                onClick={() => setNewRating(num)}
              >
                {num}
              </span>
            ))}
          </div>
        </div>

        <button type="submit" disabled={!newTitle.trim() || !newDescription.trim()}>
          Добавить достижение
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      <div className="achievements-list">
        {loading ? (
          <div className="loading">Загрузка достижений...</div>
        ) : achievements.length === 0 ? (
          <div className="no-achievements">Пока нет достижений</div>
        ) : (
          <AnimatePresence>
            {achievements.map((achievement) => (
              <motion.div
                key={achievement._id}
                className="achievement-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <div className="achievement-header">
                  <div className="achievement-title">
                    <h3>{achievement.title}</h3>
                    <span className="achievement-date">{formatDate(achievement.date)}</span>
                  </div>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteAchievement(achievement._id)}
                  >
                    ×
                  </button>
                </div>
                
                <p className="achievement-description">{achievement.description}</p>
                
                <div className="achievement-rating">
                  <div className="rating-label">
                    <span>Значимость</span>
                    <span className="rating-value" style={{ color: getRatingColor(achievement.rating) }}>
                      {achievement.rating}/10
                    </span>
                  </div>
                  <div className="rating-bar">
                    <motion.div 
                      className="rating-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${achievement.rating * 10}%` }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      style={{ backgroundColor: getRatingColor(achievement.rating) }}
                    />
                  </div>
                  <div className="rating-markers">
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <span key={num} className="marker">|</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}