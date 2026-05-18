import {Box, Button, Paper, Typography} from "@mui/material";
import {observer} from "mobx-react";
import React from "react";
import {Exist} from "views/components/exist/exist.component";
import {LeagueStatus, LeagueType} from "data/enums";
import {useViewController} from "data/hooks";
import {Bindings} from "bindings";
import type {
	ILeagueCardController,
	ILeague,
} from "views/components/league_card/league_card.controller";
import {
	FlexBetweenContainer,
	FlexContainer,
	LeagueClassStatus,
	LeagueClassTypography,
	TextBlock,
} from "views/components/league_card/styles";
import {Preloader} from "views/components/preloader";
import {LeagueRankDiff} from "views/components/league_card/league_rank_diff.component";

interface ILeagueCard {
	league: ILeague;
	joinLeague: (id: number) => void;
	isJoinInProgress: (id: number) => boolean;
	isLoading: boolean;
}

export const LeagueJoinCard: React.FC<ILeagueCard> = observer(
	({league, joinLeague, isJoinInProgress, isLoading}) => {
		const {i18n, isManagerShow} = useViewController<ILeagueCardController>(
			Bindings.LeagueCardController,
			{league}
		);

		const leagueClass = `${league.class} ${league.privacy}`;

		return (
			<Paper sx={{height: "72px", border: "1px solid #E5E5EA", boxShadow: "none"}}>
				<FlexBetweenContainer>
					<FlexContainer>
						<LeagueClassStatus className={leagueClass}>
							<LeagueClassTypography
								className={leagueClass}
								variant="caption"
								fontWeight={"bold"}>
								<Exist when={league.class !== LeagueType.REGULAR}>
									{i18n.t(`league_card.class.${league.class}`, league.class)}
								</Exist>
								<Exist when={league.class === LeagueType.REGULAR}>
									{i18n.t(
										`league_card.privacy.${league.privacy}`,
										league.privacy
									)}
								</Exist>
							</LeagueClassTypography>
						</LeagueClassStatus>

						<Box p={2}>
							<Typography>{league.name}</Typography>

							<Exist when={isManagerShow}>
								<TextBlock>
									<Typography variant="caption" fontWeight={"bold"}>
										{i18n.t("league_card.label.manager", "Chairman")}:
									</Typography>
									<Typography variant="caption" fontWeight={"normal"}>
										{league.leagueManager?.displayName}
									</Typography>
								</TextBlock>
							</Exist>
							<TextBlock>
								<Typography variant="caption" fontWeight={"bold"}>
									{i18n.t("league_card.label.users_joined", "Teams")}:
								</Typography>
								<Typography variant="caption" fontWeight={"normal"}>
									{league.numTeams.toLocaleString()}
								</Typography>
							</TextBlock>
							<Exist when={league.status !== LeagueStatus.SCHEDULED && league?.rank}>
								<TextBlock>
									<Typography variant="caption" fontWeight={"bold"}>
										{i18n.t("league_card.label.rank", "Rank")}:
									</Typography>

									<LeagueRankDiff
										rank={league?.rank || 0}
										prevRank={league?.prevRank || 0}
									/>
									<Typography variant="caption" fontWeight={"normal"}>
										{`${league.rank || "-"}/${league.numTeams}`}
									</Typography>
								</TextBlock>
							</Exist>
						</Box>
					</FlexContainer>
					<Button
						variant="outlined"
						disabled={isLoading}
						onClick={() => joinLeague(league.id)}>
						<Exist when={isJoinInProgress(league.id)}>
							<Preloader />
						</Exist>
						<Exist when={!isJoinInProgress(league.id)}>
							{i18n.t("join_leagues.button.join", "Join")}
						</Exist>
					</Button>
				</FlexBetweenContainer>
			</Paper>
		);
	}
);
