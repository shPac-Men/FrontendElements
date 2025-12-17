import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import type { ChemicalElement } from '../../types/chemistry';
import { getChemicals, getCartCount } from '../../modules/chemistryApi';
import './ChemicalPage.css';
import { ROUTES } from '../../Routes';
import reactSvg from '../../assets/react.svg';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSearchQuery } from '../../store/filterSlice';
import { logout } from '../../store/authSlice'; // Добавлен logout
import { STATIC_BASE } from '../../config/config'

const DEFAULT_IMAGE = reactSvg;

export const ChemicalPage: FC = () => {
  const [chemicals, setChemicals] = useState<ChemicalElement[]>([]);
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const dispatch = useAppDispatch();
  // Достаем пользователя из store
  const { user } = useAppSelector((state) => state.auth); 
  const searchQuery = useAppSelector((state) => state.filter.searchQuery);
  
  const loadChemicals = async (query?: string) => {
    setLoading(true);
    try {
      const elements = await getChemicals(query);
      setChemicals(elements);
    } catch (error) {
      console.error('Error loading chemicals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChemicals(searchQuery || undefined);
    loadCartCount();
  }, []);

  const loadCartCount = async () => {
    try {
      const count = await getCartCount();
      setCartCount(count);
    } catch (error) {
      console.error('Error loading cart count:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadChemicals(searchQuery);
  };

  return (
    <div className="chemistry-page">
      <section className="hero">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0 2rem' }}>
          <h1>
            <Link to={ROUTES.HOME}>
              <img src={`${STATIC_BASE}/image.svg`} alt="home" />
            </Link>
          </h1>
          
          {/* БЛОК АВТОРИЗАЦИИ В ШАПКЕ */}
          <div className="auth-controls" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {user ? (
              <>
                <Link to={ROUTES.PROFILE} className="user-link" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
                  {user.login}
                </Link>
                <Link to={ROUTES.ORDERS} className="btn-small" style={{ color: 'white', fontSize: '0.9rem' }}>
                  Мои заявки
                </Link>
                <button 
                  onClick={() => dispatch(logout())} 
                  className="btn btn-small"
                  style={{ padding: '5px 10px', fontSize: '0.9rem' }}
                >
                  Выход
                </button>
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN} className="btn" style={{ textDecoration: 'none', color: 'white' }}>
                  Войти
                </Link>
                <Link to={ROUTES.REGISTER} style={{ color: '#aaa', fontSize: '0.9rem' }}>
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </header>
      </section>

      <div className="search-section">
        {/* КОРЗИНА ДОСТУПНА ВСЕМ ИЛИ ТОЛЬКО ЮЗЕРАМ?
            Если только юзерам, можно скрыть. Пока оставим как есть. */}
        <Link to={ROUTES.MIXING} className="cart-link">
          <img src={`${STATIC_BASE}/breaker.svg`} alt="cart" />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>
        
        <form onSubmit={handleSearch}>
          <input 
            type="text" 
            name="query" 
            placeholder="Введите запрос" 
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          />
          <button type="submit">Найти</button>
        </form>
      </div>

      <main>
        <div className="cards-container">
          {loading ? (
            <div className="loading">Загрузка...</div>
          ) : chemicals.length === 0 ? (
            <div className="no-results">Реактивы не найдены</div>
          ) : (
            chemicals.map((chemical) => (
              <div key={chemical.id} className="card">
                <img 
                  src={chemical.image || DEFAULT_IMAGE} 
                  alt={chemical.name} 
                  className="card-img"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_IMAGE;
                  }}
                />
                <h3>{chemical.name}</h3>
                <p><strong>Концентрация:</strong> {chemical.concentration}</p>
                <p><strong>pH:</strong> {chemical.ph}</p>
                
                <Link 
                to={ROUTES.ELEMENT_DETAIL.replace(':id', chemical.id.toString())}
                className="btn"
                style={{ marginTop: 'auto' }} // Чтобы прижималась к низу, если карточка flex column
              >
                Подробнее
              </Link>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};
