// components/LoginButton/styles.module.js
import styled from "styled-components";

/**
 * Flexible, non-fixed sizing:
 * - The button grows with its text (padding-based).
 * - The left pill starts as a square (uses the button's min-height).
 * - On hover the pill expands across, covering the label (which fades out).
 */

export const ButtonWrap = styled.button`
    /* Theme tokens + fallbacks */
    display: flex;
    background-color: #abdb27;
    color: #1d1d1d;
    padding: 0.5rem 1.4rem;
    line-height: 1.25rem;
    font-weight: 500;
    text-align: center;
    vertical-align: middle;
    align-items: center;
    border-radius: 0.5rem;
    gap: 0.75rem;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: .6s ease;
    font-size: clamp(0.9rem, 1vw, 1.1rem);


    svg, path {

    }

    .button:hover {
        box-shadow: none;
    }

`;

// export const Pill = styled.div`
//     /* The collapsed pill width equals the button's inner height (square) */
//     --gap: 4px;
//     position: absolute;
//     top: var(--gap);
//     bottom: var(--gap);
//     left: var(--gap);
//
//     /* square based on current button height */
//     width: calc(100% - (var(--gap) * 2)); /* fallback while we compute height */
//     /* actual collapsed width: innerHeight = minHeight - 2*gap */
//     /* using min-height ensures we always have room for an icon */
//     width: calc(3rem - (var(--gap) * 2));
//
//     z-index: 2;                   /* ABOVE the label so it can cover it on hover */
//     pointer-events: none;
//
//     display: flex;
//     align-items: center;
//     justify-content: center;
//
//     background: #1DB954;
//     border-radius: 0.9rem;
//     transition: width .5s ease;
//     will-change: width;
//
//     box-shadow:
//             inset 0 8px 10px rgba(255,255,255,.15),
//             inset 0 -10px 14px rgba(0,0,0,.12),
//             0 8px 16px rgba(0,0,0,.12);
//
//     svg {
//         width: 1.5rem;
//         height: 1.5rem;
//         color: #e9e6e7 ;  /* black icon like your snippet */
//         filter: drop-shadow(0 2px 4px rgba(0,0,0,.2));
//     }
//
//     /* expand across on hover */
//     ${ButtonWrap}:hover & {
//         width: calc(100% - (var(--gap) * 2));
//     }
// `;

export const Label = styled.p`
    /* put label under the pill; pill will cover it on hover */
    position: relative;
    z-index: 1;
    margin: 0;

    /* keep label from sitting under the collapsed pill */
    padding-left: calc(3rem + .5rem);
    white-space: nowrap;

    /* fade/slide away when pill expands */
    transition: opacity .35s ease, transform .35s ease;

    ${ButtonWrap}:hover & {
        opacity: 0;
        transform: translateX(4px);
    }
`;
