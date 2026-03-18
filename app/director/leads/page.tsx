'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import "../../styles/director/leads.scss";
import TemplateBack from '@/app/components/template/template';

interface Lead {
  _id: string;
  name: string;
  email: string;
  contact: string;
  message?: string;
  status: 'new' | 'contacted' | 'converted' | 'lost';
  source: string;
  createdAt: string;
}

export default function DirectorLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState({ total: 0, new: 0, contacted: 0, converted: 0, lost: 0, conversionRate: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [leadsRes, statsRes] = await Promise.all([
        fetch('/api/leads/manage'),
        fetch('/api/leads/manage/stats')
      ]);

      setLeads(await leadsRes.json());
      setStats(await statsRes.json());
    } catch (err) {
      setError('Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/leads/manage', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });

      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      setError('Ошибка обновления');
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm('Удалить заявку?')) return;

    try {
      const res = await fetch('/api/leads/manage', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      setError('Ошибка удаления');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'new': return '#f2c94c';
      case 'contacted': return '#60a5fa';
      case 'converted': return '#ccff00';
      case 'lost': return '#ff6b6b';
      default: return '#888';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'new': return 'Новая';
      case 'contacted': return 'Связались';
      case 'converted': return 'Клиент';
      case 'lost': return 'Потеря';
      default: return status;
    }
  };

  return (
    <>
      <TemplateBack />
      <div className="director-leads">
        <div className="director-leads__header">
          <h1>Управление заявками</h1>
          <p>Для директора</p>
        </div>

        {/* Статистика */}
        <div className="director-leads__stats">
          <div className="director-leads__stat-card">
            <span className="director-leads__stat-label">Всего</span>
            <span className="director-leads__stat-value">{stats.total}</span>
          </div>
          <div className="director-leads__stat-card">
            <span className="director-leads__stat-label">Новые</span>
            <span className="director-leads__stat-value">{stats.new}</span>
          </div>
          <div className="director-leads__stat-card">
            <span className="director-leads__stat-label">В работе</span>
            <span className="director-leads__stat-value">{stats.contacted}</span>
          </div>
          <div className="director-leads__stat-card">
            <span className="director-leads__stat-label">Клиенты</span>
            <span className="director-leads__stat-value">{stats.converted}</span>
          </div>
          <div className="director-leads__stat-card">
            <span className="director-leads__stat-label">Потеряно</span>
            <span className="director-leads__stat-value">{stats.lost}</span>
          </div>
          <div className="director-leads__stat-card">
            <span className="director-leads__stat-label">Конверсия</span>
            <span className="director-leads__stat-value">{stats.conversionRate}%</span>
          </div>
        </div>

        {/* Список заявок */}
        <div className="director-leads__list">
          {loading ? (
            <div className="director-leads__loading">Загрузка...</div>
          ) : leads.length === 0 ? (
            <div className="director-leads__empty">Пока нет заявок</div>
          ) : (
            leads.map((lead) => (
              <motion.div
                key={lead._id}
                className="director-leads__card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="director-leads__card-header">
                  <div>
                    <h3 className="director-leads__card-name">{lead.name}</h3>
                    <span className="director-leads__card-date">{formatDate(lead.createdAt)}</span>
                  </div>
                  <button
                    className="director-leads__card-delete"
                    onClick={() => deleteLead(lead._id)}
                  >
                    ×
                  </button>
                </div>

                <div className="director-leads__card-content">
                  <div className="director-leads__card-row">
                    <span className="director-leads__card-label">Email:</span>
                    <a href={`mailto:${lead.email}`} className="director-leads__card-link">{lead.email}</a>
                  </div>
                  
                  <div className="director-leads__card-row">
                    <span className="director-leads__card-label">Контакт:</span>
                    <a href={lead.contact} target="_blank" rel="noopener noreferrer" className="director-leads__card-link">
                      {lead.contact}
                    </a>
                  </div>

                  {lead.message && (
                    <div className="director-leads__card-message">
                      {lead.message}
                    </div>
                  )}

                  <div className="director-leads__card-footer">
                    <select
                      value={lead.status}
                      onChange={(e) => updateStatus(lead._id, e.target.value)}
                      style={{ borderColor: getStatusColor(lead.status) }}
                    >
                      <option value="new">Новая</option>
                      <option value="contacted">Связались</option>
                      <option value="converted">Клиент</option>
                      <option value="lost">Потеря</option>
                    </select>
                    <span 
                      className="director-leads__card-status"
                      style={{ backgroundColor: getStatusColor(lead.status) }}
                    >
                      {getStatusLabel(lead.status)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {error && <div className="director-leads__error">{error}</div>}
      </div>
    </>
  );
}