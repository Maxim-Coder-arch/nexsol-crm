'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import "../../styles/clients/clietns.scss";

interface Client {
  _id: string;
  name: string;
  request: string;
  service: string;
  comment?: string;
  payment: number;
  contacts: {
    telegram?: string;
    instagram?: string;
    whatsapp?: string;
    email?: string;
    phone?: string;
    other?: string;
  };
  timeSpent: number;
  createdAt: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState({ total: 0, totalRevenue: 0, averagePayment: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Форма
  const [newName, setNewName] = useState('');
  const [newRequest, setNewRequest] = useState('');
  const [newService, setNewService] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newPayment, setNewPayment] = useState('');
  const [newTimeSpent, setNewTimeSpent] = useState('');
  
  // Контакты
  const [newTelegram, setNewTelegram] = useState('');
  const [newInstagram, setNewInstagram] = useState('');
  const [newWhatsapp, setNewWhatsapp] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newOther, setNewOther] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [clientsRes, statsRes] = await Promise.all([
        fetch('/api/clients'),
        fetch('/api/clients/stats')
      ]);

      setClients(await clientsRes.json());
      setStats(await statsRes.json());
    } catch (err) {
      setError('Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newName || !newRequest || !newService || !newPayment || !newTimeSpent) {
      setError('Заполните обязательные поля');
      return;
    }

    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          request: newRequest,
          service: newService,
          comment: newComment || undefined,
          payment: Number(newPayment),
          contacts: {
            telegram: newTelegram || undefined,
            instagram: newInstagram || undefined,
            whatsapp: newWhatsapp || undefined,
            email: newEmail || undefined,
            phone: newPhone || undefined,
            other: newOther || undefined
          },
          timeSpent: newTimeSpent
        })
      });

      if (res.ok) {
        const data = await res.json();
        setClients(prev => [data.client, ...prev]);
        // Очистка формы
        setNewName('');
        setNewRequest('');
        setNewService('');
        setNewComment('');
        setNewPayment('');
        setNewTimeSpent('');
        setNewTelegram('');
        setNewInstagram('');
        setNewWhatsapp('');
        setNewEmail('');
        setNewPhone('');
        setNewOther('');
        setShowForm(false);
        fetchData(); // Обновим статистику
      }
    } catch (err) {
      setError('Ошибка при добавлении');
    }
  };

  const deleteClient = async (id: string) => {
    if (!confirm('Удалить клиента из базы?')) return;

    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setClients(prev => prev.filter(c => c._id !== id));
        fetchData(); // Обновим статистику
      }
    } catch (err) {
      setError('Ошибка при удалении');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="clients">
      <div className="clients__header">
        <h1>База клиентов</h1>
        <p>История сотрудничества и контакты</p>
      </div>

      {/* Статистика */}
      <div className="clients__stats">
        <div className="clients__stat-card">
          <span className="clients__stat-label">Всего клиентов</span>
          <span className="clients__stat-value">{stats.total}</span>
        </div>
        <div className="clients__stat-card">
          <span className="clients__stat-label">Общая выручка</span>
          <span className="clients__stat-value">{formatCurrency(stats.totalRevenue)}</span>
        </div>
        <div className="clients__stat-card">
          <span className="clients__stat-label">Средний чек</span>
          <span className="clients__stat-value">{formatCurrency(stats.averagePayment)}</span>
        </div>
      </div>

      {/* Кнопка добавления */}
      <div className="clients__action">
        <button 
          className="clients__add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '−' : '+'} Новый клиент
        </button>
      </div>

      {/* Форма добавления */}
      <AnimatePresence>
        {showForm && (
          <motion.form 
            className="clients__form"
            onSubmit={addClient}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2>Новый клиент</h2>
            
            <div className="clients__form-row">
              <input
                type="text"
                placeholder="Имя клиента *"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
            </div>

            <div className="clients__form-row">
              <input
                type="text"
                placeholder="Запрос клиента *"
                value={newRequest}
                onChange={(e) => setNewRequest(e.target.value)}
                required
              />
            </div>

            <div className="clients__form-row">
              <input
                type="text"
                placeholder="Оказанная услуга *"
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                required
              />
            </div>

            <div className="clients__form-row">
              <textarea
                placeholder="Комментарий по сделке"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={2}
              />
            </div>

            <div className="clients__form-row clients__form-row--two">
              <input
                type="number"
                placeholder="Оплата (₽) *"
                value={newPayment}
                onChange={(e) => setNewPayment(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Время (часы) *"
                value={newTimeSpent}
                onChange={(e) => setNewTimeSpent(e.target.value)}
                required
              />
            </div>

            <h3>Контакты</h3>
            
            <div className="clients__form-row clients__form-row--two">
              <input
                type="text"
                placeholder="Telegram"
                value={newTelegram}
                onChange={(e) => setNewTelegram(e.target.value)}
              />
              <input
                type="text"
                placeholder="Instagram"
                value={newInstagram}
                onChange={(e) => setNewInstagram(e.target.value)}
              />
            </div>

            <div className="clients__form-row clients__form-row--two">
              <input
                type="text"
                placeholder="WhatsApp"
                value={newWhatsapp}
                onChange={(e) => setNewWhatsapp(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>

            <div className="clients__form-row clients__form-row--two">
              <input
                type="tel"
                placeholder="Телефон"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
              />
              <input
                type="text"
                placeholder="Другое"
                value={newOther}
                onChange={(e) => setNewOther(e.target.value)}
              />
            </div>

            <button type="submit" className="clients__submit">
              Сохранить
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Список клиентов */}
      <div className="clients__list">
        {loading ? (
          <div className="clients__loading">Загрузка...</div>
        ) : clients.length === 0 ? (
          <div className="clients__empty">Нет клиентов в базе</div>
        ) : (
          clients.map((client) => (
            <motion.div
              key={client._id}
              className="clients__card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="clients__card-header">
                <div>
                  <h3 className="clients__card-name">{client.name}</h3>
                  <span className="clients__card-date">{formatDate(client.createdAt)}</span>
                </div>
                <button
                  className="clients__card-delete"
                  onClick={() => deleteClient(client._id)}
                >
                  ×
                </button>
              </div>

              <div className="clients__card-content">
                <div className="clients__card-row">
                  <span className="clients__card-label">Запрос:</span>
                  <span className="clients__card-value">{client.timeSpent}</span>
                </div>
                
                <div className="clients__card-row">
                  <span className="clients__card-label">Услуга:</span>
                  <span className="clients__card-value">{client.service}</span>
                </div>

                {client.comment && (
                  <div className="clients__card-row">
                    <span className="clients__card-label">Комментарий:</span>
                    <span className="clients__card-value">{client.comment}</span>
                  </div>
                )}

                <div className="clients__card-row clients__card-row--highlight">
                  <span className="clients__card-label">Оплата:</span>
                  <span className="clients__card-value clients__card-value--payment">
                    {formatCurrency(client.payment)}
                  </span>
                </div>

                <div className="clients__card-row">
                  <span className="clients__card-label">Время:</span>
                  <span className="clients__card-value">{client.timeSpent} ч</span>
                </div>

                {/* Контакты */}
                <div className="clients__card-contacts">
                  <span className="clients__card-label">Контакты:</span>
                  <div className="clients__card-contact-list">
                    {client.contacts.telegram && (
                      <a href={`https://t.me/${client.contacts.telegram}`} target="_blank" rel="noopener noreferrer">
                        📱 Telegram
                      </a>
                    )}
                    {client.contacts.instagram && (
                      <a href={`https://instagram.com/${client.contacts.instagram}`} target="_blank" rel="noopener noreferrer">
                        📷 Instagram
                      </a>
                    )}
                    {client.contacts.whatsapp && (
                      <a href={`https://wa.me/${client.contacts.whatsapp}`} target="_blank" rel="noopener noreferrer">
                        💬 WhatsApp
                      </a>
                    )}
                    {client.contacts.email && (
                      <a href={`mailto:${client.contacts.email}`}>
                        ✉️ Email
                      </a>
                    )}
                    {client.contacts.phone && (
                      <a href={`tel:${client.contacts.phone}`}>
                        📞 {client.contacts.phone}
                      </a>
                    )}
                    {client.contacts.other && (
                      <span>🔗 {client.contacts.other}</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {error && <div className="clients__error">{error}</div>}
    </div>
  );
}