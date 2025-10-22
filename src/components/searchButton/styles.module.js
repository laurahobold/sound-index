import styled from "styled-components";
import {fonts} from "./../../styles/theme.js";

export const SearchBar = styled.label`
    display: flex;
    align-items: center;
    gap: .5rem;
    width: min(320px, 100%);
    padding: .6rem .8rem;
    border-radius: 12px;
    background: ${({theme}) => `color-mix(in oklab, ${theme.textMain} 4%, ${theme.background} 96%)`};
    border: 1px solid ${({theme}) => `color-mix(in oklab, ${theme.textMain} 16%, transparent)`};
    box-shadow: 0 1px 0 rgba(0, 0, 0, .04) inset;
    transition: border .15s ease, box-shadow .15s ease, background .15s ease;

    &:focus-within {
        border-color: ${({theme}) => theme.accent};
        box-shadow: 0 0 0 4px ${({theme}) => `color-mix(in oklab, ${theme.accent} 22%, transparent)`};
    }
`;

export const SearchIcon = styled.span`
    display: grid;
    place-items: center;
    width: 22px;
    height: 22px;
    opacity: .7;
`;

export const SearchInput = styled.input`
    flex: 1;
    min-width: 0;
    font: 200 0.98rem ${fonts.body};
    color: ${({theme}) => theme.textMain};
    background: transparent;
    border: 0;
    outline: none;
    padding: 0;

    &::placeholder {
        color: ${({theme}) => theme.textMuted};
        opacity: .9;
    }
`;

export const ClearBtn = styled.button`
    border: 0;
    outline: 0;
    background: ${({theme}) => `color-mix(in oklab, ${theme.textMain} 8%, transparent)`};
    color: ${({theme}) => theme.textMain};
    width: 24px;
    height: 24px;
    border-radius: 6px;
    display: grid;
    place-items: center;
    cursor: pointer;
    opacity: .85;
    transition: background .15s ease, transform .05s ease;

    &:hover {
        opacity: 1;
    }

    &:active {
        transform: translateY(1px);
    }
`;

export const KbdHint = styled.kbd`
    margin-left: .25rem;
    padding: .15rem .4rem;
    font: 600 .7rem ${fonts.body};
    border-radius: 6px;
    border: 1px solid ${({theme}) => `color-mix(in oklab, ${theme.textMain} 18%, transparent)`};
    background: ${({theme}) => `color-mix(in oklab, ${theme.textMain} 4%, transparent)`};
    color: ${({theme}) => theme.textMuted};
    user-select: none;
`;
