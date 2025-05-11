// backgrounds/light/gradients.ts
import styled from 'styled-components';

export const BgLightGradient1 = styled.div`
  position: absolute;
  inset: 0;
  z-index: -10;
  height: 100%;
  width: 100%;
  background-color: white;
  background-image: 
    linear-gradient(to right, #f0f0f0 1px, transparent 1px),
    linear-gradient(to bottom, #f0f0f0 1px, transparent 1px);
  background-size: 6rem 4rem;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle 800px at 100% 200px, #d5c5ff, transparent);
  }
`;

export const BgLightGradient2 = styled.div`
  position: absolute;
  top: 0;
  z-index: -10;
  height: 100vh;
  width: 100vw;
  background-color: white;
  background-image: radial-gradient(60% 120% at 50% 50%, hsla(0,0%,100%,0) 0, rgba(252,205,238,.5) 100%);
`;

export const BgLightGradient3 = styled.div`
  position: absolute;
  top: 0;
  z-index: -2;
  height: 100vh;
  width: 100vw;
  background-color: white;
  background-image: radial-gradient(100% 50% at 50% 0%, rgba(0,163,255,0.13) 0, rgba(0,163,255,0) 50%, rgba(0,163,255,0) 100%);
`;

export const BgLightGradient4 = styled.div`
  position: absolute;
  top: 0;
  z-index: -10;
  height: 100%;
  width: 100%;
  background-color: white;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    height: 500px;
    width: 500px;
    transform: translate(30%, 20%);
    border-radius: 9999px;
    background: rgba(173, 109, 244, 0.5);
    opacity: 0.5;
    filter: blur(80px);
  }
`;

export const BgLightGradient5 = styled.div`
  position: absolute;
  top: 0;
  z-index: -2;
  height: 100vh;
  width: 100vw;
  background-color: white;
  background-image: radial-gradient(ellipse 80% 80% at 50% -20%, rgba(120,119,198,0.3), rgba(255,255,255,0));
`;

export const BgLightGradient6 = styled.div`
  position: absolute;
  inset: 0;
  z-index: -10;
  height: 100%;
  width: 100%;
  background-color: white;
  background: radial-gradient(125% 125% at 50% 10%, #fff 40%, #63e 100%);
`;
export const BgLightGridGradient1 = styled.div`
    position: absolute;
    inset: 0;
    z-index: -10;
    height: 100%;
    width: 100%;
    background-color: white;
    background-image: linear-gradient(to right, #8080800a 1px, transparent 1px),
    linear-gradient(to bottom, #8080800a 1px, transparent 1px);
    background-size: 14px 24px;

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        margin: auto;
        height: 310px;
        width: 310px;
        z-index: -10;
        border-radius: 9999px;
        background-color: rgba(232, 121, 249, 0.3); /* bg-fuchsia-400 with 20% opacity */
        filter: blur(100px);
    }
`;

export const BgLightGridGradient2 = styled.div`
  position: absolute;
  inset: 0;
  z-index: -10;
  height: 100%;
  width: 100%;
  background-color: white;
  background-image:
    linear-gradient(to right, #f0f0f0 1px, transparent 1px),
    linear-gradient(to bottom, #f0f0f0 1px, transparent 1px);
  background-size: 6rem 4rem;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle 500px at 50% 200px, #C9EBFF, transparent);
  }
`;
