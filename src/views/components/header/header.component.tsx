import styled from "@emotion/styled";
import MenuIcon from "@mui/icons-material/Menu";
import React, {Fragment} from "react";
import {observer} from "mobx-react";
import {Button, Container, IconButton, SwipeableDrawer} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {Exist} from "views/components/exist/exist.component";
import {useViewController} from "data/hooks";
import {Bindings} from "bindings";
import {matchPath, NavLink, useLocation} from "react-router-dom";
import {AccountCircleRounded} from "@mui/icons-material";
import type {IHeaderController} from "views/components/header/header.controller";
import InfoIcon from "@mui/icons-material/Info";
import {
	MobileMenuItem,
	NestedMobileMenuItem,
} from "views/components/mobile_menu/mobile_menu.component";

const MenuLink = styled(NavLink)`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 12px 16px;
	color: ${({theme}) => theme.palette.text.medium};
	font-weight: 400;
	font-size: 14px;
	height: 100%;
	border-top: 2px solid transparent;
	border-bottom: 2px solid transparent;
	transition: all 0.2s linear;

	&.active {
		color: #0000dc;
		border-bottom-color: #0000dc;
	}

	@media (hover: hover) {
		&:hover {
			color: #000000;
			border-bottom-color: #000000;
		}
	}
`;

export const Header: React.FC = observer(() => {
	const location = useLocation();
	const {pathname} = location;

	const {i18n, mainMenuItems, isAuthorized, drawer} = useViewController<IHeaderController>(
		Bindings.HeaderController,
		{
			location,
			matchPath,
		}
	);

	return (
		<Fragment>
			<header>
				<div className="flex items-center h-12 bg-slate-900 gap-3 md:py-2.5">
					<Container className="flex justify-between items-center">
						<IconButton className="md:hidden p-0 text-white" onClick={drawer.toggle}>
							{drawer.isOpen ? <CloseIcon /> : <MenuIcon />}
						</IconButton>
						<Exist when={isAuthorized}>
							<Button
								variant="text"
								className="flex gap-2 normal-case ml-auto mr-0 text-white"
								component={NavLink}
								to="/my-account">
								<span className="hidden md:flex">
									{i18n.t("header.my_account", "My Account")}
								</span>
								<AccountCircleRounded />
							</Button>
						</Exist>
					</Container>
				</div>
				<nav className="bg-white border-solid border-b border-gray-200">
					<Container>
						<ul className="flex items-center">
							{mainMenuItems.map(
								({path, isEnd, isHideOnMobile, name, onClick}, index) => (
									<li
										className={`flex-1 md:flex-initial ${isHideOnMobile ? "hidden md:block" : ""}`}
										key={index}>
										<MenuLink
											onClick={onClick}
											to={path}
											end={isEnd?.(pathname)}>
											{name}
										</MenuLink>
									</li>
								)
							)}
							<Exist when={isAuthorized}>
								<li className="ml-auto mr-0 hidden md:block">
									<Button variant="text" className="flex gap-2 normal-case">
										{i18n.t("tutorial.button.open", "Tutorial")}
										<InfoIcon />
									</Button>
								</li>
							</Exist>
						</ul>
					</Container>
				</nav>
			</header>
			<SwipeableDrawer
				disablePortal
				className="md:hidden"
				open={drawer.isOpen}
				onClose={drawer.close}
				onOpen={drawer.open}>
				<div className="w-screen max-w-96">
					{drawer.menu.map((it, index) => (
						<Fragment key={index}>
							{"items" in it ? (
								<NestedMobileMenuItem {...it} />
							) : (
								<MobileMenuItem to={it.path}>{it.name}</MobileMenuItem>
							)}
						</Fragment>
					))}
				</div>
			</SwipeableDrawer>
		</Fragment>
	);
});
