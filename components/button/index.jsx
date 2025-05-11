// GetStartedButton.jsx
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { ArrowRight } from 'lucide-react'

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
    background-color: #f1d6f5; /* amber-100 */
    padding: 0.5rem; /* 8px */
    font-weight: bold;
    transition: background-color 0.1s ease-in-out;

    &:hover {
        background-color: #1a1a1a; /* orange-600 */
    }
`

const Text = styled.span`
  color: #1a1a1a;  /* orange-600 */
  transition: color 0.1s ease-in-out;

  ${Button}:hover & {
    color: #f1d6f5; /* amber-100 */
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
  background-color: #1a1a1a; /* orange-600 */
  transition: background-color 0.1s ease-in-out;

  ${Button}:hover & {
    background-color: #f1d6f5; /* amber-100 */
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
  padding: 0.25rem; /* 4px */
  color: #1a1a1a;   /* orange-600 */
  opacity: 0;
  transition: opacity 0.2s ease-in-out;

  ${Button}:hover & {
    opacity: 1;
  }
`

const ArrowSecondary = styled(ArrowRight)`
  padding: 0.25rem; /* 4px */
  color: #f1d6f5;   /* amber-100 */
  opacity: 1;
  transition: opacity 0.3s ease-in-out;

  ${Button}:hover & {
    opacity: 0;
  }
`

function GetStartedButton({ text = 'Login with Spotify', className }) {
		return (
				<Container>
						<Button className={className}>
								<Text>{text}</Text>
								<IconOuter>
										<IconInner>
												<ArrowPrimary size={18} />
												<ArrowSecondary size={18} />
										</IconInner>
								</IconOuter>
						</Button>
				</Container>
		)
}

GetStartedButton.propTypes = {
		text: PropTypes.string,
		className: PropTypes.string,
}

export default GetStartedButton
