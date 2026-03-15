'use client';

import { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import "../../styles/home/home.scss";

interface Visitor {
  _id: string;
  visitorId: string;
  page: string;
  referrer: string;
  userAgent: string;
  timestamp: string;
}

interface StatsData {
  unique: { today: number; week: number; month: number };
  total: { today: number; week: number; month: number };
}

interface ChartData {
  day: string;
  visitors: number;
}

interface VisitorsByDay {
  [key: string]: number;
}

interface Expense {
  amount: number;
  description: string;
  // другие поля не важны для сумм
}

interface Income {
  amount: number;
  description: string;
}

interface FinanceTotals {
  expenses: number;
  incomes: number;
  profit: number;
}

const Main = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState<ChartData[]>([]);
  const [monthlyData, setMonthlyData] = useState<ChartData[]>([]);
  const [yearlyData, setYearlyData] = useState<ChartData[]>([]);
  const [financeTotals, setFinanceTotals] = useState<FinanceTotals>({
    expenses: 0,
    incomes: 0,
    profit: 0
  });
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [recentIncomes, setRecentIncomes] = useState<Income[]>([]);

  const team = [
    { initials: 'М', name: 'Максим', role: 'Технический директор, фронтенд разработчик, тимлид' },
    { initials: 'З', name: 'Захар', role: 'Sales, маркетолог, стратег' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, visitorsRes, chartRes, expensesRes, incomesRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/visitors/recent?limit=10'),
          fetch('/api/visitors/charts'),
          fetch('/api/finance/expenses'),
          fetch('/api/finance/incomes')
        ]);

        const statsData = await statsRes.json();
        const visitorsData = await visitorsRes.json();
        const chartData = await chartRes.json();
        const expensesData = await expensesRes.json();
        const incomesData = await incomesRes.json();

        setStats(statsData);
        setVisitors(visitorsData);
        setWeeklyData(chartData.weekly || []);
        setMonthlyData(chartData.monthly || []);
        setYearlyData(chartData.yearly || []);

        // Сохраняем последние 3 операции
        setRecentExpenses(expensesData.slice(0, 3));
        setRecentIncomes(incomesData.slice(0, 3));

        // Считаем общие суммы
        const totalExpenses = expensesData.reduce((sum: number, e: Expense) => sum + e.amount, 0);
        const totalIncomes = incomesData.reduce((sum: number, i: Income) => sum + i.amount, 0);
        
        setFinanceTotals({
          expenses: totalExpenses,
          incomes: totalIncomes,
          profit: totalIncomes - totalExpenses
        });

      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const COLORS = ['#f2c94c', '#60a5fa', '#ccff00', '#4a4a4a'];

  return (
    <div className="dashboard-main">
      <div className="dashboard-header">
        <h1>Главная</h1>
        <div className="dashboard-date">
          {new Date().toLocaleDateString('ru-RU', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })}
        </div>
      </div>

      <section className="dashboard-section">
        <h2>Посещаемость сайта</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <span className="stat-label">Уникальные сегодня</span>
              <span className="stat-value">{stats?.unique.today || 0}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <span className="stat-label">Уникальные за неделю</span>
              <span className="stat-value">{stats?.unique.week || 0}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <span className="stat-label">Уникальные за месяц</span>
              <span className="stat-value">{stats?.unique.month || 0}</span>
            </div>
          </div>
          <div className="stat-card total">
            <div className="stat-content">
              <span className="stat-label">Всего сегодня</span>
              <span className="stat-value">{stats?.total.today || 0}</span>
            </div>
          </div>
          <div className="stat-card total">
            <div className="stat-content">
              <span className="stat-label">Всего за неделю</span>
              <span className="stat-value">{stats?.total.week || 0}</span>
            </div>
          </div>
          <div className="stat-card total">
            <div className="stat-content">
              <span className="stat-label">Всего за месяц</span>
              <span className="stat-value">{stats?.total.month || 0}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Графики посещаемости</h2>
        <div className="charts-grid">
          <div className="chart-card">
            <h3>За неделю</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="day" stroke="#aeaeae" />
                <YAxis stroke="#aeaeae" />
                <Tooltip 
                  contentStyle={{ 
                    background: '#1b1b1b', 
                    border: '1px solid #f2c94c',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="visitors" 
                  stroke="#f2c94c" 
                  strokeWidth={2}
                  dot={{ fill: '#f2c94c', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>За месяц</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="day" stroke="#aeaeae" />
                <YAxis stroke="#aeaeae" />
                <Tooltip 
                  contentStyle={{ 
                    background: '#1b1b1b', 
                    border: '1px solid #f2c94c',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="visitors" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>За год</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={yearlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="day" stroke="#aeaeae" />
                <YAxis stroke="#aeaeae" />
                <Tooltip 
                  contentStyle={{ 
                    background: '#1b1b1b', 
                    border: '1px solid #f2c94c',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="visitors" 
                  stroke="#ccff00" 
                  strokeWidth={2}
                  dot={{ fill: '#ccff00', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="dashboard-section">
  <h2>Финансы</h2>
  <div className="finance-grid">
    {/* Траты */}
    <div className="finance-card expenses">
      <h3>Последние траты</h3>
      {recentExpenses.length > 0 ? (
        recentExpenses.map((expense, idx) => (
          <div key={idx} className="finance-item">
            <span>{expense.description}</span>
            <span>{expense.amount.toLocaleString()} ₽</span>
          </div>
        ))
      ) : (
        <div className="finance-item">
          <span>Нет трат</span>
          <span>0 ₽</span>
        </div>
      )}
      <div className="finance-total">
        <span>Всего трат</span>
        <span>{financeTotals.expenses.toLocaleString()} ₽</span>
      </div>
    </div>

    {/* Доходы */}
    <div className="finance-card incomes">
      <h3>Последние доходы</h3>
      {recentIncomes.length > 0 ? (
        recentIncomes.map((income, idx) => (
          <div key={idx} className="finance-item">
            <span>{income.description}</span>
            <span>{income.amount.toLocaleString()} ₽</span>
          </div>
        ))
      ) : (
        <div className="finance-item">
          <span>Нет доходов</span>
          <span>0 ₽</span>
        </div>
      )}
      <div className="finance-total">
        <span>Всего доходов</span>
        <span>{financeTotals.incomes.toLocaleString()} ₽</span>
      </div>
    </div>

    {/* Прибыль */}
    <div className="finance-card profit">
      <h3>Общая прибыль</h3>
      <div className="profit-value">
        {financeTotals.profit.toLocaleString()} ₽
      </div>
      <div className="profit-chart">
        <ResponsiveContainer width="100%" height={150}>
          <PieChart>
            <Pie
              data={[
                { name: 'Прибыль', value: Math.max(financeTotals.profit, 0) },
                { name: 'Расходы', value: financeTotals.expenses }
              ]}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              paddingAngle={5}
              dataKey="value"
            >
              <Cell fill={financeTotals.profit >= 0 ? "#f2c94c" : "#ff0000"} />
              <Cell fill="#e42525" />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="finance-stats">
        <div className="finance-stat">
          <span>Доходы</span>
          <span className="income-value">{financeTotals.incomes.toLocaleString()} ₽</span>
        </div>
        <div className="finance-stat">
          <span>Расходы</span>
          <span className="expense-value">{financeTotals.expenses.toLocaleString()} ₽</span>
        </div>
      </div>
    </div>
  </div>
</section>

      <section className="dashboard-section">
        <h2>Команда</h2>
        <div className="team-grid">
          {team.map((member, idx) => (
            <div key={idx} className="team-card">
              <div className="team-avatar">{member.initials}</div>
              <div className="team-info">
                <div className="team-name">{member.name}</div>
                <div className="team-role">{member.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Детальная статистика</h2>
        <div className="visitors-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Страница</th>
                <th>Источник</th>
                <th>Устройство</th>
                <th>Время</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map((visitor) => (
                <tr key={visitor._id}>
                  <td className="visitor-id">{visitor.visitorId.slice(0, 8)}</td>
                  <td>{visitor.page}</td>
                  <td>{visitor.referrer}</td>
                  <td className="user-agent">
                    {visitor.userAgent.includes('Mobile') ? 'Смартфон' : 'Пк'}
                  </td>
                  <td>{new Date(visitor.timestamp).toLocaleString('ru-RU')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Main;