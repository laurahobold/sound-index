import { useEffect, useState } from "react";

export default function useColorMode() {
		const [mode, setMode] = useState(() => {
				const saved = localStorage.getItem("ui-theme");
				if (saved) return saved; // "light" | "dark"
				return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
		});

		useEffect(() => {
				localStorage.setItem("ui-theme", mode);
				document.documentElement.setAttribute("data-theme", mode); // optional hook for plain CSS
		}, [mode]);

		const toggle = () => setMode((m) => (m === "dark" ? "light" : "dark"));
		const isDark = mode === "dark";
		return { mode, isDark, setMode, toggle };
}
