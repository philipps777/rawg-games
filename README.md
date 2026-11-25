# GAMEHUB

A web application for discovering and browsing video games built with **React**, **Vite**, and the public **RAWG** API.

**Live Demo:** [https://philipps777.github.io/rawg-games/](https://philipps777.github.io/rawg-games/)

## API Server & Data Source

- **API Server:** `https://api.rawg.io/api`
- **RAWG API Documentation:** [https://api.rawg.io/docs/](https://api.rawg.io/docs/)
- **Game Data Source:** [https://rawg.io](https://rawg.io)
- **Authentication:** API key passed via the `key` query parameter from the `VITE_RAWG_KEY` environment variable.

## Features

- Game catalog with genre filtering, sorting, and debounced search.
- Infinite scroll pagination with a manual "Load more" fallback.
- Loading skeletons, empty search states, and API/network error handling with retry.
- Detailed game modal with description, screenshots, ratings, platforms, developers, and playtime.
- Local user profile (sign up / sign in) and favorites stored in `localStorage`.
- Built-in `EN` / `UA` language switcher, dark/light theme toggle (dark by default), and responsive layout.

## Project Structure

```text
src/
├── components/   # UI components, game cards, and modals
├── hooks/        # Custom hooks (catalog, debounced input, local auth)
├── services/     # RAWG API client
├── styles/       # Application styles
├── utils/        # Helpers, localization dictionary, and storage wrapper
├── App.jsx       # Main application component
└── main.jsx      # Entry point