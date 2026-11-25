import { useEffect, useState } from "react";
import { fetchRawg } from "../services/rawg";
import { formatDate, getYear } from "../utils/format";
import { Modal } from "./Modal";

export function GameModal({ game, isFav, onToggleFav, onClose }) {
  const [details, setDetails] = useState(null);
  const gallery = [
    game.image,
    ...(game.shots || []).filter((s) => s && s !== game.image),
  ].filter(Boolean);
  const [activeImg, setActiveImg] = useState(gallery[0]);

  useEffect(() => {
    setActiveImg(gallery[0]);
    const controller = new AbortController();
    fetchRawg(`/games/${game.id}`, {}, controller.signal)
      .then(setDetails)
      .catch(() => setDetails({}));
    return () => controller.abort();
  

    
  }, [game.id]);

  const rows = [
    ["Год", getYear(game.released)],
    ["Дата релиза", formatDate(game.released)],
    ["Жанр", game.genres.join(", ") || "—"],
    details?.rating
      ? [
          "Рейтинг",
          `★ ${details.rating} / ${details.rating_top} · ${(
            details.ratings_count ?? 0
          ).toLocaleString("ru-RU")} оценок`,
        ]
      : null,
    details?.metacritic ? ["Metacritic", details.metacritic] : null,
    details?.platforms?.length
      ? ["Платформы", details.platforms.map((p) => p.platform.name).join(", ")]
      : null,
    details?.developers?.length
      ? ["Разработчик", details.developers.map((d) => d.name).join(", ")]
      : null,
    details?.playtime ? ["Время игры", `~${details.playtime} ч`] : null,
  ].filter(Boolean);

  return (
    <Modal wide onClose={onClose}>
      <div className="gm">
        <div>
          {activeImg && <img className="big" src={activeImg} alt={game.name} />}
          {gallery.length > 1 && (
            <div className="thumbs">
              {gallery.map((src) => (
                <button
                  key={src}
                  className={src === activeImg ? "on" : ""}
                  onClick={() => setActiveImg(src)}
                  aria-label="Показать скриншот"
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2>{game.name}</h2>
          <button
            className={`btn${isFav ? "" : " ghost"}`}
            onClick={() => onToggleFav(game)}
            aria-pressed={isFav}
          >
            {isFav ? "♥ В избранном" : "♡ В избранное"}
          </button>

          <dl className="dl">
            {rows.map(([label, val]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{val}</dd>
              </div>
            ))}
          </dl>

          <p className="desc">
            {details
              ? details.description_raw || "Описания нет."
              : "Загрузка…"}
          </p>

          {details?.website && (
            <a
              className="link"
              href={details.website}
              target="_blank"
              rel="noreferrer"
            >
              Сайт игры ↗
            </a>
          )}
        </div>
      </div>
    </Modal>
  );
}