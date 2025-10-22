import styled from "styled-components";
import {Button} from "antd";
import theme, {fonts} from "../styles/theme.js";
import {vars} from "../layout/styles.module.js";
import image from "../assets/girl.png"

export const Hero = styled.div`
    //;  max-width: 1300px;
    // margin: 0 auto;
    padding: clamp(2rem, 4vw, 3rem) clamp(2rem, 4vw, 3rem) clamp(2rem, 4vw, 3rem);
    max-height: 100svh;
    min-height: 50svh;
    display: flex;
    flex-direction: column;
    place-items: center;
    position: relative;
    justify-content: center;
    align-items: center;
    max-width: min(1300px, 100%);
    align-self: center;
    @media (max-width: 900px) {
        width: 100%;
        flex-direction: column;

    }
`;

export const GettingStarted = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: clamp(16px, 2.5vw, 20px);
    text-align: center;
    width: 80%;
    @media (max-width: 900px) {
        width: 100%;
        flex-direction: column;

    }
    justify-content: center;

`;
export const Illustration = styled.img`
    background-size: contain;
    background-position: center;
    bottom: -10px;
    flex: 1;
    max-height: 80%;
    height: 80%;
    width: 50%;
    display: block;
    //padding: 1rem;
    @media (max-width: 900px) {
        width: 40%;
    }
`;

// ——— Typographic system
// ...imports e demais exports que você já tem

export const Title = styled.h1`
    margin: 30px auto;
    width: 100%;
    gap: clamp(16px, 2.5vw, 20px);
    font-family: ${({theme}) => fonts.heading};
    font-size: clamp(1rem, 4vw, 4rem);
    color: ${({theme}) => theme.textMain};
    user-select: none;
    text-wrap: wrap;
    text-align: start;
    //text-transform: uppercase;
    font-weight: 600;
    width: 100%;

    b {
        color: ${({theme}) => theme.accent};
    }

    animation: fadeUp .6s ease forwards;
    @keyframes fadeUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    /* glow suave em profundidade */
        // --t1: ${({theme}) => `color-mix(in oklab, ${theme.primary} 28%, transparent)`};
        //--t2: ${({theme}) => `color-mix(in oklab, ${theme.accent} 24%, transparent)`};
    // text-shadow: 0 0 0.01em currentColor,
    0 0 18px var(--t1),
    0 0 36px var(--t2);
    /* flutuação leve (respeita prefers-reduced-motion) */
    @media (prefers-reduced-motion: no-preference) {
        animation: fadeUp .6s ease forwards, hoverFloat 8s ease-in-out .6s infinite;
        will-change: transform, text-shadow;
    }
    @keyframes hoverFloat {
        0%, 100% {
            transform: translateY(0)
        }
        50% {
            transform: translateY(-4px)
        }
    }
    @media (max-width: 900px) {
        text-align: center;
        margin: 50px 0;

    }
`;

export const Accent = styled.b`
    position: relative;
    --accent: ${({theme}) => theme.accent};
    text-underline-offset: -1rem;
    width: fit-content;
    --primary: ${({theme}) => theme.primary};
        // font-family: ${() => fonts.accent2};
    text-wrap: wrap;
    /* MODO B: sublinhado suave quando "soft" */
    ${({soft}) => soft && `
     background: linear-gradient(90deg, var(--accent), var(--primary));
     background-clip: text; -webkit-background-clip: text;
     color: transparent;
  `}

    ${({soft}) => soft && `
         color: transparent;

    &::after{
      content:"";

      position:absolute; left:0; right:0; bottom:-3px; height:0.10em;
      background:
        linear-gradient(90deg,
          color-mix(in oklab, var(--accent) 100%, transparent) 40%,
          color-mix(in oklab, var(--primary) 100%, transparent) 60%,
          var(--primary) 0%);
      border-radius: 3px;
      transform-origin: 0 50%;
      transform: scaleX(0.2);
      opacity:.9;
      @media (prefers-reduced-motion: no-preference){
        animation: underlineSweep 2.2s cubic-bezier(.2,.8,.2,1) .2s forwards;
      }
    }
    @keyframes underlineSweep { to { transform: scaleX(1) } }
  `} /* brilho "shimmer" opcional quando usar $shimmer */ ${({$shimmer}) => $shimmer && `
 background: linear-gradient(90deg, var(--accent), var(--primary));
         background-clip: content-box; -webkit-background-clip: content-box;
 --webkit-background-clip: border-box;
     color: white;
border: 3px solid transparent;
border-radius:8px;
padding: 0 0.3rem !important;
line-height:0.4rem !important;
  `}
`;


export const Subtitle = styled.p`
    --accent: ${({theme}) => theme.accent};
    text-underline-offset: -1rem;
    --primary: ${({theme}) => theme.primary};
    font-family: ${({theme}) => fonts.accent2};
    background: linear-gradient(90deg, var(--accent), var(--primary));
    background-clip: content-box;
    -webkit-background-clip: content-box;;
    border-radius: 18px;
    letter-spacing: -.01875rem;
`

export const Description = styled.small`
    padding: 0.2rem;
    margin-top: 0.25rem;
    border-radius: 4px;
    font-family: ${({theme}) => fonts.body};
    color: ${({theme}) => theme.textMuted};
    width: min(100ch, 100%);
    font-size: clamp(0.9rem, 1vw, 1.1rem);
    letter-spacing: -.01875rem;
    text-align: start;

`;

export const ActionButtons = styled.div`
    display: flex;
    flex-direction: row;
    align-items: start;
    justify-content: start;
    gap: .75rem;
    font-family: ${({theme}) => fonts.body};
    flex-wrap: wrap;

`;

export const LearnMore = styled (Button)`
    font-family: ${({theme}) => fonts.accent};
    margin-top: 0.4rem;
    color: ${({theme}) => theme.textMain};
    cursor: pointer;
`;
// styles.module.js
export const Badge = styled.span`
    align-self: center;
    display: inline-flex;
    align-items: center;
    gap: .5rem;
    padding: .3rem .8rem;
    border-radius: 999px;
    font-size: .8rem;
    font-family: ${({theme}) => fonts.body};

    background: ${({theme}) => `color-mix(in oklab, ${theme.secondary} 30%, transparent)`};
    border: ${({theme}) => `1px solid color-mix(in oklab, ${theme.accent} 30%, transparent)`};
    color: ${({theme}) => theme.textMain};
    backdrop-filter: blur(26px);
`;

export const BadgeIcon = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1rem;
    height: 1rem;
    opacity: .9;

    svg {
        width: 100%;
        height: 100%;
        display: block;
    }
`;

export const HomeStack = styled.main`
    display: flex;
    flex-direction: column;
    gap: 0;
    max-width: 100svw;
    overflow: hidden;
    // padding: clamp(8px, 2vw, 16px) clamp(16px, 3vw, 24px);
    justify-content: start;
    flex-wrap: inherit;

    .about-divider svg {
        fill: ${({theme}) => theme.background};
    }

    @media (max-width: ${vars.bpMobile}) {
        flex-wrap: wrap;
    }

    .custom-shape-divider-bottom-1760888362 {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        overflow: hidden;
        line-height: 0;
        transform: rotate(180deg);
    }

    .custom-shape-divider-bottom-1760888362 svg {
        position: relative;
        display: block;
        width: calc(226% + 1.3px);
        height: 184px;
        transform: rotateY(180deg);
    }

    .custom-shape-divider-bottom-1760888362 .shape-fill {
        fill: ${({theme}) => theme.textMain};
    }
`;
export const Section = styled.div`
    background-color: ${({theme}) => theme.background};
    padding: clamp(3rem, 3vw, 2rem);

    .custom-shape-divider-bottom-1760888362 {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        overflow: hidden;
        line-height: 0;
        transform: rotate(180deg);
    }

    .custom-shape-divider-bottom-1760888362 svg {
        position: relative;
        display: block;
        width: calc(226% + 1.3px);
        height: 184px;
        transform: rotateY(180deg);
    }

    .custom-shape-divider-bottom-1760888362 .shape-fill {
        fill: ${({theme}) => theme.textMain};
    }
`;