import React, {useEffect, useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {Dropdown, Avatar, theme, Button, Layout as AntLayout} from "antd";
import {UserOutlined} from "@ant-design/icons";
import texts from "../texts/text.js";
import {
		Shell, Header, Content, Crumbs, InnerCard, AvatarWrap, LogoWrap, Nav, NavList, NavItem, NavLink, Burger, BurgerIcon, MobilePanel, MobileList, MobileLink, LabelWrap, MobileOverlay, SI, LogoText, Logo
} from "./styles.module.js";

import DecryptedText from "../components/DecryptedText.jsx";
import AppSidebar from "./components/sidebar/index.jsx"; // keep this path if that's where your sidebar is

import {startLogin, spotifyFetch} from "../services/index.js";
import UserAvatarMenu from "../components/UserMenu/index.jsx";

const navItems = [ {key: "/", label: "Home"}, {key: "/about", label: "About"}, ];

function useIsPhone (max = 680) {
		const [ isPhone, setIsPhone ] = useState (typeof window !== "undefined" ? window.innerWidth <= max : false);
		useEffect (() => {
				const onResize = () => setIsPhone (window.innerWidth <= max);
				window.addEventListener ("resize", onResize);
				return () => window.removeEventListener ("resize", onResize);
		}, [ max ]);
		return isPhone;
}

// Link with your DecryptedText effect
function DecryptLink ({text, active, onClick, asMobile = false}) {
		const Comp = asMobile ? MobileLink : NavLink;
		return ( <Comp
				type="button"
				data-active={active ? "true" : "false"}
				onClick={onClick}
				onKeyDown={(e) => e.key === "Enter" && onClick?.()}
				aria-current={active ? "page" : undefined}
				role="link"
		>
				<LabelWrap>
						<p className="ghost">{text}</p>
						<DecryptedText
								text={text}
								animateOn="hover"
								className="nav-revealed"
								encryptedClassName="nav-encrypted"
								parentClassName="anim"
						/>
				</LabelWrap>
		</Comp> );
}

export default function Layout ({children, token, setToken}) {
		const navigate = useNavigate ();
		const location = useLocation ();
		const isPhone = useIsPhone ();

		const {
				token: {colorBgContainer, borderRadiusLG, boxShadowSecondary},
		} = theme.useToken ();

		const [ profilePic, setProfilePic ] = useState (null);
		const [ displayName, setDisplayName ] = useState ("");
		const isLoggedIn = Boolean (token || localStorage.getItem ("spotify_token"));
		const [ menuOpen, setMenuOpen ] = useState (false);

		// compute these EARLY so we can use them below safely
		const isHome = location.pathname === "/";
		const showSidebar = !isHome && isLoggedIn && !isPhone; // sidebar on every non-home page (when logged
		// in and not
		// phone)
		const showHeader = !showSidebar; // hide header whenever sidebar is visible
		// Load basic profile when logged in
		useEffect (() => {
				if (!isLoggedIn) return;
				const accessToken = token || localStorage.getItem ("spotify_token");
				spotifyFetch ("https://api.spotify.com/v1/me", {token: accessToken}).then ((r) => r.json ()).then ((me) => {
						setProfilePic (me?.images?.[0]?.url ?? null);
						setDisplayName (me?.display_name || me?.id || "");
				}).catch (() => {
						setProfilePic (null);
						setDisplayName ("");
				});
		}, [ token, isLoggedIn ]);

		// Close mobile panel on route change (single effect)
		useEffect (() => {
				setMenuOpen (false);
		}, [ location.pathname ]);

		const userMenu = {
				items: [ {type: "divider"}, {key: "logout", danger: true, label: "Log out"}, ], onClick: ({key}) => {
						if (key === "logout") {
								localStorage.removeItem ("spotify_token");
								localStorage.removeItem ("spotify_scope");
								localStorage.removeItem ("pkce_verifier");
								setToken?.(null);
								setProfilePic (null);
								setDisplayName ("");
								navigate ("/");
						}
				},
		};

		const selectedKey = location.pathname === "/" ? "/" : navItems.find ((i) => i.key !== "/" && location.pathname.startsWith (i.key))?.key || "/";

		const crumbs = buildCrumbs (location.pathname);

		const loginWithSpotify = () => {
				const next = location.pathname + location.search;
				startLogin (next);
		};

		return ( <Shell style={{minHeight: '100vh'}}>
				<>
						{showHeader && ( <Header>
								{/* Left: brand */}
								<LogoWrap onClick={() => navigate ("/")} aria-label="Home">
										{/*<Logo style={{marginRight: 10}}/>*/}
										<LogoText>{texts.main.title}</LogoText>
								</LogoWrap>

								{/*/!* Center: desktop nav *!/*/}
								{/*<Nav aria-label="Primary">*/}
								{/*		<NavList>*/}
								{/*				{navItems.map ((item) => ( <NavItem key={item.key}>*/}
								{/*						<DecryptLink*/}
								{/*								text={item.label}*/}
								{/*								active={selectedKey === item.key}*/}
								{/*								onClick={() => navigate (item.key)}*/}
								{/*						/>*/}
								{/*				</NavItem> ))}*/}
								{/*		</NavList>*/}
								{/*</Nav>*/}

								{/*/!* Mobile: burger *!/*/}
								{/*<Burger*/}
								{/*		type="button"*/}
								{/*		aria-label="Menu"*/}
								{/*		aria-expanded={menuOpen}*/}
								{/*		onClick={() => setMenuOpen ((v) => !v)}*/}
								{/*>*/}
								{/*		<BurgerIcon/>*/}
								{/*		Menu*/}
								{/*</Burger>*/}

								<UserAvatarMenu
										token={token}
										setToken={setToken}
										placement="bottomRight"
										size={32}
										className="header-avatar"   // optional for styling hook
								/>
						</Header> )}

						{/* Mobile panel only when header is visible */}
						{showHeader && ( <>
								<MobileOverlay data-open={menuOpen} onClick={() => setMenuOpen (false)}/>
								<MobilePanel data-open={menuOpen}>
										<MobileList>
												{navItems.map ((item) => ( <li key={item.key}>
														<DecryptLink
																asMobile
																text={item.label}
																active={selectedKey === item.key}
																onClick={() => {
																		setMenuOpen (false);
																		navigate (item.key);
																}}
														/>
												</li> ))}

										</MobileList>
								</MobilePanel>
						</> )}

						{/* Main area */}
						{isHome ? ( <Content $isHero>{children}</Content> ) : ( <AntLayout>
								<AppSidebar
										collapsible
										hidden={!showSidebar}            // hide/show sidebar correctly
										tools={texts.tools}
										onNavigate={(path) => navigate (path)}
								/>
								<Content $isHero={false}>
										<InnerCard $bg={colorBgContainer} $radius={borderRadiusLG} $shadow={boxShadowSecondary}>
												{!isHome && <Crumbs items={crumbs}/>}
												{children}
										</InnerCard>
								</Content>

						</AntLayout> )}

				</>
		</Shell> );
}

function buildCrumbs (pathname) {
		const parts = pathname.split ("/").filter (Boolean);
		const map = {dashboard: "Dashboard", pick: "Pick", about: "About"};
		const items = [ {title: "Home", href: "/"} ];

		let acc = "";
		for (const p of parts) {
				acc += `/${p}`;
				items.push ({title: map[p] || capitalize (p), href: acc});
		}
		return items;
}

function capitalize (s) {
		return s ? s.charAt (0).toUpperCase () + s.slice (1) : s;
}
