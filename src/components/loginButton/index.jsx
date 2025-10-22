// components/LoginButton/index.jsx
import React from "react";
import { BsSpotify } from "react-icons/bs";
import { ButtonWrap } from "./styles.module.js";

export default function LoginButton({
		label = "Log in with Spotify",
		onClick,
		disabled = false,
		icon: Icon = BsSpotify,
		type = "button",
}) {
		return (
				<ButtonWrap
						type={type}
						onClick={onClick}
						disabled={disabled}
						aria-disabled={disabled}
						className="button"
				>
						<BsSpotify></BsSpotify>
						{label}
				</ButtonWrap>
		);
}
