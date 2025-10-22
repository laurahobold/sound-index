// src/components/Brand/Logo.jsx
import React from "react";
import styled from "styled-components";
import logoUrl from "../src/assets/LOGO.svg"; // Vite imports SVG as a URL by default

const Mark = styled.img.attrs({
		src: logoUrl,
		alt: "Logo",
		draggable: false,
})`
  height: var(--logo-size, 42px);
  display: block;
  user-select: none;
`;

export default function Logo(props) {
		return <Mark {...props} />;
}
