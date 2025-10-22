// Minimal wrapper to catch 401 and broadcast an "auth:expired" event
// src/services/spotifyFetch.js
export async function spotifyFetch(url, options = {}) {
		const token = options.token || localStorage.getItem("spotify_token");
		const headers = {
				...(options.headers || {}),
				Authorization: `Bearer ${token}`,
		};

		const res = await fetch(url, { ...options, headers });

		if (res.status === 401) {
				// Immediately remove any trace of the token + game session
				localStorage.removeItem("spotify_token");
				sessionStorage.removeItem("si_sortingStack");
				sessionStorage.removeItem("si_rankedTracks");

				// Tell the app so it can drop in-memory state (setToken(null), show banner, etc.)
				window.dispatchEvent(new CustomEvent("auth:expired"));

				// Reject so callers stop their flows right away
				const msg = "401 Unauthorized (token expired)";
				throw new Error(msg);
		}

		return res;
}

