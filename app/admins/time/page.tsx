'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import "../../styles/time/time.scss";
import { TimeEntry } from '@/types/timeEntry.type';

export default function TimePage() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [activeTimer, setActiveTimer] = useState<TimeEntry | null>(null);
  const [stats, setStats] = useState({ day: 0, week: 0, month: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [manualAuthor, setManualAuthor] = useState('');
  const [manualTask, setManualTask] = useState('');
  const [manualDescription, setManualDescription] = useState('');
  const [manualDifficulty, setManualDifficulty] = useState(5);
  const [manualStartDate, setManualStartDate] = useState('');
  const [manualStartTime, setManualStartTime] = useState('');
  const [manualEndDate, setManualEndDate] = useState('');
  const [manualEndTime, setManualEndTime] = useState('');
  const [timerAuthor, setTimerAuthor] = useState('');
  const [timerTask, setTimerTask] = useState('');
  const [timerDescription, setTimerDescription] = useState('');
  const [timerDifficulty, setTimerDifficulty] = useState(5);
  const [timerStart, setTimerStart] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      if (activeTimer) {
        setCurrentTime(prev => prev + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [activeTimer]);

  const fetchData = async () => {
    try {
      const [entriesRes, activeRes, statsRes] = await Promise.all([
        fetch('/api/time'),
        fetch('/api/time/active'),
        fetch('/api/time/stats')
      ]);

      setEntries(await entriesRes.json());
      
      const activeData = await activeRes.json();
      if (activeData._id) {
        setActiveTimer(activeData);
        const duration = Math.floor((Date.now() - new Date(activeData.startTime).getTime()) / 1000);
        setCurrentTime(duration);
      }
      
      setStats(await statsRes.json());
    } catch {
      setError('Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  const startTimer = async () => {
    if (!timerAuthor || !timerTask) {
      setError('Заполните автора и задачу');
      return;
    }

    try {
      const res = await fetch('/api/time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: timerAuthor,
          task: timerTask,
          description: timerDescription || undefined,
          difficulty: timerDifficulty,
          startTime: new Date()
        })
      });

      if (res.ok) {
        const data = await res.json();
        setActiveTimer(data.entry);
        setTimerStart(new Date());
        setCurrentTime(0);
        setTimerAuthor('');
        setTimerTask('');
        setTimerDescription('');
        setTimerDifficulty(5);
        fetchData();
      }
    } catch {
      setError('Ошибка при старте');
    }
  };

  const stopTimer = async () => {
    if (!activeTimer) return;

    try {
      const res = await fetch('/api/time/active', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endTime: new Date() })
      });

      if (res.ok) {
        setActiveTimer(null);
        setTimerStart(null);
        fetchData();
      }
    } catch {
      setError('Ошибка при остановке');
    }
  };

  const addManualEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!manualAuthor || !manualTask || !manualStartDate || !manualStartTime) {
      setError('Заполните обязательные поля');
      return;
    }

    const startDateTime = new Date(`${manualStartDate}T${manualStartTime}`);
    let endDateTime;
    
    if (manualEndDate && manualEndTime) {
      endDateTime = new Date(`${manualEndDate}T${manualEndTime}`);
      if (endDateTime < startDateTime) {
        setError('Дата окончания не может быть раньше начала');
        return;
      }
    }

    try {
      const res = await fetch('/api/time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: manualAuthor,
          task: manualTask,
          description: manualDescription || undefined,
          difficulty: manualDifficulty,
          startTime: startDateTime,
          endTime: endDateTime
        })
      });

      if (res.ok) {
        setManualAuthor('');
        setManualTask('');
        setManualDescription('');
        setManualDifficulty(5);
        setManualStartDate('');
        setManualStartTime('');
        setManualEndDate('');
        setManualEndTime('');
        fetchData();
      }
    } catch {
      setError('Ошибка при добавлении');
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDifficultyColor = (diff: number) => {
    if (diff >= 8) return '#ff6b6b';
    if (diff >= 5) return '#f2c94c';
    return '#60a5fa';
  };

  return (
    <div className="time">
      <div className="time__header">
        <h1>Учет времени</h1>
        <p>Трекинг задач и трудозатрат</p>
      </div>

      <div className="time__stats">
        <div className="time__stat-card">
          <span className="time__stat-label">Сегодня</span>
          <span className="time__stat-value">{Math.floor(stats.day / 60)}ч {stats.day % 60}м</span>
        </div>
        <div className="time__stat-card">
          <span className="time__stat-label">Неделя</span>
          <span className="time__stat-value">{Math.floor(stats.week / 60)}ч {stats.week % 60}м</span>
        </div>
        <div className="time__stat-card">
          <span className="time__stat-label">Месяц</span>
          <span className="time__stat-value">{Math.floor(stats.month / 60)}ч {stats.month % 60}м</span>
        </div>
        <div className="time__stat-card">
          <span className="time__stat-label">Всего</span>
          <span className="time__stat-value">{Math.floor(stats.total / 60)}ч {stats.total % 60}м</span>
        </div>
      </div>

      {activeTimer ? (
        <div className="time__active">
          <div className="time__active-info">
            <h3>Сейчас работаете</h3>
            <p className="time__active-task">{activeTimer.task}</p>
            <p className="time__active-author">{activeTimer.author}</p>
            <div className="time__active-timer">{formatDuration(currentTime)}</div>
          </div>
          <button className="time__active-stop" onClick={stopTimer}>
            Остановить
          </button>
        </div>
      ) : (
        <div className="time__active time__active--empty">
          <h3>Нет активной задачи</h3>
        </div>
      )}
      <div className="time__forms">
        <div className="time__form time__form--timer">
          <h2>Запустить таймер</h2>
          <input
            type="text"
            placeholder="Автор"
            value={timerAuthor}
            onChange={(e) => setTimerAuthor(e.target.value)}
          />
          <input
            type="text"
            placeholder="Задача"
            value={timerTask}
            onChange={(e) => setTimerTask(e.target.value)}
          />
          <input
            type="text"
            placeholder="Комментарий (необязательно)"
            value={timerDescription}
            onChange={(e) => setTimerDescription(e.target.value)}
          />
          <div className="time__difficulty">
            <label>Сложность: {timerDifficulty}/10</label>
            <input
              type="range"
              min="1"
              max="10"
              value={timerDifficulty}
              onChange={(e) => setTimerDifficulty(parseInt(e.target.value))}
            />
          </div>
          <button onClick={startTimer}>Старт</button>
        </div>

        <div className="time__form time__form--manual">
          <h2>Добавить вручную</h2>
          <form onSubmit={addManualEntry}>
            <input
              type="text"
              placeholder="Автор"
              value={manualAuthor}
              onChange={(e) => setManualAuthor(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Задача"
              value={manualTask}
              onChange={(e) => setManualTask(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Комментарий (необязательно)"
              value={manualDescription}
              onChange={(e) => setManualDescription(e.target.value)}
            />
            
            <div className="time__datetime">
              <div className="time__datetime-field">
                <label>Дата начала</label>
                <input
                  type="date"
                  value={manualStartDate}
                  onChange={(e) => setManualStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="time__datetime-field">
                <label>Время начала</label>
                <input
                  type="time"
                  value={manualStartTime}
                  onChange={(e) => setManualStartTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="time__datetime">
              <div className="time__datetime-field">
                <label>Дата окончания</label>
                <input
                  type="date"
                  value={manualEndDate}
                  onChange={(e) => setManualEndDate(e.target.value)}
                />
              </div>
              <div className="time__datetime-field">
                <label>Время окончания</label>
                <input
                  type="time"
                  value={manualEndTime}
                  onChange={(e) => setManualEndTime(e.target.value)}
                />
              </div>
            </div>

            <div className="time__difficulty">
              <label>Сложность: {manualDifficulty}/10</label>
              <input
                type="range"
                min="1"
                max="10"
                value={manualDifficulty}
                onChange={(e) => setManualDifficulty(parseInt(e.target.value))}
              />
            </div>

            <button type="submit">Добавить</button>
          </form>
        </div>
      </div>

      <div className="time__history">
        <h2>История</h2>
        <div className="time__entries">
          {entries.map((entry) => (
            <motion.div
              key={entry._id}
              className="time__entry"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="time__entry-header">
                <span className="time__entry-author">{entry.author}</span>
                <span className="time__entry-date">{formatDateTime(entry.startTime)}</span>
              </div>
              <div className="time__entry-task">{entry.task}</div>
              {entry.description && (
                <div className="time__entry-description">{entry.description}</div>
              )}
              <div className="time__entry-footer">
                <span 
                  className="time__entry-difficulty"
                  style={{ backgroundColor: getDifficultyColor(entry.difficulty) }}
                >
                  Сложность: {entry.difficulty}/10
                </span>
                <span className="time__entry-duration">
                  {entry.duration 
                    ? `${Math.floor(entry.duration / 60)}ч ${entry.duration % 60}м`
                    : 'Не завершено'
                  }
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {error && <div className="time__error">{error}</div>}
    </div>
  );
}