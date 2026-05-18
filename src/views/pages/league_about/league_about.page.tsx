import React, {Fragment} from "react";
import {observer} from "mobx-react";
import {useViewController} from "data/hooks";
import {Bindings} from "bindings";
import {type ILeagueAboutController} from "views/pages/league_about/league_about.controller";
import {useParams} from "react-router-dom";
import {Box, Button, Paper, Stack, Typography} from "@mui/material";
import {Exist} from "views/components/exist/exist.component";
import {Preloader} from "views/components/preloader";

export const LeagueAboutPage: React.FC = observer(() => {
	const {i18n, league, joinLeague, leaveLeague, isLoading} =
		useViewController<ILeagueAboutController>(Bindings.LeagueAboutController, {
			leagueId: Number(useParams<{leagueId: string}>().leagueId),
		});

	const leaguePrivacyStr = league?.privacy ?? "";
	const isJoined = league?.isJoined;

	return (
		<Stack direction={{xs: "column-reverse", md: "row"}}>
			<Box flex={1}>
				<Paper>
					<Box p={2}>
						<Typography variant="h6" mb={3}>
							{i18n.t("league_about.about.title", "About this league")}
						</Typography>
						<Box mb={2}>
							<Typography variant="body1" mb={1}>
								{i18n.t("league_about.start_round.title", "Starting Round")}
							</Typography>
							<Typography variant="body2">
								{i18n.t("league_about.start_round.value", "Round {{ X }}", {
									X: league?.id,
								})}
							</Typography>
						</Box>
						<Box mb={2}>
							<Typography variant="body1" mb={1}>
								{i18n.t("league_about.privacy.title", "Privacy Settings")}
							</Typography>
							<Typography variant="body2">
								{i18n.t(
									`league_about.privacy.${leaguePrivacyStr}.value`,
									leaguePrivacyStr
								)}
							</Typography>
						</Box>
						<Box mb={2}>
							<Typography variant="body1" mb={1}>
								{i18n.t("league_about.manager.title", "Manager")}
							</Typography>
							<Typography variant="body2">
								{league?.leagueManager?.displayName}
							</Typography>
						</Box>
						<Exist when={isJoined}>
							<Fragment>
								<Typography variant="body1" mb={2}>
									{i18n.t("league_setting.leave_league.title", "Leave League")}
								</Typography>
								<Typography variant="body2" mb={2}>
									{i18n.t(
										"league_setting.leave_league.description",
										"If you leave a league, you can always rejoin it should you wish to do so."
									)}
								</Typography>
								<Button fullWidth variant="contained" onClick={leaveLeague}>
									<Exist when={!isLoading}>
										{i18n.t(
											"league_setting.button_leave_league.label",
											"LEAVE LEAGUE"
										)}
									</Exist>
									<Exist when={isLoading}>
										<Preloader />
									</Exist>
								</Button>
							</Fragment>
						</Exist>
						<Exist when={!isJoined}>
							<Fragment>
								<Typography variant="body1" mb={2}>
									{i18n.t("league_setting.join_league.title", "Join League")}
								</Typography>
								<Button fullWidth variant="contained" onClick={joinLeague}>
									<Exist when={!isLoading}>
										{i18n.t(
											"league_setting.button_join_league.label",
											"JOIN LEAGUE"
										)}
									</Exist>
									<Exist when={isLoading}>
										<Preloader />
									</Exist>
								</Button>
							</Fragment>
						</Exist>
					</Box>
				</Paper>
			</Box>
			<Box flex={1} maxWidth={{xs: "100%", md: 320}}>
				{/* Widgets	*/}
			</Box>
		</Stack>
	);
});

export default LeagueAboutPage;
