import React, {useEffect, useState} from "react";
import {Dropdown, Avatar, Button} from "antd";
import {UserOutlined} from "@ant-design/icons";
import {startLogin, spotifyFetch} from "../../services";
import {ActionButtons} from "../../pages/styles.module.js";
import LoginButton from "../loginButton/index.jsx"; // adjust path if needed


export default function UserAvatarMenu ({
		token,
		setToken,
		placement = "top",
		size = 32,
		showName = false,
		renderWhenLoggedOut = "button",
		onLoggedOut,
		className,
}) {
		const [ profilePic, setProfilePic ] = useState (null);
		const [ displayName, setDisplayName ] = useState ("");
		const isLoggedIn = Boolean (token || localStorage.getItem ("spotify_token"));

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

		const doLogout = () => {
				localStorage.removeItem ("spotify_token");
				localStorage.removeItem ("spotify_scope");
				localStorage.removeItem ("pkce_verifier");
				setToken?.(null);
				setProfilePic (null);
				setDisplayName ("");
				onLoggedOut?.();
		};

		const userMenu = {
				items: [ {key: "logout", danger: true, label: "Log out"}, ],
				onClick: ({key}) => key === "logout" && doLogout (),
		};

		if (!isLoggedIn) {
				return renderWhenLoggedOut === "icon" ? ( <Avatar
						className={className}
						size={size}
						icon={<UserOutlined/>}
						onClick={() => startLogin (window.location.pathname + window.location.search)}
						style={{cursor: "pointer"}}
				/> ) : ( <ActionButtons>
						<LoginButton
								block
								onClick={() => startLogin (location.pathname + location.search)}
						>
								Login with Spotify
						</LoginButton>
				</ActionButtons> );
		}

		return ( <Dropdown menu={userMenu} placement={placement} trigger={[ "click" ]}>
      <span
		      role="button"
		      aria-label={`${displayName || "User"} menu`}
		      className={className}
		      style={{display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer"}}
      >
        <Avatar src={profilePic ?? undefined} icon={!profilePic && <UserOutlined/>} size={size}/>
		      {showName && ( <span
				      style={{
						      maxWidth: 160, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
				      }}
				      title={displayName}
		      >
            {displayName}
          </span> )}
      </span>
		</Dropdown> );
}
