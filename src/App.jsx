import {useState} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/home/index.jsx";
import PickPage from "./pages/pick/index.jsx";
import SortPage from "./pages/sort/index.jsx";
import ResultPage from "./pages/result/index.jsx";
import Layout from "./layout/index.jsx";
import {Theme} from "@radix-ui/themes";
import VantaBackground from "../components/background/index.jsx";
import {BgLightGradient1, BgLightGradient2, BgLightGradient3, BgLightGradient4, BgLightGradient5, BgLightGridGradient1} from "./styles/background.js";
import AboutPage from "./pages/about/index.jsx";

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_REDIRECT_URI;
const scopes = [ "playlist-read-private", "playlist-modify-private", "playlist-modify-public" ];

function generateCodeVerifier (length = 128) {
		const array = new Uint32Array (length);
		window.crypto.getRandomValues (array);
		return Array.from (array, dec => ( '0' + dec.toString (16) ).slice (-2)).join ('').slice (0, length);
}

async function generateCodeChallenge (codeVerifier) {
		const encoder = new TextEncoder ();
		const data = encoder.encode (codeVerifier);
		const digest = await window.crypto.subtle.digest ("SHA-256", data);
		return btoa (String.fromCharCode (...new Uint8Array (digest))).replace (/\+/g, "-").replace (/\//g, "_").replace (/=+$/, "");
}

function App () {
		const [ token, setToken ] = useState (null);
		const [ playlists, setPlaylists ] = useState ([]);
		const [ selectedTracks, setSelectedTracks ] = useState ([]);
		const [ sortingStack, setSortingStack ] = useState ([]);
		const [ rankedTracks, setRankedTracks ] = useState ([]);


		return ( <Router>
				<BgLightGridGradient1>
								<Layout token={token}>
										<Routes>
												<Route
														path="/"
														element={<Home token={token} setToken={setToken}/>}
												/>
												<Route
														path="/pick"
														element={<PickPage setRankedTracks={setRankedTracks} // ✅ Pass this!
														                   token={token} playlists={playlists} setPlaylists={setPlaylists}
														                   setSelectedTracks={setSelectedTracks}
														                   setSortingStack={setSortingStack}/>}
												/>
												<Route
														path="/sort"
														element={<SortPage sortingStack={sortingStack} setSortingStack={setSortingStack}
														                   setRankedTracks={setRankedTracks}/>}
												/>
												<Route
														path="/result"
														element={<ResultPage token={token} rankedTracks={rankedTracks}/>}
												/>
												<Route
														path="/about"
														element={<AboutPage />}
												/>
										</Routes>
								</Layout>
				</BgLightGridGradient1>

		</Router> );
}

export default App;
