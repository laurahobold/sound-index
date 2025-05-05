import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
    padding: 2rem;
    text-align: center;
`;

const Button = styled.button`
    background-color: #1db954;
    color: white;
    margin: 0.5rem;
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
`;

export default function PickPage({ token, playlists, setPlaylists, setSelectedTracks, setSortingStack, setRankedTracks }) {
		const navigate = useNavigate();

		// Pull token from props or localStorage
		const accessToken = token || localStorage.getItem("spotify_token");

		// If no token, block usage
		if (!accessToken) {
				return <Container>Please log in first.</Container>;
		}

		function fetchPlaylists() {
				fetch("https://api.spotify.com/v1/me/playlists", {
						headers: { Authorization: `Bearer ${accessToken}` }
				})
				.then(res => res.json())
				.then(data => {
						if (!data.items) {
								console.error("❌ Failed to fetch playlists:", data);
								return;
						}
						setPlaylists(data.items);
				})
				.catch(err => {
						console.error("❌ Playlist fetch error:", err);
				});
		}

		function fetchTracks(playlistId) {
				fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
						headers: { Authorization: `Bearer ${accessToken}` }
				})
				.then(res => res.json())
				.then(data => {
						const tracks = data.items.map(i => i.track);
						setSelectedTracks(tracks);
						setSortingStack([...tracks]);       // Load into sorting stack
						setRankedTracks([]);                // ✅ Clear any previous rankings
						navigate("/sort");
				});
		}


		return (
				<Container>
						<h2>Pick a Playlist</h2>
						<Button onClick={fetchPlaylists}>Load Playlists</Button>
						{playlists.map(pl => (
								<div key={pl.id}>
										<Button onClick={() => fetchTracks(pl.id)}>{pl.name}</Button>
								</div>
						))}
				</Container>
		);
}
