import React, { useMemo } from "react";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import { theme as antdTheme } from "antd";
import { fonts } from "./theme.js"; // your file

const Global = createGlobalStyle`
  html, body {
    background: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.textMain};
    font-family: ${fonts?.body} !important;
    transition: background 0.2s ease, color 0.2s ease;
  }
`;

export default function ThemeBridge({ children }) {
		const { token } = antdTheme.useToken(); // must be a child of ConfigProvider
		const mapped = useMemo(() => ({
				textMain: token.colorText,
				textMuted: token.colorTextSecondary,
				bg: token.colorBgLayout,
				bgElevated: token.colorBgContainer,
				border: token.colorBorderSecondary,
				primary: token.colorPrimary,
				accent: token.colorInfo,
				radius: token.borderRadius,
				fonts,
		}), [token]);

		return (
				<ThemeProvider theme={mapped}>
						<Global />
						{children}
				</ThemeProvider>
		);
}
