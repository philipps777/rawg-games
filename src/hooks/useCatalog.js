import { useCallback, useEffect, useRef, useState } from "react";
import { fetchRawg } from "../services/rawg";
import { normalizeGame } from "../utils/format";

export function useCatalog(filters) {
  const filterKey = JSON.stringify(filters);
  const [pageState, setPageState] = useState({ key: filterKey, page: 1 });
  const [retries, setRetries] = useState(0);
  const [catalog, setCatalog] = useState({
    key: "",
    items: [],
    count: 0,
    hasMore: true,
  });
  const [status, setStatus] = useState({ loading: true, error: null });
  const isFetching = useRef(false);

  const page = pageState.key === filterKey ? pageState.page : 1;

  useEffect(() => {
    const controller = new AbortController();
    isFetching.current = true;
    setStatus({ loading: true, error: null });

    const params = {
      page,
      page_size: 20,
      ordering: filters.ordering,
    };
    if (filters.query) params.search = filters.query;
    if (filters.genres) params.genres = filters.genres;

    fetchRawg("/games", params, controller.signal)
      .then((data) => {
        const incoming = (data.results || []).map(normalizeGame);
        setCatalog((prev) => {
          const sameFilter = prev.key === filterKey && page > 1;
          const merged = sameFilter
            ? [...prev.items, ...incoming.filter((g) => !prev.items.some((x) => x.id === g.id))]
            : incoming;

          return {
            key: filterKey,
            count: data.count ?? 0,
            hasMore: Boolean(data.next),
            items: merged,
          };
        });
        isFetching.current = false;
        setStatus({ loading: false, error: null });
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        isFetching.current = false;
        setStatus({ loading: false, error: err.message });
      });

    return () => controller.abort();
    

    
  }, [filterKey, page, retries]);

  const loadMore = useCallback(() => {
    if (isFetching.current) return;
    isFetching.current = true;
    setPageState({ key: filterKey, page: page + 1 });
  }, [filterKey, page]);

  const isCurrent = catalog.key === filterKey;

  return {
    items: isCurrent ? catalog.items : [],
    count: catalog.count,
    hasMore: isCurrent ? catalog.hasMore : true,
    loading: status.loading,
    error: status.error,
    loadMore,
    retry: () => setRetries((n) => n + 1),
  };
}
