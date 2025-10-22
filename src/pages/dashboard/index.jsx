// src/pages/dashboard/SortPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import texts from "../../texts/text.js";
import { Activity, Library, Heart, Users } from "lucide-react";
import { fonts } from "./../../styles/theme.js";

import {getMe, getMyPlaylistsAll, getTopArtists, getTopTracks} from "../../services/spotifyApi.js";
import { spotifyFetch } from "../../services/index.js";

// NEW: reusable cards & sparkline
import StatCard from "./StatCard/index.jsx";
import TopListCard from "./StatCard/rank.jsx";
import GenresPieCard from "./StatCard/genres.jsx";
import {HeaderSection, SectionHeader, SectionSub} from "../../layout/styles.module.js";

const InsightGrid = styled.section`
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr 1fr 1.5fr;
  @media (max-width: 1200px) { grid-template-columns: 1fr 1fr; }
  @media (max-width: 900px)  { grid-template-columns: 1fr; }
`;



export const StatsGrid = styled.section`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(4, minmax(0, 1fr));

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;
const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
`;

const MainArea = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 28px;
    margin: 0 auto;
    padding: clamp(0.5rem, 1.5vw, 1rem);
`;


export const Heading = styled.h1`
    color: ${({ theme }) => theme.background};
    font-family: ${fonts.heading};
    text-align: center;
    //padding: clamp(1rem, 3vw, 2rem);

`;

const Sub = styled.p`
    margin: 8px 0 0;
    font-size: 1.05rem;
    opacity: 0.8;
`;

export default function Dashboard() {
		const navigate = useNavigate();
		const token = localStorage.getItem("spotify_token");

		const [me, setMe] = useState(null);
		const [playlists, setPlaylists] = useState([]);
		const [savedTotal, setSavedTotal] = useState(null);
		const [followingTotal, setFollowingTotal] = useState(null);
		const [recentSeries, setRecentSeries] = useState([]); // [{date, count}]
		const [scopeWarnings, setScopeWarnings] = useState([]);

		const [topArtists, setTopArtists] = useState([]);
		const [topTracks, setTopTracks] = useState([]);
		const [genreTop6, setGenreTop6] = useState([]);
		const [errorMsg, setErrorMsg] = useState("");

		useEffect(() => {
				let cancelled = false;
				(async () => {
						try {
								const token = localStorage.getItem("spotify_token");

								// 1) Artists (short_term ~ last 4 weeks)
								const artists = await getTopArtists({ token, limit: 50, time_range: "short_term" });
								if (cancelled) return;
								setTopArtists(artists.slice(0, 5));

								// genres from artists
								const counts = new Map();
								for (const a of artists) (a.genres || []).forEach((g) => counts.set(g, (counts.get(g) || 0) + 1));
								const genres = [...counts.entries()]
								.sort((a, b) => b[1] - a[1])
								.slice(0, 6)
								.map(([name, value]) => ({ name, value }));
								if (!cancelled) setGenreTop6(genres);

								// 2) Tracks (short_term)
								const tracks = await getTopTracks({ token, limit: 5, time_range: "short_term" });
								if (!cancelled) setTopTracks(tracks);
						} catch (e) {
								if (!cancelled) setErrorMsg(e.message || "Failed to load tops");
						}
				})();
				return () => { cancelled = true; };
		}, []);

		useEffect(() => {
				if (!token) return;

				let cancelled = false;
				(async () => {
						try {
								// Profile
								const m = await getMe(token);
								if (cancelled) return;
								setMe(m);

								// Playlists (all pages)
								const pls = await getMyPlaylistsAll(token);
								if (cancelled) return;
								setPlaylists(pls);

								// Saved tracks TOTAL (no heavy fetch)
								const likedRes = await spotifyFetch("https://api.spotify.com/v1/me/tracks?limit=1", { token });
								const likedJson = await likedRes.json();
								if (!cancelled) setSavedTotal(likedJson?.total ?? 0);

								// Following artists TOTAL
								const folRes = await spotifyFetch("https://api.spotify.com/v1/me/following?type=artist&limit=1", { token });
								const folJson = await folRes.json();
								if (!cancelled) setFollowingTotal(folJson?.artists?.total ?? 0);

								// Recently played -> compact daily series
								try {
										const rp = await spotifyFetch("https://api.spotify.com/v1/me/player/recently-played?limit=50", { token });
										if (!rp.ok) throw rp;
										const data = await rp.json();
										const counts = new Map();
										for (const it of data?.items || []) {
												const day = new Date(it.played_at).toISOString().slice(0, 10);
												counts.set(day, (counts.get(day) || 0) + 1);
										}
										const series = Array.from(counts.entries())
										.sort((a, b) => a[0].localeCompare(b[0]))
										.map(([date, count]) => ({ date, count }));
										if (!cancelled) setRecentSeries(series);
								} catch (e) {
										// Missing scope user-read-recently-played or other non-fatal issues
										if (!cancelled) setScopeWarnings((w) => Array.from(new Set([...w, "user-read-recently-played"])));
								}
						} catch {
								// ignore; wrapper handles token expiry elsewhere
						}
				})();

				return () => {
						cancelled = true;
				};
		}, [token]);

		// Derived quick numbers
		const publicCount = useMemo(() => playlists.filter(p => p.public).length, [playlists]);
		const privateCount = useMemo(() => playlists.filter(p => !p.public).length, [playlists]);

		return (
				<Wrapper>
						<MainArea>
								<HeaderSection>
										<SectionHeader>{me?.display_name ? `Welcome, ${me.display_name}!` : "Welcome!"}</SectionHeader>
										<SectionSub>Live counts from your Spotify account. Tiny charts update as you listen.</SectionSub>
								</HeaderSection>

								<InsightGrid>

										<TopListCard
												title="Top Tracks"
												items={topTracks}
												type="tracks"
										/>
										<TopListCard
												title="Top Artists"
												items={topArtists.map(a => ({
														id: a.id,
														name: a.name,
														image: a.images?.[0]?.url,
														genres: a.genres || [],
												}))}
												type="artists"
										/>
										<GenresPieCard
												title="Top Genres"
												data={ genreTop6}
										/>
								</InsightGrid>
								<StatsGrid>
										<StatCard
												title="Playlists"
												icon={Library}
												value={playlists.length}
												subtitle={`${publicCount} public • ${privateCount} private`}
												chartData={
														// small fake shimmer to give visual motion when no recent data
														playlists.slice(0, 8).map((p, i) => ({ x: i + 1, y: (p.tracks?.total ?? 0) % 20 }))
												}
												xKey="x"
												yKey="y"
										/>

										<StatCard
												title="Liked Songs"
												icon={Heart}
												value={savedTotal ?? "—"}
												subtitle="Saved tracks total"
												chartData={
														Array.from({ length: 10 }, (_, i) => ({
																x: i + 1,
																y: ((savedTotal || 0) % 50) + (i % 3)
														}))
												}
												xKey="x"
												yKey="y"
										/>

										<StatCard
												title="Following Artists"
												icon={Users}
												value={followingTotal ?? "—"}
												subtitle="Artists you follow"
												chartType="line"
												chartData={
														Array.from({ length: 12 }, (_, i) => ({
																x: i + 1,
																y: ((followingTotal || 0) % 30) + (i % 2)
														}))
												}
												xKey="x"
												yKey="y"
										/>

										<StatCard
												title="Recent Plays"
												icon={Activity}
												value={recentSeries.reduce((a, b) => a + b.count, 0) || "—"}
												subtitle={recentSeries.length ? "Last 50 plays by day" : (scopeWarnings.length ? "Add scope: user-read-recently-played" : "Listening soon…")}
												chartType="area"
												chartData={
														recentSeries.length
																? recentSeries.map(d => ({ x: d.date.slice(5), y: d.count }))
																: Array.from({ length: 7 }, (_, i) => ({ x: `D${i+1}`, y: (i % 3) + 1 }))
												}
												xKey="x"
												yKey="y"
										/>
								</StatsGrid>

						</MainArea>
				</Wrapper>
		);
}
