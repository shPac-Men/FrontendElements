// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { HomePage } from './pages/HomePage/HomePage';
import { ChemicalPage } from './pages/ChemicalPage/ChemicalPage';
import { ChemicalDetailPage } from './pages/ChemicalDetailPage/ChemicalDetailPage';
import { MixingPage } from './pages/MixingPage/MixingPage';
import { ROUTES } from './Routes';
import './index.css';

// Простой router БЕЗ общего Layout
const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <HomePage />,
  },
  {
    path: ROUTES.ELEMENTS,
    element: <ChemicalPage />,
  },
  {
    path: ROUTES.ELEMENT_DETAIL,
    element: <ChemicalDetailPage />,
  },
  {
    path: ROUTES.MIXING,
    element: <MixingPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
