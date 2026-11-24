import { useState } from "react";
import { useGames } from "../hooks/useGames";
import { SearchBar } from "../components/SearchBar";
import { GameCard } from "../components/GameCard";

export function HomePage({ onSelectGame }) {
  const [query, setQuery] = useState("");
  const { games, loading, error } = useGames(query);

  return (
    <>
      <SearchBar value={query} onChange={setQuery} />

      {error && <p className="status">Ошибка: {error}. Проверьте ключ.</p>}
      {loading && <p className="status">Загрузка…</p>}
      {!loading && !error && games.length === 0 && (
        <p className="status">Ничего не найдено — попробуйте другое название.</p>
      )}

      <div className="grid">
        {games.map((g) => (
          <GameCard key={g.id} game={g} onOpen={onSelectGame} />
        ))}
      </div>
    </>
  );
}