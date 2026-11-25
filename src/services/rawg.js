const API_BASE = "https://api.rawg.io/api";

export const RAWG_KEY = (import.meta.env.VITE_RAWG_KEY || "").trim();

export async function fetchRawg(path, params = {}, signal) {
  const query = new URLSearchParams({ key: RAWG_KEY, ...params });
  let res;

  try {
    res = await fetch(`${API_BASE}${path}?${query}`, { signal });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new Error("Нет соединения с RAWG. Проверьте интернет.");
  }

  if (res.status === 401 || res.status === 403) {
    throw new Error("Ключ RAWG не принят. Проверьте VITE_RAWG_KEY в .env.");
  }
  if (res.status === 429) {
    throw new Error("Исчерпан лимит запросов RAWG. Попробуйте позже.");
  }
  if (!res.ok) {
    throw new Error(`Ошибка сервера RAWG (${res.status}).`);
  }

  return res.json();
}