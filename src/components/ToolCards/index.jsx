// src/components/ToolCards/index.jsx
import {memo, useMemo} from "react";
import {useNavigate} from "react-router-dom";
import {useTheme} from "styled-components";
import texts from "../../texts/text.js";
import {
		Grid, Card, Thumb, Name, Desc, Footer, Chip, Arrow, Section, Head, CardHeader
} from "./styles.module.js";
import {Space} from "antd";

const PALETTE = [ "#7357FF", "#00B2FF", "#FF8A3D", "#10B981", "#FF5C8A", "#A78BFA", "#00BFA6", "#FFC400" ];
const colorForIndex = (i) => PALETTE[i % PALETTE.length];

function ToolCards ({
		tools = texts.tools, hasToken = Boolean (localStorage.getItem ("spotify_token")), startLogin,   // optional
		onOpen,       // optional
}) {
		const navigate = useNavigate ();
		const theme = useTheme ();

		const openOrLogin = (path) => {
				if (onOpen) return onOpen (path);
				if (hasToken) return navigate (path || "/dashboard");
				try {
						sessionStorage.setItem ("si_next", path || "/dashboard");
				} catch {
				}
				return startLogin ? startLogin (path || "/dashboard") : navigate ("/about");
		};

		const decorated = useMemo (() => tools.map ((t, i) => {
				const tokenAccent = t.theme && theme && Object.prototype.hasOwnProperty.call (theme, t.theme) ? theme[t.theme] : undefined;
				const accent = tokenAccent || t.color || colorForIndex (i);
				return {...t, accent};
		}), [ tools, theme ]);

		return ( <>
				<Section>
						{/*<Head>Features</Head>*/}
						<Grid>
								{decorated.map ((tool) => {
										const Icon = tool.icon;
										return ( <Card
												key={tool.path}
												href={tool.path}
												$accent={tool.accent}
												onClick={(e) => {
														e.preventDefault ();
														openOrLogin (tool.path);
												}}
										>
												<CardHeader>
														{/* “image” area = icon on accent background */}
														<Thumb $accent={tool.accent}>
																{Icon ? <Icon className="tool-icon"/> : null}
														</Thumb>

														<h3 className="card-title">
																<Name as="span">{tool.name}</Name>
														</h3>
												</CardHeader>
												{tool.description ? ( <p className="card-body">
														<Desc as="span">{tool.description}</Desc>
												</p> ) : null}
										</Card> );
								})}
						</Grid>


				</Section>
		</> );
}

export default memo (ToolCards);
