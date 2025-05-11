// src/layout/styles.module.js
import styled from 'styled-components';

export const PageWrapper = styled.div`
    display: flex;
    flex-direction: column;
		justify-content: space-between;
		align-items: center;
    height: 100vh;
		width: 100vw;
    font-family: "Space Grotesk", sans-serif;
    //background-image: url('/src/assets/blurgradient-1746746299205.png') !important;
padding:2rem;
`;

export const ContentWrapper = styled.div`
//height:100vh;
		margin: auto;
		//padding: 1rem;
`;

export const TaskBarWrapper = styled.div`
  //border-top: 2px solid #a0a0a0;
  //background: #dfdfdf;
  padding: 8px 8px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
import * as NavigationMenu from '@radix-ui/react-navigation-menu';


// Styled Components (short + correct context)
export const Root = styled(NavigationMenu.Root)`
    display: flex;
		position: absolute;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2rem;
		color: #1a1a1a;
		width: 90%;
`;

export const List = styled(NavigationMenu.List)`
    display: flex;
    gap: 1.5rem;
`;

export const Item = styled(NavigationMenu.Item)``;

export const Link = styled(NavigationMenu.Link)`
    all: unset;
    font-size: 1rem;
    cursor: pointer;

    &:hover {
        color: #666;
    }
`;

export const Logo = styled.div`
    font-family: 'Dreamer', cursive;
    font-size: 1.5rem;
    cursor: pointer;
`;
