'use client';

import { motion } from 'framer-motion';
import "../../styles/funnels/funnels.scss";

const Funnels = () => {
  // Данные для воронок
  const funnelTypes = [
    {
      title: "По температуре",
      items: [
        { name: "Холодные", desc: "Клиенты, которые не знают о вас", color: "#60a5fa", percentage: 100 },
        { name: "Теплые", desc: "Знают, но не готовы купить", color: "#f2c94c", percentage: 65 },
        { name: "Горячие", desc: "Готовы к покупке", color: "#ccff00", percentage: 30 },
      ]
    },
    {
      title: "По типу бизнеса",
      items: [
        { name: "B2B воронка", desc: "Длинный цикл сделки, личные встречи", color: "#60a5fa" },
        { name: "B2C воронка", desc: "Короткий цикл, эмоциональные покупки", color: "#f2c94c" },
      ]
    }
  ];

  // Этапы классической воронки
  const aidaStages = [
    { name: "Внимание (Awareness)", desc: "Привлекаем внимание", width: 100 },
    { name: "Интерес (Interest)", desc: "Вызываем интерес", width: 80 },
    { name: "Желание (Desire)", desc: "Формируем желание", width: 60 },
    { name: "Действие (Action)", desc: "Побуждаем к покупке", width: 40 },
  ];

  const aarpStages = [
    { name: "Осознание", desc: "Клиент понимает проблему", width: 100 },
    { name: "Поиск решения", desc: "Ищет варианты", width: 85 },
    { name: "Выбор", desc: "Сравнивает", width: 70 },
    { name: "Покупка", desc: "Принимает решение", width: 50 },
  ];

  return (
    <div className="funnels-page">
      <motion.div 
        className="funnels-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Воронки</h1>
        <p>Маркетинговые и sales-воронки для стратегического планирования</p>
      </motion.div>

      {/* Секция с типами воронок */}
      <div className="funnels-grid">
        {funnelTypes.map((section, idx) => (
          <motion.div 
            key={section.title}
            className="funnel-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <h2>{section.title}</h2>
            <div className="funnel-cards">
              {section.items.map((item, i) => (
                <motion.div 
                  key={item.name}
                  className="funnel-card"
                  whileHover={{ y: -5, borderColor: item.color }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="card-header" style={{ borderLeftColor: item.color }}>
                    <h3>{item.name}</h3>
                  </div>
                  <p>{item.desc}</p>
                  {item.percentage && (
                    <div className="funnel-progress">
                      <div 
                        className="progress-bar" 
                        style={{ 
                          width: `${item.percentage}%`,
                          backgroundColor: item.color 
                        }}
                      />
                      <span>{item.percentage}% от общего потока</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Детальные воронки */}
      <div className="funnels-detailed">
        <motion.div 
          className="detailed-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2>Воронка продаж (AARP)</h2>
          <div className="funnel-stages">
            {aarpStages.map((stage, index) => (
              <motion.div 
                key={stage.name}
                className="stage-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              >
                <div className="stage-info">
                  <span className="stage-number">0{index + 1}</span>
                  <div>
                    <h3>{stage.name}</h3>
                    <p>{stage.desc}</p>
                  </div>
                </div>
                <div className="stage-bar">
                  <div 
                    className="bar-fill"
                    style={{ 
                      width: `${stage.width}%`,
                      background: `linear-gradient(90deg, #f2c94c, #60a5fa)` 
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="detailed-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2>Воронка маркетинга (AIDA)</h2>
          <div className="funnel-visual">
            {aidaStages.map((stage, index) => (
              <motion.div 
                key={stage.name}
                className="funnel-block"
                style={{ width: `${stage.width}%` }}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              >
                <div className="block-content">
                  <h4>{stage.name}</h4>
                  <p>{stage.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* B2B Специфика */}
      <motion.div 
        className="b2b-section"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2>B2B воронка (особенности)</h2>
        <div className="b2b-timeline">
          <div className="timeline-item">
            <span className="timeline-stage">Лидогенерация</span>
            <span className="timeline-duration">2-4 недели</span>
          </div>
          <div className="timeline-item">
            <span className="timeline-stage">Квалификация</span>
            <span className="timeline-duration">1-2 недели</span>
          </div>
          <div className="timeline-item">
            <span className="timeline-stage">Переговоры</span>
            <span className="timeline-duration">2-8 недель</span>
          </div>
          <div className="timeline-item">
            <span className="timeline-stage">Закрытие сделки</span>
            <span className="timeline-duration">1-2 недели</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Funnels;