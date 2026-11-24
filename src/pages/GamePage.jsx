import { useEffect, useState } from "react";
import { rawg } from "../services/rawg";
import { fmtDate, year } from "../utils/formatDate";

export function GamePage({ id, onBack }) {
  const [game, setGame] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();
    rawg(`/games/${id}`, {}, ctrl.signal)
      .then(setGame)
      .catch((e) => e.name !== "AbortError" && setError(e.message));
    return () => ctrl.abort();
  }, [id]);

  return (
    <section className="detail">
      <button className="back" onClick={onBack} aria-label="Назад">
        ←
      </button>

      {error && <p className="status">Не удалось загрузить: {error}</p>}
      {!game && !error && <p className="status">Загрузка…</p>}

      {game && (
        <>
          {game.background_image && (
            <img className="hero" src={game.background_image} alt={game.name} />
          )}
          <h2>{game.name}</h2>
          <dl>
            <div>
              <dt>Год</dt>
              <dd>{year(game.released)}</dd>
            </div>
            <div>
              <dt>Дата релиза</dt>
              <dd>{fmtDate(game.released)}</dd>
            </div>
            <div>
              <dt>Жанр</dt>
              <dd>{game.genres?.map((g) => g.name).join(", ") || "—"}</dd>
            </div>
          </dl>
          <p className="desc">{game.description_raw || "Описания нет."}</p>
        </>
      )}
    </section>
  );
}