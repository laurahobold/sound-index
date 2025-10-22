// src/services/spotifyApi.js
import { spotifyFetch } from "./spotifyFetch.js";

// --- Me ---
export async function getMe(token) {
		const res = await spotifyFetch("https://api.spotify.com/v1/me", { token });
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		return res.json();
}

// --- Playlists (current user, paginated aggregate) ---
export async function getMyPlaylistsAll(token) {
		const out = [];
		let url = "https://api.spotify.com/v1/me/playlists?limit=50&offset=0";
		while (url) {
				const res = await spotifyFetch(url, { token });
				if (!res.ok) throw new Error(`HTTP ${res.status}`);
				const data = await res.json();
				out.push(...(data.items || []));
				url = data.next;
		}
		return out;
}

// Unfollow (a.k.a. delete from library)
export async function unfollowPlaylist(playlistId, token) {
		const res = await spotifyFetch(
				`https://api.spotify.com/v1/playlists/${playlistId}/followers`,
				{ method: "DELETE", token }
		);
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		return true;
}

// Update playlist meta (name/description/public)
export async function updatePlaylist(playlistId, body, token) {
		const res = await spotifyFetch(
				`https://api.spotify.com/v1/playlists/${playlistId}`,
				{
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						token,
						body: JSON.stringify(body),
				}
		);
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		return true;
}

// --- Tracks in a playlist (first page; keep logic identical to current page) ---
// export async function getPlaylistTracks(playlistId, token) {
// 		const res = await spotifyFetch(
// 				`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100&offset=0`,
// 				{ token }
// 		);
// 		if (!res.ok) throw new Error(`HTTP ${res.status}`);
// 		return res.json(); // { items, snapshot_id, ... }
// }

// Remove specific tracks by URI (optionally with snapshot)
export async function removeTracksFromPlaylist(playlistId, uris, snapshotId, token) {
		const res = await spotifyFetch(
				`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
				{
						method: "DELETE",
						headers: { "Content-Type": "application/json" },
						token,
						body: JSON.stringify({
								tracks: uris.map((u) => ({ uri: u })),
								snapshot_id: snapshotId || undefined,
						}),
				}
		);
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		// Spotify may return { snapshot_id }
		try {
				return await res.json();
		} catch {
				return {};
		}
}

// Replace (save order) with a full list of URIs
export async function replacePlaylistTracks(playlistId, uris, token) {
		const res = await spotifyFetch(
				`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
				{
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						token,
						body: JSON.stringify({ uris }),
				}
		);
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		try {
				return await res.json(); // { snapshot_id }
		} catch {
				return {};
		}
}
// src/services/spotifyApi.js

/** Read token from arg or localStorage */
function resolveToken(token) {
		return token || localStorage.getItem("spotify_token");
}

/** Generic paginator for Spotify endpoints that return { items, next } */
async function fetchAllPaginated(url, { token, limit = 50 } = {}) {
		const accessToken = resolveToken(token);
		const items = [];
		let next = new URL(url);
		// inject limit if not provided
		if (!next.searchParams.has("limit")) next.searchParams.set("limit", String(limit));

		while (next) {
				const res = await spotifyFetch(next.toString(), { token: accessToken });
				const data = await res.json();
				if (data?.items?.length) items.push(...data.items);
				next = data?.next ? new URL(data.next) : null;
		}
		return items;
}

/** Sort playlists by latest snapshot (desc), then name (asc) */
function sortPlaylists(items) {
		return items.sort((a, b) => {
				const t1 = a.snapshot_id ? Number(new Date(parseInt(a.snapshot_id.slice(0, 8), 16) * 1000)) : 0;
				const t2 = b.snapshot_id ? Number(new Date(parseInt(b.snapshot_id.slice(0, 8), 16) * 1000)) : 0;
				if (t1 !== t2) return t2 - t1;
				return (a.name || "").localeCompare(b.name || "");
		});
}

/** Map a Spotify track object to your sorter shape */
function mapTrack(t) {
		if (!t) return null;
		return {
				id: t.id,
				name: t.name,
				uri: t.uri,
				artists: t.artists?.map(a => a.name).join(", "),
				cover: t.album?.images?.[0]?.url || "",
				album: t.album?.name || "",
				previewUrl: t.preview_url ?? null,
		};
}

/** Public API */
export async function listUserPlaylists({ token, all = true, limit = 50 } = {}) {
		if (all) {
				const items = await fetchAllPaginated("https://api.spotify.com/v1/me/playlists", { token, limit });
				return sortPlaylists(items);
		}
		// single page
		const accessToken = resolveToken(token);
		const url = `https://api.spotify.com/v1/me/playlists?limit=${limit}`;
		const res = await spotifyFetch(url, { token: accessToken });
		const data = await res.json();
		return sortPlaylists(data.items || []);
}

export async function getPlaylistTracks(playlistId, { token, all = true, limit = 100 } = {}) {
		if (!playlistId) throw new Error("playlistId is required");
		const base = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

		const items = all
				? await fetchAllPaginated(base, { token, limit })
				: (await (await spotifyFetch(`${base}?limit=${limit}`, { token: resolveToken(token) })).json()).items || [];

		// Items may contain { track: {...} } or nulls for unavailable tracks
		return items
		.map(i => mapTrack(i?.track))
		.filter(Boolean);
}
// Helper to resolve a token


/* ================= New: Albums API ================= */

/** Search albums by text (uses Spotify Search API) */
export async function searchAlbums(query, { token, limit = 24, offset = 0 } = {}) {
		if (!query || !query.trim()) return [];
		const accessToken = resolveToken(token);
		const url = new URL("https://api.spotify.com/v1/search");
		url.searchParams.set("type", "album");
		url.searchParams.set("q", query.trim());
		url.searchParams.set("limit", String(limit));
		url.searchParams.set("offset", String(offset));

		const res = await spotifyFetch(url.toString(), { token: accessToken });
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const data = await res.json();
		return (data?.albums?.items || []).map((a) => ({
				id: a.id,
				name: a.name,
				artists: a.artists?.map((ar) => ar.name).join(", "),
				release_date: a.release_date,
				images: a.images || [],
				total_tracks: a.total_tracks ?? null,
		}));
}

/** Get all tracks from an album (and enrich with the album’s images/name) */
export async function getAlbumTracks(albumId, { token } = {}) {
		if (!albumId) throw new Error("albumId is required");
		const accessToken = resolveToken(token);

		// 1) Fetch album meta (to attach cover/name to each track)
		const albumRes = await spotifyFetch(`https://api.spotify.com/v1/albums/${albumId}`, {
				token: accessToken,
		});
		if (!albumRes.ok) throw new Error(`HTTP ${albumRes.status}`);
		const album = await albumRes.json();

		// 2) Fetch album tracks (paginated)
		const tracks = await fetchAllPaginated(
				`https://api.spotify.com/v1/albums/${albumId}/tracks`,
				{ token: accessToken, limit: 50 }
		);

		// 3) Enrich each item to look like a full track object, then map
		const fullTracks = tracks.map((t) =>
				mapTrack({
						...t,
						album: { name: album.name, images: album.images },
				})
		);

		return fullTracks.filter(Boolean);
}
export async function getRecentlyPlayedAlbums({ token, limit = 5 } = {}) {
		const accessToken = token || localStorage.getItem("spotify_token");

		// pull a few more raw items to survive de-dup across albums
		const rawLimit = Math.max(10, limit * 3);
		const res = await spotifyFetch(
				`https://api.spotify.com/v1/me/player/recently-played?limit=${rawLimit}`,
				{ token: accessToken }
		);

		if (!res.ok) {
				if (res.status === 403) {
						const err = new Error("Missing scope: user-read-recently-played");
						err.code = "MISSING_SCOPE";
						err.requiredScopes = ["user-read-recently-played"];
						throw err;
				}
				throw new Error(`HTTP ${res.status}`);
		}

		const data = await res.json();

		const seen = new Set();
		const out = [];
		for (const item of data?.items || []) {
				const a = item?.track?.album;
				if (!a?.id || seen.has(a.id)) continue;
				seen.add(a.id);
				out.push({
						id: a.id,
						name: a.name,
						artists: (a.artists || []).map((ar) => ar.name).join(", "),
						release_date: a.release_date,
						images: a.images || [],
						total_tracks: a.total_tracks ?? null,
				});
				if (out.length >= limit) break;
		}
		return out;
}
// --- Top Artists / Top Tracks (require: user-top-read) ---
export async function getTopArtists({ token, limit = 50, time_range = "short_term" } = {}) {
		const accessToken = token || localStorage.getItem("spotify_token");
		const url = new URL("https://api.spotify.com/v1/me/top/artists");
		url.searchParams.set("limit", String(limit));
		url.searchParams.set("time_range", time_range);

		const res = await spotifyFetch(url.toString(), { token: accessToken });
		if (res.status === 401) throw new Error("Unauthorized (token expired?)");
		if (res.status === 403) {
				const e = new Error("Missing scope: user-top-read");
				e.code = "MISSING_SCOPE";
				throw e;
		}
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const data = await res.json();
		return data.items || [];
}

export async function getTopTracks({ token, limit = 5, time_range = "short_term" } = {}) {
		const accessToken = token || localStorage.getItem("spotify_token");
		const url = new URL("https://api.spotify.com/v1/me/top/tracks");
		url.searchParams.set("limit", String(limit));
		url.searchParams.set("time_range", time_range);

		const res = await spotifyFetch(url.toString(), { token: accessToken });
		if (res.status === 401) throw new Error("Unauthorized (token expired?)");
		if (res.status === 403) {
				const e = new Error("Missing scope: user-top-read");
				e.code = "MISSING_SCOPE";
				throw e;
		}
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const data = await res.json();
		return (data.items || []).map((t) => ({
				id: t.id,
				name: t.name,
				uri: t.uri,
				artists: (t.artists || []).map((a) => a.name).join(", "),
				cover: t.album?.images?.[0]?.url || "",
				album: t.album?.name || "",
				previewUrl: t.preview_url ?? null,
		}));
}
