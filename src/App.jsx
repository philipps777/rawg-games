import { useEffect, useMemo, useRef, useState } from "react";
import "./styles/gamehub.css";
import { fetchRawg, RAWG_KEY } from "./services/rawg";
import { storage } from "./utils/storage";
import { GENRE_RU, QUICK_GENRES, SORT_OPTIONS, stripHtml } from "./utils/format";
import { useDebounced } from "./hooks/useDebounced";
import { useCatalog } from "./hooks/useCatalog";
import { useAuth } from "./hooks/useAuth";
import { ArrowUpIcon, MoonIcon, SunIcon } from "./components/Icons";
import { GameCard, GameCardSkeleton } from "./components/GameCard";
import { GameModal } from "./components/GameModal";
import { AuthModal } from "./components/AuthModal";
import { ProfileModal } from "./components/ProfileModal";

export default function App() {
  const [theme, setTheme] = useState(() =>
    storage.get(
      "gh_theme",
      window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    )
  );
  const [view, setView] = useState("catalog");
  const [query, setQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [ordering, setOrdering] = useState("-added");
  const [genres, setGenres] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [isDesktop] = useState(() => window.matchMedia("(min-width: 861px)").matches);
  const [genreDetails, setGenreDetails] = useState(null);

  const auth = useAuth();
  const debouncedQuery = useDebounced(query, 350);
  const catalog = useCatalog({
    query: debouncedQuery,
    genres: selectedGenres.join(","),
    ordering,
  });
  const sentinelRef = useRef(null);

  const favIds = useMemo(
    () => new Set((auth.user?.favs || []).map((f) => f.id)),
    [auth.user]
  );

  useEffect(() => {
    storage.set("gh_theme", theme);
  }, [theme]);

  useEffect(() => {
    fetchRawg("/genres", { page_size: 40 })
      .then((data) => setGenres(data.results || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedGenres.length !== 1) {
      setGenreDetails(null);
      return;
    }
    const controller = new AbortController();
    fetchRawg(`/genres/${selectedGenres[0]}`, {}, controller.signal)
      .then(setGenreDetails)
      .catch(() => {});
    return () => controller.abort();
  }, [selectedGenres]);

  useEffect(() => {
    const onScroll = () => setShowTopBtn(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const target = sentinelRef.current;
    if (view !== "catalog" || !target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && catalog.hasMore && !catalog.error) {
          catalog.loadMore();
        }
      },
      { rootMargin: "700px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [view, catalog.loadMore, catalog.hasMore, catalog.error, catalog.items.length]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleToggleFav = (game) => {
    if (!auth.user) {
      setDialog("auth");
      return;
    }
    auth.toggleFav(game);
  };

  const openFavorites = () => {
    if (!auth.user) {
      setDialog("auth");
      return;
    }
    setDialog(null);
    setView("favs");
  };

  const pickSingleGenre = (genreId) => {
    setSelectedGenres([genreId]);
    setView("catalog");
    scrollToTop();
  };

  const toggleGenre = (genreId) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]
    );
  };

  const visibleGames = view === "favs" ? auth.user?.favs ?? [] : catalog.items;
  const activeGenre =
    view === "catalog" && selectedGenres.length === 1 && genreDetails?.id === selectedGenres[0]
      ? genreDetails
      : null;
  const activeGenreDesc = activeGenre?.description ? stripHtml(activeGenre.description) : "";
  const quickGenreItems = QUICK_GENRES.map((slug) =>
    genres.find((g) => g.slug === slug)
  ).filter(Boolean);

  return (
    <div className="app" data-theme={theme}>
      <div className="bg" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>

      <header className="top">
        <button
          className="logo"
          onClick={() => {
            setView("catalog");
            scrollToTop();
          }}
        >
          GAMEHUB
        </button>

        <nav>
          <button
            className={view === "catalog" ? "on" : ""}
            onClick={() => setView("catalog")}
          >
            Игры
          </button>
          <button className={view === "favs" ? "on" : ""} onClick={openFavorites}>
            Избранное
            {auth.user?.favs.length > 0 && <b>{auth.user.favs.length}</b>}
          </button>
        </nav>

        <span className="sp" />

        <button
          className="icon"
          onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
          aria-label={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>

        <button
          className="btn"
          onClick={() => setDialog(auth.user ? "profile" : "auth")}
        >
          {auth.user ? auth.user.login : "Профиль"}
        </button>
      </header>

      <div className="wrap">
        <section
          className={`hero${activeGenre?.image_background ? " img" : ""}`}
          style={
            activeGenre?.image_background
              ? { "--hero": `url(${activeGenre.image_background})` }
              : undefined
          }
        >
          <h1>
            {view === "favs"
              ? "Избранное"
              : activeGenre
              ? GENRE_RU[activeGenre.slug] ?? activeGenre.name
              : "Каталог игр"}
          </h1>
          <p>
            {activeGenreDesc
              ? activeGenreDesc.length > 260
                ? `${activeGenreDesc.slice(0, 260).trimEnd()}…`
                : activeGenreDesc
              : "Ищите игры, смотрите описания и скриншоты, сохраняйте любимые в избранное."}
          </p>
        </section>

        <div className={view === "catalog" ? "layout" : "layout solo"}>
          {view === "catalog" && (
            <aside className="side">
              <h2>Фильтры</h2>

              <details open={isDesktop}>
                <summary>Жанры</summary>
                {genres.map((genre) => (
                  <label key={genre.id} className="check">
                    <input
                      type="checkbox"
                      checked={selectedGenres.includes(genre.id)}
                      onChange={() => toggleGenre(genre.id)}
                    />
                    <span>{GENRE_RU[genre.slug] ?? genre.name}</span>
                    {genre.games_count != null && (
                      <small className="cnt">
                        {genre.games_count.toLocaleString("ru-RU")}
                      </small>
                    )}
                  </label>
                ))}
                {selectedGenres.length > 0 && (
                  <button className="link" onClick={() => setSelectedGenres([])}>
                    Сбросить
                  </button>
                )}
              </details>

              <details open={isDesktop}>
                <summary>Сортировка</summary>
                {SORT_OPTIONS.map(([value, label]) => (
                  <label key={value} className="check">
                    <input
                      type="radio"
                      name="sort"
                      checked={ordering === value}
                      onChange={() => setOrdering(value)}
                    />
                    {label}
                  </label>
                ))}
              </details>
            </aside>
          )}

          <main>
            {view === "catalog" && (
              <>
                <input
                  className="search"
                  type="search"
                  placeholder="Search for a game"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Поиск игры"
                />
                {!RAWG_KEY && (
                  <p className="note">
                    Добавьте ключ RAWG в файл .env: VITE_RAWG_KEY=ваш_ключ
                  </p>
                )}
                <p className="meta">
                  Найдено игр: {catalog.count.toLocaleString("ru-RU")}
                </p>
              </>
            )}

            {view === "favs" && visibleGames.length === 0 && (
              <p className="status">
                Здесь пока пусто. Нажмите ♡ на карточке игры, чтобы сохранить её.
              </p>
            )}

            <div className="grid">
              {visibleGames.map((game, idx) => (
                <GameCard
                  key={game.id}
                  game={game}
                  index={idx}
                  isFav={favIds.has(game.id)}
                  onOpen={setSelectedGame}
                  onToggleFav={handleToggleFav}
                />
              ))}

              {view === "catalog" &&
                catalog.loading &&
                Array.from({ length: catalog.items.length ? 4 : 8 }, (_, i) => (
                  <GameCardSkeleton key={`sk-${i}`} />
                ))}
            </div>

            {view === "catalog" && (
              <>
                <div ref={sentinelRef} className="sentinel" />

                {catalog.error && (
                  <div className="alert" role="alert">
                    <span>{catalog.error}</span>
                    <button className="btn" onClick={catalog.retry}>
                      Повторить
                    </button>
                  </div>
                )}

                {!catalog.loading && !catalog.error && catalog.items.length === 0 && (
                  <div className="status">
                    <p>
                      {debouncedQuery.trim()
                        ? `По запросу «${debouncedQuery.trim()}» ничего не найдено.`
                        : "Ничего не найдено."}
                    </p>
                    <button
                      className="btn ghost"
                      onClick={() => {
                        setQuery("");
                        setSelectedGenres([]);
                      }}
                    >
                      Сбросить поиск и фильтры
                    </button>
                  </div>
                )}

                {catalog.hasMore && !catalog.loading && !catalog.error && catalog.items.length > 0 && (
                  <div className="status">
                    <button className="btn ghost" onClick={catalog.loadMore}>
                      Загрузить ещё
                    </button>
                  </div>
                )}

                {!catalog.hasMore && catalog.items.length > 0 && (
                  <p className="status">Это все игры по запросу.</p>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      <footer className="foot">
        <div className="wrap cols">
          <div>
            <small>GAMEHUB</small>
            <strong>PLAY MORE</strong>
          </div>

          <div>
            <h4>Категории</h4>
            {quickGenreItems.map((genre) => (
              <button key={genre.id} onClick={() => pickSingleGenre(genre.id)}>
                {GENRE_RU[genre.slug] ?? genre.name}
              </button>
            ))}
          </div>

          <div>
            <h4>Разделы</h4>
            <button
              onClick={() => {
                setView("catalog");
                scrollToTop();
              }}
            >
              Игры
            </button>
            <button onClick={openFavorites}>Избранное</button>
            <button onClick={() => setDialog(auth.user ? "profile" : "auth")}>
              Профиль
            </button>
          </div>

          <div>
            <h4>Источник данных</h4>
            <a href="https://rawg.io" target="_blank" rel="noreferrer">
              RAWG
            </a>
            <a href="https://api.rawg.io/docs/" target="_blank" rel="noreferrer">
              RAWG API
            </a>
          </div>
        </div>
      </footer>

      <button
        className={`up${showTopBtn ? " show" : ""}`}
        onClick={scrollToTop}
        aria-label="Наверх"
        tabIndex={showTopBtn ? 0 : -1}
      >
        <ArrowUpIcon />
      </button>

      {selectedGame && (
        <GameModal
          game={selectedGame}
          isFav={favIds.has(selectedGame.id)}
          onToggleFav={handleToggleFav}
          onClose={() => setSelectedGame(null)}
        />
      )}

      {dialog === "auth" && (
        <AuthModal auth={auth} onClose={() => setDialog(null)} />
      )}

      {dialog === "profile" && auth.user && (
        <ProfileModal
          user={auth.user}
          onClose={() => setDialog(null)}
          onOpenFavs={openFavorites}
          onLogout={() => {
            auth.logout();
            setDialog(null);
            setView("catalog");
          }}
        />
      )}
    </div>
  );
}