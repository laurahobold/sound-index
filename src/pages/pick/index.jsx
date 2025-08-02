import styled from "styled-components";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {Card, Cover, PlaylistGrid, SearchInput, Title, Container, SectionTitle, ContainerHeader} from "./styles.module.js";



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
						<ContainerHeader><SectionTitle>Pick your playlist</SectionTitle>
								<SearchInput
										type="text"
										placeholder="Search playlists..."
										value={searchTerm}
										onChange={e => setSearchTerm(e.target.value)}
								/></ContainerHeader>

						<PlaylistGrid>
								{filtered.map(pl => (
										<Card key={pl.id} onClick={() => handleSelect(pl.id)}>
												<Cover
														src={pl.images && pl.images.length > 0 ? pl.images[0].url : ""}
														alt={pl.name}
												/>
												<Title>{pl.name}</Title>
										</Card>
								))}
						</PlaylistGrid>
				</Container>
		);
}
