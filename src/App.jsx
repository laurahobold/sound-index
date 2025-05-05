// App.jsx – Routing for all pages
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login';
import PickPage from './pages/pick';
import SortPage from './pages/sort';
import ResultPage from './pages/result';
import { useEffect, useState } from 'react';

const clientId = "YOUR_SPOTIFY_CLIENT_ID";
const redirectUri = "https://rank-sorting-for-spotify.vercel.app/";
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

function App() {
    const [token, setToken] = useState(null);
    const [playlists, setPlaylists] = useState([]);
    const [selectedTracks, setSelectedTracks] = useState([]);
    const [sortingStack, setSortingStack] = useState([]);
    const [rankedTracks, setRankedTracks] = useState([]);

    useEffect(() => {
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
            .then(data => setToken(data.access_token));
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
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage loginWithSpotify={loginWithSpotify} token={token} />} />
                <Route path="/pick" element={<PickPage token={token} playlists={playlists} setPlaylists={setPlaylists} setSelectedTracks={setSelectedTracks} setSortingStack={setSortingStack} />} />
                <Route path="/sort" element={<SortPage sortingStack={sortingStack} setSortingStack={setSortingStack} setRankedTracks={setRankedTracks} />} />
                <Route path="/result" element={<ResultPage token={token} rankedTracks={rankedTracks} />} />
            </Routes>
        </Router>
    );
}

export default App;
