import React from "react";
import {Container} from "@mui/material";
import GSLogo from "assets/img/gs-logo.svg?react";
import {NavLink} from "react-router-dom";

export const Footer: React.FC = () => (
	<div className="p-4 text-white bg-footer">
		<Container className="text-center sm:flex justify-between items-center">
			<div className="sm:text-left">
				<NavLink className="inline-flex mb-3 sm:mb-4" to="/">
					<img
						className="w-10 h-auto sm:w-11"
						src="https://place-hold.it/60x40/666?text=Logo"
						alt=""
					/>
				</NavLink>
				<p className="text-xs hidden sm:block">© 2024 Genius Sports</p>
			</div>
			<div className="mb-2 sm:mb-0 sm:text-right">
				<nav className="flex items-center gap-2 justify-center font-bold mb-2 sm:mb-7">
					<NavLink
						className="text-sm sm:text-base underline hover:no-underline"
						to="/help/terms">
						Terms & Conditions
					</NavLink>
					<span>|</span>
					<NavLink
						className="text-sm sm:text-base underline hover:no-underline"
						to="/help/privacy">
						Privacy Policy
					</NavLink>
				</nav>
				<div>
					<a
						className="flex items-center gap-2 justify-center font-semibold sm:justify-end"
						href="https://geniussports.com/"
						target="_blank"
						rel="nofollow noreferrer">
						<span className="text-xs">Powered By:</span>
						<GSLogo className="w-20 h-auto" />
					</a>
				</div>
			</div>
			<p className="text-xs sm:hidden">© 2024 Genius Sports</p>
		</Container>
	</div>
);
