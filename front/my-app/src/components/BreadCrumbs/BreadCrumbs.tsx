// src/components/Breadcrumbs/Breadcrumbs.tsx
import type { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES, BREADCRUMB_LABELS } from '../../Routes';
import './BreadCrumbs.css';

export const Breadcrumbs: FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Скрываем breadcrumbs на главной странице
  if (location.pathname === ROUTES.HOME) {
    return null;
  }

  const getBreadcrumbLabel = (path: string, index: number, fullPathnames: string[]) => {
    // Для детальной страницы реактива
    if (index === fullPathnames.length - 1 && fullPathnames[0] === 'chemicals' && !isNaN(Number(path))) {
      return 'Детали реактива';
    }
    
    const fullPath = `/${fullPathnames.slice(0, index + 1).join('/')}`;
    return BREADCRUMB_LABELS[fullPath] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  const getBreadcrumbPath = (index: number, fullPathnames: string[]) => {
    return `/${fullPathnames.slice(0, index + 1).join('/')}`;
  };

  return (
    <nav className="breadcrumbs">
      <div className="breadcrumbs-container">
        <Link to={ROUTES.HOME} className="breadcrumb-item">Главная</Link>
        {pathnames.map((path, index) => {
          const routeTo = getBreadcrumbPath(index, pathnames);
          const isLast = index === pathnames.length - 1;
          const label = getBreadcrumbLabel(path, index, pathnames);

          return isLast ? (
            <span key={routeTo} className="breadcrumb-item active">
              {label}
            </span>
          ) : (
            <Link key={routeTo} to={routeTo} className="breadcrumb-item">
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};