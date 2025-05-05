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

export default function PickPage({ token, playlists, setPlaylists, setSelectedTracks, setSortingStack }) {
  const navigate = useNavigate();

  function fetchPlaylists() {
    fetch("https://api.spotify.com/v1/me/playlists", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setPlaylists(data.items));
  }

  function fetchTracks(playlistId) {
    fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
		headers: { Authorization: `Bearer ${token}` }
})
.then(res => res.json())
.then(data => {
		const tracks = data.items.map(i => i.track);
		setSelectedTracks(tracks);
		setSortingStack([...tracks]);
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