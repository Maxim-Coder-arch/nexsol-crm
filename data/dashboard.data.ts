import { IDashboard } from "../types/dashboard.type";

const dashboard: IDashboard[] = [
  {
    label: "Главная",
    link: "/",
  },
  {
    label: "Воронки",
    link: "/admins/funnels",
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
    label: "Управление сайтом",
    link: "/admins/website",
  },
  {
    label: "Финансы",
    link: "/admins/finance",
  },
  {
    label: "Идеи для бизнеса",
    link: "/admins/ideas",
  },
  {
    label: "Шаблоны ответов",
    link: "/admins/answers",
  },
  {
    label: "Калькуляторы",
    link: "/admins/calculators",
  },
];

export default dashboard;