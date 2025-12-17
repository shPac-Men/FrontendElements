// src/pages/Orders/OrdersPage.tsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchOrders } from '../../store/ordersSlice'; // Создай ordersSlice если нет
import { ROUTES } from '../../Routes';
import { STATIC_BASE } from '../../config/config';
// import './OrdersPage.css'; 

export const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <div className="chemistry-page">
      <header className="hero">
        <h1>
          <Link to={ROUTES.HOME}>
            <img src={`${STATIC_BASE}/image.svg`} alt="home" />
          </Link>
          <span style={{ marginLeft: '1rem', color: 'white' }}>История заявок</span>
        </h1>
      </header>

      <main>
        {loading ? (
          <div className="loading">Загрузка...</div>
        ) : list.length === 0 ? (
          <div className="no-results">
            <p>У вас пока нет оформленных заявок.</p>
            <Link to={ROUTES.MIXING} className="btn">Перейти к смешиванию</Link>
          </div>
        ) : (
          <div className="cards-container">
            {list.map((order: any) => (
              <div key={order.id} className="card" style={{ flexDirection: 'column', alignItems: 'flex-start', minWidth: '300px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <h3>Заявка #{order.id}</h3>
                    <span className={`status-badge status-${order.status}`}>{order.status}</span>
                </div>
                <p><strong>Создана:</strong> {new Date(order.created_at || Date.now()).toLocaleDateString()}</p>
                <p><strong>Элементов:</strong> {order.items?.length || 0}</p>
                
                {/* Если нужен детальный просмотр, можно добавить ссылку */}
                 <Link to={`/orders/${order.id}`} className="btn" style={{ marginTop: 'auto' }}>
                  Подробнее
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
