import { IDashboard } from "../types/dashboard.type";

const dashboard: IDashboard[] = [
  {
    id: "home",
    label: "Главная",
    link: "/",
  },
  {
    id: "leads",
    label: "Заявки",
    link: "/admins/leads",
  },
  {
    id: "ai",
    label: "Быстрый чат с ai",
    link: "/admins/nexsol-ai",
  },
  {
    id: 'time',
    label: "Учет времени",
    link: "/admins/time",
  },
  {
    id: 'clients',
    label: "База данных клиентов",
    link: "/admins/clients",
  },
  {
    id: 'advertisements',
    label: "Объявления",
    link: "/admins/advertisements",
  },
  {
    id: 'finance',
    label: "Финансы",
    link: "/admins/finance",
  },
  {
    id: 'funnels',
    label: "Воронки",
    link: "/admins/funnels",
  },
  {
    id: 'calculators',
    label: "Калькуляторы",
    link: "/admins/calculators",
  },
  {
    id: 'responsibilities',
    label: "Обязанности",
    link: "/admins/responsibilities",
  },
  {
    id: 'tools',
    label: "Инструменты",
    link: "/admins/tools",
  },
  {
    id: 'templates',
    label: "Текстовые шаблоны",
    link: "/admins/text-templates",
  },
  {
    id: 'notes',
    label: "Заметки",
    link: "/admins/notes",
  },
  {
    id: 'achievements',
    label: "Достижения",
    link: "/admins/achievements",
  },
  {
    id: 'ideas',
    label: "Идеи для бизнеса",
    link: "/admins/ideas",
  },
  {
    id: 'website',
    label: "Перейти на сайт nexsol",
    link: "https://nexsol.vercel.app/",
  },
  {
    id: 'director',
    label: "Администрация",
    link: "/director",
  },
];

export default dashboard;