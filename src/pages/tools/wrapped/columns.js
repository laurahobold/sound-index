import React from "react";
import {Avatar} from "antd";

export function makeTrackColumns ({coverSize = 35} = {}) {
		return [ {title: "#", dataIndex: "rank", width: 56, sorter: (a, b) => a.rank - b.rank}, {
				title: "",
				dataIndex: "cover",
				width: 54,
				render: (url) => React.createElement (Avatar, {shape: "square", size: coverSize, src: url}),
		}, {
				title: "Song",
				dataIndex: "name",
				ellipsis: true,
				render: (text, r) => r.href ? React.createElement ("a", {
						href: r.href,
						target: "_blank",
						rel: "noreferrer"
				}, text) : text,
		}, {title: "Artists", dataIndex: "artists", ellipsis: true},
				{title: "Album", dataIndex: "album", ellipsis: true}, ];
}

export function makeArtistColumns ({coverSize = 35, maxGenres = 3} = {}) {
		return [ {title: "#", dataIndex: "rank", width: 56, sorter: (a, b) => a.rank - b.rank}, {
				title: "",
				dataIndex: "cover",
				width: 54,
				render: (url) => React.createElement (Avatar, {shape: "square", size: coverSize, src: url}),
		}, {
				title: "Artist",
				dataIndex: "name",
				ellipsis: true,
				render: (t, r) => r.href ? React.createElement ("a", {
						href: r.href,
						target: "_blank",
						rel: "noreferrer"
				}, t) : t,
		}, {
				title: "Genres",
				dataIndex: "genres",
				ellipsis: true,
				render: (g) => ( g && g.length ? g.slice (0, maxGenres).join (", ") : "—" ),
		}, ];
}
