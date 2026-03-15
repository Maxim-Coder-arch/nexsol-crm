import { IDashboard } from "../types/dashboard.type";

const dashboard: IDashboard[] = [
  {
    id: "home",
    label: "Главная",
    link: "/",
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
    id: 'director',
    label: "Директор",
    link: "/director",
  },
];

export default dashboard;