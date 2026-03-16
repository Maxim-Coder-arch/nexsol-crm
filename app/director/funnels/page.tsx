'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import "../../styles/director/funnels.scss";

interface FunnelStage {
  id: string;
  name: string;
  description: string;
  order: number;
  type: 'tofu' | 'mofu' | 'bofu';
}

interface Funnel {
  _id: string;
  name: string;
  description: string;
  type: 'sales' | 'attraction' | 'b2b';
  stages: FunnelStage[];
  createdAt: string;
}

export default function DirectorFunnelsPage() {
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedFunnel, setSelectedFunnel] = useState<Funnel | null>(null);

  // Форма для новой воронки
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newType, setNewType] = useState<'sales' | 'attraction' | 'b2b'>('sales');
  const [stages, setStages] = useState<FunnelStage[]>([
    { id: crypto.randomUUID(), name: '', description: '', order: 0, type: 'tofu' }
  ]);

  useEffect(() => {
    fetchFunnels();
  }, []);

  const fetchFunnels = async () => {
    try {
      const res = await fetch('/api/director/funnels');
      const data = await res.json();
      setFunnels(data);
    } catch (err) {
      setError('Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  const addStage = () => {
    const newStage: FunnelStage = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      order: stages.length,
      type: 'tofu'
    };
    setStages([...stages, newStage]);
  };

  const removeStage = (id: string) => {
    if (stages.length > 1) {
      const updatedStages = stages
        .filter(s => s.id !== id)
        .map((s, idx) => ({ ...s, order: idx }));
      setStages(updatedStages);
    }
  };

  const updateStage = (id: string, field: keyof FunnelStage, value: string | number) => {
    setStages(prev =>
      prev.map(s => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const filteredStages = stages.filter(s => s.name.trim() !== '');
    
    if (!newName || !newDescription || filteredStages.length === 0) {
      setError('Заполните название, описание и хотя бы один этап');
      return;
    }

    try {
      const res = await fetch('/api/director/funnels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          description: newDescription,
          type: newType,
          stages: filteredStages.map((s, idx) => ({ ...s, order: idx }))
        })
      });

      if (res.ok) {
        const data = await res.json();
        setFunnels(prev => [data.funnel, ...prev]);
        resetForm();
      }
    } catch (err) {
      setError('Ошибка при создании');
    }
  };

  const resetForm = () => {
    setNewName('');
    setNewDescription('');
    setNewType('sales');
    setStages([{ id: crypto.randomUUID(), name: '', description: '', order: 0, type: 'tofu' }]);
    setShowForm(false);
  };

  const deleteFunnel = async (id: string) => {
    if (!confirm('Удалить воронку?')) return;

    try {
      const res = await fetch(`/api/director/funnels/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setFunnels(prev => prev.filter(f => f._id !== id));
      }
    } catch (err) {
      setError('Ошибка при удалении');
    }
  };

  // Функция для расчета ширины этапов (каждый следующий чуть уже)
  const getStageWidth = (index: number, total: number) => {
    const baseWidth = 100;
    const decreasePerStep = 5; // каждый этап уже на 5%
    return baseWidth - (index * decreasePerStep);
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'tofu': return 'TOFU — Осведомленность';
      case 'mofu': return 'MOFU — Интерес';
      case 'bofu': return 'BOFU — Действие';
      default: return type;
    }
  };

  const getFunnelTypeLabel = (type: string) => {
    switch(type) {
      case 'sales': return 'Воронка продаж';
      case 'attraction': return 'Воронка привлечения';
      case 'b2b': return 'B2B воронка';
      default: type;
    }
  };

  return (
    <div className="director-funnels">
      <div className="director-funnels__header">
        <h1>Конструктор воронок</h1>
        <p>Создавайте и управляйте воронками продаж и привлечения</p>
      </div>

      {/* Кнопка добавления */}
      <div className="director-funnels__action">
        <button 
          className="director-funnels__add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '−' : '+'} Новая воронка
        </button>
      </div>

      {/* Форма создания */}
      <AnimatePresence>
        {showForm && (
          <motion.form 
            className="director-funnels__form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h2>Новая воронка</h2>

            <div className="director-funnels__field">
              <label>Название</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Например: B2B-воронка для сложных продаж"
              />
            </div>

            <div className="director-funnels__field">
              <label>Описание</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Для чего эта воронка"
                rows={2}
              />
            </div>

            <div className="director-funnels__field">
              <label>Тип воронки</label>
              <select value={newType} onChange={(e) => setNewType(e.target.value as any)}>
                <option value="sales">Воронка продаж</option>
                <option value="attraction">Воронка привлечения</option>
                <option value="b2b">B2B воронка</option>
              </select>
            </div>

            <div className="director-funnels__stages-header">
              <h3>Этапы воронки</h3>
              <button type="button" className="director-funnels__add-stage" onClick={addStage}>
                + Добавить этап
              </button>
            </div>

            {stages.map((stage, index) => (
              <div key={stage.id} className="director-funnels__stage">
                <div className="director-funnels__stage-header">
                  <span className="director-funnels__stage-number">Этап {index + 1}</span>
                  {stages.length > 1 && (
                    <button 
                      type="button"
                      className="director-funnels__stage-remove"
                      onClick={() => removeStage(stage.id)}
                    >
                      ×
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Название этапа"
                  value={stage.name}
                  onChange={(e) => updateStage(stage.id, 'name', e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Описание этапа"
                  value={stage.description}
                  onChange={(e) => updateStage(stage.id, 'description', e.target.value)}
                />

                <select
                  value={stage.type}
                  onChange={(e) => updateStage(stage.id, 'type', e.target.value)}
                >
                  <option value="tofu">TOFU — Осведомленность</option>
                  <option value="mofu">MOFU — Интерес</option>
                  <option value="bofu">BOFU — Действие</option>
                </select>
              </div>
            ))}

            <button type="submit" className="director-funnels__submit">
              Создать воронку
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Список воронок */}
      <div className="director-funnels__list">
        {loading ? (
          <div className="director-funnels__loading">Загрузка...</div>
        ) : funnels.length === 0 ? (
          <div className="director-funnels__empty">Нет созданных воронок</div>
        ) : (
          funnels.map((funnel) => (
            <motion.div
              key={funnel._id}
              className="director-funnels__card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="director-funnels__card-header">
                <div>
                  <h3>{funnel.name}</h3>
                  <span className="director-funnels__card-type">
                    {getFunnelTypeLabel(funnel.type)}
                  </span>
                </div>
                <button
                  className="director-funnels__card-delete"
                  onClick={() => deleteFunnel(funnel._id)}
                >
                  ×
                </button>
              </div>

              <p className="director-funnels__card-description">{funnel.description}</p>

              {/* Визуализация воронки */}
              <div className="director-funnels__visualization">
                {funnel.stages.sort((a, b) => a.order - b.order).map((stage, idx) => (
                  <div 
                    key={stage.id}
                    className="director-funnels__stage-visual"
                    style={{ width: `${getStageWidth(idx, funnel.stages.length)}%` }}
                  >
                    <div className={`director-funnels__stage-type ${stage.type}`}>
                      {stage.type.toUpperCase()}
                    </div>
                    <div className="director-funnels__stage-name">{stage.name}</div>
                    <div className="director-funnels__stage-desc">{stage.description}</div>
                  </div>
                ))}
              </div>

              <div className="director-funnels__stages-list">
                {funnel.stages.sort((a, b) => a.order - b.order).map((stage) => (
                  <div key={stage.id} className="director-funnels__stage-item">
                    <span className={`director-funnels__stage-badge ${stage.type}`}>
                      {stage.type.toUpperCase()}
                    </span>
                    <span className="director-funnels__stage-name">{stage.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {error && <div className="director-funnels__error">{error}</div>}
    </div>
  );
}