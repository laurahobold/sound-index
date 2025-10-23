// src/pages/home/index.jsx
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
		ActionButtons, Description, GettingStarted, Hero, Title, Accent, LearnMore, Subtitle, Illustration, Section
} from "./styles.module.js";

import {AsteriskIcon, ListMusic} from "lucide-react";
import {
		ToolCard, ToolCTA, ToolDesc, ToolHead, ToolIcon, ToolName, ToolsGrid, ToolsHeader, ToolsSection
} from "./tools/ranking/styles.module.js";

import texts from "../texts/text.js";
import {HomeStack} from "./styles.module.js";
// ✅ only the public auth API
import {startLogin, handleAuthRedirect} from "../services/index.js";
import {spotifyFetch} from "../services/index.js";
import ToolCards from "../components/ToolCards/index.jsx";
import {Button, Col, Row, Space} from "antd";
import LoginButton from "../components/loginButton/index.jsx";
import image from "../assets/hero2.png"


export default function Home ({
		token, setToken
}) {
		const navigate = useNavigate ();
		const [ authError, setAuthError ] = useState (null);
		const [ isBusy, setIsBusy ] = useState (true);
		const [ Img, setImg ] = "../../public/shape-04.png"

		useEffect (() => {
				let mounted = true;
				( async () => {
						try {
								// Try to complete the OAuth redirect if we have ?code
								const tokenSet = await handleAuthRedirect (); // no-op if no ?code
								if (mounted && tokenSet?.access_token) {
										setToken (tokenSet.access_token);
								}
						} catch (e) {
								// Most common cause is a missing/cleared PKCE — show a friendly message
								if (mounted) setAuthError (e?.message || "Login failed. Please try again.");
						} finally {
								// If we already had a token, verify it to refresh UI state
								const storedToken = localStorage.getItem ("spotify_token");
								if (storedToken && mounted) {
										try {
												await spotifyFetch ("https://api.spotify.com/v1/me", {token: storedToken}).then (r => r.json ());
												setToken ((t) => t || storedToken);
										} catch {
												// wrapper likely cleared invalid token; ignore
										}
								}
								if (mounted) setIsBusy (false);
						}
				} ) ();

				return () => {
						mounted = false;
				};
		}, [ setToken ]);

		const hasToken = Boolean (token || localStorage.getItem ("spotify_token"));

		const loginWithSpotify = () => {
				const next = window.location.pathname + window.location.search;
				startLogin (next);
		};

		function ToolCard () {
				const navigate = useNavigate ();

				const openOrLogin = (path) => {
						if (hasToken) {
								navigate (path || "/dashboard");
						} else {
								sessionStorage.setItem ("si_next", path || "/dashboard");
								startLogin (path || "/dashboard");
						}
				};
				const hasToken = Boolean (token || localStorage.getItem ("spotify_token"));

				return ( <ToolsSection>
						<ToolsHeader>
								<AsteriskIcon/>
								Features
								<AsteriskIcon/>
						</ToolsHeader>

						<ToolsGrid>
								{texts.tools.map ((tool, i) => {
										const Icon = tool.icon || ListMusic;
										return ( <ToolCard key={i}>
												<ToolHead>
														<ToolIcon><Icon/></ToolIcon>
														<ToolName>{tool.name}</ToolName>
												</ToolHead>

												<ToolDesc>{tool.description}</ToolDesc>

												<ToolCTA onClick={() => openOrLogin (tool.path)}>
														Open
												</ToolCTA>
										</ToolCard> );
								})}
						</ToolsGrid>
				</ToolsSection> );
		}

		return ( <HomeStack>
				<Hero>
						<GettingStarted>
								{/*<Description>Welcome to</Description>*/}
								{/*Designed for people who use playlists as diaries.*/}
								{/*<Title>*/}
								{/*		The interserction of{" "}*/}
								{/*		<Accent soft>music nerd</Accent>*/}
								{/*		{" "} and {" "}*/}
								{/*		<Accent $shimmer>data freak</Accent>—right here.*/}
								{/*</Title>*/}
								<Col>
										<Title>Tools for people who overthink playlists - <b>right here</b>.
										</Title>
										<ActionButtons>
												{!hasToken && !isBusy ? (
														<LoginButton label="Log in with Spotify" onClick={loginWithSpotify}/> ) : isBusy ? (
														<p>Redirecting...</p> ) : (
														<LoginButton label="Open dashboard" onClick={() => navigate ("/dashboard")}/> )}
												{authError && <Text style={{
														color: "#ff4d4f", marginTop: 8
												}}>{authError}</Text>}

												<Button color="default" variant="link" onClick={() => navigate ("/about")}>Learn
														More</Button>

										</ActionButtons>

								</Col>
								<Illustration src={image}></Illustration>


						</GettingStarted>

						<ToolCards
								hasToken={hasToken}
								startLogin={(next) => startLogin (next)}
						/>
						{/*<div className="custom-shape-divider-bottom-1760888362">*/}
						{/*		<svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120"*/}
						{/*		     preserveAspectRatio="none">*/}
						{/*				<path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" className="shape-fill"></path>*/}
						{/*		</svg>*/}
						{/*</div>*/}
				</Hero>

		</HomeStack> );
}
