# Rank Sorting for Spotify

A small React app (Vite) for exploring and sorting Spotify tracks/playlists using a ranking interface and Spotify OAuth (PKCE). This README documents the stack, architecture, local development flow (including Spotify PKCE login), notable files, and troubleshooting tips.

---

## Table of contents

- Project summary
- Tech stack
- Architecture & data flow
- Project layout (important files)
- Environment variables
- Local development
- Build & deploy
- Troubleshooting
- Contributing & next steps

---

## Project summary

Rank Sorting for Spotify is a front-end application that integrates with the Spotify Web API to let users sign in with Spotify (OAuth PKCE), view their data (tracks, playlists, audio features), and interactively rank / sort items via the UI. The app is built as a modern single-page app with fast HMR during development and a small, dependency-focused runtime for production builds.

This repo contains the UI, theming, auth flow, and a thin services layer that wraps Spotify API calls (no backend required for the main flows — the app uses the PKCE flow so no client secret is needed).

---

## Tech stack

- Framework and bundler
  - React (v18+)
  - Vite (dev server / build)
- UI & styling
  - styled-components (CSS-in-JS, theme driven)
  - Ant Design (`antd`) used for layout/primitive components
  - lucide-react (icons)
  - react-fast-marquee (announce bar animation)
- State & data
  - React context for auth (`src/context/SpotifyAuthContext.jsx`) and local hooks
  - Small custom hooks in `src/hooks/` (e.g. `useColorMode.js`)
- Services
  - `src/services/spotifyAuth.js` implements the PKCE + OAuth login flow
  - `src/services/spotifyApi.js` and `spotifyFetch.js` wrap API calls and token handling
- Tooling
  - ESLint (configured in `eslint.config.js`) and Vite config (`vite.config.js`)
  - npm for dependency management

---

## Architecture & data flow (high-level)

1. User clicks Login -> app initiates Spotify OAuth PKCE code flow via `spotifyAuth.js`.
2. Spotify redirects back to the configured redirect URI with a code.
3. App exchanges the code for tokens (client-side PKCE exchange). The ripple effects are handled in `SpotifyAuthContext` which stores tokens (typically in memory/session/localStorage depending on the code paths).
4. Authenticated requests go through `spotifyFetch.js` and `spotifyApi.js`, which add the Authorization header and handle 401/token-refresh logic.
5. UI components (pages under `src/pages/`) call services to fetch user playlists, tracks, and audio features. UI state and sorting interactions are local to components (or stored in small hooks/contexts when shared).

Security notes:
- PKCE flow is used so there's no client secret in the client bundle.
- Tokens may be stored in localStorage/sessionStorage; be aware of XSS risks — treat the app origin as protected and follow best XSS-hardening practices when evolving the app.

---

## Project layout (notable files)

- src/
  - App.jsx — app entry + routes
  - main.jsx — React DOM bootstrap
  - context/SpotifyAuthContext.jsx — central auth context and token exchange logic
  - services/
    - spotifyAuth.js — PKCE helpers, login, code exchange logic
    - spotifyApi.js — high-level wrapper for app-specific Spotify endpoints
    - spotifyFetch.js — thin fetch wrapper adding Authorization and retry logic
  - layout/ — shared layout components and `styles.module.js` (styled-components tokens)
  - components/ — shared UI components
  - hooks/ — custom hooks used across the app
  - pages/ — route pages (home, dashboard, tools, etc.)
  - styles/ — global theme, fonts, and CSS tokens

Top-level files:
- `vite.config.js` — dev server + build config (default host 127.0.0.1, port 5173)
- `package.json` — scripts and dependencies
- `README.md` — (this file)

---

## Environment variables

Create a `.env.local` (or `.env`) at the project root and set the following variables before running the app locally:

- VITE_SPOTIFY_CLIENT_ID — Spotify app client id (from developer dashboard)
- VITE_REDIRECT_URI — full redirect URI registered in your Spotify app (example: `http://127.0.0.1:5173/`)

Example (.env.local):

VITE_SPOTIFY_CLIENT_ID=YOUR_CLIENT_ID
VITE_REDIRECT_URI=http://127.0.0.1:5173/

Notes:
- The redirect URI registered in the Spotify Developer Dashboard must exactly match `VITE_REDIRECT_URI` including scheme, host, port, and trailing slash.
- If you prefer `http://localhost:5173/` then register and use that exact value.

---

## Local development

1. Install dependencies

   npm install

2. Start dev server (Vite)

   npm run dev

3. Open the app in the browser

   http://127.0.0.1:5173/ (or the host shown by Vite)

4. Login flow

- Click the Login button in the app. The app will create a PKCE code challenge and redirect to Spotify.
- After granting permissions, Spotify redirects back to `VITE_REDIRECT_URI`.
- The app will exchange the code for access/refresh tokens and store them according to the implementation in `SpotifyAuthContext.jsx`.

---

## Build & preview

- Build production bundle:

  npm run build

- Preview production build locally (Vite preview):

  npm run preview

Serve the static output directory from any static host for deployment.

---

## Troubleshooting

Common issues and fixes:

- Missing required env vars: VITE_SPOTIFY_CLIENT_ID, VITE_REDIRECT_URI
  - Create `.env.local` from the example and restart the dev server.

- INVALID_CLIENT / Invalid redirect URI
  - Ensure `VITE_REDIRECT_URI` exactly matches a Redirect URI in your Spotify app settings (include trailing slash).

- Missing PKCE verifier or "Missing PKCE verifier" during token exchange
  - The PKCE verifier should be stored in browser storage before redirect. Try logging in again; if it persists, clear site data for the app’s origin and retry.

- Stuck on "Redirecting..."
  - Check the browser developer console and Network tab for the token exchange request. Verify query params, code, and that `VITE_REDIRECT_URI` is correct.

---

## Tests

This project currently does not include a test suite. If you add tests, prefer lightweight unit tests for services and hooks, and small integration tests around the auth flow (mocking Spotify endpoints).

---

## Contribution & next steps

Ideas that are useful to add:
- Add unit tests for `spotifyAuth.js` and `spotifyFetch.js` (mock fetch)
- Add stricter linting and CI (GitHub Actions) to run lint/build
- Move sensitive token handling into a minimal backend if you want to support refresh tokens more securely
- Enhance error handling and add telemetry for auth/API errors

If you want help implementing any of these, open an issue or submit a PR.

---

## License

This project does not include a license file. If you plan to open-source it, add a `LICENSE` (MIT/Apache/etc.) file as appropriate.

---

If you'd like, I can also:
- add a concise `DEVELOPMENT.md` with the PKCE implementation details and example network traces,
- create a `.env.local.example` file in the repo, or
- add a small smoke test that simulates the PKCE flow (mocked) to demonstrate auth logic.

Tell me which of those you'd like next.
