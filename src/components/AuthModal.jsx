import { useState } from "react";
import { Modal } from "./Modal";

export function AuthModal({ auth, onClose }) {
  const [mode, setMode] = useState("in");
  const [form, setForm] = useState({
    id: "",
    email: "",
    login: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (mode === "up") {
        await auth.register(form);
      } else {
        await auth.signIn(form);
      }
      onClose();
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <Modal onClose={onClose}>
      <div className="tabs">
        <button
          className={mode === "in" ? "on" : ""}
          onClick={() => {
            setMode("in");
            setError("");
          }}
        >
          Вход
        </button>
        <button
          className={mode === "up" ? "on" : ""}
          onClick={() => {
            setMode("up");
            setError("");
          }}
        >
          Регистрация
        </button>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        {mode === "in" ? (
          <label>
            Почта или логин
            <input
              value={form.id}
              onChange={updateField("id")}
              autoComplete="username"
              required
            />
          </label>
        ) : (
          <>
            <label>
              Почта
              <input
                type="email"
                value={form.email}
                onChange={updateField("email")}
                autoComplete="email"
                required
              />
            </label>
            <label>
              Логин
              <input
                value={form.login}
                onChange={updateField("login")}
                autoComplete="username"
                required
              />
            </label>
          </>
        )}

        <label>
          Пароль
          <input
            type="password"
            value={form.password}
            onChange={updateField("password")}
            autoComplete={mode === "in" ? "current-password" : "new-password"}
            required
          />
        </label>

        {error && (
          <p className="err" role="alert">
            {error}
          </p>
        )}

        <button className="btn" disabled={submitting}>
          {mode === "in" ? "Войти" : "Создать профиль"}
        </button>
      </form>
    </Modal>
  );
}