import styled from "styled-components";
import {fonts} from "../../../styles/theme.js";

export const Container = styled.div`
    padding: 0.5rem;
    overflow: hidden !important;
`;

export const ContainerHeader = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 0 1rem 0 0;
    position: sticky;
    gap: 2rem;
`;

export const SearchInput = styled.input`
    //width: 80%;
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
`;

export const PlaylistGrid = styled.div`
    gap: 1rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    overflow-y: scroll;
    height: 60vh !important;
    width: auto;
    align-content: flex-start;
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.2) transparent;

}

`;

export const Card = styled.div`
    width: 46%;
    // max-width: 180px;      /* prevents ultra-wide cards on tablets */
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    font-family: ${({theme}) => fonts.accent};
    letter-spacing: 0.1rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform .15s ease, box-shadow .15s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, .10);
    }

    &:active {
        transform: translateY(0);
    }

    @media (max-width: 500px) {
        width: 100%;
        flex-direction: column;
    }
`;

export const Cover = styled.img`
    /* Em desktop, fixa um tamanho confortável */
    width: 72px;
    height: 72px;
    flex: 0 0 72px;
    border-radius: 10px;
    object-fit: cover;
    background: #eee;

    /* Tablet */
    @media (max-width: 900px) {
        width: 72px;
        height: 72px;
        flex-basis: 72px;
    }

    /* MOBILE */
    @media (max-width: 720px) {
        width: 56px;
        height: 56px;
        flex-basis: 56px;
        border-radius: 8px;
    }
`;

export const Title = styled.div`
    font-size: clamp(.95rem, 2.4vw, 1.05rem);
    font-weight: 600;
    color: ${({theme}) => theme.textMain};
    line-height: 1.2;
    /* Better wrapping on small screens while keeping neat ellipsis */
    display: -webkit-box;
    -webkit-line-clamp: 2; /* up to 2 lines */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
`
export const PlaylistCard = styled.div`
    display: flex;
    flex-direction: row;
    padding: .6rem .75rem .8rem;
    align-items: center;

`
// --- Tools section container
export const ToolsSection = styled.section`
    width: 90%;
    margin: auto;
    font-family: ${({theme}) => fonts.body};
    display: flex;
    flex-direction: column;
    background: ${({theme}) => `color-mix(in oklab, ${theme.textMain} 4%, transparent)`};
    border: ${({theme}) => `1px solid color-mix(in oklab, ${theme.textMain} 18%, transparent)`};
`;

// Header (title + subtitle)
export const ToolsHeader = styled.header`
    display: flex;
    flex-direction: row;
    gap: .25rem;
    border-bottom: ${({theme}) => `1px solid color-mix(in oklab, ${theme.textMain} 18%, transparent)`};
    padding: 6px;
    text-align: center;
    //text-transform: uppercase;
    font-family: ${fonts.body};
    font-weight: 600;
    font-size: clamp(1rem, 1.8vw, 1.1rem);
    color: ${({theme}) => theme.primary};
    text-transform: uppercase;
    justify-content: center;
    align-items: center;
`;

export const ToolsTitle = styled.h2`
    margin: 0;
    font-size: 0.7rem;

`;

export const ToolsSub = styled.p`
    margin: 0 0 0 10px;
    font-size: clamp(.85rem, 1.5vw, 0.7rem);
    color: ${({theme}) => theme.textMuted};
    justify-content: center;
    font-family: ${({theme}) => fonts.body};
`;

// Grid
export const ToolsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: clamp(.9rem, 2vw, 1.2rem);
    padding: clamp(1rem, 3vw, 2rem);

`;

// Card
export const ToolCard = styled.article`
    display: flex;
    flex-direction: column;
    gap: .75rem;
    padding: 1rem;
    background: ${({theme}) => `color-mix(in oklab, ${theme.textMain} 3%, transparent)`};
    border: ${({theme}) => `1px solid color-mix(in oklab, ${theme.textMain} 14%, transparent)`};
    transition: transform .18s ease, box-shadow .18s ease;
    will-change: transform;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, .08);
    }
`;

export const ToolHead = styled.div`
    display: flex;
    align-items: center;
    gap: .75rem;
`;

export const ToolIcon = styled.div`
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    background: ${({theme}) => `color-mix(in oklab, #1db954 18%, ${theme.background} 82%)`};
    border: 1px solid ${({theme}) => `color-mix(in oklab, #1db954 45%, transparent)`};

    svg {
        width: 20px;
        height: 20px;
        color: #0a0a0a;
    }
`;

export const ToolName = styled.h3`
    margin: 0;
    font-size: 1.2rem;
    color: ${({theme}) => theme.textMain};
    font-family: ${({theme}) => fonts.accent};
    font-weight: 900;
    font-variation-settings: "ELGR" 2,
    "ELSH" 2;
    font-style: normal;
    letter-spacing: 0.09rem;
`;

export const ToolDesc = styled.p`
    margin: 0;
    color: ${({theme}) => theme.textMuted};
    font-size: .95rem;
    letter-spacing: 0.02rem;

`;

export const ToolCTA = styled.button`
    align-self: start;
    margin-top: .25rem;
    background: #1db954;
    color: white;
    font-weight: 700;
    border: 0;
    border-radius: 999px;
    padding: .55rem .85rem;
    cursor: pointer;
    transition: transform .05s ease, background .15s ease;

    &:hover {
        background: #1ed760;
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }
`;

export const ToggleBar = styled.div`
    display: inline-flex;
    gap: 6px;
    padding: 4px;
    border-radius: 999px;
    background: ${({theme}) => `color-mix(in oklab, ${theme.textMain} 6%, transparent)`};
    border: 1px solid ${({theme}) => `color-mix(in oklab, ${theme.textMain} 16%, transparent)`};
`;

export const ToggleBtn = styled.button`
    appearance: none;
    border: 0;
    font-family: ${fonts.body};
    font-weight: 700;
    letter-spacing: .02rem;
    padding: .4rem .8rem;
    border-radius: 999px;
    cursor: pointer;
    background: transparent;
    color: ${({theme}) => theme.textMuted};
    transition: background .15s ease, color .15s ease, transform .05s ease;

    &[data-active="true"] {
        background: ${({theme}) => theme.primary};
        color: #0b0b0b;
    }

    &:active {
        transform: translateY(0.5px);
    }
`;