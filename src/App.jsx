// App.jsx
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {useEffect, useState} from "react";
import {ConfigProvider, theme} from "antd";
import Layout from "./layout/index.jsx";
import Home from "./pages/index.jsx";
import Dashboard from "./pages/dashboard/index.jsx";
import AboutPage from "./pages/about/index.jsx";
import PickPage from "./pages/tools/ranking/PickPage.jsx";
import SortPage from "./pages/tools/ranking/SortPage.jsx";
import ResultPage from "./pages/tools/ranking/ResultPage.jsx";
import LibraryEditor from "./pages/tools/playlists/index.jsx";
import WrappedPeek from "./pages/tools/wrapped/index.jsx";
import AuthNotification from "./components/authNotification.jsx";
import {handleAuthRedirect} from "./services/index.js";
import {Button} from "antd";
import {startLogin} from "./services/index.js";
import 'antd/dist/reset.css';
import './App.css'

// 🔒 Simple gate for pages that require a Spotify session
function RequireSpotifyAuth ({token, children, message = "You need to log in with Spotify to use this tool."}) {
		const isLoggedIn = Boolean (token || localStorage.getItem ("spotify_token"));
		if (isLoggedIn) return children;

		return ( <div style={{padding: 24}}>
				<h2 style={{marginBottom: 8}}>Login required</h2>
				<p style={{marginBottom: 16}}>{message}</p>
				<Button
						type="primary"
						onClick={() => {
								// remember where the user wanted to go
								sessionStorage.setItem ("si_next", window.location.pathname + window.location.search);
								startLogin ();
						}}
				>
						Log in with Spotify
				</Button>
		</div> );
}

function App () {
		const [ token, setToken ] = useState (localStorage.getItem ("spotify_token"));
		const [ sortingStack, setSortingStack ] = useState ([]);
		const [ rankedTracks, setRankedTracks ] = useState ([]);

		useEffect (() => {
				( async () => {
						const tokenSet = await handleAuthRedirect ().catch (() => null);
						if (tokenSet?.access_token) {
								setToken (tokenSet.access_token);
								// 🔁 if we saved a target route before logging in, go there now
								const next = sessionStorage.getItem ("si_next");
								if (next) {
										sessionStorage.removeItem ("si_next");
										window.location.replace (next);
								}
						}
				} ) ();

				// optional: when a token expires, drop in-memory copy
				const off = (e) => setToken (null);
				window.addEventListener ("auth:expired", off);
				return () => window.removeEventListener ("auth:expired", off);
		}, []);

		return ( <ConfigProvider theme={{algorithm: theme.darkAlgorithm}}>
				<Router>
						<Layout token={token} setToken={setToken}>
								<AuthNotification loginPath="/sorter/pick"/>

								<Routes>
										<Route path="/" element={<Home token={token} setToken={setToken}/>}/>
										<Route
												path="/dashboard"
												element={<RequireSpotifyAuth token={token}
												                             message="Log in with Spotify to view your dashboard.">
														<Dashboard token={token}/>
												</RequireSpotifyAuth>}
										/>
										<Route path="/about" element={<AboutPage/>}/>
										<Route
												path="/tools"
												element={<RequireSpotifyAuth token={token}>
														<PickPage token={token} setSortingStack={setSortingStack}
														          setRankedTracks={setRankedTracks}/>
												</RequireSpotifyAuth>}
										/>
										{/* 🔒 Tools – gated */}
										<Route
												path="/sorter/pick"
												element={<RequireSpotifyAuth token={token}>
														<PickPage token={token} setSortingStack={setSortingStack}
														          setRankedTracks={setRankedTracks}/>
												</RequireSpotifyAuth>}
										/>
										<Route
												path="/sorter/sort"
												element={<RequireSpotifyAuth token={token}>
														<SortPage token={token}/>
												</RequireSpotifyAuth>}
										/>
										<Route
												path="/sorter/result"
												element={<RequireSpotifyAuth token={token}>
														<ResultPage token={token}/>
												</RequireSpotifyAuth>}
										/>
										<Route
												path="/playlists"
												element={<RequireSpotifyAuth token={token}>
														<LibraryEditor token={token}/>
												</RequireSpotifyAuth>}
										/>
										<Route
												path="/wrapped"
												element={<RequireSpotifyAuth token={token}>
														<WrappedPeek token={token}/>
												</RequireSpotifyAuth>}
										/>
								</Routes>
						</Layout>
				</Router>
		</ConfigProvider> );
}

export default App;
