// src/texts.js
import {PiImagesSquareThin, PiPlaylistLight, PiPlaylistThin, PiRankingLight, PiRankingThin, PiSpotifyLogoLight, PiSpotifyLogoThin} from "react-icons/pi";

const texts = {
		main: {
				title: "Sound Index", marquee: "under development",
		}, home: {
				title: "S☺und  Index",
				description: "Map your taste, curate with intent, and share what you discover.",
				description2: "Turning “I have a system” into a personality.",
				description3: "For the kind of listener who exports their stats and calls it joy.",
				description4: "The toolkit for self-aware listeners.",
				description5: "A digital toolkit for people who see playlists as projects, not products—built to analyze, organize, and perfect the soundtracks of your life.",
				getStarted: "Get Started",
				learnMore: "Learn More",
				redirecting: "Redirecting...",
		}, about: {
				title: "About This Project", description: "Here's how it works...",
		}, tools: [ {
				name: "Comparative Ranking",
				description: "Preference-based ranker: compare two tracks at a time to derive a precise full order for a playlist or your saved songs.",
				icon: PiRankingLight,
				path: "/sorter/pick",
				theme: "love",
				featured: true,

		}, {
				name: "Library Manager",
				description: "Search your library, rename inline, flip public/private, and unfollow in bulk.",
				icon: PiPlaylistLight,
				path: "/playlists",
				theme: "gold",

		}, {
				name: "Top Tracks/Artists",
				description: "A private preview of your top tracks and artists based on your library activity.",
				icon: PiSpotifyLogoLight,
				path: "/wrapped",
				theme: "foam",

		}, // {
				// 		name: "Cover Lab",
				// 		description:
				// 				"Drag-and-drop a JPG/PNG to update or create playlist covers. Auto-crop to square, safe-area guides,
				// and export to Spotify-ready 640×640.", icon: PiImagesSquareThin  , path: "/cover", theme: "iris",  },
		],
};

export default texts;
