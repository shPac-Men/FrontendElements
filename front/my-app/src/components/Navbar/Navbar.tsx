// src/components/Navbar/Navbar.tsx
import type { FC } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES, ROUTE_LABELS } from '../../Routes';
import { useAppDispatch, useAppSelector } from '../../store/hooks'; // Импорт хуков
import { logout } from '../../store/authSlice'; // Импорт logout
import './Navbar.css';

export const Navbar: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Достаем пользователя из Redux
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate(ROUTES.LOGIN);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to={ROUTES.HOME} className="nav-logo">
          Chemistry Lab
        </Link>
        
        {/* Основные ссылки (центр) */}
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

        {/* Блок авторизации (справа) */}
        <div className="nav-auth">
          {user ? (
            <div className="auth-user-menu">
              <span className="auth-username">{user.login}</span>
              <div className="auth-dropdown">
                <Link to={ROUTES.ORDERS}>Мои заявки</Link>
                <Link to={ROUTES.PROFILE}>Профиль</Link>
                {user.is_moderator && (
                  <>
                    <div className="dropdown-divider"></div>
                    <Link to={ROUTES.ADMIN_ORDERS}>Управление заявками</Link>
                    <Link to={ROUTES.ADMIN_ELEMENTS}>Управление элементами</Link>
                  </>
                )}
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="btn-logout-link">Выход</button>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to={ROUTES.LOGIN} className="nav-btn-login">Вход</Link>
              {/* <Link to={ROUTES.REGISTER} className="nav-btn-register">Регистрация</Link> */}
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};
