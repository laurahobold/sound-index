// src/context/SpotifyAuthContext.jsx
import {createContext, useContext, useState, useEffect} from "react";

const SpotifyAuthContext = createContext ();

export function SpotifyAuthProvider ({children}) {
		const [ token, setToken ] = useState (localStorage.getItem ("spotify_token"));

		useEffect (() => {
				if (token) {
						localStorage.setItem ("spotify_token", token);
				} else {
						localStorage.removeItem ("spotify_token");
				}
		}, [ token ]);

		return ( <SpotifyAuthContext.Provider value={{token, setToken}}>
						{children}
				</SpotifyAuthContext.Provider> );

}

export function useSpotifyAuth () {
		return useContext (SpotifyAuthContext);
}
