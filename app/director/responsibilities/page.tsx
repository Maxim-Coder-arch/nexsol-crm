'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import "../../styles/director/responsibilities.scss";
import TemplateBack from '@/app/components/template/template';

interface Responsibility {
  _id: string;
  assignee: string;
  tasks: string[];
  createdAt: string;
}

const ResponsibilitiesPage = () => {
  const [responsibilities, setResponsibilities] = useState<Responsibility[]>([]);
  const [newAssignee, setNewAssignee] = useState('');
  const [newTasks, setNewTasks] = useState<string[]>(['']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTasks, setEditTasks] = useState<string[]>([]);

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

  const addTaskField = () => {
    setNewTasks([...newTasks, '']);
  };

  const removeTaskField = (index: number) => {
    if (newTasks.length > 1) {
      setNewTasks(newTasks.filter((_, i) => i !== index));
    }
  };

  const updateTaskField = (index: number, value: string) => {
    const updated = [...newTasks];
    updated[index] = value;
    setNewTasks(updated);
  };

  const addResponsibility = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const filteredTasks = newTasks.filter(task => task.trim() !== '');
    
    if (!newAssignee || filteredTasks.length === 0) {
      setError('Заполните имя и хотя бы одну обязанность');
      return;
    }

    try {
      const res = await fetch('/api/director/responsibilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignee: newAssignee.trim(),
          tasks: filteredTasks
        })
      });

      const data = await res.json();

      if (res.ok) {
        setResponsibilities(prev => [data.responsibility, ...prev]);
        setNewAssignee('');
        setNewTasks(['']);
        setError('');
      } else {
        setError(data.error || 'Ошибка при добавлении');
      }
    } catch (err) {
      setError('Ошибка при добавлении');
    }
  };

  const deleteResponsibility = async (id: string) => {
    if (!confirm('Удалить обязанности этого сотрудника?')) return;

    try {
      const res = await fetch(`/api/director/responsibilities/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setResponsibilities(prev => prev.filter(r => r._id !== id));
      } else {
        const data = await res.json();
        setError(data.error || 'Ошибка при удалении');
      }
    } catch (err) {
      setError('Ошибка при удалении');
    }
  };

  const startEdit = (responsibility: Responsibility) => {
    setEditingId(responsibility._id);
    setEditTasks([...responsibility.tasks]);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTasks([]);
  };

  const updateTaskInEdit = (index: number, value: string) => {
    const updated = [...editTasks];
    updated[index] = value;
    setEditTasks(updated);
  };

  const addTaskInEdit = () => {
    setEditTasks([...editTasks, '']);
  };

  const removeTaskInEdit = (index: number) => {
    if (editTasks.length > 1) {
      setEditTasks(editTasks.filter((_, i) => i !== index));
    }
  };

  const saveEdit = async (id: string) => {
    const filteredTasks = editTasks.filter(task => task.trim() !== '');
    
    if (filteredTasks.length === 0) {
      setError('Должна быть хотя бы одна обязанность');
      return;
    }

    try {
      const res = await fetch(`/api/director/responsibilities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: filteredTasks })
      });

      if (res.ok) {
        setResponsibilities(prev => prev.map(r => 
          r._id === id ? { ...r, tasks: filteredTasks } : r
        ));
        setEditingId(null);
        setEditTasks([]);
      } else {
        const data = await res.json();
        setError(data.error || 'Ошибка при обновлении');
      }
    } catch (err) {
      setError('Ошибка при обновлении');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <>
      <TemplateBack />
      <div className="responsibilities">
        <div className="responsibilities__header">
          <h1>Обязанности команды</h1>
          <p>Распределение задач между сотрудниками</p>
        </div>

        {/* Форма добавления */}
        <div className="responsibilities__form-container">
          <form className="responsibilities__form" onSubmit={addResponsibility}>
            <h2>Новые обязанности</h2>
            
            <div className="responsibilities__field">
              <label>Сотрудник</label>
              <input
                type="text"
                value={newAssignee}
                onChange={(e) => setNewAssignee(e.target.value)}
                placeholder="Имя"
              />
            </div>

            <div className="responsibilities__tasks">
              <label>Обязанности</label>
              {newTasks.map((task, index) => (
                <div key={index} className="responsibilities__task-row">
                  <input
                    type="text"
                    value={task}
                    onChange={(e) => updateTaskField(index, e.target.value)}
                    placeholder={`Обязанность ${index + 1}`}
                  />
                  <button
                    type="button"
                    className="responsibilities__remove-task"
                    onClick={() => removeTaskField(index)}
                    disabled={newTasks.length === 1}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="responsibilities__add-task"
                onClick={addTaskField}
              >
                + Добавить обязанность
              </button>
            </div>

            <button type="submit" className="responsibilities__submit">
              Сохранить
            </button>
          </form>
        </div>

        {/* Список обязанностей */}
        <div className="responsibilities__list">
          {loading ? (
            <div className="responsibilities__loading">Загрузка...</div>
          ) : responsibilities.length === 0 ? (
            <div className="responsibilities__empty">Нет назначенных обязанностей</div>
          ) : (
            responsibilities.map((item) => (
              <motion.div
                key={item._id}
                className="responsibilities__card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="responsibilities__card-header">
                  <div className="responsibilities__assignee">
                    <h3>{item.assignee}</h3>
                    <span className="responsibilities__date">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                  <div className="responsibilities__actions">
                    <button
                      className="responsibilities__edit"
                      onClick={() => startEdit(item)}
                    >
                      ✎
                    </button>
                    <button
                      className="responsibilities__delete"
                      onClick={() => deleteResponsibility(item._id)}
                    >
                      ×
                    </button>
                  </div>
                </div>

                {editingId === item._id ? (
                  <div className="responsibilities__edit-mode">
                    {editTasks.map((task, index) => (
                      <div key={index} className="responsibilities__edit-row">
                        <input
                          type="text"
                          value={task}
                          onChange={(e) => updateTaskInEdit(index, e.target.value)}
                          placeholder={`Обязанность ${index + 1}`}
                        />
                        <button
                          className="responsibilities__remove-edit"
                          onClick={() => removeTaskInEdit(index)}
                          disabled={editTasks.length === 1}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <div className="responsibilities__edit-actions">
                      <button
                        className="responsibilities__add-edit"
                        onClick={addTaskInEdit}
                      >
                        + Добавить
                      </button>
                      <button
                        className="responsibilities__save-edit"
                        onClick={() => saveEdit(item._id)}
                      >
                        Сохранить
                      </button>
                      <button
                        className="responsibilities__cancel-edit"
                        onClick={cancelEdit}
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                ) : (
                  <ul className="responsibilities__tasks-list">
                    {item.tasks.map((task, index) => (
                      <li key={index} className="responsibilities__task-item">
                        {task}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))
          )}
        </div>

        {error && <div className="responsibilities__error">{error}</div>}
      </div>
    </>
  );
};

export default ResponsibilitiesPage;