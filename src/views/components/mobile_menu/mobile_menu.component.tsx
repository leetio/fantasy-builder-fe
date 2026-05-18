import React, {Fragment, type PropsWithChildren, type SyntheticEvent, useState} from "react";
import type {INestedMenuItem} from "data/types/navigation";
import {NavLink} from "react-router-dom";
import {Button, Collapse} from "@mui/material";
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import {useLocation} from "react-router";

interface IMobileMenuItemProps {
	to: string;
	end?: boolean;
	className?: string;
	onClick?: (event: SyntheticEvent<HTMLElement, Event>) => void;
}

export const MobileMenuItem: React.FC<PropsWithChildren<IMobileMenuItemProps>> = ({
	children,
	to,
	end,
	className,
	onClick,
}) => (
	<Button
		onClick={onClick}
		fullWidth
		variant="text"
		component={NavLink}
		to={to}
		end={end}
		className={`drawer-menu-item [&.active]:active-drawer-menu-item ${className}`}>
		{children}
	</Button>
);

export const NestedMobileMenuItem: React.FC<INestedMenuItem> = ({
	name,
	path,
	items,
	isEnd,
	onClick,
}) => {
	const {pathname} = useLocation();
	const [isOpen, setIsOpen] = useState(false);

	const toggleIsOpen = (event: SyntheticEvent<HTMLElement, Event>) => {
		event.preventDefault();
		setIsOpen(!isOpen);
	};

	return (
		<Fragment>
			<MobileMenuItem
				to={path}
				end={isEnd?.(pathname)}
				className={`drawer-menu-item [&.active]:active-drawer-menu-item ${isOpen ? "active-drawer-sub-menu-item" : ""}`}
				onClick={onClick || toggleIsOpen}>
				{name}
				{isOpen ? <ExpandLess /> : <ExpandMore />}
			</MobileMenuItem>
			<Collapse className="w-full" timeout="auto" in={isOpen} unmountOnExit>
				{items.map((it, index) => (
					<MobileMenuItem className="pl-5" key={index} to={it.path}>
						{it.name}
					</MobileMenuItem>
				))}
			</Collapse>
		</Fragment>
	);
};
