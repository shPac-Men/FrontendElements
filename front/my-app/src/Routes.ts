
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