'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import "../styles/director/director.scss";

export default function DirectorPage() {
  const modules = [
    {
      title: 'Воронки',
      description: 'Разработка и проектирование воронок разных типов',
      link: '/director/funnels',
    },
    {
      title: 'Объявления',
      description: 'Создавать и управлять объявлениями для команды',
      link: '/director/announce',
    },
    {
      title: 'Обязанности',
      description: 'Назначать обязанности команды',
      link: '/director/responsibilities',
    },
    {
      title: 'Полезные ссылки',
      description: 'Полезные ссылки и источники информации',
      link: '/director/links',
    }
  ];

  return (
    <div className="director">
      <div className="director__header">
        <h1>Панель директора</h1>
        <p>Управление компанией и командой</p>
      </div>

      <div className="director__grid">
        {modules.map((module, index) => (
          <motion.div
            key={module.title}
            className="director__card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link href={module.link}>
              <h3>{module.title}</h3>
              <p>{module.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}