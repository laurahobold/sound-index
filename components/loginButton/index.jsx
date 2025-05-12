import React from "react";
import { ArrowRight } from "lucide-react";
import styled from "styled-components"; // import the CSS

const Container = styled.div`
  min-height: 3rem;   /* 48px */
  width: 12rem;       /* 192px */
`
const Button = styled.button`
    display: flex;
    height: 3rem; /* 48px */
    width: 14rem; /* 160px */
    align-items: center;
    justify-content: center;
    gap: 0.75rem; /* 12px */
    border-radius: 0.5rem;
		background-color: #1a1a1a;
    padding: 0.5rem; /* 8px */
    font-weight: bold;
    transition: background-color 0.1s ease-in-out;

    &:hover {
        background-color: #f1d6f5; /* orange-600 */
    }
`
const Text = styled.span`
    color: #f1d6f5; /* amber-100 */

  transition: color 0.1s ease-in-out;

  ${Button}:hover & {
      color: #1a1a1a;  /* orange-600 */

  }
`

const IconOuter = styled.div`
  position: relative;
  display: flex;
  height: 2rem;  /* 28px */
  width: 2rem;   /* 28px */
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 9999px;
    background-color: #f1d6f5; /* amber-100 */

    transition: background-color 0.1s ease-in-out;

  ${Button}:hover & {
      background-color: #1a1a1a; /* orange-600 */

  }
`

const IconInner = styled.div`
  position: absolute;
  left: 0;
  display: flex;
  height: 2rem;  /* 28px */
  width: 3.5rem;    /* 56px */
  transform: translateX(-50%);
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease-in-out;

  ${Button}:hover & {
    transform: translateX(0);
  }
`

const ArrowPrimary = styled(ArrowRight)`
  padding: 0.5rem; /* 4px */

  color: #f1d6f5;   /* orange-600 */
  opacity: 0;
  transition: opacity 0.2s ease-in-out;

  ${Button}:hover & {
    opacity: 1;
  }
`

const ArrowSecondary = styled(ArrowRight)`
  padding: 0.25rem; /* 4px */
    color: #1a1a1a;  /* orange-600 */

    opacity: 1;
  transition: opacity 0.3s ease-in-out;

  ${Button}:hover & {
    opacity: 0;
  }
`
export default function SlideArrowButton({
		text = "Login with Spotify",
		primaryColor = "#1DB954",
		...props
}) {
		return (
				<Container>

				<Button
						{...props}
				>
						<IconOuter>
								<IconInner>
										<ArrowPrimary size={18} />
										<ArrowSecondary size={18} />
								</IconInner>
						</IconOuter>
						<Text>{text}</Text>
				</Button>
				</Container>

		);
}

function SpotifyIcon({ size = 20, color = "currentColor" }) {
		return (
				<svg
						width={size}
						height={size}
						viewBox="0 0 168 168"
						xmlns="http://www.w3.org/2000/svg"
						fill={color}
				>
						<path d="M83.9 0C37.5 0 0 37.5 0 83.9s37.5 83.9 83.9 83.9 83.9-37.5 83.9-83.9S130.3 0 83.9 0zm38.1 121.1c-1.6 2.7-5 3.6-7.7 2-21.1-12.9-47.7-15.8-79.2-8.5-3.1.7-6.1-1.2-6.9-4.3s1.2-6.1 4.3-6.9c34.8-8.1 65.6-5 89.8 9.3 2.7 1.6 3.6 5 2 7.7zm11-22.5c-2 3.3-6.3 4.4-9.6 2.4-24-14.8-60.7-19-88.8-10.2-3.7 1.1-7.6-1-8.6-4.7-1.1-3.7 1-7.6 4.7-8.6 32.5-9.7 74-5 101.9 11.3 3.3 2 4.4 6.3 2.4 9.6zm.7-23.5C113.5 61 71.2 59.6 44.2 67.6c-4.2 1.2-8.7-1.1-10-5.3s1.1-8.7 5.3-10c31.2-9.2 79.6-7.5 109.7 12.6 3.6 2.3 4.7 7.1 2.4 10.6-2.3 3.5-7.1 4.6-10.6 2.4z" />
				</svg>
		);
}


