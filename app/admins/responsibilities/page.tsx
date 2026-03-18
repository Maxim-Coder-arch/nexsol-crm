'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import "../../styles/responsibilities/responsibilities.scss";

interface User {
  _id: string;
  name: string;
  specialties: string[];
  responsibilities: string[];
  role: string;
  createdAt: string;
}

const ResponsibilitiesPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<string>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users'); // получаем всех пользователей
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError('Ошибка загрузки сотрудников');
    } finally {
      setLoading(false);
    }
  };

  // Фильтруем пользователей
  const filteredUsers = selectedUser === 'all'
    ? users
    : users.filter(u => u._id === selectedUser);

  // Формируем список для фильтра
  const userOptions = [
    { id: 'all', name: 'Все сотрудники' },
    ...users.map(u => ({ id: u._id, name: u.name }))
  ];

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getRoleLabel = (role: string) => {
    switch(role) {
      case 'director': return 'Директор';
      case 'admin': return 'Администратор';
      case 'manager': return 'Менеджер';
      default: return role;
    }
  };

  return (
    <div className="team-responsibilities">
      <div className="team-responsibilities__header">
        <h1>Обязанности команды</h1>
        <p>Специальности и задачи сотрудников</p>
      </div>

      {/* Фильтр по сотрудникам */}
      {!loading && users.length > 0 && (
        <div className="team-responsibilities__filter">
          <label>Сотрудник:</label>
          <select 
            value={selectedUser} 
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            {userOptions.map(option => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="team-responsibilities__list">
        {loading ? (
          <div className="team-responsibilities__loading">Загрузка сотрудников...</div>
        ) : error ? (
          <div className="team-responsibilities__error">{error}</div>
        ) : filteredUsers.length === 0 ? (
          <div className="team-responsibilities__empty">
            {selectedUser === 'all' 
              ? 'Нет сотрудников' 
              : 'Сотрудник не найден'}
          </div>
        ) : (
          filteredUsers.map((user, index) => (
            <motion.div
              key={user._id}
              className="team-responsibilities__card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="team-responsibilities__card-header">
                <div>
                  <h2>{user.name}</h2>
                </div>
                <span className="team-responsibilities__date">
                  В команде с {formatDate(user.createdAt)}
                </span>
              </div>

              {/* Специальности */}
              {user.specialties && user.specialties.length > 0 && (
                <div className="team-responsibilities__section">
                  <h3>Специальности</h3>
                  <div className="team-responsibilities__tags">
                    {user.specialties.map((spec, idx) => (
                      <span key={idx} className="team-responsibilities__tag">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Обязанности */}
              {user.responsibilities && user.responsibilities.length > 0 ? (
                <div className="team-responsibilities__section">
                  <h3>Обязанности</h3>
                  <ul className="team-responsibilities__list">
                    {user.responsibilities.map((task, taskIndex) => (
                      <motion.li 
                        key={taskIndex}
                        className="team-responsibilities__task"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: 0.1 + taskIndex * 0.05 }}
                      >
                        <span className="team-responsibilities__task-bullet">•</span>
                        {task}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="team-responsibilities__empty-tasks">
                  Нет назначенных обязанностей
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ResponsibilitiesPage;