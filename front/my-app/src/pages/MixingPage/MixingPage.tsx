import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMixingCart, removeFromMixing } from '../../modules/chemistryApi'; // Функции для работы с "корзиной"
import { ROUTES } from '../../Routes';
import './MixingPage.css';
import { STATIC_BASE } from '../../config/config';
import { useAppSelector } from '../../store/hooks';
import { api } from '../../api'; // API клиент для работы с "заказами"

// Единый интерфейс для элемента в списке, будь то из корзины или из черновика
interface DisplayItem {
  id: number; // ID элемента
  volume: number;
  name: string;
  ph: number;
  concentration: number;
  image: string;
}

export const MixingPage: FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<DisplayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedWater, setAddedWater] = useState(100);
  const [result, setResult] = useState('');
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [draftId, setDraftId] = useState<number | null>(null); // ID черновика, если он есть

  const { user } = useAppSelector((state) => state.auth);

  // Функция для загрузки данных (черновика или корзины)
  const loadDraftOrCart = async () => {
    setLoading(true);
    try {
      // 1. Ищем существующий черновик
      const draftResponse = await api.mixed.getMixed({ status: 'draft', limit: 1 });
      const drafts = draftResponse.data;

      if (drafts && drafts.length > 0) {
        // --- РЕЖИМ РЕДАКТИРОВАНИЯ ЧЕРНОВИКА ---
        const currentDraft = drafts[0];
        setDraftId(currentDraft.id ?? null);

        // Загружаем детали этого черновика
        const detailResponse = await api.mixed.getMixed2(currentDraft.id!); // Используем getMixed2, как мы исправили
        const draftDetails = detailResponse.data;

        // Нормализуем данные из заказа в наш формат DisplayItem
        const normalizedItems = (draftDetails.items || []).map((item: any) => ({
          id: item.element_id,
          volume: item.volume,
          name: item.title,
          ph: item.ph,
          concentration: item.concentration,
          image: item.image,
        }));

        setItems(normalizedItems);
        setAddedWater(draftDetails.added_water || 100);
        
      } else {
        // --- РЕЖИМ ОБЫЧНОЙ КОРЗИНЫ ---
        setDraftId(null);
        const cartItems = await getMixingCart();
        
        // Нормализуем данные из корзины
        const normalizedItems = (cartItems || []).map((item: any) => ({
            id: item.element.id,
            volume: item.volume,
            name: item.element.name,
            ph: item.element.ph,
            concentration: item.element.concentration,
            image: item.element.image,
        }));
        setItems(normalizedItems);
      }
    } catch (error) {
      console.error('Ошибка загрузки черновика или корзины:', error);
      setItems([]); // Очищаем в случае ошибки
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
        navigate(ROUTES.LOGIN);
        return;
    }
    loadDraftOrCart();
  }, [user]);

  const handleCreateOrder = async () => {
    if (items.length === 0) return;
    if (!confirm('Вы уверены, что хотите оформить заявку? Это действие создаст новый расчет.')) return;

    setIsCreatingOrder(true);
    try {
      // TODO: На бэкенде должен быть пользовательский эндпоинт, а не админский.
      // Сейчас используется api.admin.mixedCreate, так как другого нет.
      await api.admin.mixedCreate({
        title: `Расчет от ${new Date().toLocaleDateString()}`,
        description: `Добавлено воды: ${addedWater} мл`
      });
      
      alert('Заявка успешно оформлена!');
      navigate(ROUTES.ORDERS); // Переходим к списку всех заявок
    } catch (error) {
      console.error('Ошибка оформления:', error);
      alert('Не удалось оформить заявку. Возможно, у вас нет прав.');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleRemoveItem = async (elementId: number) => {
    // TODO: Здесь должна быть разная логика для корзины и для черновика.
    // Пока что работает только для корзины.
    if (draftId) {
        alert("Удаление из существующего черновика пока не поддерживается.");
        return;
    }

    if (!confirm('Удалить этот элемент?')) return;
    const success = await removeFromMixing(elementId);
    if (success) {
      loadDraftOrCart(); // Обновляем список
    } else {
      alert('Ошибка при удалении');
    }
  };

  // ... (handleCalculate и handleAddWater можно оставить без изменений) ...
  const handleCalculate = () => { /* ... */ };
  const handleAddWater = () => { /* ... */ };

  return (
    <div className="mixing-page">
      <header>
        <Link to={ROUTES.HOME} className="home-link">
          <img src={`${STATIC_BASE}/image.svg`} alt="На главную" />
        </Link>
        <h2>{draftId ? `Редактирование черновика #${draftId}` : 'Новый расчет (Корзина)'}</h2>
      </header>

      <div className="temperature-section">
        {/* ... (секция с водой, расчетом и кнопкой "Оформить") ... */}
        <div className="input-group">
            <label>Добавленная вода (мл):</label>
            <input type="number" value={addedWater} onChange={(e) => setAddedWater(parseInt(e.target.value) || 0)} />
            <button type="button" className="btn-temperature" onClick={handleAddWater}>Применить</button>
        </div>
        <div className="result-display">
            <input type="text" readOnly value={result} placeholder="Результат расчета pH" />
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="button" className="btn calculate-btn" onClick={handleCalculate} disabled={items.length === 0}>Рассчитать pH</button>
            <button type="button" className="btn" style={{ backgroundColor: '#28a745' }} onClick={handleCreateOrder} disabled={items.length === 0 || isCreatingOrder}>
                {isCreatingOrder ? 'Оформляем...' : 'Оформить заявку'}
            </button>
        </div>
      </div>

      <main>
        <div className="cards-container">
          {loading ? (
            <div className="loading">Загрузка...</div>
          ) : items.length === 0 ? (
            <div className="empty-cart">
              <p>Здесь пока пусто</p>
              <Link to={ROUTES.CHEMICALS} className="btn">Добавить элементы</Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="card">
                <div className="card-content">
                  <div className="card-column">
                    <img src={item.image} alt={item.name} className="card-img" onError={(e) => { e.currentTarget.src = `${STATIC_BASE}/default_element.png`; }}/>
                  </div>
                  <div className="card-column">
                    <h3>{item.name}</h3>
                    <div className="info-item"><strong>pH:</strong> {item.ph}</div>
                    <div className="info-item"><strong>Конц.:</strong> {item.concentration}%</div>
                  </div>
                  <div className="card-column">
                    <div className="mass-input">
                      <label>Объем (мл):</label>
                      <input type="number" value={item.volume} disabled /> {/* Редактирование объема пока не делаем */}
                    </div>
                    <button type="button" className="btn btn-remove" onClick={() => handleRemoveItem(item.id)}>Удалить</button>
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
