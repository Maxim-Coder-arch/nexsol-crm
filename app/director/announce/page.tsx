'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import "../../styles/director/announce.scss";
import TemplateBack from '@/app/components/template/template';

interface Announcement {
  _id: string;
  author: string;
  title: string;
  content: string;
  importance: number;
  createdAt: string;
}

const AnnouncePage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newAuthor, setNewAuthor] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newImportance, setNewImportance] = useState<number>(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/director/announcements');
      const data = await res.json();
      setAnnouncements(data);
    } catch {
      setError('Ошибка загрузки объявлений');
    } finally {
      setLoading(false);
    }
  };

  const addAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAuthor || !newTitle || !newContent) {
      setError('Все поля обязательны для заполнения');
      return;
    }

    try {
      const res = await fetch('/api/director/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: newAuthor.trim(),
          title: newTitle.trim(),
          content: newContent.trim(),
          importance: newImportance
        })
      });

      const data = await res.json();

      if (res.ok) {
        setAnnouncements(prev => [data.announcement, ...prev]);
        setNewAuthor('');
        setNewTitle('');
        setNewContent('');
        setNewImportance(5);
        setError('');
      } else {
        setError(data.error || 'Ошибка при добавлении');
      }
    } catch {
      setError('Ошибка при добавлении');
    }
  };

  const deleteAnnouncement = async (id: string) => {
    if (!confirm('Удалить объявление?')) return;

    try {
      const res = await fetch(`/api/director/announcements/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setAnnouncements(prev => prev.filter(a => a._id !== id));
      } else {
        const data = await res.json();
        setError(data.error || 'Ошибка при удалении');
      }
    } catch {
      setError('Ошибка при удалении');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getImportanceColor = (importance: number) => {
    if (importance >= 8) return '#ff6b6b';
    if (importance >= 5) return '#f2c94c';
    return '#60a5fa';
  };

  const getImportanceLabel = (importance: number) => {
    if (importance >= 9) return 'Критично';
    if (importance >= 7) return 'Высокая';
    if (importance >= 4) return 'Средняя';
    return 'Низкая';
  };

  return (
    <>
      <TemplateBack />
      <div className="announce">
        <div className="announce__header">
          <h1>Объявления для команды</h1>
          <p>Важные сообщения и уведомления</p>
        </div>

        <div className="announce__form-container">
          <form className="announce__form" onSubmit={addAnnouncement}>
            <h2>Новое объявление</h2>
            
            <div className="announce__field">
              <label>Автор</label>
              <input
                type="text"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                placeholder="Ваше имя"
              />
            </div>

            <div className="announce__field">
              <label>Заголовок</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Кратко о чем"
              />
            </div>

            <div className="announce__field">
              <label>Текст объявления</label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Полный текст"
                rows={4}
              />
            </div>

            <div className="announce__field">
              <label>Важность: {newImportance}/10</label>
              <input
                type="range"
                min="1"
                max="10"
                value={newImportance}
                onChange={(e) => setNewImportance(parseInt(e.target.value))}
              />
              <div className="announce__scale">
                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                  <span 
                    key={num}
                    className={num <= newImportance ? 'active' : ''}
                    onClick={() => setNewImportance(num)}
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>

            <button type="submit" className="announce__submit">
              Опубликовать
            </button>
          </form>
        </div>

        <div className="announce__list">
          {loading ? (
            <div className="announce__loading">Загрузка объявлений...</div>
          ) : announcements.length === 0 ? (
            <div className="announce__empty">Нет объявлений</div>
          ) : (
            announcements.map((item) => (
              <motion.div
                key={item._id}
                className="announce__item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="announce__item-header">
                  <div className="announce__item-title">
                    <h3>{item.title}</h3>
                    <div 
                      className="announce__item-importance"
                      style={{ backgroundColor: getImportanceColor(item.importance) }}
                    >
                      {getImportanceLabel(item.importance)}
                    </div>
                  </div>
                  <button 
                    className="announce__item-delete"
                    onClick={() => deleteAnnouncement(item._id)}
                  >
                    ×
                  </button>
                </div>

                <div className="announce__item-meta">
                  <span className="announce__item-author">{item.author}</span>
                  <span className="announce__item-date">{formatDate(item.createdAt)}</span>
                </div>

                <div className="announce__item-content">
                  {item.content}
                </div>
              </motion.div>
            ))
          )}
        </div>

        {error && <div className="announce__error">{error}</div>}
      </div>
    </>
  );
};

export default AnnouncePage;