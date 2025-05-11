// Home.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Text, Theme } from "@radix-ui/themes";
import '@radix-ui/themes/styles.css';
import GibberishText from "../../../components/title/index.jsx";
import WaveReveal from "../../../components/title/index.jsx";
import SlideArrowButton from "../../../components/loginButton/index.jsx";
import styled from "styled-components";
import {ActionButtons, Description, GettingStarted, Hero, LearnMore} from "./styles.module.js";
import GetStartedButton from "../../../components/button/index.jsx";


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

export default function Home({ token, setToken }) {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
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
        }
      });
    }
  }, []);

  useEffect(() => {
    if (token) navigate("/pick");
  }, [token]);

  function loginWithSpotify() {
    const verifier = generateCodeVerifier();
    generateCodeChallenge(verifier).then(challenge => {
      localStorage.setItem("code_verifier", verifier);
      const authUrl = new URL("https://accounts.spotify.com/authorize");
      authUrl.search = new URLSearchParams({
        client_id: clientId,
        response_type: "code",
        redirect_uri: redirectUri,
        code_challenge_method: "S256",
        code_challenge: challenge,
        scope: scopes.join(" ")
      }).toString();
      window.location.href = authUrl.toString();
    });
  }

  return (<Hero>
        <WaveReveal
            text="Bop Hierarchy"
            direction="up"
            mode="letter"
            delay={100}
            duration="1600ms"
            blur={true}
        />
        <GettingStarted>
        <Description>
              {/*1. Click "Login with Spotify"<br />*/}
              {/*2. Authorize the app<br />*/}
              {/*3. Choose a playlist<br />*/}
              {/*4. Rank and save it*/}
          Swipe, sort, and settle the score. A fun way to rank your favorite tracks, one choice at a time.
        </Description>
          <ActionButtons>
        {!token ? (
            <SlideArrowButton onClick={loginWithSpotify}></SlideArrowButton>
        ) : (
            <Text>Redirecting...</Text>
        )}
            <LearnMore onClick={() => navigate('/about')}>Learn More</LearnMore>
          </ActionButtons>
        </GettingStarted>
    </Hero>
  );
}
