import styled, {css, keyframes} from "styled-components";
import {Layout as AntLayout, Breadcrumb as AntBreadcrumb} from "antd";
import {fonts} from "../styles/theme.js";
import {BarChart} from "lucide-react";
import Marquee from "react-fast-marquee";
import theme from "../../src/styles/theme.js";
import {RiSoundModuleFill} from "react-icons/ri";

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @                                                        @
// @                                                        @
// @  ██╗      █████╗ ██╗   ██╗ ██████╗ ██╗   ██╗████████╗  @
// @  ██║     ██╔══██╗╚██╗ ██╔╝██╔═══██╗██║   ██║╚══██╔══╝  @
// @  ██║     ███████║ ╚████╔╝ ██║   ██║██║   ██║   ██║     @
// @  ██║     ██╔══██║  ╚██╔╝  ██║   ██║██║   ██║   ██║     @
// @  ███████╗██║  ██║   ██║   ╚██████╔╝╚██████╔╝   ██║     @
// @  ╚══════╝╚═╝  ╚═╝   ╚═╝    ╚═════╝  ╚═════╝    ╚═╝     @
// @                                                        @
// @                                                        @
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

export const vars = {
		headerHeight: "54px",
		cardBg: "#1d1d1d",
		cardRadius: "12px",
		cardShadow: "0 6px 24px rgba(0,0,0,0.06)",
		pagePadX: "clamp(16px, 4vw, 48px)",
		cardPad: "clamp(16px, 3vw, 24px)",
		crumbsMarginY: "clamp(4px, 1vw, 8px)",
		maxContent: "1000px",
		bpMobile: "900px", // breakpoint
};

export const Shell = styled (AntLayout)`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    --accent: ${({theme}) => theme.background};
    --bg: ${({theme}) => theme.background};
    background-color: ${({theme}) => theme.background};

    . ant-layout-content {
        display: flex;
    }

    .ant-layout {
        background: none !important;
    }


    &::after {
        content: "";
        position: fixed;
        pointer-events: none;
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0.25), transparent 35%);
    }

    @media (max-width: 720px) {
        --size: 14px;
    }
`;

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @                               @
// @                               @
// @  ███╗   ██╗ █████╗ ██╗   ██╗  @
// @  ████╗  ██║██╔══██╗██║   ██║  @
// @  ██╔██╗ ██║███████║██║   ██║  @
// @  ██║╚██╗██║██╔══██║╚██╗ ██╔╝  @
// @  ██║ ╚████║██║  ██║ ╚████╔╝   @
// @  ╚═╝  ╚═══╝╚═╝  ╚═╝  ╚═══╝    @
// @                               @
// @                               @
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


export const Header = styled (AntLayout.Header)`
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    top: 0;
    z-index: 10;
    max-height: ${vars.headerHeight};
    width: 100%;
    padding: 0 ${vars.pagePadX};
    background: transparent;
    // border-bottom-style: outset;
        // border-bottom: 1px solid ${({theme}) => theme.textMain};
`;

const sheen = keyframes`
    0% {
        background-position: 0% 50%;
    }
    100% {
        background-position: 200% 50%;
    }
`;

export const LogoText = styled.h1`
    font-family: ${({theme}) => fonts.heading};
    font-size: clamp(1rem, 1.5vw, 1.7rem);
    margin-left: -14px; /* optical nudge */
    cursor: pointer;
    //text-transform: uppercase;
    user-select: none;
    display: flex;
    text-wrap: wrap;
    text-align: center;
    color: ${({theme}) => theme.accent};
    font-weight: 600;
    @media (max-width: ${vars.bpMobile}) {
        display: none;
    }

    /* palette hooks */
    --c1: ${({theme}) => theme.accent};
    --c2: ${({theme}) => theme.secondary};
    --c3: ${({theme}) => theme.primary};
    --bg: ${({theme}) => theme.background};

    /* 1) Static gradient fill (no motion) */
    ${({$style}) => $style === "duoGradient" && css`
        background-image: linear-gradient(
                92deg,
                color-mix(in oklab, var(--c1) 90%, transparent) 0%,
                color-mix(in oklab, var(--c2) 90%, transparent) 55%,
                color-mix(in oklab, var(--c3) 90%, transparent) 100%
        );
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
    `} /* 2) Ink outline (crisp mono outline) */ ${({$style}) => $style === "inkOutline" && css`
        color: var(--c1);
        /* primary stroke */
        -webkit-text-stroke: 1px color-mix(in oklab, var(--c3) 85%, transparent);
        /* subtle inside depth */
        text-shadow: 0 0 0 color-mix(in oklab, var(--bg) 100%, transparent),
        0.5px 0.5px 0 color-mix(in oklab, var(--bg) 35%, transparent);
    `} /* 3) Sticker (offset layer = “printed label” feel) */ ${({$style}) => $style === "sticker" && css`
        position: relative;
        color: var(--c1);
        text-shadow: 0 1px 0 color-mix(in oklab, var(--bg) 85%, transparent),
        2px 3px 0 color-mix(in oklab, var(--c2) 65%, transparent);
    `} /* 4) Tape highlight behind the text (non-animated) */ ${({$style}) => $style === "tape" && css`
        position: relative;
        z-index: 0;
        color: var(--c1);

        &::before {
            content: "";
            position: absolute;
            inset: -4px -8px -4px -10px;
            background: linear-gradient(to right,
            color-mix(in oklab, var(--c2) 18%, transparent),
            color-mix(in oklab, var(--c3) 18%, transparent));
            border: 1px solid color-mix(in oklab, var(--c3) 35%, transparent);
            border-radius: 8px;
            transform: rotate(-1.2deg);
            box-shadow: 0 1px 0 color-mix(in oklab, var(--bg) 70%, transparent),
            0 6px 18px color-mix(in oklab, var(--c3) 12%, transparent);
            z-index: -1;
        }
    `} /* 5) Pill tag (clean badge behind text) */ ${({$style}) => $style === "pill" && css`
        padding: 4px 10px;
        border-radius: 999px;
        color: color-mix(in oklab, var(--c1) 92%, #fff);
        background: linear-gradient(180deg,
        color-mix(in oklab, var(--c2) 16%, transparent),
        color-mix(in oklab, var(--c3) 8%, transparent));
        outline: 1px solid color-mix(in oklab, var(--c1) 28%, transparent);
        box-shadow: inset 0 1px 0 color-mix(in oklab, #fff 8%, transparent),
        0 6px 16px color-mix(in oklab, var(--c1) 14%, transparent);
    `}
`;
export const SI = styled.img.attrs (() => ( {
		src: logo, alt: "Sound Index logo",
} ))`
    width: 32px;
    height: 42px;
    display: block;
    border-radius: 8px; /* optional */
`;

export const LogoWrap = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    line-height: 1;
    padding: 1rem 0;

    user-select: none;
    flex-direction: row;
    gap: 1em;
}
`;
export const Logo = styled (RiSoundModuleFill)`
    height: 25px;
    width: 25px;
    color: ${({theme}) => theme.accent};

}
`;


export const Nav = styled.nav`
    grid-column: 2;
    justify-self: center;
    display: block;

    @media (max-width: ${vars.bpMobile}) {
        display: none;
    }
`;

export const NavList = styled.ul`
    display: flex;
    gap: clamp(16px, 4vw, 32px);
    margin: 0;
    padding: 0;
    list-style: none;
    outline: none;

`;

export const NavItem = styled.li`
    position: relative;
    width: 100%;
    text-align: center;

    &:focus-visible {
        outline: none;
    }
`;

export const NavLink = styled.button`
    all: unset;
    cursor: pointer;
    font-family: ${fonts.accent};
    font-weight: 400;
    font-size: clamp(1rem, 1.8vw, 1.1rem);
    color: ${({theme}) => theme.textMain};
    //padding: 6px 12px;
    //border-radius: 6px;
    user-select: none;
    max-width: fit-content;
    outline: none;
    text-transform: uppercase;

    &[data-active="true"] {
        color: ${({theme}) => theme.accent};
        outline: none;


    }

    &:focus-visible,
    &:focus {
        outline: none;
    }
`;

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @                                                   @
// @                                                   @
// @  ███╗   ███╗ ██████╗ ██████╗ ██╗██╗     ███████╗  @
// @  ████╗ ████║██╔═══██╗██╔══██╗██║██║     ██╔════╝  @
// @  ██╔████╔██║██║   ██║██████╔╝██║██║     █████╗    @
// @  ██║╚██╔╝██║██║   ██║██╔══██╗██║██║     ██╔══╝    @
// @  ██║ ╚═╝ ██║╚██████╔╝██████╔╝██║███████╗███████╗  @
// @  ╚═╝     ╚═╝ ╚═════╝ ╚═════╝ ╚═╝╚══════╝╚══════╝  @
// @                                                   @
// @                                                   @
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

export const Burger = styled.button`
    grid-column: 2;
    justify-self: center;

    &:focus-visible,
    &:focus,
    &:hover {
        outline: none;
        border: none;
    }

    display: none;

    @media (max-width: ${vars.bpMobile}) {
        display: inline-flex;
    }

    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    border-radius: 10px;
    background: transparent;
    cursor: pointer;
    font-family: ${fonts.accent};
    color: ${({theme}) => theme.textMain};
    outline: none;
    text-transform: uppercase;


`;

export const BurgerIcon = styled.span`
    width: 18px;
    height: 2px;
    background: currentColor;
    position: relative;
    display: inline-block;
    transition: transform 200ms ease;

    &::before,
    &::after {
        content: "";
        position: absolute;
        left: 0;
        width: 18px;
        height: 2px;
        background: currentColor;
        transition: transform 200ms ease, top 200ms ease, opacity 200ms ease;
    }

    &::before {
        top: -6px;
    }

    &::after {
        top: 6px;
    }

    [aria-expanded="true"] & {
        transform: rotate(45deg);
    }

    [aria-expanded="true"] &::before {
        top: 0;
        transform: rotate(90deg);
    }

    [aria-expanded="true"] &::after {
        top: 0;
        opacity: 0;
    }
`;
export const MobileOverlay = styled.div`
    position: fixed;
    inset: 0;
    top: ${vars.headerHeight}; /* don’t cover the header */
    background: rgba(0, 0, 0, 0.35); /* tap catcher behind the panel */
    opacity: 0;
    pointer-events: none;
    transition: opacity 200ms ease;
    z-index: 999; /* below panel, above content */

    @media (min-width: ${vars.bpMobile}) {
        display: none;
    }

    &[data-open="true"] {
        opacity: 1;
        pointer-events: auto;
    }
`;
export const MobilePanel = styled.div`
    position: fixed;
    top: ${vars.headerHeight};
    left: 0;
    right: 0;
    background: color-mix(in oklab, ${({theme}) => theme.background} 95%, black 5%);
    border-top: 1px solid color-mix(in oklab, ${({theme}) => theme.textMain} 10%, transparent);
    backdrop-filter: blur(8px);
    padding: 14px ${vars.pagePadX} 20px;
    display: none;
    z-index: 1000;
    @media (max-width: ${vars.bpMobile}) {
        display: grid;
    }

    transform: translateY(-8px);
    opacity: 0;
    pointer-events: none;
    transition: transform 200ms ease, opacity 200ms ease;

    &[data-open="true"] {
        transform: translateY(0);
        opacity: 1;
        pointer-events: auto;
    }
`;

export const MobileList = styled.ul`
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 10px;
`;

export const MobileLink = styled.button`
    all: unset;
    cursor: pointer;
    font-family: ${fonts.accent};
    font-size: 1.05rem;
    padding: 10px 8px;
    border-radius: 10px;
    color: ${({theme}) => theme.textMain};
    background: color-mix(in oklab, ${({theme}) => theme.textMain} 4%, transparent);
    border: 1px solid color-mix(in oklab, ${({theme}) => theme.textMain} 14%, transparent);

    &[data-active="true"] {
        border-color: ${({theme}) => theme.accent};
        color: ${({theme}) => theme.accent};
    }
`;

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @                                                                   @
// @                                                                   @
// @   ██████╗ ██████╗ ███╗   ██╗████████╗███████╗███╗   ██╗████████╗  @
// @  ██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔════╝████╗  ██║╚══██╔══╝  @
// @  ██║     ██║   ██║██╔██╗ ██║   ██║   █████╗  ██╔██╗ ██║   ██║     @
// @  ██║     ██║   ██║██║╚██╗██║   ██║   ██╔══╝  ██║╚██╗██║   ██║     @
// @  ╚██████╗╚██████╔╝██║ ╚████║   ██║   ███████╗██║ ╚████║   ██║     @
// @   ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═══╝   ╚═╝     @
// @                                                                   @
// @                                                                   @
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

export const Content = styled (AntLayout.Content)`
    flex: 1;
    display: flex;
    flex-direction: column;
    ${({$isHero}) => ( $isHero ? css`padding: 0;` : css`padding: 0 1rem 0 0;` )}
    background: none;
    align-items: center;
    justify-content: center;
    max-height: 100svh;


`;

export const Crumbs = styled (AntBreadcrumb)`
    margin: 0.5rem 0 1rem;
    font-family: ${fonts.body};
    color: ${({theme}) => theme.textMuted};

    .ant-breadcrumb-link,
    .ant-breadcrumb-separator {
        color: ${({theme}) => theme.textMuted} !important;
    }
`;

export const InnerCard = styled.div`
    background: ${vars.cardBg};
    flex: 1;
    min-height: 0;
    box-shadow: ${vars.cardShadow};
    max-width: 100%;
    margin: 1rem;
    width: 100%;
    padding: clamp(1rem, 3vw, 2rem);
    border-radius: 1rem;
    background: ${({theme}) => `color-mix(in oklab, ${theme.textMain} 1%, transparent)`};
    border: ${({theme}) => `1px solid color-mix(in oklab, ${theme.primary} 12%, transparent)`};
`;


styled (AntLayout.Footer)`
    text-align: center;
    background: none !important;
`;

export const AvatarWrap = styled.div`
    grid-column: 3; /* right column */
    justify-self: end;
    margin-left: 16px;
    cursor: pointer;
`;

export const LabelWrap = styled.span`
    display: inline-grid;
    align-items: center;

    > .ghost,
    > .anim {
        grid-area: 1 / 1;
        width: 100px;
    }

    > .ghost {
        visibility: hidden;
        pointer-events: none;
    }

    .nav-revealed,
    .nav-encrypted {
        font-family: inherit;
        font-size: inherit;
        font-weight: inherit;
        line-height: inherit;
        letter-spacing: inherit;
        text-transform: inherit;
        font-variant-ligatures: none;
        font-feature-settings: "liga" 0, "clig" 0;
        font-synthesis: none;
    }
`;

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @                                                           @
// @                                                           @
// @  ███████╗███████╗ ██████╗████████╗██╗ ██████╗ ███╗   ██╗  @
// @  ██╔════╝██╔════╝██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║  @
// @  ███████╗█████╗  ██║        ██║   ██║██║   ██║██╔██╗ ██║  @
// @  ╚════██║██╔══╝  ██║        ██║   ██║██║   ██║██║╚██╗██║  @
// @  ███████║███████╗╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║  @
// @  ╚══════╝╚══════╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝  @
// @                                                           @
// @                                                           @
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

export const HeaderSection = styled.div`
    text-align: left;

    & h1 {
        color: ${({theme}) => theme.textMain};
        font-family: ${({theme}) => fonts.heading};
        text-align: start;
    }
`;

export const SectionHeader = styled.h2`
    margin-bottom: 1rem;
    font-family: ${fonts.heading};
    font-size: clamp(1.2rem, 2vw, 1.9rem);
    color: ${({theme}) => theme.textMain};
    font-weight: 600;
`;
export const SectionSub = styled.p`
    margin: 0 0 10px;
    font-family: ${fonts.body};
    color: ${({theme}) => theme.textMuted};
    font-size: .95rem;
`;