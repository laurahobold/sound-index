// AboutPage.jsx
import React from 'react';
import {HeaderSection, LogoText, SectionHeader, SectionSub} from "../../layout/styles.module.js";
import {Wrapper} from "../tools/playlists/styles.module.js";

function AboutPage () {
		return ( <Wrapper>
				<HeaderSection>
						<SectionHeader>About</SectionHeader>
						<SectionSub>Learn more about Sound Index! </SectionSub>
				</HeaderSection>
				<section style={{maxWidth: 600, margin: '2rem auto', fontSize: '1.15rem', lineHeight: 1.7}}>
						<h2>About Sound Index</h2>
						<p>
								Sound Index is a web app that helps you explore, organize, and rank your favorite Spotify tracks and
								playlists. Connect your Spotify account to view your music, create custom rankings, and discover new
								insights about your listening habits. Whether you’re a casual listener or a playlist curator, Sound
								Index makes it easy and fun to sort and share your musical taste.
						</p>
				</section>
		</Wrapper> );
}

export default AboutPage;