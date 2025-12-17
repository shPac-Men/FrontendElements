import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMixingCart, removeFromMixing } from '../../modules/chemistryApi'; // Можно заменить на thunk draftSlice, если хочешь
import { ROUTES } from '../../Routes';
import './MixingPage.css';
import { STATIC_BASE } from '../../config/config';
import { useAppSelector } from '../../store/hooks'; // Добавляем хук
import { api } from '../../api'; // Добавляем API для создания заявки

interface MixingItem {
  id: number;
  element_id: number;
  volume: number;
  element: {
    id: number;
    name: string;
    description: string;
    ph: number;
    concentration: number;
    image: string;
  };
}

export const MixingPage: FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<MixingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [addedWater, setAddedWater] = useState(100);
  const [result, setResult] = useState('');
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  // Проверяем авторизацию
  const { user } = useAppSelector((state) => state.auth);

  const loadCart = async () => {
    setLoading(true);
    try {
      const items = await getMixingCart();
      setCartItems(items);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleAddWater = () => {
    alert(`Добавленная вода применена: ${addedWater} мл`);
    setResult('');
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult('Расчет...');
    setTimeout(() => {
      const calculatedPH = (7.0).toFixed(1);
      setResult(`pH: ${calculatedPH} с добавленной водой`);
    }, 1000);
  };

  // --- НОВАЯ ФУНКЦИЯ ОФОРМЛЕНИЯ ЗАЯВКИ ---
  const handleCreateOrder = async () => {
    if (!user) {
      alert('Для оформления заявки нужно войти в систему');
      navigate(ROUTES.LOGIN);
      return;
    }
    
    if (cartItems.length === 0) return;

    if (!confirm('Вы уверены, что хотите оформить заявку?')) return;

    setIsCreatingOrder(true);
    try {
      // Отправляем запрос на создание заявки
      await api.admin.mixedCreate({ 
        title: `Заявка от ${new Date().toLocaleTimeString()}`,
        description: `Добавлено воды: ${addedWater} мл`
      });
      
      alert('Заявка успешно оформлена!');
      // После оформления корзина должна очиститься (на бэке), переходим к списку заявок
      navigate(ROUTES.ORDERS);
    } catch (error) {
      console.error('Ошибка оформления:', error);
      alert('Не удалось оформить заявку');
    } finally {
      setIsCreatingOrder(false);
    }
  };
  // ---------------------------------------

  const handleRemoveFromMixing = async (element_id: number) => {
    if (!confirm('Удалить этот элемент из корзины?')) return;

    try {
      const success = await removeFromMixing(element_id);
      if (success) {
        loadCart();
      } else {
        alert('Ошибка при удалении');
      }
    } catch (error) {
      console.error('Error removing:', error);
    }
  };

  const handleVolumeChange = (id: number, newVolume: number) => {
    console.log(`Change volume for item ${id} to ${newVolume}ml`);
  };

  return (
    <div className="mixing-page">
      <header>
        <Link to={ROUTES.HOME} className="home-link">
          <img src={`${STATIC_BASE}/image.svg`} alt="На главную" />
        </Link>
        <h2 style={{marginLeft: '1rem', color: 'white'}}>Смешивание (Черновик)</h2>
      </header>

      <div className="temperature-section">
        <div className="input-group">
            <label>Добавленная вода (мл):</label>
            <input 
              type="number" 
              value={addedWater}
              onChange={(e) => setAddedWater(parseInt(e.target.value) || 0)}
            />
            <button type="button" className="btn-temperature" onClick={handleAddWater}>
              Применить
            </button>
        </div>

        <div className="result-display">
          <input type="text" readOnly value={result} placeholder="Результат расчета" />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
                type="button" 
                className="btn calculate-btn" 
                onClick={handleCalculate}
                disabled={cartItems.length === 0}
            >
                Рассчитать pH
            </button>

            {/* КНОПКА ОФОРМЛЕНИЯ */}
            <button 
                type="button" 
                className="btn" 
                style={{ backgroundColor: '#28a745' }} // Зеленая
                onClick={handleCreateOrder}
                disabled={cartItems.length === 0 || isCreatingOrder}
            >
                {isCreatingOrder ? 'Оформляем...' : 'Оформить заявку'}
            </button>
        </div>
      </div>

      <main>
        <div className="cards-container">
          {loading ? (
            <div className="loading">Загрузка корзины...</div>
          ) : cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>Корзина пуста</p>
              <Link to={ROUTES.CHEMICALS} className="btn">Добавить элементы</Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="card">
                <div className="card-content">
                  <div className="card-column">
                    <img 
                      src={item.element.image} 
                      alt={item.element.name} 
                      className="card-img"
                      onError={(e) => { e.currentTarget.src = `${STATIC_BASE}/default_element.png`; }}
                    />
                  </div>
                  <div className="card-column">
                    <h3>{item.element.name}</h3>
                    <div className="info-item"><strong>pH:</strong> {item.element.ph}</div>
                    <div className="info-item"><strong>Концентрация:</strong> {item.element.concentration}</div>
                  </div>
                  <div className="card-column">
                    <div className="mass-input">
                      <label>Объем (мл):</label>
                      <input 
                        type="number" 
                        placeholder={item.volume.toString()} 
                        value={item.volume}
                        onChange={(e) => handleVolumeChange(item.element.id, parseFloat(e.target.value))}
                      />
                    </div>
                    <button 
                      type="button" 
                      className="btn btn-remove"
                      onClick={() => handleRemoveFromMixing(item.element.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};
