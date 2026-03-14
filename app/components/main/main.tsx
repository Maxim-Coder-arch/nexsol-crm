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

const Main = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState<ChartData[]>([]);
  const [monthlyData, setMonthlyData] = useState<ChartData[]>([]);
  const [yearlyData, setYearlyData] = useState<ChartData[]>([]);

  const team = [
    { initials: 'М', name: 'Максим', role: 'Основатель' },
    { initials: 'З', name: 'Захар', role: 'Маркетолог' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, visitorsRes, chartRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/visitors/recent?limit=10'),
          fetch('/api/visitors/charts')
        ]);

        const statsData = await statsRes.json();
        const visitorsData = await visitorsRes.json();
        const chartData = await chartRes.json();

        setStats(statsData);
        setVisitors(visitorsData);
        setWeeklyData(chartData.weekly || []);
        setMonthlyData(chartData.monthly || []);
        setYearlyData(chartData.yearly || []);
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
          <div className="finance-card expenses">
            <h3>Траты</h3>
            <div className="finance-item">
              <span>Фрилансеры</span>
              <span>120 000 ₽</span>
            </div>
            <div className="finance-item">
              <span>Сервисы</span>
              <span>35 000 ₽</span>
            </div>
            <div className="finance-item">
              <span>Налоги</span>
              <span>45 000 ₽</span>
            </div>
            <div className="finance-item">
              <span>Реклама</span>
              <span>60 000 ₽</span>
            </div>
            <div className="finance-total">
              <span>Итого</span>
              <span>260 000 ₽</span>
            </div>
          </div>

          <div className="finance-card incomes">
            <h3>Доходы</h3>
            <div className="finance-item">
              <span>Разработка</span>
              <span>380 000 ₽</span>
            </div>
            <div className="finance-item">
              <span>Реклама</span>
              <span>120 000 ₽</span>
            </div>
            <div className="finance-item">
              <span>Стратегии</span>
              <span>90 000 ₽</span>
            </div>
            <div className="finance-item">
              <span>Поддержка</span>
              <span>45 000 ₽</span>
            </div>
            <div className="finance-total">
              <span>Итого</span>
              <span>635 000 ₽</span>
            </div>
          </div>

          <div className="finance-card profit">
            <h3>Общая прибыль</h3>
            <div className="profit-value">
              375 000 ₽
            </div>
            <div className="profit-chart">
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Прибыль', value: 375000 },
                      { name: 'Расходы', value: 260000 }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#f2c94c" />
                    <Cell fill="#4a4a4a" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
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
          <div className="team-card add">
            <div className="team-avatar">+</div>
            <div className="team-info">
              <div className="team-name">Добавить</div>
              <div className="team-role">нового участника</div>
            </div>
          </div>
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