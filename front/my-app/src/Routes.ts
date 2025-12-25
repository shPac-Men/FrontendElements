// src/Routes.ts

export const ROUTES = {
  HOME: '/',
  CHEMICALS: '/chemicals',
  ELEMENT_DETAIL: '/chemicals/:id',
  MIXING: '/mixing',
  MIXING_WITH_ID: '/mixing/:id',
  
  // ЛР7
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_ELEMENTS: '/admin/elements',
  DRAFT: '/draft',
} as const;


export const ROUTE_LABELS = {
  HOME: 'Главная',
  CHEMICALS: 'Реактивы',
  ELEMENT_DETAIL: 'Детали реактива',
  MIXING: 'Смешивание',
  
  // ЛР7
  LOGIN: 'Вход',
  REGISTER: 'Регистрация',
  PROFILE: 'Профиль',
  ORDERS: 'Мои заявки',
  ORDER_DETAIL: 'Детали заявки',
  ADMIN_ORDERS: 'Управление заявками',
  ADMIN_ELEMENTS: 'Управление элементами',
  DRAFT: 'Черновик заявки',
} as const;


// Маппинг для breadcrumbs
export const BREADCRUMB_LABELS: Record<string, string> = {
  [ROUTES.HOME]: 'Главная',
  [ROUTES.CHEMICALS]: 'Реактивы',
  [ROUTES.MIXING]: 'Смешивание',
  
  // Динамические
  '/chemicals/:id': 'Детали реактива',
  '/orders/:id': 'Детали заявки',

  // ЛР7
  [ROUTES.LOGIN]: 'Вход',
  [ROUTES.REGISTER]: 'Регистрация',
  [ROUTES.PROFILE]: 'Личный кабинет',
  [ROUTES.ORDERS]: 'Мои заявки',
  [ROUTES.DRAFT]: 'Черновик',
} as const;
