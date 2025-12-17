import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { ChemicalElement } from '../../types/chemistry';
import { getChemicals, getCartCount } from '../../modules/chemistryApi';
import './ChemicalPage.css';
import { ROUTES } from '../../Routes';
import reactSvg from '../../assets/react.svg';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSearchQuery } from '../../store/filterSlice';
import { addToDraft } from '../../store/draftSlice';
import { STATIC_BASE } from '../../config/config';

const DEFAULT_IMAGE = reactSvg;

export const ChemicalPage: FC = () => {
  const [chemicals, setChemicals] = useState<ChemicalElement[]>([]);
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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

  const handleAddToMixing = async (id: number) => {
    if (!user) {
        navigate(ROUTES.LOGIN);
        return;
    }

    try {
      await dispatch(addToDraft({ element_id: id, volume: 100 })).unwrap();
      //alert('Реактив добавлен!');
      loadCartCount();
    } catch (error) {
      console.error('Ошибка добавления:', error);
      alert('Ошибка при добавлении');
    }
  };

  return (
    <div className="chemistry-page">
      <section className="hero">
        {/* Хедер теперь управляется CSS-классом .hero-header */}
        <header className="hero-header">
          <h1>
            {/* Обернул лого в Link и дал класс, чтобы вернуть "слева" или "по центру" через CSS */}
            <Link to={ROUTES.HOME} className="hero-logo-link">
               <img src={`${STATIC_BASE}/image.svg`} alt="home" width="60" />
            </Link>
          </h1>
        </header>
      </section>

      <div className="search-section">
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
                  onError={(e) => { e.currentTarget.src = DEFAULT_IMAGE; }}
                />
                <h3>{chemical.name}</h3>
                <p><strong>Концентрация:</strong> {chemical.concentration}</p>
                <p><strong>pH:</strong> {chemical.ph}</p>
                
                <div className="card-actions">
                    <Link 
                      to={ROUTES.ELEMENT_DETAIL.replace(':id', chemical.id.toString())}
                      className="btn"
                    >
                      Подробнее
                    </Link>

                    {user && (
                        <button 
                          type="button" 
                          className="btn"
                          onClick={() => handleAddToMixing(chemical.id)}
                        >
                          В корзину
                        </button>
                    )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};
