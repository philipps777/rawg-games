export const GENRE_RU = {
  action: "Экшен",
  indie: "Инди",
  adventure: "Приключения",
  "role-playing-games-rpg": "РПГ",
  strategy: "Стратегии",
  shooter: "Шутеры",
  casual: "Казуальные",
  simulation: "Симуляторы",
  puzzle: "Головоломки",
  arcade: "Аркады",
  platformer: "Платформеры",
  racing: "Гонки",
  "massively-multiplayer": "MMO",
  sports: "Спорт",
  fighting: "Файтинги",
  family: "Семейные",
  "board-games": "Настольные",
  educational: "Образовательные",
  card: "Карточные",
};

export const QUICK_GENRES = ["action", "adventure", "role-playing-games-rpg", "strategy"];

export const SORT_OPTIONS = [
  ["-added", "Популярные"],
  ["-rating", "По рейтингу"],
  ["-released", "Новые"],
  ["name", "По названию"],
];

export const getYear = (dateStr) => (dateStr ? dateStr.slice(0, 4) : "—");

export const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${dateStr}T00:00:00Z`));
};

export const stripHtml = (html = "") =>
  html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();


export const normalizeGame = (game) => ({
  id: game.id,
  name: game.name,
  released: game.released,
  image: game.background_image,
  genres: (game.genres || []).map((g) => g.name),
  shots: (game.short_screenshots || []).slice(0, 5).map((s) => s.image),
});