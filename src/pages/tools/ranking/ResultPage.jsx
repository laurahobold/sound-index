import styled from "styled-components";
import {useMemo, useState} from "react";
import {ContainerHeader} from "./styles.module.js";
import {useNavigate} from "react-router-dom";
import {SectionHeader, SectionSub} from "../../../layout/styles.module.js";
import theme from "../../../styles/theme.js";
import {fonts} from "../../../styles/theme.js";

const Container = styled.div`
    padding: 2rem;
    @media (max-width: 560px) {
        padding: 0.75rem;
    }
`;

const ResultWrapper = styled.div`
    padding: 2rem;
    margin: 2rem 0;
    background: ${({theme}) => theme.secondary};
    border-radius: 2rem;
`;
const NewTitle = styled.div`

    font-family: ${fonts.heading};
    font-size: clamp(1.2rem, 2vw, 1.9rem);
    color: ${({theme}) => theme.textMain};
    font-weight: 600;
`;

const HeaderResults = styled.div`
    flex-wrap: wrap;
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media (max-width: 560px) {
        padding: 0.75rem;
    }
`;

/* Sticky action bar so buttons stay visible at the top */
const ActionBar = styled.div`

    position: sticky;
    display: flex;
    top: 0;
    z-index: 3;
    gap: 10px;

    justify-content: flex-end;
    align-items: center;
    margin: 4px 0 10px;
    backdrop-filter: blur(6px);
    width: fit-content;
    // border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const PrimaryBtn = styled.button`
    background-color: #1db954;
    color: white;
    padding: 0.6rem 1.1rem;
    border: none;
    border-radius: 10px;
    font-weight: 500;
    cursor: pointer;
    font-family: ${fonts.heading};

    &:hover {
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }
`;

const BackBtn = styled.button`
    padding: 0.6rem 1rem;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(4px);
    cursor: pointer;
    font-weight: 600;
    font-family: ${fonts.body};

    &:hover {
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }
`;

/* Multi-column list: 1/2/3 columns on desktop depending on length; always 1 on mobile */
const List = styled.ol`
    list-style: none;
    padding: 0;
    margin: 10px auto 0;
    max-width: 1200px;
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(${p => p.$cols}, minmax(280px, 1fr));
    font-family: ${fonts.body};

    @media (max-width: 900px) {
        grid-template-columns: repeat(${p => Math.min (p.$cols, 2)}, minmax(260px, 1fr));
    }
    @media (max-width: 560px) {
        grid-template-columns: 1fr; /* always single column on mobile */
        gap: 8px;
        margin-top: 6px;
    }
`;

const Item = styled.li`
    display: grid;
    grid-template-columns: 36px 64px 1fr;
    align-items: center;
    gap: 14px;
    padding: 12px 14px;
    border: 1px solid rgba(255, 255, 255, 0.10);
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    backdrop-filter: blur(4px);
    min-width: 0;
    font-family: ${fonts.body};

    &:hover {
        border-color: rgba(255, 255, 255, 0.18);
        transform: translateY(-1px);
        transition: transform 120ms ease, border-color 120ms ease;
    }

    @media (max-width: 900px) {
        grid-template-columns: 32px 60px 1fr;
        gap: 12px;
        padding: 10px 12px;
    }
    @media (max-width: 560px) {
        grid-template-columns: 56px 1fr;
        gap: 12px;
        padding: 10px 12px;
    }
    @media (max-width: 360px) {
        grid-template-columns: 48px 1fr;
        gap: 10px;
        padding: 8px 10px;
    }
`;

const IndexBadgeDesktop = styled.div`
    width: 36px;
    text-align: right;
    font-weight: 900;
    font-variant-numeric: tabular-nums;
    font-family: ${fonts.body};
    font-size: clamp(.95rem, 2.4vw, 1.05rem);
    @media (max-width: 900px) {
        width: 32px;
    }
    @media (max-width: 560px) {
        display: none;
    }
`;

const CoverWrap = styled.div`
    position: relative;
    width: 64px;
    height: 64px;
    border-radius: 8px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.06);
    flex: 0 0 auto;
    @media (max-width: 900px) {
        width: 60px;
        height: 60px;
    }
    @media (max-width: 560px) {
        width: 56px;
        height: 56px;
    }
    @media (max-width: 360px) {
        width: 48px;
        height: 48px;
        border-radius: 6px;
    }
`;

const Cover = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
`;

const IndexBadgeMobile = styled.div`
    position: absolute;
    bottom: 4px;
    right: 4px;
    min-width: 18px;
    padding: 2px 6px;
    border-radius: 10px;
    font-variant-numeric: tabular-nums;
    font-size: 12px;
    line-height: 1;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    display: none;
    font-family: ${fonts.body};
    //font-size: clamp(.95rem, 2.4vw, 1.05rem);
    @media (max-width: 560px) {
        display: inline-block;
    }
    @media (max-width: 360px) {
        font-size: 11px;
        padding: 2px 5px;
    }
`;

const Meta = styled.div` min-width: 0;
    display: grid;
    gap: 4px; `;
const Title = styled.div`
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: ${fonts.heading};
    font-size: clamp(1rem, 2.4vw, 1.05rem);
    @media (max-width: 560px) {
        font-size: 0.95rem;
    }
    @media (max-width: 360px) {
        font-size: 0.9rem;
    }
`;
const Artists = styled.div`
    font-size: 0.9rem;
    opacity: 0.8;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    @media (max-width: 560px) {
        font-size: 0.85rem;
    }
    @media (max-width: 360px) {
        font-size: 0.8rem;
    }
`;

export default function ResultPage ({token, rankedTracks}) {
		const navigate = useNavigate ();
		const [ successMessage, setSuccessMessage ] = useState ("");

		const tracks = useMemo (() => {
				if (Array.isArray (rankedTracks) && rankedTracks.length) return rankedTracks;
				try {
						return JSON.parse (sessionStorage.getItem ("si_rankedTracks") || "[]");
				} catch {
						return [];
				}
		}, [ rankedTracks ]);

		/* columns heuristic: 1 col if small list, 2 if medium, 3 if large */
		const cols = useMemo (() => {
				const n = tracks.length;
				if (n >= 60) return 3;
				if (n >= 20) return 2;
				return 1;
		}, [ tracks.length ]);
		const baseName = useMemo (() => ( sessionStorage.getItem ("si_selectedPlaylistName")?.trim () || "Ranked Playlist" ), []);
		const displayName = `${baseName}: ranked`;

		function createRankedPlaylist () {
				const accessToken = token || localStorage.getItem ("spotify_token");

				fetch ("https://api.spotify.com/v1/me", {
						headers: {Authorization: `Bearer ${accessToken}`}
				}).then (res => res.json ()).then (user => {
						return fetch (`https://api.spotify.com/v1/users/${user.id}/playlists`, {
								method: "POST", headers: {
										Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json"
								}, body: JSON.stringify ({
										name: displayName, // ← uses the same name shown at the top
										description: "Sorted with SoundIndex – Ranking tool", public: false
								})
						}).then (res => res.json ()).then (pl => {
								const uris = tracks.map (t => t.uri);
								return fetch (`https://api.spotify.com/v1/playlists/${pl.id}/tracks`, {
										method: "POST", headers: {
												Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json"
										}, body: JSON.stringify ({uris})
								});
						}).then (() => setSuccessMessage ("✅ Playlist saved to your Spotify account!"));
				});
		}

		return ( <Container>
				<ContainerHeader>
						<NewTitle>Results</NewTitle>
				</ContainerHeader>
				<ResultWrapper>
						<HeaderResults>
								<NewTitle>{displayName}</NewTitle>
								<ActionBar>
										{successMessage && <span>{successMessage}</span>}
										<PrimaryBtn onClick={createRankedPlaylist}>Create Playlist</PrimaryBtn>
								</ActionBar>
						</HeaderResults>
						<List $cols={cols}>
								{tracks.map ((track, i) => ( <Item key={track.id ?? i}>
										<IndexBadgeDesktop>{i + 1}</IndexBadgeDesktop>
										<CoverWrap>
												<Cover
														src={track.cover || "data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"}
														alt={track.name || "cover"}
														loading="lazy"
												/>
												<IndexBadgeMobile>{i + 1}</IndexBadgeMobile>
										</CoverWrap>
										<Meta>
												<Title title={track.name}>{track.name}</Title>
												<Artists title={track.artists}>{track.artists}</Artists>
										</Meta>
								</Item> ))}
						</List>
						<ActionBar>
								<BackBtn onClick={() => navigate ("/sorter/pick")}>← Pick another playlist</BackBtn>
						</ActionBar>
				</ResultWrapper>
		</Container> );
}
