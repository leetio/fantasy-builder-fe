import React from "react";
import {observer} from "mobx-react";
import {useViewController} from "data/hooks";
import {Bindings} from "bindings";
import {type ILeagueController} from "views/pages/league/league.controller";
import {NavLink, Outlet, useLocation, useNavigate, useParams} from "react-router-dom";
import {Preloader} from "views/components/preloader";
import {Typography, Container, Box, Tab, Tabs, styled} from "@mui/material";

const LeagueContainer = styled(Container)`
	padding: 0;
	color: #0f0f0f;

	h2 {
		margin: 20px 0;
		color: #0f0f0f;
		font-size: 28px;
		font-style: normal;
		font-weight: 700;
		line-height: 130%; /* 36.4px */
		text-transform: capitalize;
	}

	.MuiBox-root {
		margin: 0;
		border: none;
	}

	.MuiTabs-flexContainer {
		padding: 0;
		a {
			color: #ffffff;
			text-align: center;
			font-size: 14px;
			font-style: normal;
			font-weight: 700;
			line-height: 140%;
			display: flex;
			padding: 14px 20px;
			justify-content: center;
			align-items: center;
			gap: 8px;
			background: #151b34;
			border-radius: 4px 4px 0 0;
			border: 1px solid #dbdbdb;
			border-bottom: none;
			margin-left: -1px;
			text-transform: none;

			&:first-child {
				margin-left: 0;
			}

			&.active {
				background: #ffffff;
				color: #0000dc;
			}
		}
	}

	.MuiTabs-indicator {
		background: transparent;
	}
`;

export const LeaguePage: React.FC = observer(() => {
	const {league, isLoading, tabs, activeIndex} = useViewController<ILeagueController>(
		Bindings.LeagueController,
		{
			leagueId: Number(useParams<{leagueId: string}>().leagueId),
			location: useLocation(),
			navigate: useNavigate(),
		}
	);

	if (isLoading || !league) return <Preloader />;

	return (
		<LeagueContainer>
			<Typography textAlign="center" variant="h2" mb={2}>
				{league.name}
			</Typography>
			<Box sx={{borderBottom: 1, borderColor: "divider"}} mb={2}>
				<Tabs value={activeIndex}>
					{tabs.map((tab, index) => (
						<Tab key={index} component={NavLink} to={tab.path} label={tab.name} />
					))}
				</Tabs>
			</Box>
			<Outlet />
		</LeagueContainer>
	);
});

export default LeaguePage;
