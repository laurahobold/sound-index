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
overflow: hidden;
`;

export const ContentWrapper = styled.div`
//height:100vh;
		margin: auto;
		width: 100%;
    //overflow: scroll !important;
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
    font-family: 'Blaster', cursive;
    font-size: 1rem;
    cursor: pointer;
`;
