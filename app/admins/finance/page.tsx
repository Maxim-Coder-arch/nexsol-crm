'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import "../../styles/finance/finance.scss";

interface Expense {
  _id: string;
  author: string;
  description: string;
  amount: number;
  date: string;
  rationality: number;
}

interface Income {
  _id: string;
  author: string;
  description: string;
  amount: number;
  date: string;
}

interface PlannedExpense {
  _id: string;
  author: string;
  description: string;
  amount: number;
  plannedDate: string;
}

interface ChartData {
  date: string;
  expenses: number;
  incomes: number;
  profit: number;
}

export default function FinancePage() {
  // Состояния
  const [activeTab, setActiveTab] = useState<'expenses' | 'incomes' | 'planned'>('expenses');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [planned, setPlanned] = useState<PlannedExpense[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [totals, setTotals] = useState({ expenses: 0, incomes: 0, profit: 0 });
  const [chartPeriod, setChartPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Формы
  const [newExpense, setNewExpense] = useState({
    author: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    rationality: 5
  });

  const [newIncome, setNewIncome] = useState({
    author: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [newPlanned, setNewPlanned] = useState({
    author: '',
    description: '',
    amount: '',
    plannedDate: new Date().toISOString().split('T')[0]
  });

  // Загрузка данных
  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    fetchChartData();
  }, [chartPeriod]);

  const fetchAllData = async () => {
    try {
      const [expensesRes, incomesRes, plannedRes] = await Promise.all([
        fetch('/api/finance/expenses'),
        fetch('/api/finance/incomes'),
        fetch('/api/finance/planned')
      ]);

      setExpenses(await expensesRes.json());
      setIncomes(await incomesRes.json());
      setPlanned(await plannedRes.json());
    } catch (err) {
      setError('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      const res = await fetch(`/api/finance/stats?period=${chartPeriod}`);
      const data = await res.json();
      setChartData(data.chartData);
      setTotals(data.totals);
    } catch (err) {
      setError('Ошибка загрузки графиков');
    }
  };

  // Добавление расходов
  const addExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/finance/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newExpense,
          amount: parseFloat(newExpense.amount)
        })
      });

      if (res.ok) {
        const data = await res.json();
        setExpenses(prev => [data.expense, ...prev]);
        setNewExpense({
          author: '',
          description: '',
          amount: '',
          date: new Date().toISOString().split('T')[0],
          rationality: 5
        });
        fetchChartData();
      }
    } catch (err) {
      setError('Ошибка при добавлении');
    }
  };

  // Добавление доходов
  const addIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/finance/incomes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newIncome,
          amount: parseFloat(newIncome.amount)
        })
      });

      if (res.ok) {
        const data = await res.json();
        setIncomes(prev => [data.income, ...prev]);
        setNewIncome({
          author: '',
          description: '',
          amount: '',
          date: new Date().toISOString().split('T')[0]
        });
        fetchChartData();
      }
    } catch (err) {
      setError('Ошибка при добавлении');
    }
  };

  // Добавление планируемых расходов
  const addPlanned = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/finance/planned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newPlanned,
          amount: parseFloat(newPlanned.amount)
        })
      });

      if (res.ok) {
        const data = await res.json();
        setPlanned(prev => [data.expense, ...prev]);
        setNewPlanned({
          author: '',
          description: '',
          amount: '',
          plannedDate: new Date().toISOString().split('T')[0]
        });
      }
    } catch (err) {
      setError('Ошибка при добавлении');
    }
  };

  // Удаление планируемого расхода
  const deletePlanned = async (id: string) => {
    if (!confirm('Удалить планируемый расход?')) return;
    
    try {
      const res = await fetch('/api/finance/planned', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (res.ok) {
        setPlanned(prev => prev.filter(p => p._id !== id));
      }
    } catch (err) {
      setError('Ошибка при удалении');
    }
  };

  // Форматирование даты
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU');
  };

  // Цвет для рациональности
  const getRationalityColor = (rating: number) => {
    if (rating >= 8) return '#ccff00';
    if (rating >= 5) return '#f2c94c';
    return '#60a5fa';
  };

  return (
    <div className="finance-page">
      <div className="finance-header">
        <h1>Финансы</h1>
        <p>Управление доходами и расходами</p>
      </div>

      {/* Блок с итогами */}
      <div className="totals-grid">
        <div className="total-card income">
          <span className="total-label">Доходы</span>
          <span className="total-value">{totals.incomes.toLocaleString()} ₽</span>
        </div>
        <div className="total-card expense">
          <span className="total-label">Расходы</span>
          <span className="total-value">{totals.expenses.toLocaleString()} ₽</span>
        </div>
        <div className="total-card profit">
          <span className="total-label">Прибыль</span>
          <span className="total-value">{totals.profit.toLocaleString()} ₽</span>
        </div>
      </div>

      {/* График */}
      <div className="chart-section">
        <div className="chart-header">
          <h2>Динамика</h2>
          <div className="chart-periods">
            <button 
              className={chartPeriod === 'week' ? 'active' : ''}
              onClick={() => setChartPeriod('week')}
            >
              Неделя
            </button>
            <button 
              className={chartPeriod === 'month' ? 'active' : ''}
              onClick={() => setChartPeriod('month')}
            >
              Месяц
            </button>
            <button 
              className={chartPeriod === 'year' ? 'active' : ''}
              onClick={() => setChartPeriod('year')}
            >
              Год
            </button>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="date" stroke="#aeaeae" />
            <YAxis stroke="#aeaeae" />
            <Tooltip 
              contentStyle={{ 
                background: '#1b1b1b', 
                border: '1px solid #f2c94c',
                borderRadius: '8px',
                color: '#fff'
              }} 
            />
            <Line type="monotone" dataKey="incomes" stroke="#ccff00" strokeWidth={2} name="Доходы" />
            <Line type="monotone" dataKey="expenses" stroke="#ff6b6b" strokeWidth={2} name="Расходы" />
            <Line type="monotone" dataKey="profit" stroke="#f2c94c" strokeWidth={2} name="Прибыль" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Табы */}
      <div className="finance-tabs">
        <button 
          className={activeTab === 'expenses' ? 'active' : ''}
          onClick={() => setActiveTab('expenses')}
        >
          Расходы
        </button>
        <button 
          className={activeTab === 'incomes' ? 'active' : ''}
          onClick={() => setActiveTab('incomes')}
        >
          Доходы
        </button>
        <button 
          className={activeTab === 'planned' ? 'active' : ''}
          onClick={() => setActiveTab('planned')}
        >
          Планируемые
        </button>
      </div>

      {/* Формы и списки */}
      <div className="finance-content">
        {/* РАСХОДЫ */}
        {activeTab === 'expenses' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <form onSubmit={addExpense} className="add-form">
              <h3>Добавить расход</h3>
              
              <input
                type="text"
                placeholder="Ваше имя"
                value={newExpense.author}
                onChange={(e) => setNewExpense({...newExpense, author: e.target.value})}
                required
              />
              
              <input
                type="text"
                placeholder="Описание"
                value={newExpense.description}
                onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                required
              />
              
              <input
                type="number"
                placeholder="Сумма"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                required
              />
              
              <input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                required
              />
              
              <div className="rationality-input">
                <label>Рациональность: {newExpense.rationality}/10</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newExpense.rationality}
                  onChange={(e) => setNewExpense({...newExpense, rationality: parseInt(e.target.value)})}
                />
                <div className="rationality-scale">
                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                    <span 
                      key={num}
                      className={num <= newExpense.rationality ? 'active' : ''}
                      onClick={() => setNewExpense({...newExpense, rationality: num})}
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </div>
              
              <button type="submit">Добавить расход</button>
            </form>

            <div className="items-list">
              {expenses.map(expense => (
                <div key={expense._id} className="item-card expense">
                  <div className="item-header">
                    <span className="item-author">{expense.author}</span>
                    <span className="item-date">{formatDate(expense.date)}</span>
                  </div>
                  <div className="item-description">{expense.description}</div>
                  <div className="item-footer">
                    <span className="item-amount">-{expense.amount.toLocaleString()} ₽</span>
                    <span 
                      className="item-rationality"
                      style={{ backgroundColor: getRationalityColor(expense.rationality) }}
                    >
                      {expense.rationality}/10
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ДОХОДЫ */}
        {activeTab === 'incomes' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <form onSubmit={addIncome} className="add-form">
              <h3>Добавить доход</h3>
              
              <input
                type="text"
                placeholder="Ваше имя"
                value={newIncome.author}
                onChange={(e) => setNewIncome({...newIncome, author: e.target.value})}
                required
              />
              
              <input
                type="text"
                placeholder="Описание"
                value={newIncome.description}
                onChange={(e) => setNewIncome({...newIncome, description: e.target.value})}
                required
              />
              
              <input
                type="number"
                placeholder="Сумма"
                value={newIncome.amount}
                onChange={(e) => setNewIncome({...newIncome, amount: e.target.value})}
                required
              />
              
              <input
                type="date"
                value={newIncome.date}
                onChange={(e) => setNewIncome({...newIncome, date: e.target.value})}
                required
              />
              
              <button type="submit">Добавить доход</button>
            </form>

            <div className="items-list">
              {incomes.map(income => (
                <div key={income._id} className="item-card income">
                  <div className="item-header">
                    <span className="item-author">{income.author}</span>
                    <span className="item-date">{formatDate(income.date)}</span>
                  </div>
                  <div className="item-description">{income.description}</div>
                  <div className="item-footer">
                    <span className="item-amount">+{income.amount.toLocaleString()} ₽</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ПЛАНИРУЕМЫЕ */}
        {activeTab === 'planned' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <form onSubmit={addPlanned} className="add-form">
              <h3>Запланировать расход</h3>
              
              <input
                type="text"
                placeholder="Ваше имя"
                value={newPlanned.author}
                onChange={(e) => setNewPlanned({...newPlanned, author: e.target.value})}
                required
              />
              
              <input
                type="text"
                placeholder="Описание"
                value={newPlanned.description}
                onChange={(e) => setNewPlanned({...newPlanned, description: e.target.value})}
                required
              />
              
              <input
                type="number"
                placeholder="Сумма"
                value={newPlanned.amount}
                onChange={(e) => setNewPlanned({...newPlanned, amount: e.target.value})}
                required
              />
              
              <input
                type="date"
                value={newPlanned.plannedDate}
                onChange={(e) => setNewPlanned({...newPlanned, plannedDate: e.target.value})}
                required
              />
              
              <button type="submit">Запланировать</button>
            </form>

            <div className="items-list">
              {planned.map(item => (
                <div key={item._id} className="item-card planned">
                  <button 
                    className="delete-btn"
                    onClick={() => deletePlanned(item._id)}
                  >
                    ×
                  </button>
                  <div className="item-header">
                    <span className="item-author">{item.author}</span>
                    <span className="item-date">до {formatDate(item.plannedDate)}</span>
                  </div>
                  <div className="item-description">{item.description}</div>
                  <div className="item-footer">
                    <span className="item-amount">{item.amount.toLocaleString()} ₽</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}