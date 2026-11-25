import { useEffect, useState } from "react";
import { storage } from "../utils/storage";

async function hashPassword(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function useAuth() {
  const [users, setUsers] = useState(() => storage.get("gh_users", []));
  const [sessionId, setSessionId] = useState(() => storage.get("gh_session", null));

  useEffect(() => storage.set("gh_users", users), [users]);
  useEffect(() => storage.set("gh_session", sessionId), [sessionId]);

  const currentUser = users.find((u) => u.id === sessionId) || null;

  const register = async ({ email, login, password }) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanLogin = login.trim();

    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      throw new Error("Введите корректную почту");
    }
    if (cleanLogin.length < 3) {
      throw new Error("Логин — минимум 3 символа");
    }
    if (password.length < 6) {
      throw new Error("Пароль — минимум 6 символов");
    }
    if (
      users.some(
        (u) => u.email === cleanEmail || u.login.toLowerCase() === cleanLogin.toLowerCase()
      )
    ) {
      throw new Error("Такая почта или логин уже заняты");
    }

    const salt = crypto.randomUUID();
    const newUser = {
      id: crypto.randomUUID(),
      email: cleanEmail,
      login: cleanLogin,
      salt,
      hash: await hashPassword(salt + password),
      favs: [],
    };

    setUsers((prev) => [...prev, newUser]);
    setSessionId(newUser.id);
  };

  const signIn = async ({ id, password }) => {
    const lookup = id.trim().toLowerCase();
    const user = users.find(
      (u) => u.email === lookup || u.login.toLowerCase() === lookup
    );

    if (!user || user.hash !== (await hashPassword(user.salt + password))) {
      throw new Error("Неверная почта/логин или пароль");
    }

    setSessionId(user.id);
  };

  const toggleFav = (game) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== sessionId) return u;
        const exists = u.favs.some((f) => f.id === game.id);
        return {
          ...u,
          favs: exists ? u.favs.filter((f) => f.id !== game.id) : [game, ...u.favs],
        };
      })
    );
  };

  const logout = () => setSessionId(null);

  return {
    user: currentUser,
    register,
    signIn,
    toggleFav,
    logout,
  };
}