// src/layout/Layout.jsx
import React from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import {useNavigate, useLocation} from "react-router-dom";
import {PageWrapper, ContentWrapper, List, Link, Root, Logo, Item} from "./styles.module.js";
import VantaBackground from "../../components/background/index.jsx";
import {Button} from "@radix-ui/themes";

export default function Layout({ children, token }) {
		const navigate = useNavigate();
		const location = useLocation();

		const handleLogout = () => {
				localStorage.clear();
				navigate("/");
		};

		const handlePick = () => navigate("/pick");
		const handleRestart = () => navigate("/sort");
		const handleCredits = () =>
				window.open("https://github.com/laurahobold", "_blank");

		return ( <PageWrapper>
				{/*<Root>*/}
				{/*		<List>*/}
				{/*				{token && (*/}
				{/*						<Item>*/}
				{/*								<NavigationMenu.Link asChild>*/}
				{/*										<Button onClick={handleLogout}>Logout</Button>*/}
				{/*								</NavigationMenu.Link>*/}
				{/*						</Item>*/}
				{/*				)}*/}
				{/*				{token && (*/}
				{/*						<Item>*/}
				{/*								<NavigationMenu.Link asChild>*/}
				{/*										<Button onClick={handlePick}>Pick Playlist</Button>*/}
				{/*								</NavigationMenu.Link>*/}
				{/*						</Item>*/}
				{/*				)}*/}
				{/*				{location.pathname === "/sort" && (*/}
				{/*						<Item>*/}
				{/*								<NavigationMenu.Link asChild>*/}
				{/*										<Button onClick={handleRestart}>Restart Sort</Button>*/}
				{/*								</NavigationMenu.Link>*/}
				{/*						</Item>*/}
				{/*				)}*/}
				{/*				<Item>*/}
				{/*						<NavigationMenu.Link asChild>*/}
				{/*								<Button onClick={handleCredits}>Credits</Button>*/}
				{/*						</NavigationMenu.Link>*/}
				{/*				</Item>*/}
				{/*		</List>*/}
				{/*		<NavigationMenu.Viewport />*/}
				{/*</Root>*/}
				<Root>
						<Logo onClick={() => navigate('/')}>Bop Hierarchy</Logo>
						<List>
								<Item>
										<Link asChild>
												<button onClick={() => navigate('/')}>Home</button>
										</Link>
								</Item>
								<Item>
										<Link asChild>
												<button onClick={() => navigate('/about')}>About</button>
										</Link>
								</Item>
						</List>
				</Root>



				<ContentWrapper>{children}</ContentWrapper>
		</PageWrapper> );
}
