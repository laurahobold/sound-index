import React from "react";
import styled, { useTheme } from "styled-components";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
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
  display: flex; align-items: baseline; justify-content: space-between;
  font-family: ${fonts.body};
  color: ${({ theme }) => theme.textMuted};
  text-transform: uppercase; letter-spacing: .06em; font-size: .8rem;
`;

const Legend = styled.ul`
  list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; 
  li { display: flex; align-items: center; gap: 8px; font-family: ${fonts.body}; color: ${({theme})=>theme.textMain}; font-size: .92rem; }
  i { display:inline-block; width:12px; height:12px; border-radius: 3px;
      align-content: center;
		  justify-content: center; }
`;

export default function GenresPieCard({ title = "Top Genres", data = [] }) {
		const theme = useTheme();
		const palette = [
				theme.accent,
				theme.primary || theme.accent,
				theme.secondary || "color-mix(in oklab, var(--accent, #f0f), transparent 40%)",
				"color-mix(in oklab, " + theme.accent + " 60%, black 20%)",
				"color-mix(in oklab, " + theme.accent + " 40%, white 20%)",
				"color-mix(in oklab, " + theme.textMain + " 30%, transparent 60%)",
		];

		return (
				<Card>
						<Head>
								<span>{title}</span>
								<span style={{opacity:.7}}>{data.length ? "last 4 weeks" : ""}</span>
						</Head>

						{data.length ? (
								<div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, minHeight:200}}>
										<div>
												<ResponsiveContainer width="100%" height={200}>
														<PieChart>
																<Tooltip
																		formatter={(v, n) => [v, n]}
																		contentStyle={{ background: "rgb(227,227,227)", border: "none", borderRadius: 8, color: "#ffffff" }}
																		labelStyle={{ color: "#fff" }}
																		wrapperStyle={{ outline: "none" }}
																/>
																<Pie
																		data={data}
																		dataKey="value"
																		nameKey="name"
																		innerRadius={50}
																		outerRadius={80}
																		paddingAngle={2}
																		stroke="none"
																		isAnimationActive
																>
																		{data.map((_, i) => <Cell key={i} fill={palette[i % palette.length]} />)}
																</Pie>
														</PieChart>
												</ResponsiveContainer>
										</div>
										<Legend>
												{data.map((d, i) => (
														<li key={d.name}>
																<i style={{background: palette[i % palette.length]}} />
																{d.name} <span style={{marginLeft:"auto", opacity:.7}}>{d.value}</span>
														</li>
												))}
										</Legend>
								</div>
						) : (
								<div style={{opacity:.75}}>Add scope: <code>user-top-read</code> to show your genres.</div>
						)}
				</Card>
		);
}
