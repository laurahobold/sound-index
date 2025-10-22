// src/layout/components/sidebar/index.jsx
import React, {useCallback, useMemo, useState} from "react";
import {Layout, Menu} from "antd";
import {useLocation, useNavigate} from "react-router-dom";
import {CuteSider, MenuWrapper, Wrapper} from "./styles.module.js";
import {LogoText, LogoWrap, SI} from "../../styles.module.js";
import texts from "../../../texts/text.js";
import {LayoutDashboard} from "lucide-react";
import {Logo} from "../../styles.module.js";
import UserAvatarMenu from "../../../components/UserMenu/index.jsx";

export default function AppSidebar ({
		hidden = false, tools = [],                 // [{ name, path, icon }]
		onNavigate = () => {
		}, collapsedWidth = 60, width = 260, dashboardPath = "/dashboard", token = null, setToken,
}) {
		// ✅ Hooks ALWAYS run
		const {pathname} = useLocation ();
		const navigate = useNavigate ();
		const isLoggedIn = Boolean (token || localStorage.getItem ("spotify_token"));
		const [ profilePic, setProfilePic ] = useState (null);

		const handleNavigate = useCallback ((key) => {
				if (onNavigate) onNavigate (key); else navigate (key);
		}, [ onNavigate, navigate ]);

		const toolItems = useMemo (() => ( tools || [] ).map ((t, i) => {
				const Icon = t.icon || React.Fragment;
				return {
						key: t.path || `/tool-${i}`, icon: Icon === React.Fragment ? null : <Icon size={18}/>, label: t.name,
				};
		}), [ tools ]);

		const items = useMemo (() => [ {type: "divider"},

				{key: dashboardPath, icon: <LayoutDashboard/>, label: "Dashboard"},
				{type: "group", label: "", children: toolItems}, ], [ dashboardPath, toolItems ]);

		const allKeys = useMemo (() => [ dashboardPath, ...tools.map ((t) => t.path).filter (Boolean) ], [ dashboardPath,
		                                                                                                   tools ]);

		const selectedKey = useMemo (() => {
				const match = allKeys.slice ().sort ((a, b) => b.length - a.length).find ((k) => pathname.startsWith (k));
				return match || pathname;
		}, [ pathname, allKeys ]);

		return ( <CuteSider
				$hidden={hidden}
				width={width}
				collapsedWidth={collapsedWidth}
				breakpoint="lg"
				zeroWidthTriggerStyle={{top: 10}}
		>
				<Wrapper>
						<Wrapper>
								<LogoWrap onClick={() => handleNavigate ("/")} aria-label="Home" className="sider-logo">
										{/*<Logo style={{marginRight: 10}}/>*/}
										<LogoText>{texts.main.title}</LogoText>
								</LogoWrap>

								<Menu
										mode="inline"
										selectedKeys={[ selectedKey ]}
										onClick={({key}) => handleNavigate (key)}
										items={items}
								/>
						</Wrapper>
						<MenuWrapper>
								<UserAvatarMenu
										token={token}
										setToken={setToken}
										placement="topRight"
										size={28}
										showName
										renderWhenLoggedOut="icon"
								/>
						</MenuWrapper>
				</Wrapper>
		</CuteSider> );
}
