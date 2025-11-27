// src/components/Navbar/Navbar.tsx
import type { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES, ROUTE_LABELS } from '../../Routes';
import './Navbar.css';

export const Navbar: FC = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to={ROUTES.HOME} className="nav-logo">
          Chemistry Lab
        </Link>
        <ul className="nav-links">
          <li className={location.pathname === ROUTES.HOME ? 'active' : ''}>
            <Link to={ROUTES.HOME}>{ROUTE_LABELS.HOME}</Link>
          </li>
          <li className={location.pathname === ROUTES.CHEMICALS ? 'active' : ''}>
            <Link to={ROUTES.CHEMICALS}>{ROUTE_LABELS.CHEMICALS}</Link>
          </li>
          <li className={location.pathname === ROUTES.MIXING ? 'active' : ''}>
            <Link to={ROUTES.MIXING}>{ROUTE_LABELS.MIXING}</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};