// export const ROUTES = {
//   HOME: '/',
//   CHEMICALS: '/chemicals',  // ← Главная страница реактивов
//   ELEMENTS: '/elements',    // ← Если это нужно, оставь
//   ELEMENT_DETAIL: '/elements/:id',
//   MIXING: '/mixing',
//   CHEMICAL_DETAIL: '/elements/:id',  // ← Деталь реактива (химический элемент)
// } as const;

// export const ROUTE_LABELS = {
//   HOME: 'Главная',
//   CHEMICALS: 'Реактивы',
//   ELEMENTS: 'Элементы',
//   ELEMENT_DETAIL: 'Детали элемента',
//   MIXING: 'Смешивание',
//   CHEMICAL_DETAIL: 'Детали реактива',
// } as const;

// src/Routes.ts
export const ROUTES = {
  HOME: '/',
  CHEMICALS: '/chemicals',
  ELEMENT_DETAIL: '/chemicals/:id',  // ← Исправлено на chemicals
  MIXING: '/mixing',
} as const;

export const ROUTE_LABELS = {
  HOME: 'Главная',
  CHEMICALS: 'Реактивы',
  ELEMENT_DETAIL: 'Детали реактива',
  MIXING: 'Смешивание',
} as const;

// Маппинг для breadcrumbs
export const BREADCRUMB_LABELS: Record<string, string> = {
  [ROUTES.HOME]: 'Главная',
  [ROUTES.CHEMICALS]: 'Реактивы',
  [ROUTES.MIXING]: 'Смешивание',
  '/chemicals/:id': 'Детали реактива', // Для динамических маршрутов
} as const;