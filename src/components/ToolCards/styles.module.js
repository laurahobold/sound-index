// src/components/ToolCards/styles.module.js
import styled from "styled-components";
import theme, {fonts} from "../../styles/theme.js";

export const Grid = styled.div`
    display: flex;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: clamp(12px, 2vw, 20px);
    width: min(1200px, 100%);
    margin: 0 auto;
    padding-top: 2rem;
    @media (max-width: 720px) {
        flex-direction: column;
    }
`;

export const Card = styled.a`

    position: relative;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    padding: 20px;
    width: 100%;
    //border-radius: 20px;
    background: ${({theme}) => `color-mix(in oklab, ${theme.textMain} 4%, transparent)`};

    transition: transform .25s ease, box-shadow .25s ease, background .25s ease;
    text-decoration: none;
    color: ${({theme}) => theme.textMain};

    max-width: 300px;


    &:hover {
        transform: translateY(-6px);
    }

    &:focus-visible {
        outline: 3px solid ${({theme}) => theme.accent || "#6aa9ff"};
        outline-offset: 3px;
    }

    .card-title {
        //margin: 14px 0 0 10px;
        font-size: clamp(0.9rem, 1.2vw, 1.7rem);
        font-weight: 500 !important;

        //text-transform: uppercase;
        // letter-spacing: .005em;
        font-family: ${fonts.body};
        color: ${({theme}) => theme.textMain};
    }

    .card-body {
        margin: 12px 0 0 10px;
        line-height: 1.55;
        color: ${({theme}) => theme.textMain};
        font-size: clamp(1rem, 1vw, 1.1rem);
        font-family: ${fonts.body};
    }

    .footer {
        margin-top: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-right: 2px;
        margin-left: 10px;
        font-size: 13px;
        color: ${({theme}) => theme.textMuted || "#636"};
    }
`;

/* Accent “image” area: background = tool accent, icon with glow */
export const Thumb = styled.div`
    // border-radius: 16px;

}`
export const CardHeader = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 1rem;
    font-size: clamp(0.9rem, 1vw, 1.1rem);

    span {
        color: ${({theme}) => theme.primary};

    }

    /* the icon itself */

    .tool-icon {
        width: 32px;
        height: 32px;
        color: ${({theme}) => theme.primary};
        opacity: .98;
        transform: translateY(0);
        transition: transform .2s ease, opacity .2s ease;
    }

    /* tiny float on hover */

    ${Card}:hover & .tool-icon,
    ${Card}:hover & svg {
        transform: translateY(-1px) scale(1.04);
        opacity: 1;
    }
`;

export const Section = styled.div`
        //	background-color: ${({theme}) => theme.textMain};
    //padding: clamp(2rem, 3vw, 3rem);
    margin-bottom: 3rem;
`;
export const Head = styled.h1`
    color: ${({theme}) => theme.textMain};
    font-family: ${fonts.heading};
    text-transform: uppercase;
    text-align: center;
    padding: clamp(1rem, 3vw, 2rem);
    font-size: clamp(2rem, 2vw, 3rem);
`;


export const Name = styled.h3`
    margin: 0;
    //  font-weight: 900;
`;

export const Desc = styled.span`
    display: inline-block;
    max-width: 60ch;
`;

export const Footer = styled.div``;

export const Chip = styled.span`
    background: ${({theme}) => theme.accent || "#2e54a7"};
    color: #fff;
    border-radius: 999px;
    padding: .48rem .8rem;
    font-weight: 800;
    font-size: .92rem;
    letter-spacing: .01em;
    transform: translateY(0);
    transition: transform .12s ease, filter .12s ease;

    ${Card}:hover & {
        transform: translateY(-1px);
        filter: brightness(1.06);
    }
`;

export const Arrow = styled.span`
    font-size: 1.25rem;
    opacity: .9;
    transform: translateX(0);
    transition: transform .12s ease, opacity .12s ease;

    ${Card}:hover & {
        transform: translateX(4px);
        opacity: 1;
    }
`;

/* left exported in case you used it elsewhere; not used by the new Card */
export const IconWrap = styled.div``;
