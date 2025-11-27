// src/components/Breadcrumbs/Breadcrumbs.tsx
import type { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES, ROUTE_LABELS } from '../../Routes';
import './BreadCrumbs.css';

interface BreadcrumbItem {
  label: string;
  path: string;
}

export const Breadcrumbs: FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const breadcrumbs: BreadcrumbItem[] = [{ label: 'Главная', path: ROUTES.HOME }];

  let currentPath = '';
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`;

    if (segment === 'elements' && pathSegments.length === 1) {
      breadcrumbs.push({ label: 'Реактивы', path: ROUTES.ELEMENTS });
    } else if (segment === 'mixing') {
      breadcrumbs.push({ label: 'Расчет', path: ROUTES.MIXING });
    } else if (!isNaN(Number(segment))) {
      breadcrumbs.push({ label: 'Реактив', path: currentPath });
    }
  });

  return (
    <nav className="breadcrumbs">
      {breadcrumbs.map((crumb, index) => (
        <div key={index} className="breadcrumb-item">
          {index < breadcrumbs.length - 1 ? (
            <>
              <Link to={crumb.path}>{crumb.label}</Link>
              <span className="separator">/</span>
            </>
          ) : (
            <span className="active">{crumb.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
};
