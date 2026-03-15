'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import "../../styles/responsibilities/responsibilities.scss";

interface Responsibility {
  _id: string;
  assignee: string;
  tasks: string[];
  createdAt: string;
}

const ResponsibilitiesPage = () => {
  const [responsibilities, setResponsibilities] = useState<Responsibility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');

  useEffect(() => {
    fetchResponsibilities();
  }, []);

  const fetchResponsibilities = async () => {
    try {
      const res = await fetch('/api/director/responsibilities');
      const data = await res.json();
      setResponsibilities(data);
    } catch (err) {
      setError('Ошибка загрузки обязанностей');
    } finally {
      setLoading(false);
    }
  };

  // Получаем список всех сотрудников для фильтра
  const assignees = ['all', ...new Set(responsibilities.map(r => r.assignee))];

  // Фильтруем обязанности
  const filteredResponsibilities = selectedAssignee === 'all'
    ? responsibilities
    : responsibilities.filter(r => r.assignee === selectedAssignee);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="team-responsibilities">
      <div className="team-responsibilities__header">
        <h1>Обязанности команды</h1>
        <p>Текущие задачи и ответственность сотрудников</p>
      </div>

      {/* Фильтр по сотрудникам */}
      {!loading && responsibilities.length > 0 && (
        <div className="team-responsibilities__filter">
          <label>Сотрудник:</label>
          <select 
            value={selectedAssignee} 
            onChange={(e) => setSelectedAssignee(e.target.value)}
          >
            {assignees.map(assignee => (
              <option key={assignee} value={assignee}>
                {assignee === 'all' ? 'Все сотрудники' : assignee}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="team-responsibilities__list">
        {loading ? (
          <div className="team-responsibilities__loading">Загрузка обязанностей...</div>
        ) : error ? (
          <div className="team-responsibilities__error">{error}</div>
        ) : filteredResponsibilities.length === 0 ? (
          <div className="team-responsibilities__empty">
            {selectedAssignee === 'all' 
              ? 'Нет назначенных обязанностей' 
              : 'У этого сотрудника пока нет обязанностей'}
          </div>
        ) : (
          filteredResponsibilities.map((item, index) => (
            <motion.div
              key={item._id}
              className="team-responsibilities__card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="team-responsibilities__card-header">
                <h2>{item.assignee}</h2>
                <span className="team-responsibilities__date">
                  с {formatDate(item.createdAt)}
                </span>
              </div>

              <div className="team-responsibilities__tasks">
                <h3>Обязанности:</h3>
                <ul className="team-responsibilities__list">
                  {item.tasks.map((task, taskIndex) => (
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
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ResponsibilitiesPage;