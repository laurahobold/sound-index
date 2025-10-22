// src/theme.js

const theme = {
		primary: "#abdb27",
		secondary: "#343434",
		accent: "#a08cfd",
		success: "#40a02b",
		warning: "#df8e1d",
		error: "#d20f39",

		love: "#ab978c",
		gold: "#ea9d34",
		foam: "#56949f",
		iris: "#907aa9",
		grey: "#666161",

// #2b212f
// #755d7e
// #e7e1e9
// #f3f0f4
// #d0d9cc
// #262e22

// Text colors
		textMain: "#f2f2f2",
		textLight: "#09090b",
		textMuted: "#adadad",
		textSubtle: "#6c757d",

		// Backgrounds
		background: "#111111",
		backgroundDark: "#f8f8f8",
		surface: "#ffffff",
		surfaceAlt: "#f1f3f4",

		// Borders
		border: "#e0e0e0"
};
export const fonts = {
		heading: '"Clash Display"',
		accent: '"ClashGrotesk-Variable", system-ui, sans-serif',
		accent2: '"ClashGrotesk-Variable", system-ui, sans-serif',
		body: '"ClashGrotesk-Variable", system-ui, sans-serif',
		icon: 'ClashGrotesk-Variable'
}
// NOTE: Use font-weight:700 where you want the BluuNext Bold appearance since the @font-face defines family 'BluuNext'
// with weight 700. You can export more tokens (spacing, fontSizes, radii, etc.) if you want:
export const spacing = {
		xs: "0.25rem", sm: "0.5rem", md: "1rem", lg: "2rem", xl: "4rem"
};
export default theme;
