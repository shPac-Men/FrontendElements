import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { ChemicalElement } from '../../types/chemistry';
import { getChemicals } from '../../modules/chemistryApi'; 
import './ChemicalPage.css';
import { ROUTES } from '../../Routes';
import reactSvg from '../../assets/react.svg';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSearchQuery } from '../../store/filterSlice';
import { addToDraft } from '../../store/draftSlice';
import { STATIC_BASE } from '../../config/config';
import { api } from '../../api';

const DEFAULT_IMAGE = reactSvg;

export const ChemicalPage: FC = () => {
  const [chemicals, setChemicals] = useState<ChemicalElement[]>([]);
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.auth);
  // Предполагаем, что поле называется query или searchQuery (должно совпадать с filterSlice)
  const searchQuery = useAppSelector((state) => state.filter.query); 
  
  const loadChemicals = async (query?: string) => {
    console.log("PAGE: loadChemicals called with query:", query);
    setLoading(true);
    try {
      // Здесь getChemicals должна уметь принимать строку. 
      // Если она принимает объект, передайте { query }
      const elements = await getChemicals(query);
      setChemicals(elements);
    } catch (error) {
      console.error('Error loading chemicals:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCartCount = async () => {
    try {
      const response = await api.mixing.cartIconList();
      const anyRes = response as any;
      let count = 0;

      if (anyRes.data) {
         count = anyRes.data.ItemsCount ?? anyRes.data.items_count ?? 0;
      } else if (anyRes.ItemsCount !== undefined || anyRes.items_count !== undefined) {
         count = anyRes.ItemsCount ?? anyRes.items_count ?? 0;
      }
      // console.log('Cart count debug:', count);
      setCartCount(count);
    } catch (error) {
      // console.error('Error loading cart count:', error);
      setCartCount(0);
    }
  };

  // --- ЛОГИКА ЗАГРУЗКИ ---

  // 1. Автоматическая загрузка ТОЛЬКО если запрос пустой (например, при первом входе или после сброса)
  useEffect(() => {
    if (!searchQuery) {
        console.log("PAGE: Query is empty (initial or reset) -> Auto loading full list");
        loadChemicals(undefined);
    } else {
        console.log("PAGE: Query is present (" + searchQuery + ") -> Waiting for manual search");
    }
  }, [searchQuery]); 

  // 2. Обновляем корзину при смене юзера
  useEffect(() => {
    loadCartCount();
  }, [user]);

  // 3. Ручной поиск по кнопке
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("PAGE: Manual search triggered");
    loadChemicals(searchQuery);
  };

  const handleAddToMixing = async (id: number) => {
    if (!user) {
        navigate(ROUTES.LOGIN);
        return;
    }

    try {
      await dispatch(addToDraft({ element_id: id, volume: 100 })).unwrap();
      await loadCartCount();
    } catch (error) {
      console.error('Ошибка добавления:', error);
      alert('Ошибка при добавлении');
    }
  };

  return (
    <div className="chemistry-page">
      <section className="hero">
        <header className="hero-header">
          <h1>
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
