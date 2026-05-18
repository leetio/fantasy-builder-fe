import styled from "@emotion/styled";
import {Button, Typography} from "@mui/material";
import {LeaguePrivacy, LeagueType} from "data/enums";

export const RankIcon = styled.span`
	.up {
		color: #151b34;
	}

	.down {
		color: #151b34;
	}
`;

export const LeagueClassStatus = styled.div`
	display: flex;
	width: 24px;
	height: 72px;
	padding: 4px 8px;
	justify-content: center;
	border-radius: 4px 0 0 4px;
	align-items: center;
	background: #151b34;

	&.${LeagueType.OVERALL}, &.${LeagueType.REGULAR}.${LeaguePrivacy.PUBLIC} {
		background: #95ecfd;
	}
`;

export const LeagueClassTypography = styled(Typography)`
	text-transform: capitalize;
	transform: rotate(-90deg);
	letter-spacing: normal;
	color: #ffffff;

	&.${LeagueType.OVERALL}, &.${LeagueType.REGULAR}.${LeaguePrivacy.PUBLIC} {
		color: #151b34;
	}
`;

export const FlexContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	padding-left: 0;
	padding-right: 0;
	height: 100%;
	width: 100%;
`;

export const FlexBetweenContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-left: 0;
	padding-right: 16px;
	height: 100%;
	width: 100%;
`;

export const ArrowContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 24px;
	width: 24px;

	svg {
		width: 100%;
		height: 100%;
	}
`;

export const TextBlock = styled.div`
	display: flex;
	align-items: center;
	gap: 2px;
	height: 16.2px;
`;

export const JoinLeagueButton = styled(Button)`
	width: 70px;
	height: 48px;
`;
