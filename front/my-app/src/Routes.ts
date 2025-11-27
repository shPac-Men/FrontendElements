// src/Routes.ts
export const ROUTES = {
  HOME: "/",
  ALBUMS: "/albums",
  // Добавляем путь для страницы "Подробнее". :id - это динамический параметр
  ALBUM_DETAIL: "/albums/:id", 
};

export type RouteKeyType = keyof typeof ROUTES;

export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
  HOME: "Главная",
  ALBUMS: "Альбомы",
  ALBUM_DETAIL: "Подробнее", // Название для "хлебных крошек"
};
