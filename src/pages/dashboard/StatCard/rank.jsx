import React from "react";
import styled from "styled-components";
import { fonts } from "../../../styles/theme.js";

const Card = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 10px;
  padding: 14px;
  border-radius: 12px;
  background: ${({ theme }) => `color-mix(in oklab, ${theme.textMain} 4%, transparent)`};
  border: ${({ theme }) => `1px solid color-mix(in oklab, ${theme.textMain} 18%, transparent)`};
  min-height: 260px;
`;
const Head = styled.div`
  display:flex; align-items:baseline; justify-content:space-between;
  font-family:${fonts.body}; color:${({theme})=>theme.textMuted}; text-transform:uppercase; letter-spacing:.06em; font-size:.8rem;
`;
const List = styled.ol`
  margin: 0; padding: 0; list-style: none; display: grid; gap: 8px;
`;
const Row = styled.li`
  display: grid; grid-template-columns: 32px 1fr; gap: 10px; align-items: center;
`;
const Cover = styled.img`
  width: 32px; height: 32px; border-radius: 6px; object-fit: cover; background: ${({theme})=>`color-mix(in oklab, ${theme.textMain} 6%, transparent)`};
`;

const Title = styled.div`
  font-family:${fonts.body}; color:${({theme})=>theme.textMain}; font-size:.95rem; line-height:1.2;
`;
const Sub = styled.div`
  font-family:${fonts.body}; color:${({theme})=>theme.textMuted}; font-size:.85rem; line-height:1.2;
`;

export default function TopListCard({ title, hint = "last 4 weeks", items = [], type = "tracks" }) {
		return (
				<Card>
						<Head>
								<span>{title}</span>
								<span style={{opacity:.7}}>{items.length ? hint : ""}</span>
						</Head>
						{items.length ? (
								<List>
										{items.slice(0,5).map((it, i) => (
												<Row key={it.id || i}>
														{type === "tracks" ? (
																<Cover src={it.cover} alt="" />
														) : (
																<Cover src={it.image || it.images?.[0]?.url || ""} alt="" />
														)}
														<div>
																<Title>{type === "tracks" ? it.name : it.name}</Title>
																<Sub>{type === "tracks" ? it.artists : (it.genres?.slice(0,2).join(" • ") || "")}</Sub>
														</div>
												</Row>
										))}
								</List>
						) : (
								<div style={{opacity:.75}}>Add scope: <code>user-top-read</code>.</div>
						)}
				</Card>
		);
}
