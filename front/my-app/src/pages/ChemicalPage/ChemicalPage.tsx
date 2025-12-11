import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import type { ChemicalElement } from '../../types/chemistry';
import { getChemicals, addToMixing, getCartCount } from '../../modules/chemistryApi';
import './ChemicalPage.css';
import { ROUTES } from '../../Routes';
import reactSvg from '../../assets/react.svg';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSearchQuery } from '../../store/filterSlice';


const DEFAULT_IMAGE = reactSvg;

export const ChemicalPage: FC = () => {
  const [chemicals, setChemicals] = useState<ChemicalElement[]>([]);
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const dispatch = useAppDispatch();
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
    // При первом заходе на страницу подгружаем с учетом уже сохраненного searchQuery
    loadChemicals(searchQuery || undefined);
    loadCartCount();
  }, []); // зависимость оставляем пустой, чтобы не зациклить запросы


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
    try {
      const success = await addToMixing(id, 100);
      if (success) {
        setCartCount(prev => prev + 1);
        alert('Реактив добавлен в корзину');
      } else {
        alert('Ошибка при добавлении в корзину');
      }
    } catch (error) {
      console.error('Error adding to mixing:', error);
      alert('Ошибка при добавлении в корзину');
    }
  };

  return (
    <div className="chemistry-page">
      <section className="hero">
        <header>
          <h1>
            <Link to={ROUTES.HOME}>
              <img src="/staticimages/image.svg" alt="home" />
            </Link>
          </h1>
        </header>
      </section>

      <div className="search-section">
        <Link to={ROUTES.MIXING} className="cart-link">
          <img src="/staticimages/breaker.svg" alt="cart" />
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
                {/* ИСПРАВЛЕННАЯ СТРОКА: используем ELEMENT_DETAIL вместо CHEMICAL_DETAIL */}
                <Link 
                  to={ROUTES.ELEMENT_DETAIL.replace(':id', chemical.id.toString())}
                  className="btn"
                >
                  Подробнее
                </Link>
                {/* <button 
                  type="button" 
                  className="btn btn-cart"
                  onClick={() => handleAddToMixing(chemical.id)}
                >
                  В корзину
                </button> */}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};