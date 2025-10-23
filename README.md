# Sound Index

Sound Index is a lightweight React + Vite app that connects to the Spotify Web API so users can sign in (PKCE) and
quickly rank/sort their tracks and playlists with a drag-and-drop interface.

What it does

- Interactive drag-and-drop ranking of tracks and playlists
- Uses Spotify OAuth PKCE (no client secret) and a small client-side service layer
- Surfaces audio features and playlist metadata to help sorting decisions

Quick start

1. Install dependencies

   npm install

2. Create `.env.local` at the project root with:

   VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
   VITE_REDIRECT_URI=http://127.0.0.1:5173/

3. Run the dev server

   npm run dev

Open the URL shown by Vite (default: http://127.0.0.1:5173/) and click the app's Login button to start the Spotify flow.

Tech stack (short)

React, Vite, @dnd-kit (drag-and-drop), styled-components, Ant Design, and a small Spotify service layer.

Key files

- `src/context/SpotifyAuthContext.jsx` — auth/token handling
- `src/services/spotifyAuth.js`, `spotifyFetch.js`, `spotifyApi.js` — Spotify integration
- `src/pages/tools/ranking` and `src/components/` — ranking UI and DnD components

If you want, I can also: add a `.env.local.example`, a one-page `DEVELOPMENT.md` describing the PKCE flow, or update the
project package name to `sound-index`.
