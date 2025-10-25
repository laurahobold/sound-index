# Sound Index

Sound Index is a digital toolkit for self‑aware Spotify listeners. Built with React and Vite, it lets you sort, rank,
and organize your music library right in the browser. Authentication uses the Spotify Web API with PKCE — no server or
secret keys required.

> Map your taste, curate with intent, and share what you discover.

## What It Does

- Comparative Ranking — preference‑based ranker where you compare two tracks at a time to derive an exact ordering for a
  playlist or your saved songs. The tool surfaces audio features and metadata to help you choose what should come out on
  top.
- Library Manager — search your playlists, rename them inline, toggle visibility (public ⇄ private), and unfollow in
  bulk. Open a playlist, drag‑and‑drop to reorder tracks, and save the new order back to Spotify.
- Top Tracks/Artists — a private “Wrapped”‑style peek at your top tracks and artists over different time ranges (short
  term ≈ 4 weeks, medium term ≈ 6 months, long term ≈ several years). Data ordering is provided by Spotify; pagination
  doesn’t change ranks.
- Cover Lab — coming soon. Drag‑and‑drop a JPG/PNG to update or create playlist covers. Auto‑crop to square with
  safe‑area guides and export a Spotify‑ready 640×640 image.

## Tech Stack

- React 19 for the UI
- Vite 6 for lightning‑fast dev/build commands
- @dnd‑kit for drag‑and‑drop interactions
- Ant Design for component primitives and tables
- styled‑components for theming and custom styles
- React Router for client‑side routing
- Spotify Web API (PKCE) for authentication and data

## Getting Started

1. Clone the repository
   ```
   git clone https://github.com/laurahobold/sound-index.git
   cd sound-index
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a Spotify App
    - Go to https://developer.spotify.com/dashboard and create an application.
    - Add a redirect URI (e.g. http://127.0.0.1:5173/).
    - Copy the Client ID.

4. Create a `.env.local` file
   Sound Index uses Vite environment variables. Create a file named `.env.local` in the project root with the following
   keys (replace the values with your own credentials):
   ```
   VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
   VITE_REDIRECT_URI=http://127.0.0.1:5173/
   # Optional: override the scopes requested (comma‑separated)
   VITE_SPOTIFY_SCOPES=user-library-read,playlist-read-private,playlist-modify-public,playlist-modify-private,user-top-read,user-read-recently-played
   ```

5. Run the development server
   ```
   npm run dev
   ```
   Vite will print a local URL (default http://127.0.0.1:5173/). Open it in your browser and click Login to authorize
   Sound Index with your Spotify account. When you return, your library and tools will appear.

6. Build for production (optional)
   ```
   npm run build
   ```
   The compiled assets will be generated in the `dist` folder. You can serve them statically with any HTTP server or
   host them on a platform like Vercel.

## Project Structure

```
sound-index/
├─ src/
│  ├─ components/   # Reusable UI components (table wrappers, icons, etc.)
│  ├─ context/      # Context providers (e.g. SpotifyAuthContext)
│  ├─ layout/       # Layout primitives and styled containers
│  ├─ pages/        # Top‑level pages (home, tools, about)
│  │  └─ tools/
│  │     ├─ ranking/    # Comparative ranking interface
│  │     ├─ playlists/  # Library Manager UI and drag‑and‑drop logic
│  │     └─ wrapped/    # Top Tracks/Artists page
│  ├─ services/     # Spotify API wrappers and helpers
│  ├─ styles/       # Theme, fonts and global styles
│  └─ texts/        # Copy for UI and tool descriptions
├─ package.json      # Project metadata and scripts
└─ README.md         # You’re reading it
```

Key modules include the `SpotifyAuthContext` for storing the token, `spotifyAuth.js` / `spotifyApi.js` for making
authenticated calls, and DnD‑powered pages in `src/pages/tools/` for each tool.

## Contributing

Contributions are welcome! If you spot a bug, have an idea for a new tool, or want to help polish the UI, feel free to
open an issue or a pull request. Please ensure your code is formatted with Prettier and passes ESLint before submitting.

## License

This project currently does not include a license. If you plan to fork or reuse the code in a commercial or open‑source
project, please open an issue to discuss adding an appropriate license.
