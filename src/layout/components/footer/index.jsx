import React from "react";
import { FooterWrap } from "./styles.module.js";
export default function Footer() {
		return (
				<FooterWrap>
						Sound Index • ©{new Date().getFullYear()}
						{/*<img src={bunny}></img>*/}
				</FooterWrap>
		);
}
