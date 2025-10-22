import styled from "styled-components";
import {Table as AntTable} from "antd";
import {fonts} from "../../styles/theme.js";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem;
    background: #1d1d1d;
    border-radius: 1rem;

`;

/* Filters/search/actions live here, separate from your page header */
export const Toolbar = styled.div`
    display: flex;
    align-items: center;
    justify-content: end;
    gap: 8px;
    flex-wrap: wrap;

    /* sticky helps on long tables; remove if you don’t want it */
    position: sticky;
    top: 0;
    z-index: 2;
    padding-bottom: 1rem;

`;

/* Your shared table skin; functionality unchanged */
export const StyledTable = styled (AntTable)`
    /* Cell padding + alignment */
    max-height: 90svh;
    scroll-behavior: smooth;
    scrollbar-width: none;

    .ant-table-wrapper, .ant-table-pagination.ant-pagination {
        margin: 16px 0 0 !important;
    }

    :where(.ant-table-wrapper)
    .ant-table.ant-table-middle
    .ant-table-tbody
    > tr
    > td {
        padding-block: 4px !important;
        padding-inline: 8px !important;
        text-align: start;
    }

    && .ant-table-cell {
        padding: 6px 10px !important;
        text-align: start;
        font-family: ${fonts.body};

    }

    /* Header look */

    && .ant-table-thead .ant-table-cell {
        text-transform: uppercase;
        letter-spacing: 0.02em;
        font-size: 13px;
        line-height: 1.1;
        color: ${({theme}) => theme?.textMuted || "rgba(255,255,255,0.65)"};

    }

    /* Zebra & hover (optional, minimal) */

    && .ant-table-tbody > tr:nth-child(odd) > td {
        background: rgba(29, 29, 29, 0.57);
    }


    && .ant-table-tbody > tr:hover > td {
    }


`;

/* Rendered AFTER AntD pagination */
export const BottomBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: start;
    // gap: 12px;
    //padding: 10px 0 2px;
    background: ${({theme}) => theme?.background};
`;
