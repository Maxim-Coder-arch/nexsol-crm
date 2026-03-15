import { IDashboard } from "../types/dashboard.type";

const dashboard: IDashboard[] = [
  {
    label: "Главная",
    link: "/",
  },
  {
    label: "Финансы",
    link: "/admins/finance",
  },
  {
    label: "Воронки",
    link: "/admins/funnels",
  },
  {
    label: "Калькуляторы",
    link: "/admins/calculators",
  },
  {
    label: "Текстовые шаблоны",
    link: "/admins/text-templates",
  },
  {
    label: "Заметки",
    link: "/admins/notes",
  },
  {
    label: "Достижения",
    link: "/admins/achievements",
  },
  {
    label: "Идеи для бизнеса",
    link: "/admins/ideas",
  },
  {
    label: "Управление сайтом",
    link: "/admins/website",
  },
];

export default dashboard;