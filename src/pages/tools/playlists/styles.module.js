import styled from "styled-components";
import {Button as AntBtn, Input, Table as AntTable} from "antd";
import {fonts} from "../../../styles/theme.js";

// Page wrapper
export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

// Header bar
export const HeadBar = styled.div`
    display: flex;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 12px;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: wrap;

`;

export const Title = styled.h2`
    margin: 0;
    font-family: ${fonts.heading};
    font-size: clamp(2rem, 2vw, 3rem);
    text-wrap: nowrap;
    margin-bottom: 1rem;
    color: ${({theme}) => theme.textMain};
    letter-spacing: 0.02em;
`;
export const Main = styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    height: fit-content;
    @media (max-width: 1100px) {
        width: 100%;
    }
`;

export const Actions = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
`;

// Buttons
export const PrimaryButton = styled (AntBtn)`
    && {
        font-family: ${fonts.body};
        font-weight: 600;
    }
`;

export const SearchButton = styled (Input)`
    && {
        font-family: ${fonts.body};
        font-weight: 600;
        width: fit-content;
    }
`;

export const SecondaryButton = styled (AntBtn)`
    && {
        font-family: ${fonts.body};
    }
`;

export const DangerButton = styled (AntBtn)`
    && {
        font-family: ${fonts.body};
    }
`;

// Drawer head
export const DrawerHeader = styled.div`
    display: grid;
    grid-template-columns: 52px 1fr;
    align-items: center;
    gap: 12px;
    padding: 16px 20px 8px;
`;

export const DrawerTitle = styled.h3`
    margin: 0;
    font-family: ${fonts.heading};
    font-weight: 700;
    font-size: 1.2rem;
    color: ${({theme}) => theme.textMain};
`;

export const DrawerBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 16px;
    border-top: 1px solid ${({theme}) => theme.border};
    border-bottom: 1px solid ${({theme}) => theme.border};
    background: ${({theme}) => `color-mix(in oklab, ${theme.primary} 8%, transparent)`};
    backdrop-filter: blur(8px);
`;

export const DrawerActions = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
`;

// Tracks list
export const DrawerBody = styled.div`
    padding: 10px 8px 24px;
    max-height: calc(100vh - 170px);
    overflow: auto;
`;

export const TrackRow = styled.div`
    display: grid;
    grid-template-columns: 32px 20px 40px 1fr auto;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-bottom: 1px dashed ${({theme}) => theme.border};
    background: ${({
        $dragging,
        theme
    }) => $dragging ? `color-mix(in oklab, ${theme.accent} 12%, transparent)` : "transparent"};

    &:hover {
        background: ${({theme}) => `color-mix(in oklab, ${theme.accent} 8%, transparent)`};
    }
`;

export const DragHandle = styled.button`
    border: 0;
    background: transparent;
    color: ${({theme}) => theme.textMuted};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: grab;
    padding: 4px;

    &:active {
        cursor: grabbing;
    }
`;

export const TrackMeta = styled.div`
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
`;

export const TrackTitle = styled.div`
    font-weight: 600;
    color: ${({theme}) => theme.textMain};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const TrackArtists = styled.div`
    font-size: 12px;
    color: ${({theme}) => theme.textMuted};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;
export const Description = styled.p`
    font-size: clamp(1rem, 1vw, 1.2rem);
    color: ${({theme}) => theme.textMuted};
    text-wrap: pretty;
    width: 100%;
    font-family: ${fonts.body};
`;

export const RightMeta = styled.div`
    font-variant-numeric: tabular-nums;
    color: ${({theme}) => theme.textMuted};
    font-size: 12px;
    margin-left: 6px;
`;
export const Table = styled (AntTable)`
    :where(.ant-table-wrapper) .ant-table.ant-table-middle .ant-table-tbody > tr > td {
        padding-block: 4px;
    !important; /* vertical */
        padding-inline: 8px;
    !important; /* horizontal */
        text-align: start;

    }

    && .ant-table-cell {
        font-family: ${fonts.body};
        padding: 5px 10px !important;
        text-align: start;

    }

    && .ant-table-column-title {
        text-transform: uppercase;
        text-align: start;
        font-size: 15px;
        line-height: 1.1;
    }
`;