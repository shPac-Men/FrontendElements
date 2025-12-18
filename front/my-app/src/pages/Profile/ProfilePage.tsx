import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateProfile } from '../../store/authSlice';
import { ROUTES } from '../../Routes';
import { STATIC_BASE } from '../../config/config';
import './ProfilePage.css'; // Подключаем новые стили

export const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [isError, setIsError] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    try {
      await dispatch(updateProfile({ password })).unwrap();
      setMsg('Пароль успешно обновлен');
      setIsError(false);
      setPassword('');
    } catch (e) {
      setMsg('Ошибка обновления пароля');
      setIsError(true);
    }
  };

  if (!user) return <div className="loading">Вы не авторизованы</div>;

  return (
    <div className="chemistry-page">
      <header className="hero">
        <div className="profile-hero-topbar">
            <Link to={ROUTES.HOME} className="home-link">
            <img src={`${STATIC_BASE}/image.svg`} alt="home" />
            </Link>

    <span className="page-title">Личный кабинет</span>
  </div>
</header>

      <main>
        <div className="card profile-card">
            <div className="profile-header">
                {/* Аватар убран */}
                <h2>{user.login}</h2>
                <p className="role-badge">Роль: {user.role || 'Пользователь'}</p>
            </div>

            <form onSubmit={handleUpdate}>
                <h3>Смена пароля</h3>
                <div className="form-group">
                    <input 
                        type="password" 
                        placeholder="Новый пароль" 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="form-input"
                    />
                </div>
                <button type="submit" className="btn btn-block">Сохранить новый пароль</button>
            </form>
            {msg && <p className={`update-message ${isError ? 'error' : 'success'}`}>{msg}</p>}
        </div>
      </main>
    </div>
  );
};
