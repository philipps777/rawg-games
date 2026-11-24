const KEY = import.meta.env.VITE_RAWG_KEY;
const API = "https://api.rawg.io/api";

export async function rawg(path, params = {}, signal) {
  const qs = new URLSearchParams({ key: KEY, ...params });
  const res = await fetch(`${API}${path}?${qs}`, { signal });
  if (!res.ok) throw new Error(`RAWG ${res.status}`);
  return res.json();
}