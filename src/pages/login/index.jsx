import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  padding: 2rem;
  text-align: center;
`;

const Button = styled.button`
  background-color: #1db954;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
`;

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_REDIRECT_URI;
const scopes = [
  "playlist-read-private",
  "playlist-modify-private",
  "playlist-modify-public"
];

function generateCodeVerifier(length = 128) {
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, dec => ('0' + dec.toString(16)).slice(-2)).join('').slice(0, length);
}

async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
  .replace(/\+/g, "-")
  .replace(/\//g, "_")
  .replace(/=+$/, "");
}

export default function LoginPage({ token, setToken }) {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token is already saved
    const savedToken = localStorage.getItem("spotify_token");
    if (savedToken) {
      setToken(savedToken);
      navigate("/pick");
      return;
    }

    // Look for code and exchange for token
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const storedVerifier = localStorage.getItem("code_verifier");

    if (code && storedVerifier) {
      fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
          code_verifier: storedVerifier
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.access_token) {
          localStorage.setItem("spotify_token", data.access_token);
          setToken(data.access_token);
          navigate("/pick");
        } else {
          console.error("Token exchange failed:", data);
        }
      })
      .catch(err => console.error("Token fetch error:", err));
    }
  }, []);

  function loginWithSpotify() {
    const verifier = generateCodeVerifier();
    generateCodeChallenge(verifier).then(challenge => {
      localStorage.setItem("code_verifier", verifier);
      const params = new URLSearchParams({
        client_id: clientId,
        response_type: "code",
        redirect_uri: redirectUri,
        code_challenge_method: "S256",
        code_challenge: challenge,
        scope: scopes.join(" ")
      });
      window.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
    });
  }

  return (
      <Container>
        {!token ? (
            <Button onClick={loginWithSpotify}>Login with Spotify</Button>
        ) : (
            <p>Redirecting...</p>
        )}
      </Container>
  );
}
