// src/pages/Auth/LoginPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks"; // Проверь путь к hooks
import { login } from "../../store/authSlice"; // Проверь путь к authSlice
import { ROUTES } from "../../Routes";
import { STATIC_BASE } from "../../config/config";
//import "./AuthPage.css"; // Создай один css для всех auth-страниц или используй инлайн

export const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error, user } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({ login: "", password: "" });

  // Если вошли — редирект на главную
  useEffect(() => {
    if (user) navigate(ROUTES.HOME);
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.login || !form.password) return;
    dispatch(login(form));
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <Link to={ROUTES.HOME} className="home-link">
            <img src={`${STATIC_BASE}/image.svg`} alt="logo" width="50" />
        </Link>
        <h2>Вход в систему</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Логин</label>
            <input
              type="text"
              value={form.login}
              onChange={(e) => setForm({ ...form, login: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="form-input"
            />
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button type="submit" className="btn btn-primary" disabled={status === "pending"}>
            {status === "pending" ? "Входим..." : "Войти"}
          </button>
        </form>
        
        <div className="auth-footer">
          Нет аккаунта? <Link to={ROUTES.REGISTER}>Зарегистрироваться</Link>
        </div>
      </div>
    </div>
  );
};
