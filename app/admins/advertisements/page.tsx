'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import "../../styles/advertisements/advertisements.scss";

interface Announcement {
  _id: string;
  author: string;
  title: string;
  content: string;
  importance: number;
  createdAt: string;
}

const AdvertisementsPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
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
    } catch (err) {
      setError('Ошибка загрузки объявлений');
    } finally {
      setLoading(false);
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
    <div className="advertisements">
      <div className="advertisements__header">
        <h1>Объявления</h1>
        <p>Важные сообщения от директора</p>
      </div>

      <div className="advertisements__list">
        {loading ? (
          <div className="advertisements__loading">Загрузка объявлений...</div>
        ) : error ? (
          <div className="advertisements__error">{error}</div>
        ) : announcements.length === 0 ? (
          <div className="advertisements__empty">Нет новых объявлений</div>
        ) : (
          announcements.map((item, index) => (
            <motion.div
              key={item._id}
              className="advertisements__item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div 
                className="advertisements__item-importance-bar"
                style={{ backgroundColor: getImportanceColor(item.importance) }}
              />
              
              <div className="advertisements__item-content">
                <div className="advertisements__item-header">
                  <h2>{item.title}</h2>
                  <div 
                    className="advertisements__item-badge"
                    style={{ backgroundColor: getImportanceColor(item.importance) }}
                  >
                    {getImportanceLabel(item.importance)}
                  </div>
                </div>

                <div className="advertisements__item-meta">
                  <span className="advertisements__item-author">{item.author}</span>
                  <span className="advertisements__item-date">{formatDate(item.createdAt)}</span>
                </div>

                <div className="advertisements__item-text">
                  {item.content}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdvertisementsPage;