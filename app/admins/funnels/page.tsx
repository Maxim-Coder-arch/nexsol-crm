'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import "../../styles/funnels/funnels.scss";

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

export default function FunnelsPage() {
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    fetchFunnels();
  }, []);

  const fetchFunnels = async () => {
    try {
      const res = await fetch('/api/director/funnels');
      const data = await res.json();
      setFunnels(data);
    } catch (err) {
      setError('Ошибка загрузки воронок');
    } finally {
      setLoading(false);
    }
  };

  const filteredFunnels = selectedType === 'all'
    ? funnels
    : funnels.filter(f => f.type === selectedType);

  const getFunnelTypeLabel = (type: string) => {
    switch(type) {
      case 'sales': return 'Воронка продаж';
      case 'attraction': return 'Воронка привлечения';
      case 'b2b': return 'B2B воронка';
      default: return type;
    }
  };

  const getStageTypeLabel = (type: string) => {
    switch(type) {
      case 'tofu': return 'TOFU — Осведомленность';
      case 'mofu': return 'MOFU — Интерес';
      case 'bofu': return 'BOFU — Действие';
      default: return type;
    }
  };

  const getStageTypeColor = (type: string) => {
    switch(type) {
      case 'tofu': return '#60a5fa';
      case 'mofu': return '#f2c94c';
      case 'bofu': return '#ccff00';
      default: return '#888';
    }
  };

  // Функция для расчета ширины этапов (каждый следующий уже на 5%)
  const getStageWidth = (index: number, total: number) => {
    const baseWidth = 100;
    const decreasePerStep = 5;
    return baseWidth - (index * decreasePerStep);
  };

  return (
    <div className="funnels-page">
      <motion.div 
        className="funnels-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Воронки</h1>
        <p>Маркетинговые и sales-воронки для стратегического планирования</p>
      </motion.div>

      {/* Фильтр по типам */}
      <div className="funnels-filter">
        <button 
          className={`funnels-filter__btn ${selectedType === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedType('all')}
        >
          Все воронки
        </button>
        <button 
          className={`funnels-filter__btn ${selectedType === 'sales' ? 'active' : ''}`}
          onClick={() => setSelectedType('sales')}
        >
          Продажи
        </button>
        <button 
          className={`funnels-filter__btn ${selectedType === 'attraction' ? 'active' : ''}`}
          onClick={() => setSelectedType('attraction')}
        >
          Привлечение
        </button>
        <button 
          className={`funnels-filter__btn ${selectedType === 'b2b' ? 'active' : ''}`}
          onClick={() => setSelectedType('b2b')}
        >
          B2B
        </button>
      </div>

      {/* Список воронок */}
      <div className="funnels-list">
        {loading ? (
          <div className="funnels-loading">Загрузка воронок...</div>
        ) : error ? (
          <div className="funnels-error">{error}</div>
        ) : filteredFunnels.length === 0 ? (
          <div className="funnels-empty">
            {selectedType === 'all' 
              ? 'Нет созданных воронок' 
              : 'В этой категории пока нет воронок'}
          </div>
        ) : (
          filteredFunnels.map((funnel, funnelIndex) => (
            <motion.div
              key={funnel._id}
              className="funnels-item"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: funnelIndex * 0.1 }}
            >
              <div className="funnels-item__header">
                <div>
                  <h2>{funnel.name}</h2>
                  <span className="funnels-item__type">
                    {getFunnelTypeLabel(funnel.type)}
                  </span>
                </div>
                <span className="funnels-item__date">
                  {new Date(funnel.createdAt).toLocaleDateString('ru-RU')}
                </span>
              </div>

              <p className="funnels-item__description">{funnel.description}</p>

              {/* Визуализация воронки */}
              <div className="funnels-visual">
                {funnel.stages
                  .sort((a, b) => a.order - b.order)
                  .map((stage, idx) => (
                    <motion.div
                      key={stage.id}
                      className="funnels-visual__stage"
                      style={{ 
                        width: `${getStageWidth(idx, funnel.stages.length)}%`,
                        borderColor: getStageTypeColor(stage.type)
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 + idx * 0.1 }}
                    >
                      <div 
                        className="funnels-visual__stage-type"
                        style={{ backgroundColor: getStageTypeColor(stage.type) }}
                      >
                        {stage.type.toUpperCase()}
                      </div>
                      <div className="funnels-visual__stage-name">{stage.name}</div>
                      <div className="funnels-visual__stage-desc">{stage.description}</div>
                    </motion.div>
                  ))}
              </div>

              {/* Список этапов */}
              <div className="funnels-stages">
                {funnel.stages
                  .sort((a, b) => a.order - b.order)
                  .map((stage) => (
                    <div key={stage.id} className="funnels-stages__item">
                      <span 
                        className="funnels-stages__badge"
                        style={{ backgroundColor: getStageTypeColor(stage.type) }}
                      >
                        {stage.type.toUpperCase()}
                      </span>
                      <span className="funnels-stages__name">{stage.name}</span>
                    </div>
                  ))}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}