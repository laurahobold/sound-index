import React from "react";
import './styles.css'

import theme from "../../src/styles/theme.js";
import styled, {css, keyframes} from "styled-components";
import texts from "../../src/texts/text.js";
 const revealUp = keyframes`
  0% { opacity: 0; transform: translateY(80%); filter: blur(0.3rem); }
  100% { opacity: 1; transform: translateY(0); filter: blur(0); }
`;

 const revealDown = keyframes`
  0% { opacity: 0; transform: translateY(-80%); filter: blur(0.3rem); }
  100% { opacity: 1; transform: translateY(0); filter: blur(0); }
`;
const Container = styled.div`
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  white-space: pre;
  font-size: 3rem;
  font-weight: 900;

  @media (min-width: 768px) {
    padding: 0 1.5rem;
    font-size: 4.5rem;
  }
`;

const Text = styled.span`
    display: inline-block;
		font-size: 50px ;
		flex-wrap: nowrap!important;
    color: ${({ theme }) => theme.textMain};
		animation-fill-mode: forwards;
    ${({direction, blur}) => css`
        animation-name: ${direction === "up" ? revealUp : revealDown};
        animation-duration: var(--duration, 2000ms);
        animation-delay: var(--delay, 0ms);
        animation-timing-function: cubic-bezier(0.18, 0.89, 0.82, 1.04);
        ${!blur && `filter: none;`}
    `}
		@media (max-width: 768px) {
			font-size: 3rem;
		}
}
`;

export default function WaveReveal({
		text = texts.home.title,
		direction = "down",
		mode = "letter",
		className = "",
		duration = "2000ms",
		delay = 0,
		blur = true,
}) {
		if (!text) return null;

		const words = text.trim().split(/\s+/);
		const letters = mode === "word" ? words : text.split("");
		let offset = 0;

		return (
				<Container className={className}>
						{letters.map((wordOrLetter, i) => {
								const content = mode === "word" ? wordOrLetter : wordOrLetter;
								const isLast = i === letters.length - 1;
								const localDelay = `${delay + offset * 50}ms`;
								offset += mode === "word" ? 1 : content.length + 1;

								return (
										<Text
												key={`${content}-${i}`}
												direction={direction}
												blur={blur}
												style={{ fontFamily: 'Blaster, sans-serif',"--duration": duration, "--delay": localDelay }}
										>
												{content}
												{mode === "word" && !isLast ? " " : ""}
										</Text>
								);
						})}
				</Container>
		);
}
