'use client';
import dashboard from "@/data/dashboard.data";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../../styles/dashboard/dashboard.scss";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [stats, setStats] = useState({
    unique: { today: 0, week: 0, month: 0 },
    total: { today: 0, week: 0, month: 0 }
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const toggleDashboard = () => setIsOpen(!isOpen);
  const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift();
      return cookieValue || null;
    }
    return null;
  };

  useEffect(() => {
    const fetchUserData = () => {
      const userNameFromCookie = getCookie('nexsol_user');
      
      if (userNameFromCookie) {
        try {
          const decodedName = decodeURIComponent(userNameFromCookie);
          console.log('✅ Имя после декодирования:', decodedName);
          setUserName(decodedName);
        } catch (e) {
          console.error('Ошибка декодирования:', e);
          setUserName(userNameFromCookie);
        }
      } else {
        const allCookies = document.cookie.split('; ').reduce((acc, curr) => {
          const [name, value] = curr.split('=');
          acc[name] = value;
          return acc;
        }, {} as Record<string, string>);
      }
    };
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);
  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });
      
      if (res.ok) {
        document.cookie = 'nexsol_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        document.cookie = 'nexsol_user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <motion.button 
        className={`dashboard-toggle ${isOpen ? 'open' : 'closed'}`}
        onClick={toggleDashboard}
        whileTap={{ scale: 0.95 }}
        animate={{ 
          left: isOpen ? 280 : 20,
          rotate: isOpen ? 0 : 180
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="toggle-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path 
              d="M15 18L9 12L15 6" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </motion.button>

      <motion.div 
        className="dashboard"
        initial={{ x: 0 }}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {!isOpen && (
          <motion.div 
            className="dashboard-closed-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleDashboard}
          />
        )}

        <div className="dashboard-header-left">
          <div className="dashboard-logo">
            <div className="logotype-company" />
            <AnimatePresence mode="wait">
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  NEXSOL CRM
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.div 
                className="dashboard-user"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <span className="user-greeting">👋</span>
                <span className="user-name">
                  {userName || 'Пользователь'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="dashboard-nav">
          {dashboard.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -20 }}
              transition={{ duration: 0.2, delay: isOpen ? index * 0.03 : 0 }}
            >
              <Link href={item.link} className="dashboard-nav-item" onClick={toggleDashboard}>
                <span className="dashboard-nav-label">
                  {isOpen ? item.label : ''}
                </span>
                {isOpen && (
                  <span className="dashboard-nav-arrow">→</span>
                )}
              </Link>
            </motion.div>
          ))}
        </nav>

        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div 
              className="dashboard-stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, delay: 0.2 }}
            >
              <div className="stat-item">
                <span className="stat-label">Уникальных сегодня</span>
                <span className="stat-value">
                  {loading ? '...' : stats.unique.today}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">За неделю</span>
                <span className="stat-value">
                  {loading ? '...' : stats.unique.week}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">За месяц</span>
                <span className="stat-value">
                  {loading ? '...' : stats.unique.month}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div 
              className="dashboard-footer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, delay: 0.3 }}
            >
              <div className="team-members">
                <div className="team-member">
                  <span className="member-initials">А</span>
                </div>
                <div className="team-member">
                  <span className="member-initials">П</span>
                </div>
                <div className="team-member add">
                  <span>+</span>
                </div>
              </div>
              
              <motion.button
                className="logout-button"
                onClick={handleLogout}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Выйти</span>
              </motion.button>
              
              <div className="dashboard-version">
                v1.0 · internal
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default Dashboard;