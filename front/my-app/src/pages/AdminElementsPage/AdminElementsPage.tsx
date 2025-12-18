import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { api } from '../../api';
import { ROUTES } from '../../Routes';
import { STATIC_BASE } from '../../config/config';
import './AdminElementsPage.css';

interface Element {
  id: number;
  name: string;
  description?: string;
  ph: number;
  concentration: number;
  img?: string;
}

export const AdminElementsPage = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [elements, setElements] = useState<Element[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ph: 0,
    concentration: 0,
  });
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Проверка прав модератора
  useEffect(() => {
    if (!user || !user.is_moderator) {
      navigate(ROUTES.HOME);
    }
  }, [user, navigate]);

  const loadElements = async () => {
    setLoading(true);
    try {
      const response = await api.elements.elementsList({ query: searchQuery || undefined });
      const data = response.data as any;
      setElements(Array.isArray(data) ? data : (data?.items || []));
    } catch (error) {
      console.error('Ошибка загрузки элементов:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadElements();
  }, [searchQuery]);

  const handleEdit = (element: Element) => {
    setEditingId(element.id);
    setFormData({
      name: element.name,
      description: element.description || '',
      ph: element.ph,
      concentration: element.concentration,
    });
    setShowCreateForm(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот элемент?')) return;
    
    try {
      await api.elements.elementsDelete(id);
      loadElements();
    } catch (error) {
      console.error('Ошибка удаления элемента:', error);
      alert('Ошибка при удалении элемента');
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        // Обновление существующего элемента
        await api.elements.elementsUpdate(editingId, {
          name: formData.name || undefined,
          description: formData.description || undefined,
          ph: formData.ph || undefined,
          concentration: formData.concentration || undefined,
        });
      } else {
        // Создание нового элемента
        await api.elements.elementsCreate({
          name: formData.name,
          description: formData.description,
          ph: formData.ph,
          concentration: formData.concentration,
        });
      }
      
      setEditingId(null);
      setShowCreateForm(false);
      setFormData({ name: '', description: '', ph: 0, concentration: 0 });
      loadElements();
    } catch (error: any) {
      console.error('Ошибка сохранения элемента:', error);
      alert(error?.response?.data?.message || 'Ошибка при сохранении элемента');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowCreateForm(false);
    setFormData({ name: '', description: '', ph: 0, concentration: 0 });
  };

  if (!user || !user.is_moderator) {
    return null;
  }

  return (
    <div className="chemistry-page">
      <section className="hero">
        <header>
          <h1>
            <Link to={ROUTES.HOME}>
              <img src={`${STATIC_BASE}/image.svg`} alt="home" />
            </Link>
            <span className="page-title">Управление элементами (Модератор)</span>
          </h1>
        </header>
      </section>

      <main className="admin-elements-container">
        {/* Поиск и кнопка создания */}
        <div className="search-section">
          <form onSubmit={(e) => { e.preventDefault(); loadElements(); }}>
            <input
              type="text"
              placeholder="Поиск элементов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Найти</button>
          </form>
          <button 
            className="btn btn-create"
            onClick={() => {
              setShowCreateForm(true);
              setEditingId(null);
              setFormData({ name: '', description: '', ph: 0, concentration: 0 });
            }}
          >
            + Создать элемент
          </button>
        </div>

        {/* Форма создания/редактирования */}
        {(showCreateForm || editingId) && (
          <div className="edit-form">
            <h3>{editingId ? 'Редактирование элемента' : 'Создание нового элемента'}</h3>
            <div className="form-group">
              <label>Название:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Описание:</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>pH:</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="14"
                  value={formData.ph}
                  onChange={(e) => setFormData({ ...formData, ph: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Концентрация (%):</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.concentration}
                  onChange={(e) => setFormData({ ...formData, concentration: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button className="btn btn-save" onClick={handleSave}>
                Сохранить
              </button>
              <button className="btn btn-cancel" onClick={handleCancel}>
                Отмена
              </button>
            </div>
          </div>
        )}

        {/* Список элементов */}
        {loading && elements.length === 0 ? (
          <div className="loading">Загрузка элементов...</div>
        ) : elements.length === 0 ? (
          <div className="no-results">
            <p>Элементы не найдены.</p>
          </div>
        ) : (
          <div className="cards-container">
            {elements.map((element) => (
              <div key={element.id} className="card">
                <img 
                  src={element.img || `${STATIC_BASE}/react.svg`} 
                  alt={element.name} 
                  className="card-img"
                  onError={(e) => { (e.target as HTMLImageElement).src = `${STATIC_BASE}/react.svg`; }}
                />
                <h3>{element.name}</h3>
                {element.description && <p className="card-description">{element.description}</p>}
                <div className="card-properties">
                  <p><strong>pH:</strong> {element.ph.toFixed(2)}</p>
                  <p><strong>Концентрация:</strong> {element.concentration.toFixed(2)}%</p>
                </div>
                <div className="card-actions">
                  <button 
                    className="btn btn-edit"
                    onClick={() => handleEdit(element)}
                  >
                    Редактировать
                  </button>
                  <button 
                    className="btn btn-delete"
                    onClick={() => handleDelete(element.id)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

