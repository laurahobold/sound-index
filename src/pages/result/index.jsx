import styled from "styled-components";
import { useState } from "react";

const Container = styled.div`
    padding: 2rem;
    text-align: center;
`;

const Button = styled.button`
    background-color: #1db954;
    color: white;
    margin-top: 1rem;
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
`;

export default function ResultPage({ token, rankedTracks }) {
		const [successMessage, setSuccessMessage] = useState("aaaaaaaaaaaa");

		function createRankedPlaylist() {
				fetch("https://api.spotify.com/v1/me", {
						headers: { Authorization: `Bearer ${token}` }
				})
				.then(res => res.json())
				.then(user => {
						fetch(`https://api.spotify.com/v1/users/${user.id}/playlists`, {
								method: "POST",
								headers: {
										Authorization: `Bearer ${token}`,
										"Content-Type": "application/json"
								},
								body: JSON.stringify({
										name: "Ranked Playlist",
										description: "Sorted with Bias Sorter App",
										public: false
								})
						})
						.then(res => res.json())
						.then(pl => {
								const uris = rankedTracks.map(t => t.uri);
								fetch(`https://api.spotify.com/v1/playlists/${pl.id}/tracks`, {
										method: "POST",
										headers: {
												Authorization: `Bearer ${token}`,
												"Content-Type": "application/json"
										},
										body: JSON.stringify({ uris })
								}).then(() => {
										setSuccessMessage("✅ Playlist saved to your Spotify account!");
								});
						});
				});
		}

		return (
				<Container>
						<h2>Your Ranked Playlist</h2>
						<ol style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
								{rankedTracks.map((track, i) => (
										<li key={i}>{i + 1}. {track.name}</li>
								))}
						</ol>

						{successMessage && <p style={{ color: "green", marginTop: "1rem" }}>{successMessage}</p>}

						<Button onClick={createRankedPlaylist}>Create Playlist on Spotify</Button>
				</Container>
		);
}
