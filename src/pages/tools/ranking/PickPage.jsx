import {useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
		Card, Cover, PlaylistGrid, Title, Container, ContainerHeader, ToolsSub, PlaylistCard, ToggleBar, ToggleBtn,
} from "./styles.module.js";
import SearchBar from "../../../components/searchButton/searchInput.jsx";
import texts from "../../../texts/text.js";

import {
		listUserPlaylists, getPlaylistTracks, searchAlbums, getAlbumTracks, getRecentlyPlayedAlbums,
} from "../../../services/spotifyApi.js";
import {HeaderSection, SectionHeader, SectionSub} from "../../../layout/styles.module.js";

export default function PickPage ({token, setSortingStack, setRankedTracks}) {
		const navigate = useNavigate ();
		const accessToken = token || localStorage.getItem ("spotify_token");

		const [ mode, setMode ] = useState ("playlists");

		// playlists
		const [ playlists, setPlaylists ] = useState ([]);
		const [ plLoading, setPlLoading ] = useState (true);

		// albums/search
		const [ searchTerm, setSearchTerm ] = useState ("");
		const [ recentAlbums, setRecentAlbums ] = useState ([]);
		const [ recLoading, setRecLoading ] = useState (false);
		const [ albumResults, setAlbumResults ] = useState ([]);
		const [ albLoading, setAlbLoading ] = useState (false);

		// --- load playlists once
		useEffect (() => {
				let mounted = true;
				if (!accessToken) {
						setPlLoading (false);
						return;
				}
				( async () => {
						try {
								const items = await listUserPlaylists ({token: accessToken, all: true, limit: 50});
								if (mounted) setPlaylists (items);
						} catch (e) {
								console.error (e);
						} finally {
								if (mounted) setPlLoading (false);
						}
				} ) ();
				return () => {
						mounted = false;
				};
		}, [ accessToken ]);

		// --- always prefetch recent albums when entering Albums (or on first render if Albums is default)
		useEffect (() => {
				if (mode !== "albums") return;
				if (!accessToken) return;
				if (recentAlbums.length > 0 || recLoading) return;

				let cancelled = false;
				setRecLoading (true);
				( async () => {
						try {
								// fetch 5 items for the placeholder
								const rec = await getRecentlyPlayedAlbums ({token: accessToken, limit: 5});
								if (!cancelled) setRecentAlbums (rec);
						} catch (e) {
								if (!cancelled) {
										console.error ("recent albums failed", e);
										setRecentAlbums ([]);
								}
						} finally {
								if (!cancelled) setRecLoading (false);
						}
				} ) ();

				return () => {
						cancelled = true;
				};
		}, [ mode, accessToken, recLoading, recentAlbums.length ]);

		// --- album search (debounced). If query is empty, we *don’t* search; we show recent.
		useEffect (() => {
				if (mode !== "albums") return;
				if (!accessToken) return;

				const q = searchTerm.trim ();
				if (!q) {
						setAlbumResults ([]);
						setAlbLoading (false);
						return;
				}

				let cancelled = false;
				setAlbLoading (true);
				const t = setTimeout (async () => {
						try {
								const res = await searchAlbums (q, {token: accessToken, limit: 24});
								if (!cancelled) setAlbumResults (res);
						} catch (e) {
								if (!cancelled) {
										console.error ("album search failed", e);
										setAlbumResults ([]);
								}
						} finally {
								if (!cancelled) setAlbLoading (false);
						}
				}, 300);

				return () => {
						cancelled = true;
						clearTimeout (t);
				};
		}, [ mode, searchTerm, accessToken ]);

		const filteredPlaylists = useMemo (() => {
				const q = searchTerm.toLowerCase ();
				return playlists.filter ((pl) => ( pl.name || "" ).toLowerCase ().includes (q));
		}, [ playlists, searchTerm ]);

		if (!accessToken) {
				return ( <Container>
								<ContainerHeader>
										<SectionTitle>Pick what to rank</SectionTitle>
								</ContainerHeader>
								<p>Log in with Spotify to continue.</p>
						</Container> );
		}

		async function goSort (tracks, label) {
				sessionStorage.setItem ("si_selectedPlaylistName", label || "");
				if (typeof setSortingStack === "function") setSortingStack (tracks);
				if (typeof setRankedTracks === "function") setRankedTracks ([]);
				sessionStorage.setItem ("si_sortingStack", JSON.stringify (tracks));
				navigate ("/sorter/sort", {state: {tracks}});
		}

		async function handleSelectPlaylist (id, name) {
				try {
						const tracks = await getPlaylistTracks (id, {token: accessToken, all: true, limit: 100});
						await goSort (tracks, name);
				} catch (e) {
						console.error (e);
				}
		}

		async function handleSelectAlbum (id, name) {
				try {
						const tracks = await getAlbumTracks (id, {token: accessToken});
						await goSort (tracks, name);
				} catch (e) {
						console.error (e);
				}
		}

		// tolerate both value and event
		const handleSearchChange = (v) => {
				const next = typeof v === "string" ? v : ( v && v.target && typeof v.target.value === "string" ? v.target.value : "" );
				setSearchTerm (next);
		};
		console.log (recentAlbums)
		useEffect (() => {
				if (mode !== "albums" || !accessToken) return;
				if (recentAlbums.length > 0 || recLoading) return;

				let cancelled = false;
				setRecLoading (true);
				( async () => {
						try {
								const rec = await getRecentlyPlayedAlbums ({token: accessToken, limit: 5});
								if (!cancelled) setRecentAlbums (rec);
						} finally {
								if (!cancelled) setRecLoading (false);
						}
				} ) ();

				return () => {
						cancelled = true;
				};
		}, [ mode, accessToken, recentAlbums.length, recLoading ]);

		return ( <Container>
						<HeaderSection>
								<SectionHeader>What would you like to rank?</SectionHeader>
								<SectionSub>{texts.tools[0].description}</SectionSub>
						</HeaderSection>
						<ContainerHeader>
								<ToggleBar role="tablist" aria-label="Choose source">
										<ToggleBtn
												role="tab"
												data-active={mode === "playlists"}
												aria-selected={mode === "playlists"}
												onClick={() => setMode ("playlists")}
										>
												Playlists
										</ToggleBtn>
										<ToggleBtn
												role="tab"
												data-active={mode === "albums"}
												aria-selected={mode === "albums"}
												onClick={() => {
														setMode ("albums");
														setSearchTerm ("");        // <<< force empty query so recents show
														setAlbumResults?.([]);    // optional: clear old album results
												}}
										>
												Albums
										</ToggleBtn>
								</ToggleBar>

								<SearchBar
										value={searchTerm}
										onChange={handleSearchChange}
										onClear={() => setSearchTerm ("")}
										placeholder={mode === "playlists" ? "Search your playlists…" : "Search albums on Spotify…"}
								/>
						</ContainerHeader>

						{mode === "playlists" ? ( plLoading ? (
										<ToolsSub aria-live="polite">Loading your playlists…</ToolsSub> ) : ( <PlaylistGrid>
												{filteredPlaylists.map ((pl) => (
														<Card key={pl.id} onClick={() => handleSelectPlaylist (pl.id, pl.name)}>
																<Cover src={pl.images?.[0]?.url || ""} alt={pl.name || "Playlist cover"}/>
																<PlaylistCard>
																		<Title>{pl.name}</Title>
																		{pl?.tracks?.total != null && <ToolsSub>({pl.tracks.total})</ToolsSub>}
																</PlaylistCard>
														</Card> ))}
										</PlaylistGrid> ) ) : ( () => {
								const q = searchTerm.trim ();

								// Empty query -> show recent albums placeholder
								// Empty query -> show recent albums placeholder (no loading text)
								if (!q) {
										const hasRecent = Array.isArray (recentAlbums) && recentAlbums.length > 0;

										// helpful debug you WILL see:
										console.log ("[Albums render]", {q, hasRecent, recLoading, recentAlbumsLen: recentAlbums?.length});

										return ( <PlaylistGrid>
														{hasRecent ? ( recentAlbums.map ((al) => {
																		const year = al.release_date?.slice (0, 4) || "";
																		const cover = al.images?.[0]?.url || "";
																		return ( <Card key={al.id} onClick={() => handleSelectAlbum (al.id, al.name)}>
																						<Cover src={cover} alt={al.name || "Album cover"}/>
																						<PlaylistCard>
																								<Title>{al.name}</Title>
																								<ToolsSub>
																										{al.artists}
																										{year ? ` • ${year}` : ""}
																										{al.total_tracks ? ` • ${al.total_tracks} tracks` : ""}
																								</ToolsSub>
																						</PlaylistCard>
																				</Card> );
																}) ) : null}
												</PlaylistGrid> );
								}


								// Has query -> show search results
								if (albLoading) return <ToolsSub aria-live="polite">Searching albums…</ToolsSub>;
								return ( <PlaylistGrid>
												{albumResults.map ((al) => {
														const year = al.release_date?.slice (0, 4) || "";
														const cover = al.images?.[0]?.url || "";
														return ( <Card key={al.id} onClick={() => handleSelectAlbum (al.id, al.name)}>
																		<Cover src={cover} alt={al.name || "Album cover"}/>
																		<PlaylistCard>
																				<Title>{al.name}</Title>
																				<ToolsSub>
																						{al.artists}
																						{year ? ` • ${year}` : ""}
																						{al.total_tracks ? ` • ${al.total_tracks} tracks` : ""}
																				</ToolsSub>
																		</PlaylistCard>
																</Card> );
												})}
												{albumResults.length === 0 && !albLoading && (
														<ToolsSub style={{padding: "0 0.75rem"}}>No albums found. Try another query.</ToolsSub> )}
										</PlaylistGrid> );
						} ) ()}
				</Container> );
}
