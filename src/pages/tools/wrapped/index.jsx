// src/pages/tools/wrapped/index.jsx
// Wrapped Peek — Top Tracks/Artists with short/medium/long range
import React, {useEffect, useMemo, useState, useCallback} from "react";
import styled from "styled-components";
import {Tabs, Tooltip, Empty, message, Typography, Segmented} from "antd";
import {ReloadOutlined} from "@ant-design/icons";
import theme from "../../../styles/theme.js";

import {makeTrackColumns, makeArtistColumns} from "./columns.js";
import DataTable from "../../../components/Table/index.jsx";
import {getTopTracks, getTopArtists} from "../../../services/spotifyApi.js";
import {HeaderSection, SectionHeader, SectionSub} from "../../../layout/styles.module.js";
import {fonts} from "./../../../styles/theme.js";

const {Text} = Typography;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const StyledTabs = styled (Tabs)`
    .ant-tabs-tab,
    .ant-tabs,
    .ant-tabs-tab-btn {
        font-family: ${fonts.body} !important;

        &:hover,
        &:focus {
            color: ${({theme}) => theme.accent} !important;
            text-shadow: ${({theme}) => theme.accent} !important
        }


        .ant-tabs-tab-active,
        .ant-tabs-tab
        &:hover {
            color: ${({theme}) => theme.accent} !important;
        }
    }
`;

const HeadBar = styled.div`
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: baseline;
    //gap: 12px;
`;

/* simple hint style for the table footer */
const Hint = styled.div`
    color: ${({theme}) => theme.textMuted};
    font-size: 12px;
`;

/* lives ABOVE the tabs — prevents tab subtree rebuild on range change */
const ControlsBar = styled.div`
    display: flex;
    align-items: center;
    //  gap: 8px;
    margin: 6px 0 2px;

    position: sticky;
    top: 0;
    z-index: 1;
    padding: 8px 0;
        //background: ${({theme}) => `color-mix(in oklab, ${theme?.background || "#0b0b0b"} 92%, transparent)`};
    backdrop-filter: blur(6px);
        // border-bottom: 1px solid ${({theme}) => theme?.border || "rgba(255,255,255,0.08)"};
`;

const RANGE_OPTIONS = [ {label: "Short • 4w", value: "short_term"}, {label: "Medium • 6m", value: "medium_term"},
		{label: "Long • years", value: "long_term"}, ];

function labelForRange (v) {
		switch (v) {
				case "short_term":
						return "short_term (≈ last 4 weeks)";
				case "medium_term":
						return "medium_term (≈ last 6 months)";
				default:
						return "long_term (≈ several years)";
		}
}

export default function WrappedPeek ({token}) {
		const [ loading, setLoading ] = useState (false);
		const [ range, setRange ] = useState ("medium_term");
		const [ tracks, setTracks ] = useState ([]);
		const [ artists, setArtists ] = useState ([]);
		const [ activeTab, setActiveTab ] = useState ("tracks");

		const load = useCallback (async () => {
				setLoading (true);
				try {
						const [ tItems, aItems ] = await Promise.all ([ getTopTracks ({token, limit: 50, time_range: range}),
						                                                getTopArtists ({token, limit: 50, time_range: range}), ]);

						const tRows = ( tItems || [] ).map ((t, i) => ( {
								...t, rank: i + 1, key: t.id || t.uri || `t-${i}`,
						} ));

						const aRows = ( aItems || [] ).map ((a, i) => ( {
								rank: i + 1,
								key: a.id || a.uri || `a-${i}`,
								id: a.id,
								name: a.name,
								cover: a.images?.[2]?.url || a.images?.[1]?.url || a.images?.[0]?.url,
								href: a.external_urls?.spotify,
								genres: a.genres || [],
						} ));

						setTracks (tRows);
						setArtists (aRows);
				} catch (e) {
						const needsScope = e?.code === "MISSING_SCOPE" || /user-top-read/i.test (e?.message || "");
						message.error (needsScope ? "This view needs the ‘user-top-read’ permission. Log out and log in again." : "Couldn't load your Top items.");
						console.error (e);
				} finally {
						setLoading (false);
				}
		}, [ token, range ]);

		useEffect (() => {
				if (token) load ();
		}, [ token, load ]);

		const trackCols = useMemo (() => makeTrackColumns ({coverSize: 35}), []);
		const artistCols = useMemo (() => makeArtistColumns ({coverSize: 35, maxGenres: 3}), []);

		return ( <Wrapper>
				<HeadBar>
						<HeaderSection>
								<SectionHeader>Your Listening</SectionHeader>
								<SectionSub>
										Spotify affinity data. Ordered by Spotify; numbering is fixed, pagination won’t change ranks.
								</SectionSub>
						</HeaderSection>
						<ControlsBar>
								<StyledTabs
										fontFamily="ClashGrotesk-Variable"
										itemActiveColor="#a08cfd"
										itemSelectedColor="#a08cfd"
										inkBarColor="#a08cfd"
										itemHoverColor="#a08cfd"
										size="small"
										activeKey={range}
										onChange={setRange}
										tabBarGutter={8}
										style={{marginBottom: 0}}      // keep the bar tight
										items={RANGE_OPTIONS.map (opt => ( {
												key: opt.value, label: opt.label,
										} ))}
								/>

								<Tooltip title="Reload">
										<ReloadOutlined
												onClick={!loading ? load : undefined}
												style={{cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.5 : 1}}
										/>
								</Tooltip>
						</ControlsBar>
				</HeadBar>
				<StyledTabs
						fontFamily="ClashGrotesk-Variable"
						itemActiveColor="#a08cfd"
						itemSelectedColor="#a08cfd"
						inkBarColor="#a08cfd"
						itemHoverColor="#a08cfd"
						activeKey={activeTab}
						onChange={setActiveTab}
						destroyOnHidden={false}
						animated={false}
				>
						<StyledTabs.TabPane tab="Top Tracks" key="tracks">
								<DataTable
										size="small"
										rowKey="key"
										dataSource={tracks}
										columns={trackCols}
										pagination={{pageSize: 20}}
										loading={loading && activeTab === "tracks"} // overlay INSIDE the table
										locale={{emptyText: <Empty description="No top tracks for this range"/>}}
										scroll={{x: 900, y: "55vh"}}
								/>
						</StyledTabs.TabPane>

						<StyledTabs.TabPane tab="Top Artists" key="artists">
								<DataTable
										size="small"
										rowKey="key"
										dataSource={artists}
										columns={artistCols}
										pagination={{pageSize: 20}}
										loading={loading && activeTab === "artists"} // overlay INSIDE the table
										locale={{emptyText: <Empty description="No top artists for this range"/>}}
										scroll={{x: 900, y: "55vh"}}
								/>
						</StyledTabs.TabPane>
				</StyledTabs>
		</Wrapper> );
}
