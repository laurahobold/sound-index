import styled from "styled-components";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
    padding: 2rem;
`;

const SearchInput = styled.input`
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
`;

const PlaylistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const Card = styled.div`
  background: #fafafa;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s;
  &:hover { transform: translateY(-4px); }
`;

const Cover = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  background: #eee;
`;

const Title = styled.div`
  padding: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default function PickPage({ token, setSelectedTracks, setSortingStack, setRankedTracks }) {
		const navigate = useNavigate();
		const accessToken = token || localStorage.getItem("spotify_token");

		const [playlists, setPlaylists] = useState([]);
		const [searchTerm, setSearchTerm] = useState("");

		// Fetch playlists on mount
		useEffect(() => {
				if (!accessToken) return;
				fetch("https://api.spotify.com/v1/me/playlists?limit=50", {
						headers: { Authorization: `Bearer ${accessToken}` }
				})
				.then(res => res.json())
				.then(data => {
						if (data.items) {
								// sort by snapshot_id timestamp if available (recent first), else by name
								const sorted = data.items.sort((a, b) => {
										const t1 = a.snapshot_id ? Number(new Date(parseInt(a.snapshot_id.slice(0,8),16)*1000)) : 0;
										const t2 = b.snapshot_id ? Number(new Date(parseInt(b.snapshot_id.slice(0,8),16)*1000)) : 0;
										if (t1 !== t2) return t2 - t1;
										return a.name.localeCompare(b.name);
								});
								setPlaylists(sorted);
						}
				})
				.catch(err => console.error("Failed to load playlists", err));
		}, [accessToken]);

		// Filter by search term
		const filtered = playlists.filter(pl =>
				pl.name.toLowerCase().includes(searchTerm.toLowerCase())
		);

		// Handle selection
		const handleSelect = (id) => {
				fetch(`https://api.spotify.com/v1/playlists/${id}/tracks?limit=100`, {
						headers: { Authorization: `Bearer ${accessToken}` }
				})
				.then(res => res.json())
				.then(data => {
						const tracks = data.items.map(i => i.track).filter(t => t);
						setSelectedTracks(tracks);
						setSortingStack([...tracks]);
						setRankedTracks([]);
						navigate("/sort");
				})
				.catch(err => console.error("Failed to load tracks", err));
		};

		if (!accessToken) {
				return <Container>Please log in first.</Container>;
		}

		return (
				<Container>
						<h2>Your Playlists</h2>
						<SearchInput
								type="text"
								placeholder="Search playlists..."
								value={searchTerm}
								onChange={e => setSearchTerm(e.target.value)}
						/>
						<PlaylistGrid>
								{filtered.map(pl => (
										<Card key={pl.id} onClick={() => handleSelect(pl.id)}>
												<Cover
														src={pl.images[0]?.url || ""}
														alt={pl.name}
												/>
												<Title>{pl.name}</Title>
										</Card>
								))}
						</PlaylistGrid>
				</Container>
		);
}
