'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import "../../styles/director/links.scss";
import TemplateBack from '@/app/components/template/template';

interface Link {
  _id: string;
  title: string;
  description: string;
  url: string;
  importance: number;
  createdAt: string;
}

export default function LinksPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newImportance, setNewImportance] = useState<number>(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/director/links');
      const data = await res.json();
      setLinks(data);
    } catch (err) {
      setError('Ошибка загрузки ссылок');
    } finally {
      setLoading(false);
    }
  };

  const addLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTitle || !newDescription || !newUrl) {
      setError('Заполните все поля');
      return;
    }

    try {
      const res = await fetch('/api/director/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newDescription.trim(),
          url: newUrl.trim(),
          importance: newImportance
        })
      });

      const data = await res.json();

      if (res.ok) {
        setLinks(prev => [data.link, ...prev]);
        setNewTitle('');
        setNewDescription('');
        setNewUrl('');
        setNewImportance(3);
        setError('');
      } else {
        setError(data.error || 'Ошибка при добавлении');
      }
    } catch (err) {
      setError('Ошибка при добавлении');
    }
  };

  const deleteLink = async (id: string) => {
    if (!confirm('Удалить ссылку?')) return;

    try {
      const res = await fetch(`/api/director/links/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setLinks(prev => prev.filter(l => l._id !== id));
      } else {
        const data = await res.json();
        setError(data.error || 'Ошибка при удалении');
      }
    } catch (err) {
      setError('Ошибка при удалении');
    }
  };

  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getImportanceLabel = (importance: number) => {
    switch(importance) {
      case 5: return 'Критично';
      case 4: return 'Высокая';
      case 3: return 'Средняя';
      case 2: return 'Низкая';
      case 1: return 'Справочно';
      default: return 'Средняя';
    }
  };

  return (
    <>
      <TemplateBack />
      <div className="links">
        <div className="links__header">
          <h1>База знаний</h1>
          <p>Полезные ссылки и источники информации</p>
        </div>

        {/* Форма добавления */}
        <div className="links__form-container">
          <form className="links__form" onSubmit={addLink}>
            <h2>Новый источник</h2>
            
            <div className="links__field">
              <label>Название</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Например: Habr — статьи по разработке"
              />
            </div>

            <div className="links__field">
              <label>Описание</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Для чего эта ссылка, чем полезна"
                rows={2}
              />
            </div>

            <div className="links__field">
              <label>Ссылка</label>
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="links__field">
              <label>Важность: {newImportance}/5</label>
              <div className="links__importance-scale">
                {[1,2,3,4,5].map(level => (
                  <button
                    key={level}
                    type="button"
                    className={`links__importance-btn ${level <= newImportance ? 'active' : ''}`}
                    onClick={() => setNewImportance(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="links__submit">
              Добавить
            </button>
          </form>
        </div>

        {/* Список ссылок */}
        <div className="links__list">
          {loading ? (
            <div className="links__loading">Загрузка...</div>
          ) : links.length === 0 ? (
            <div className="links__empty">Нет сохраненных ссылок</div>
          ) : (
            links.map((link) => (
              <motion.div
                key={link._id}
                className="links__card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="links__card-header">
                  <div>
                    <h3 className="links__card-title">{link.title}</h3>
                    <span className="links__card-date">{formatDate(link.createdAt)}</span>
                  </div>
                  <button
                    className="links__card-delete"
                    onClick={() => deleteLink(link._id)}
                  >
                    ×
                  </button>
                </div>

                <p className="links__card-description">{link.description}</p>

                <div className="links__card-footer">
                  <button
                    className="links__card-link"
                    onClick={() => openLink(link.url)}
                  >
                    Перейти к источнику →
                  </button>
                  <span className={`links__card-importance importance-${link.importance}`}>
                    {getImportanceLabel(link.importance)}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {error && <div className="links__error">{error}</div>}
      </div>
    </>
  );
}