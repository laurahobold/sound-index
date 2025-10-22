// components/dashboard/Sparkline.jsx
import React from "react";
import {
		ResponsiveContainer, AreaChart, Area, LineChart, Line, Tooltip, YAxis, XAxis
} from "recharts";

/**
 * Minimal, theme-friendly tiny chart.
 * - No explicit colors: it inherits currentColor via CSS (keeps your theme consistent).
 */
export default function Sparkline({ type = "area", data = [], xKey = "x", yKey = "y" }) {
		const common = {
				data,
				margin: { top: 6, right: 6, left: 6, bottom: 0 },
		};

		const axisStyle = { fontSize: 10, opacity: 0.6 };

		if (type === "line") {
				return (
						<ResponsiveContainer width="100%" height={70}>
								<LineChart {...common}>
										<XAxis dataKey={xKey} hide />
										<YAxis hide />
										<Tooltip
												cursor={{ strokeOpacity: 0.08 }}
												contentStyle={{ background: "rgba(0,0,0,.6)", border: "none", borderRadius: 8, color: "#fff" }}
												labelStyle={{ color: "#fff" }}
												wrapperStyle={{ outline: "none" }}
										/>
										<Line type="monotone" dataKey={yKey} stroke="currentColor" strokeWidth={2} dot={false} />
								</LineChart>
						</ResponsiveContainer>
				);
		}

		return (
				<ResponsiveContainer width="100%" height={70}>
						<AreaChart {...common}>
								<XAxis dataKey={xKey} hide />
								<YAxis hide />
								<Tooltip
										cursor={{ strokeOpacity: 0.08 }}
										contentStyle={{ background: "rgba(0,0,0,.6)", border: "none", borderRadius: 8, color: "#fff" }}
										labelStyle={{ color: "#fff" }}
										wrapperStyle={{ outline: "none" }}
								/>
								<defs>
										<linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
												{/* gradient uses currentColor; browsers blend it nicely */}
												<stop offset="0%" stopColor="currentColor" stopOpacity="0.32" />
												<stop offset="100%" stopColor="currentColor" stopOpacity="0.04" />
										</linearGradient>
								</defs>
								<Area
										type="monotone"
										dataKey={yKey}
										stroke="currentColor"
										strokeWidth={2}
										fill="url(#sparkFill)"
										isAnimationActive
								/>
						</AreaChart>
				</ResponsiveContainer>
		);
}
