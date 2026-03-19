import { IModules } from "@/types/directorModules.type";

export const modules: IModules[] = [
    {
      title: 'Заявки',
      description: 'Заявки от клиентов с основного сайта',
      link: '/director/leads',
    },
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
    },
    {
      title: 'Инструменты',
      description: 'Полезные инструменты для работы',
      link: '/director/tools',
    },
    {
      title: 'Пользователи',
      description: 'Управление пользователями: добавление и удаление пользователей',
      link: '/director/users',
    },
  ];