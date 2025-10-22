import styled from "styled-components";
import {Layout as AntLayout} from "antd";
import {fonts} from "../../../styles/theme.js";

export const CuteSider = styled (AntLayout.Sider)`
    body {

        // height: 100vh;
        overflow: hidden;
        display: -webkit-box;
        display: -moz-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        align-items: center;
        justify-content: center;
    }


    .logo-sider {
        font-size: clamp(1.2rem, 1vw, 1rem);
        font-weight: 500;

    }

    .sider-logo {
        display: flex;
        //  margin: 2em 0 1em 1em; 
        // padding-bottom: 1em;
        align-items: center;
    }

    z-index: 1;
    padding-top: 10px;
    // max-height: 100svh;
    overflow: hidden;
    background: transparent;

    .ant-menu-item-group-title {
        display: none;
    }

    .ant-menu-item-divider {
        margin-top: -6px;
        border-color: rgba(160, 140, 253, 0.38);
    }

    left: 0;
    top: 0;

    .ant-menu {
        background: transparent;
        padding: 8px;
        border-inline-end: 0 !important;
        height: fit-content;
        position: relative;

    }

    .ant-menu-item {
        margin: 6px 0;
        font-family: ${fonts.body};
        text-transform: uppercase;
        //  border-radius: 12px;
        color: ${({theme}) => theme.textMain};
        transition: transform 160ms ease;
        font-size: clamp(0.7rem, 0.8vw, 0.9rem);
        text-wrap: nowrap;
        overflow: visible;

        &:hover {
            background: color-mix(in oklab, ${({theme}) => theme.textMain} 6%, transparent);
            transform: translateX(1px);
        }

    }

    .ant-menu-title-content {
        overflow: visible !important;
        text-overflow: ellipsis !important;
    }

    .ant-menu-item-selected {
        color: ${({theme}) => theme.accent} !important;
        background: linear-gradient(90deg,
        color-mix(in oklab, ${({theme}) => theme.accent} 20%, transparent),
        transparent 80%) !important;
        box-shadow: inset 0 0 0 1px color-mix(in oklab, ${({theme}) => theme.accent} 30%, transparent);
        position: relative;

        &::before {
            content: "";
            position: absolute;
            left: 8px;
            top: 50%;
            transform: translateY(-50%);
            width: 4px;
            height: 14px;
            border-radius: 999px;
            background: ${({theme}) => theme.accent};
        }
    }

    .ant-layout-sider-zero-width-trigger {
        top: 14px;
        inset-inline-end: -12px;
        background: ${({theme}) => theme.accent};
        color: white;
        border-radius: 999px;
        width: 26px;
        height: 26px;
        box-shadow: 0 6px 20px color-mix(in oklab, ${({theme}) => theme.accent} 36%, transparent);
    }

    @media (max-width: 680px) {
        display: none;
    }
`;
export const Wrapper = styled.div`
    height: fit-content;
    width: fit-content;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    position: fixed
`
export const MenuWrapper = styled.nav`
    display: flex;
    bottom: 1rem;
    left: 1rem;
    position: fixed;
    color: ${({theme}) => theme.textMain};
    font-size: clamp(1rem, 1.8vw, 1.1rem);
`;