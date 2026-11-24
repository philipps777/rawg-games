import { year } from "../utils/formatDate";

export function GameCard({ game, onOpen }) {
  const genre = game.genres?.[0]?.name;

  return (
    <button className="card" onClick={() => onOpen(game.id)}>
      <div className="cover">
        {game.background_image && (
          <img src={game.background_image} alt={game.name} loading="lazy" />
        )}
        <div className="chips">
          <span className="chip">{year(game.released)}</span>
          {genre && <span className="chip">{genre}</span>}
        </div>
      </div>
      <h3>{game.name}</h3>
      <p>
        {year(game.released)} • {genre ?? "—"}
      </p>
    </button>
  );
}