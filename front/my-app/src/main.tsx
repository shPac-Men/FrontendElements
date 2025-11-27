// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Root } from './pages/Root/Root';
import { HomePage } from './pages/HomePage/HomePage';
import { ElementsPage } from './pages/ElementPage/ElementPage';
import { ElementDetailPage } from './pages/ElementDetailPage/ElementDetailPage';
import { MixingPage } from './pages/MixingPage/MixingPage';
import { ROUTES } from './Routes';
import './index.css';

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Root />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: ROUTES.ELEMENTS,
        element: <ElementsPage />,
      },
      {
        path: ROUTES.ELEMENT_DETAIL,
        element: <ElementDetailPage />,
      },
      {
        path: ROUTES.MIXING,
        element: <MixingPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
