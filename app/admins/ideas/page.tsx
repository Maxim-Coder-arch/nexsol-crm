'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import "../../styles/ideas/ideas.scss";

interface Idea {
  _id: string;
  title: string;
  description: string;
  author: string;
  priority: number;
  createdAt: string;
}

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newPriority, setNewPriority] = useState<number>(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      const res = await fetch('/api/ideas');
      const data = await res.json();
      setIdeas(data);
    } catch (err) {
      setError('Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  const addIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim() || !newAuthor.trim()) return;

    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: newTitle, 
          description: newDescription,
          author: newAuthor,
          priority: newPriority 
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setIdeas(prev => [data.idea, ...prev]);
        setNewTitle('');
        setNewDescription('');
        setNewAuthor('');
        setNewPriority(3);
        setError('');
      } else {
        const data = await res.json();
        setError(data.error || 'Ошибка при добавлении');
      }
    } catch (err) {
      setError('Ошибка при добавлении');
    }
  };

  const deleteIdea = async (id: string) => {
    if (!confirm('Удалить идею?')) return;

    try {
      const res = await fetch(`/api/ideas/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setIdeas(prev => prev.filter(i => i._id !== id));
      } else {
        const data = await res.json();
        setError(data.error || 'Ошибка при удалении');
      }
    } catch (err) {
      setError('Ошибка при удалении');
    }
  };

  // Статистика
  const totalIdeas = ideas.length;
  const avgPriority = ideas.length > 0 
    ? (ideas.reduce((acc, curr) => acc + curr.priority, 0) / ideas.length).toFixed(1)
    : 0;
  const topPriority = ideas.length > 0 
    ? Math.max(...ideas.map(i => i.priority))
    : 0;

  // Цвет приоритета
  const getPriorityColor = (priority: number) => {
    switch(priority) {
      case 5: return '#ff6b6b'; // красный - срочно
      case 4: return '#f2c94c'; // желтый - важно
      case 3: return '#60a5fa'; // синий - средне
      case 2: return '#888';    // серый - низко
      case 1: return '#666';    // темно-серый - очень низко
      default: return '#888';
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch(priority) {
      case 5: return 'Критично';
      case 4: return 'Высокий';
      case 3: return 'Средний';
      case 2: return 'Низкий';
      case 1: return 'Очень низкий';
      default: return 'Средний';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="ideas-page">
      <div className="ideas-header">
        <h1>Идеи для бизнеса</h1>
        <p>Записывайте и оценивайте идеи для развития</p>
      </div>

      {ideas.length > 0 && (
        <div className="stats-overview">
          <div className="stat-badge">
            <div className="stat-info">
              <span className="stat-label">Всего идей</span>
              <span className="stat-value">{totalIdeas}</span>
            </div>
          </div>
          <div className="stat-badge">
            <div className="stat-info">
              <span className="stat-label">Средний приоритет</span>
              <span className="stat-value">{avgPriority}</span>
            </div>
          </div>
          <div className="stat-badge">
            <div className="stat-info">
              <span className="stat-label">Макс. приоритет</span>
              <span className="stat-value">{topPriority}</span>
            </div>
          </div>
        </div>
      )}

      <div className="add-form-wrapper">
        <form onSubmit={addIdea} className="add-form">
          <div className="form-title">Новая идея</div>
          
          <input
            type="text"
            placeholder="Ваше имя"
            value={newAuthor}
            onChange={(e) => setNewAuthor(e.target.value)}
          />
          
          <input
            type="text"
            placeholder="Название идеи"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          
          <textarea
            placeholder="Описание идеи"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            rows={3}
          />
          
          <div className="priority-input">
            <label>Приоритет: {newPriority}/5</label>
            <div className="priority-stars">
              {[1,2,3,4,5].map(star => (
                <span
                  key={star}
                  className={`star ${star <= newPriority ? 'active' : ''}`}
                  onClick={() => setNewPriority(star)}
                  style={{ color: star <= newPriority ? getPriorityColor(star) : '#444' }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <button type="submit" disabled={!newTitle.trim() || !newDescription.trim() || !newAuthor.trim()}>
            Добавить идею
          </button>
        </form>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="ideas-list">
        {loading ? (
          <div className="loading">Загрузка идей...</div>
        ) : ideas.length === 0 ? (
          <div className="no-ideas">Пока нет идей</div>
        ) : (
          <AnimatePresence>
            {ideas.map((idea) => (
              <motion.div
                key={idea._id}
                className="idea-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <div className="idea-header">
                  <div className="idea-title">
                    <h3>{idea.title}</h3>
                    <span className="idea-date">{formatDate(idea.createdAt)}</span>
                  </div>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteIdea(idea._id)}
                  >
                    ×
                  </button>
                </div>
                
                <p className="idea-description">{idea.description}</p>
                
                <div className="idea-footer">
                  <div className="idea-author">
                    <span className="author-label">Автор:</span>
                    <span className="author-name">{idea.author}</span>
                  </div>
                  
                  <div className="idea-priority">
                    <span 
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(idea.priority) }}
                    >
                      {getPriorityLabel(idea.priority)}
                    </span>
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