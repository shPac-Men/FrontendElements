export const ROUTES = {
  HOME: '/',
  CHEMICALS: '/chemicals',  // Добавляем CHEMICALS
  ELEMENTS: '/elements',
  ELEMENT_DETAIL: '/elements/:id',
  MIXING: '/mixing',
  CHEMICAL_DETAIL: '/chemicals/:id',  // Добавляем CHEMICAL_DETAIL
} as const;

export const ROUTE_LABELS = {
  HOME: 'Главная',
  CHEMICALS: 'Реактивы',
  ELEMENTS: 'Элементы',
  ELEMENT_DETAIL: 'Детали элемента',
  MIXING: 'Смешивание',
  CHEMICAL_DETAIL: 'Детали реактива',
} as const;