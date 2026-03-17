'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import "../../styles/tools/tools.scss";

interface Tool {
  _id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  icon: string;
  createdBy: string;
  createdAt: string;
}

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'Все' },
    { id: 'design', name: 'Дизайн' },
    { id: 'dev', name: 'Разработка' },
    { id: 'marketing', name: 'Маркетинг' },
    { id: 'analytics', name: 'Аналитика' },
    { id: 'other', name: 'Другое' },
  ];

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const res = await fetch('/api/tools');
      const data = await res.json();
      setTools(data);
    } catch (err) {
      setError('Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  const filteredTools = selectedCategory === 'all'
    ? tools
    : tools.filter(t => t.category === selectedCategory);

  const getCategoryName = (cat: string) => {
    const category = categories.find(c => c.id === cat);
    return category ? category.name : cat;
  };

  return (
    <div className="tools">
      <div className="tools__header">
        <h1>Инструменты</h1>
        <p>Полезные сервисы для работы</p>
      </div>

      {/* Фильтры */}
      <div className="tools__categories">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`tools__category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Список инструментов */}
      <div className="tools__list">
        {loading ? (
          <div className="tools__loading">Загрузка...</div>
        ) : error ? (
          <div className="tools__error">{error}</div>
        ) : filteredTools.length === 0 ? (
          <div className="tools__empty">Нет инструментов в этой категории</div>
        ) : (
          filteredTools.map((tool, index) => (
            <motion.a
              key={tool._id}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="tools__card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="tools__card-icon">{tool.icon}</div>
              <div className="tools__card-content">
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>
                <div className="tools__card-meta">
                  <span className="tools__card-category">{getCategoryName(tool.category)}</span>
                  <span className="tools__card-author">Добавил: {tool.createdBy}</span>
                </div>
              </div>
            </motion.a>
          ))
        )}
      </div>
    </div>
  );
}