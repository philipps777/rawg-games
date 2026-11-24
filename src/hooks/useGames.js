import { useEffect, useState } from "react";
import { rawg } from "../services/rawg";

export function useGames(query) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { page_size: 20 };
        if (query.trim()) params.search = query.trim();
        else params.ordering = "-added";

        const data = await rawg("/games", params, ctrl.signal);
        setGames(data.results);
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message);
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }, 350);

    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [query]);

  return { games, loading, error };
}