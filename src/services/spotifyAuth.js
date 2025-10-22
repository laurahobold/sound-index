// src/services/spotifyAuth.js
const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_REDIRECT_URI;
const scopes = [
		"playlist-read-private",
		"playlist-modify-private",
		"playlist-modify-public",
		"ugc-image-upload",
		"user-top-read",
		"user-library-read",
		"user-read-recently-played",
];

function ensureEnv() {
		const missing = [];
		if (!clientId) missing.push("VITE_SPOTIFY_CLIENT_ID");
		if (!redirectUri) missing.push("VITE_REDIRECT_URI");
		if (missing.length) {
				throw new Error(
						`Missing env: ${missing.join(", ")}. Create .env.local with those and restart.`
				);
		}
}

function generateCodeVerifier(length = 64) {
		const array = new Uint8Array(length);
		crypto.getRandomValues(array);
		return btoa(String.fromCharCode(...array))
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+/g, "")
		.slice(0, length);
}

async function generateCodeChallenge(verifier) {
		const data = new TextEncoder().encode(verifier);
		const digest = await crypto.subtle.digest("SHA-256", data);
		return btoa(String.fromCharCode(...new Uint8Array(digest)))
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
}

function getAuthUrl(challenge) {
		ensureEnv();
		const auth = new URL("https://accounts.spotify.com/authorize");
		auth.search = new URLSearchParams({
				client_id: clientId,
				response_type: "code",
				redirect_uri: redirectUri,
				code_challenge_method: "S256",
				code_challenge: challenge,
				scope: scopes.join(" "),
				show_dialog: "true",
		}).toString();
		return auth.toString();
}

async function exchangeCodeForToken(code, verifier) {
		ensureEnv();
		const res = await fetch("https://accounts.spotify.com/api/token", {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: new URLSearchParams({
						client_id: clientId,
						grant_type: "authorization_code",
						code,
						redirect_uri: redirectUri,
						code_verifier: verifier,
				}),
		});
		const data = await res.json();
		if (!res.ok) {
				const msg = data?.error_description || data?.error || `HTTP ${res.status}`;
				throw new Error(`Spotify token exchange failed: ${msg}`);
		}
		return data;
}

/* ------------ PUBLIC API ------------ */

// Always call this one — everywhere.
export async function startLogin(targetPath) {
		ensureEnv();

		// Remember where the user wanted to go (optional but nice)
		if (targetPath) sessionStorage.setItem("si_next", targetPath);

		const verifier = generateCodeVerifier();
		// Store in BOTH places to survive weird navigations or SPA reloads
		sessionStorage.setItem("pkce_verifier", verifier);
		localStorage.setItem("pkce_verifier", verifier);

		const challenge = await generateCodeChallenge(verifier);
		const url = getAuthUrl(challenge);
		window.location.assign(url);
}

// Call once on app load (on the redirect URI route)
export async function handleAuthRedirect() {
		const params = new URLSearchParams(window.location.search);
		const code = params.get("code");
		if (!code) return null;

		// Prefer sessionStorage; fallback to localStorage; then clean up.
		let verifier = sessionStorage.getItem("pkce_verifier");
		if (!verifier) verifier = localStorage.getItem("pkce_verifier");
		if (!verifier) throw new Error("Missing PKCE verifier. Please try logging in again.");

		const tokenSet = await exchangeCodeForToken(code, verifier);

		// Clean sensitive stuff
		window.history.replaceState({}, "", window.location.pathname);
		sessionStorage.removeItem("pkce_verifier");
		localStorage.removeItem("pkce_verifier");

		// Persist token
		localStorage.setItem("spotify_token", tokenSet.access_token);
		localStorage.setItem("spotify_scope", tokenSet.scope || "");
		// optional: expires_in, refresh_token, etc.

		// Deep link after login
		const next = sessionStorage.getItem("si_next");
		if (next) {
				sessionStorage.removeItem("si_next");
				// replace to avoid back-button weirdness
				window.location.replace(next);
		}

		return tokenSet;
}

export function isLoggedIn() {
		return Boolean(localStorage.getItem("spotify_token"));
}

export function logout() {
		localStorage.removeItem("spotify_token");
		localStorage.removeItem("spotify_scope");
		sessionStorage.removeItem("si_next");
		window.dispatchEvent(new CustomEvent("auth:expired"));
}

export {
		// exported for testing or advanced flows, but not needed by app code
		generateCodeVerifier,
		generateCodeChallenge,
};
