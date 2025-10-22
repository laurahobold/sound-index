import React from "react";
import {Table} from "antd";
import {
		Container, Toolbar, StyledTable, BottomBar,
} from "./styles.module.js";

/**
 * Reusable AntD Table shell (no page header).
 *
 * Props:
 * - toolbar?: ReactNode   // filters/search/actions area above the table
 * - footer?: ReactNode    // content shown BELOW the table + pagination
 * - className?: string
 * - ...tableProps         // forwarded to <Table /> unchanged
 */
export default function DataTable ({
		toolbar, footer, className, ...tableProps
}) {
		return ( <Container className={className}>
						{toolbar ? <Toolbar role="toolbar">{toolbar}</Toolbar> : null}

						{/* All behavior stays the same; we only style */}
						<StyledTable
								// keep user’s size unless they override
								size={tableProps.size ?? "middle"}
								{...tableProps}
						/>

						{footer ? <BottomBar>{footer}</BottomBar> : null}
				</Container> );
}
