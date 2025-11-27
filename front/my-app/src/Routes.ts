// src/Routes.ts
export const ROUTES = {
  HOME: '/',
  ELEMENTS: '/elements',
  ELEMENT_DETAIL: '/elements/:id',
  MIXING: '/mixing',
} as const;

export const ROUTE_LABELS: Record<string, string> = {
  HOME: 'Главная',
  ELEMENTS: 'Реактивы',
  ELEMENT_DETAIL: 'Реактив',
  MIXING: 'Расчет',
};
