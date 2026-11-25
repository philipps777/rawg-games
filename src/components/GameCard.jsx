import { getYear } from "../utils/format";
import { HeartIcon } from "./Icons";

function handleTiltMove(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  const xRatio = (e.clientX - rect.left) / rect.width - 0.5;
  const yRatio = (e.clientY - rect.top) / rect.height - 0.5;
  e.currentTarget.style.setProperty("--ry", `${xRatio * 12}deg`);
  e.currentTarget.style.setProperty("--rx", `${-yRatio * 10}deg`);
}

function handleTiltLeave(e) {
  e.currentTarget.style.setProperty("--rx", "0deg");
  e.currentTarget.style.setProperty("--ry", "0deg");
}

export function GameCard({ game, index, isFav, onOpen, onToggleFav }) {
  const releaseYear = getYear(game.released);
  const mainGenre = game.genres[0] ?? "—";

  return (
    <div className="float" style={{ "--i": index % 8 }}>
      <article
        className="tilt"
        onMouseMove={handleTiltMove}
        onMouseLeave={handleTiltLeave}
      >
        <button
          className="cover"
          onClick={() => onOpen(game)}
          aria-label={`Открыть: ${game.name}`}
        >
          {game.image && <img src={game.image} alt="" loading="lazy" />}
        </button>

        <div className="chips">
          <span className="chip">{releaseYear}</span>
          {game.genres[0] && <span className="chip">{game.genres[0]}</span>}
        </div>

        <button
          className="heart"
          aria-pressed={isFav}
          aria-label={isFav ? "Убрать из избранного" : "В избранное"}
          onClick={() => onToggleFav(game)}
        >
          <HeartIcon active={isFav} />
        </button>

        <h3>{game.name}</h3>
        <p>
          {releaseYear} • {mainGenre}
        </p>
      </article>
    </div>
  );
}

export function GameCardSkeleton() {
  return (
    <div className="tilt sk" aria-hidden="true">
      <div className="cover" />
      <div className="l1" />
      <div className="l2" />
    </div>
  );
}