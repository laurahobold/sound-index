import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Text } from "@radix-ui/themes";
import WaveReveal from "../../../components/title/index.jsx";
import SlideArrowButton from "../../../components/loginButton/index.jsx";
import {ActionButtons, Description, GettingStarted, Hero, LearnMore} from "./styles.module.js";
import {
  generateCodeVerifier,
  generateCodeChallenge,
  getAuthUrl,
  exchangeCodeForToken,
} from "../../services/spotifyAuth.js";
import text from "../../texts/text.js";
import texts from "../../texts/text.js";

export default function Home({ token, setToken }) {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    const storedVerifier = localStorage.getItem("code_verifier");

    if (code && storedVerifier) {
      exchangeCodeForToken(code, storedVerifier)
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
      const url = getAuthUrl(verifier, challenge);
      window.location.href = url;
    });
  }

  return (
      <Hero>
        <WaveReveal/>
        <GettingStarted>
          <Description>
            {texts.home.description}
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
