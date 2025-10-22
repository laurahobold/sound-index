// components/dashboard/StatCard/index.jsx
import React from "react";
import styled from "styled-components";
import Sparkline from "./Sparkline.jsx";
import { fonts } from "../../../styles/theme.js";

const Card = styled.div`
  display: grid;
  grid-template-rows: auto auto 1fr;
  gap: 8px;
  padding: 14px;
  border-radius: 12px;
  background: ${({ theme }) => `color-mix(in oklab, ${theme.textMain} 4%, transparent)`};
  border: ${({ theme }) => `1px solid color-mix(in oklab, ${theme.textMain} 18%, transparent)`};
  min-height: 140px;
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${({ theme }) => theme.textMuted};
  font-family: ${fonts.body};
  text-transform: uppercase;
  letter-spacing: .06em;
  font-size: .78rem;
`;

const IconWrap = styled.span`
  width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center;
  svg { width: 18px; height: 18px; }
`;

const Value = styled.div`
  font-family: ${fonts.heading};
  color: ${({ theme }) => theme.textMain};
  font-size: clamp(1.4rem, 2.5vw, 1.8rem);
  line-height: 1;
`;

const Sub = styled.div`
  font-family: ${fonts.body};
  color: ${({ theme }) => theme.textMuted};
  font-size: .9rem;
`;

export default function StatCard({
		title,
		icon: Icon,
		value,
		subtitle,
		chartType = "area",
		chartData = [],
		xKey = "x",
		yKey = "y",
}) {
		return (
				<Card>
						<Head>
								<IconWrap>{Icon ? <Icon /> : null}</IconWrap>
								{title}
						</Head>

						<div>
								<Value>{value}</Value>
								{subtitle ? <Sub>{subtitle}</Sub> : null}
						</div>

						<div style={{ minHeight: 64 }}>
								<Sparkline type={chartType} data={chartData} xKey={xKey} yKey={yKey} />
						</div>
				</Card>
		);
}
