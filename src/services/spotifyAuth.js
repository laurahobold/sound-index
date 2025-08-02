// src/services/spotifyAuth.js
const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_REDIRECT_URI;
const scopes = [
		"playlist-read-private",
		"playlist-modify-private",
		"playlist-modify-public"
];

function generateCodeVerifier(length = 128) {
		const array = new Uint32Array(length);
		crypto.getRandomValues(array);
		return Array.from(array, dec => ('0' + dec.toString(16)).slice(-2)).join('').slice(0, length);
}

async function generateCodeChallenge(verifier) {
		const encoder = new TextEncoder();
		const data = encoder.encode(verifier);
		const digest = await crypto.subtle.digest("SHA-256", data);
		return btoa(String.fromCharCode(...new Uint8Array(digest)))
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
}

function getAuthUrl(verifier, challenge) {
		const authUrl = new URL("https://accounts.spotify.com/authorize");
		authUrl.search = new URLSearchParams({
				client_id: clientId,
				response_type: "code",
				redirect_uri: redirectUri,
				code_challenge_method: "S256",
				code_challenge: challenge,
				scope: scopes.join(" ")
		}).toString();
		return authUrl.toString();
}

async function exchangeCodeForToken(code, verifier) {
		const response = await fetch("https://accounts.spotify.com/api/token", {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: new URLSearchParams({
						client_id: clientId,
						grant_type: "authorization_code",
						code,
						redirect_uri: redirectUri,
						code_verifier: verifier
				})
		});
		return response.json();
}

export {
		generateCodeVerifier,
		generateCodeChallenge,
		getAuthUrl,
		exchangeCodeForToken,
};
