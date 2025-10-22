import React, { useEffect, useMemo, useRef } from "react";
import {
		SearchBar as SearchBarWrap,
		SearchIcon,
		SearchInput,
		ClearBtn,
		KbdHint,
} from "./styles.module.js";

export default function SearchBar({
		value,
		onChange,
		onClear,
		placeholder = "Search playlists…",
		hotkey = "k",           // override if you ever change the gesture
		autoFocus = false,
}) {
		const inputRef = useRef(null);
		const isMac = useMemo(() => /Mac|iPhone|iPad/.test(navigator.platform), []);

		useEffect(() => {
				if (autoFocus) inputRef.current?.focus();
		}, [autoFocus]);

		useEffect(() => {
				const onKey = (e) => {
						const isK = e.key?.toLowerCase() === hotkey;
						if ((e.metaKey || e.ctrlKey) && isK) {
								e.preventDefault();
								inputRef.current?.focus();
						}
				};
				window.addEventListener("keydown", onKey);
				return () => window.removeEventListener("keydown", onKey);
		}, [hotkey]);

		const handleClear = () => {
				onClear?.();
				// keep focus on the field after clearing
				requestAnimationFrame(() => inputRef.current?.focus());
		};

		return (
				<SearchBarWrap aria-label="Search playlists">
						<SearchIcon aria-hidden="true">
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
										<circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
										<line x1="16.65" y1="16.65" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
								</svg>
						</SearchIcon>

						<SearchInput
								ref={inputRef}
								type="search"
								inputMode="search"
								autoComplete="off"
								placeholder={placeholder}
								value={value}
								onChange={(e) => onChange?.(e.target.value)}
						/>

						{value ? (
								<ClearBtn onClick={handleClear} type="button" aria-label="Clear search">
										<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
												<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
										</svg>
								</ClearBtn>
						) : (
								<KbdHint>{isMac ? "⌘K" : "Ctrl K"}</KbdHint>
						)}
				</SearchBarWrap>
		);
}
