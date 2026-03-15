'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import "../../styles/text-templates/textTemplates.scss";

interface Template {
  _id: string;
  author: string;
  title: string;
  content: string;
  category: 'attraction' | 'answers' | 'ads' | 'essential';
  createdAt: string;
}

type CategoryType = 'all' | 'attraction' | 'answers' | 'ads' | 'essential';

const TemplatesPage = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Форма добавления
  const [newAuthor, setNewAuthor] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'attraction' | 'answers' | 'ads' | 'essential'>('attraction');
  const [showForm, setShowForm] = useState(false);

  // Копирование в буфер
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Категории (без иконок)
  const categories = [
    { id: 'all', name: 'Все шаблоны' },
    { id: 'attraction', name: 'Привлечение клиентов' },
    { id: 'answers', name: 'Ответы на вопросы' },
    { id: 'ads', name: 'Рекламные тексты' },
    { id: 'essential', name: 'Самые нужные' },
  ];

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/templates');
      const data = await res.json();
      setTemplates(data);
    } catch (err) {
      setError('Ошибка загрузки шаблонов');
    } finally {
      setLoading(false);
    }
  };

  const addTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAuthor || !newTitle || !newContent || !newCategory) {
      setError('Все поля обязательны для заполнения');
      return;
    }

    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: newAuthor.trim(),
          title: newTitle.trim(),
          content: newContent.trim(),
          category: newCategory
        })
      });

      const data = await res.json();

      if (res.ok) {
        setTemplates(prev => [data.template, ...prev]);
        setNewAuthor('');
        setNewTitle('');
        setNewContent('');
        setNewCategory('attraction');
        setShowForm(false);
        setError('');
      } else {
        setError(data.error || 'Ошибка при добавлении');
      }
    } catch (err) {
      setError('Ошибка при добавлении');
    }
  };

  const deleteTemplate = async (id: string) => {
    if (!confirm('Удалить шаблон?')) return;

    try {
      const res = await fetch(`/api/templates/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setTemplates(prev => prev.filter(t => t._id !== id));
      }
    } catch (err) {
      setError('Ошибка при удалении');
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredTemplates = templates.filter(template => {
    if (activeCategory === 'all') return true;
    return template.category === activeCategory;
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getCategoryName = (category: string) => {
    switch(category) {
      case 'attraction': return 'Привлечение';
      case 'answers': return 'Ответы';
      case 'ads': return 'Реклама';
      case 'essential': return 'Важное';
      default: return category;
    }
  };

  return (
    <div className="templates">
      <div className="templates__header">
        <h1>Шаблоны текстов</h1>
        <p>База готовых текстов для работы с клиентами</p>
      </div>

      {/* Кнопка добавления */}
      <div className="templates__action">
        <button 
          className="templates__add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '−' : '+'} Новый шаблон
        </button>
      </div>

      {/* Форма добавления */}
      <AnimatePresence>
        {showForm && (
          <motion.form 
            className="templates__form"
            onSubmit={addTemplate}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3>Добавление шаблона</h3>
            
            <input
              type="text"
              placeholder="Автор"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              required
            />
            
            <input
              type="text"
              placeholder="Назначение шаблона"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
            
            <textarea
              placeholder="Текст шаблона"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={4}
              required
            />
            
            <div className="templates__category-select">
              <label>Категория:</label>
              <select 
                value={newCategory} 
                onChange={(e) => setNewCategory(e.target.value as any)}
              >
                <option value="attraction">Привлечение клиентов</option>
                <option value="answers">Ответы на вопросы</option>
                <option value="ads">Рекламные тексты</option>
                <option value="essential">Самые нужные</option>
              </select>
            </div>
            
            <button type="submit" className="templates__submit">
              Сохранить
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Категории (без иконок) */}
      <div className="templates__categories">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`templates__category-btn ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id as CategoryType)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Список шаблонов */}
      <div className="templates__list">
        {loading ? (
          <div className="templates__loading">Загрузка шаблонов...</div>
        ) : filteredTemplates.length === 0 ? (
          <div className="templates__empty">
            {activeCategory === 'all' 
              ? 'Нет сохраненных шаблонов' 
              : 'В этой категории пока нет шаблонов'}
          </div>
        ) : (
          filteredTemplates.map((template) => (
            <motion.div
              key={template._id}
              className="template-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              layout
            >
              <div className="template-card__header">
                <h3 className="template-card__title">{template.title}</h3>
                <button 
                  className="template-card__delete"
                  onClick={() => deleteTemplate(template._id)}
                  aria-label="Удалить"
                >
                  ×
                </button>
              </div>

              <div className="template-card__meta">
                <span className="template-card__author">{template.author}</span>
                <span className="template-card__date">{formatDate(template.createdAt)}</span>
                <span className="template-card__category">
                  {getCategoryName(template.category)}
                </span>
              </div>

              <div className="template-card__content">
                {template.content}
              </div>

              <div className="template-card__footer">
                <button 
                  className={`template-card__copy ${copiedId === template._id ? 'copied' : ''}`}
                  onClick={() => copyToClipboard(template.content, template._id)}
                >
                  {copiedId === template._id ? 'Скопировано' : 'Копировать'}
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {error && <div className="templates__error">{error}</div>}
    </div>
  );
};

export default TemplatesPage;