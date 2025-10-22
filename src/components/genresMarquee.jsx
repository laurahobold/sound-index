// components/GenresMarquee/index.jsx
import React, { useEffect, useMemo, useState } from "react";
import Marquee from "react-fast-marquee";
import styled from "styled-components";
import { AsteriskIcon } from "lucide-react";
import { fonts } from "./../src/styles/theme.js";

/** ----- Static seeds so it renders instantly (even logged out) ----- */
const STATIC_SEEDS = [
		"acoustic","afrobeat","alt-rock","alternative","ambient","anime","black-metal","bluegrass","blues","bossanova","brazil",
		"breakbeat","british","cantopop","chicago-house","children","chill","classical","club","comedy","country","dance","dancehall",
		"death-metal","deep-house","detroit-techno","disco","disney","drum-and-bass","dub","dubstep","edm","electro","electronic","emo",
		"folk","forro","french","funk","garage","german","gospel","goth","grindcore","groove","grunge","guitar","happy","hard-rock",
		"hardcore","hardstyle","heavy-metal","hip-hop","holidays","honky-tonk","house","idm","indian","indie","indie-pop","industrial",
		"iranian","j-dance","j-idol","j-pop","j-rock","jazz","k-pop","kids","latin","latino","malay","mandopop","metal","metalcore",
		"minimal-techno","movies","mpb","new-age","opera","pagode","party","philippines-opm","piano","pop","pop-film","post-dubstep",
		"power-pop","progressive-house","psych-rock","punk","punk-rock","r-n-b","rainy-day","reggae","reggaeton","road-trip","rock",
		"rock-n-roll","rockabilly","romance","sad","salsa","samba","sertanejo","show-tunes","singer-songwriter","ska","sleep","soul",
		"soundtracks","spanish","study","summer","swedish","synth-pop","tango","techno","trance","trip-hop","turkish","work-out","world-music"
];

// “alt-rock” → “Alt Rock”
function titleize(slug = "") {
		return slug
		.split(/[\s-]+/)
		.map((s) => (s ? s[0].toUpperCase() + s.slice(1) : s))
		.join(" ");
}

/** Small hook so single and double rows share the same data */
function useGenreSeeds(shuffle) {
		const initial = useMemo(
				() => (shuffle ? shuffleArray(STATIC_SEEDS) : [...STATIC_SEEDS]).map(titleize),
				[shuffle]
		);
		const [genres, setGenres] = useState(initial);

		useEffect(() => {
				let cancelled = false;

				async function maybeRefreshFromAPI() {
						const token = localStorage.getItem("spotify_token");
						if (!token) return;

						try {
								const res = await fetch(
										"https://api.spotify.com/v1/recommendations/available-genre-seeds",
										{ headers: { Authorization: `Bearer ${token}` } }
								);
								if (!res.ok) return;

								const json = await res.json();
								const live = Array.isArray(json?.genres) ? json.genres : [];
								if (live.length && !cancelled) {
										const merged = dedupe([...live, ...STATIC_SEEDS]).sort((a, b) => a.localeCompare(b));
										setGenres((shuffle ? shuffleArray(merged) : merged).map(titleize));
								}
						} catch {
								// keep static list on any error
						}
				}

				maybeRefreshFromAPI();
				return () => { cancelled = true; };
		}, [shuffle]);

		return genres;
}

/** ----- Single-row marquee (your current one) ----- */
export default function GenresMarquee({
		speed = 32,
		pauseOnHover = false,
		className,
		separator = <AsteriskIcon size={18} />,
		shuffle = true,
		direction = "left" // "left" | "right"
}) {
		const genres = useGenreSeeds(shuffle);
		return (
				<Bar className={className} role="region" aria-label="Spotify genres">
						<Marquee
								gradient={false}
								speed={speed}
								pauseOnHover={pauseOnHover}
								autoFill
								direction={direction}
						>
								{genres.map((g, i) => (
										<Chunk key={`${g}-${i}`}>
												<Text>{g}</Text>
												<Sep aria-hidden="true">{separator}</Sep>
										</Chunk>
								))}
						</Marquee>
				</Bar>
		);
}

/** ----- Two stacked marquees, opposite directions ----- */
export function GenresMarqueeDouble({
		className,
		pauseOnHover = false,
		separator = <AsteriskIcon size={18} />,
		shuffle = true,
		speedTop = 30,
		speedBottom = 36, // slightly different speeds so they desync nicely
}) {
		const genres = useGenreSeeds(shuffle);
		return (
				<Stack className={className} role="region" aria-label="Spotify genres (double)">
						<Row $withBorder={false}>
								<Marquee gradient={false} speed={speedTop} pauseOnHover={pauseOnHover} autoFill direction="left">
										{genres.map((g, i) => (
												<Chunk key={`top-${g}-${i}`}>
														<Text>{g}</Text>
												</Chunk>
										))}
								</Marquee>
						</Row>

						<Row $withBorder>
								<Marquee gradient={false} speed={speedBottom} pauseOnHover={pauseOnHover} autoFill direction="right">
										{genres.map((g, i) => (
												<Chunk key={`bot-${g}-${i}`}>
														{'  '}	<Text>{g}</Text>{'  '}
												</Chunk>
										))}
								</Marquee>
						</Row>
				</Stack>
		);
}

/* -------- helpers -------- */
function dedupe(arr) {
		const seen = new Set();
		const out = [];
		for (const x of arr) {
				if (!seen.has(x)) {
						seen.add(x);
						out.push(x);
				}
		}
		return out;
}
function shuffleArray(arr) {
		const a = [...arr];
		for (let i = a.length - 1; i > 0; i--) {
				const j = (Math.random() * (i + 1)) | 0;
				[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
}

/* -------- styles -------- */
const Stack = styled.div`
    max-width: 100svw;
  display: grid;
  grid-template-rows: auto auto;
    overflow: hidden;

`;

const Row = styled.div`
  max-width: 100svw;
    background: ${({theme}) => theme.textMain};
  ${({ $withBorder = true, theme }) =>
		$withBorder
				? `border-bottom: 1px solid color-mix(in oklab, ${theme.textMain} 12%, transparent);`
				: "border-bottom: none;"}
`;


/* -------- styles -------- */
const Bar = styled.div`
    max-width: 100vw;
    overflow: clip;

    display: block;
    background: ${({theme}) => theme.textMain};
    border-bottom: 1px solid color-mix(in oklab, ${({theme}) => theme.textMain} 12%, transparent);
`;

const Chunk = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 15px 0;
    max-width: 100svw;
overflow: clip;
`;

const Text = styled.span`
   // text-transform: uppercase;
    font-weight: 600;
		font-family: ${fonts.heading} !important;
    user-select: none;
    font-size: 1rem;
    color: ${({theme}) => theme.background};
    white-space: nowrap;
		border: 2px solid ${({theme}) => `color-mix(in oklab, ${theme.background} 96%, transparent)`};
		padding: 5px 14px;
		border-radius: 30px;
`;

const Sep = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: ${({theme}) => theme.accent};
`;
