import React from "react";
import {observer} from "mobx-react";
import {useViewController} from "data/hooks";
import {Bindings} from "bindings";
import type {ILeagueSettingsController} from "views/pages/league_settings/league_settings.controller";
import {
	Box,
	Button,
	FormControl,
	FormControlLabel,
	FormLabel,
	MenuItem,
	Paper,
	Radio,
	RadioGroup,
	Stack,
	Typography,
} from "@mui/material";
import {useParams} from "react-router-dom";
import {Input, Select} from "views/components/form";
import {Exist} from "views/components/exist/exist.component";
import {isEmpty, isEqual} from "lodash-es";
import {Preloader} from "views/components/preloader";
import {LeaguePrivacy, RoundStatus} from "data/enums";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

export const LeagueSettingsPage: React.FC = observer(() => {
	const {
		i18n,
		isFormDisabled,
		isLoading,
		league,
		rounds,
		userID,
		formValue,
		leagueUsers,
		isUpdateButtonDisabled,
		isLeagueNameFieldDisabled,
		isLeaguePresenceRequestLoading,
		isLeagueStarted,
		handleFormChange,
		startRoundChange,
		handleUpdateLeague,
		leaveLeague,
		joinLeague,
		loadMoreUsers,
		removeUser,
	} = useViewController<ILeagueSettingsController>(Bindings.LeagueSettingsController, {
		leagueId: Number(useParams<{leagueId: string}>().leagueId),
	});

	if (!league) return <Preloader />;

	const {PUBLIC, PRIVATE} = LeaguePrivacy;
	const leagueNameLabel = i18n.t("league_create.league_name.label", "League Name");
	const startRoundLabel = i18n.t("league_create.start_round.label", "Start round");

	return (
		<Stack direction={{xs: "column-reverse", md: "row"}}>
			<Box flex={1}>
				<Paper>
					{leagueUsers?.users.map((user) => {
						const ID = user.userId;
						const isUserRow = isEqual(userID, ID);
						const isRemovable = !isLeagueStarted && !isUserRow;

						return (
							<Stack
								px={2}
								py={1}
								key={ID}
								direction="row"
								justifyContent="space-between"
								alignItems="center"
								bgcolor={isUserRow ? "primary.main" : "white"}
								color={isUserRow ? "white" : "black"}>
								<Typography>{user.displayName}</Typography>
								<Exist when={isRemovable}>
									<Button sx={{minWidth: 0}} onClick={() => removeUser(ID)}>
										<HighlightOffIcon color="error" />
									</Button>
								</Exist>
							</Stack>
						);
					})}
					<Exist when={isEmpty(leagueUsers?.users)}>
						<Box p={2}>
							<Typography textAlign="center">
								{i18n.t(
									"league_setting.users_list.empty",
									"There are no users yet"
								)}
							</Typography>
						</Box>
					</Exist>
					<Exist when={leagueUsers?.nextPage}>
						<Stack py={2} justifyContent="center" direction="row">
							<Button variant="contained" onClick={loadMoreUsers}>
								<Exist when={!isLeaguePresenceRequestLoading}>
									{i18n.t(
										"league_setting.button_load_more_users.label",
										"Load More"
									)}
								</Exist>
								<Exist when={isLeaguePresenceRequestLoading}>
									<Preloader />
								</Exist>
							</Button>
						</Stack>
					</Exist>
				</Paper>
			</Box>
			<Box flex={1} maxWidth={{xs: "100%", md: 320}}>
				<Stack direction="column" gap={2}>
					<Paper>
						<Box p={2}>
							<Typography variant="h6" mb={2}>
								{i18n.t("league_setting.settings.title", "Settings")}
							</Typography>
							<form onChange={handleFormChange}>
								<Stack direction="column" gap={4}>
									<FormControl fullWidth>
										<Input
											label={leagueNameLabel}
											name="leagueName"
											type="text"
											placeholder={leagueNameLabel}
											required={true}
											value={formValue.leagueName}
											disabled={isLeagueNameFieldDisabled}
											slotProps={{
												htmlInput: {
													minLength: 1,
													maxLength: 128,
												},
											}}
										/>
									</FormControl>
									<Exist when={!isEmpty(rounds)}>
										<FormControl fullWidth>
											<Select
												label={startRoundLabel}
												name="startId"
												type="text"
												// placeholder={startRoundLabel}
												required={true}
												disabled={isFormDisabled}
												value={formValue.startId}
												onChange={startRoundChange}>
												{rounds.map((round) => (
													<MenuItem
														key={round.id}
														value={round.id}
														disabled={
															!isEqual(
																round.status,
																RoundStatus.SCHEDULED
															)
														}>
														{i18n.t(
															"league_create.start_round.option",
															"Round {{ X }}",
															{
																X: round.id,
															}
														)}
													</MenuItem>
												))}
											</Select>
										</FormControl>
									</Exist>
									<FormControl>
										<FormLabel id="radio-buttons-group-privacy">
											{i18n.t("league_create.privacy.label", "Privacy")}
										</FormLabel>
										<RadioGroup
											aria-labelledby="radio-buttons-group-privacy"
											name="privacy"
											value={formValue.privacy}>
											<FormControlLabel
												value={PUBLIC}
												disabled={isFormDisabled}
												control={<Radio />}
												label={i18n.t(
													"league_create.privacy.public",
													"Public"
												)}
											/>
											<FormControlLabel
												value={PRIVATE}
												disabled={isFormDisabled}
												control={<Radio />}
												label={i18n.t(
													"league_create.privacy.private",
													"Private"
												)}
											/>
										</RadioGroup>
									</FormControl>
									<Button
										variant="contained"
										disabled={isUpdateButtonDisabled}
										onClick={handleUpdateLeague}>
										<Exist when={!isLoading}>
											{i18n.t(
												"league_setting.button_update_league.label",
												"Update settings"
											)}
										</Exist>
										<Exist when={isLoading}>
											<Preloader />
										</Exist>
									</Button>
								</Stack>
							</form>
						</Box>
					</Paper>
					<Exist when={league.isJoined}>
						<Paper>
							<Box p={2}>
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
									<Exist when={!isLeaguePresenceRequestLoading}>
										{i18n.t(
											"league_setting.button_leave_league.label",
											"LEAVE LEAGUE"
										)}
									</Exist>
									<Exist when={isLeaguePresenceRequestLoading}>
										<Preloader />
									</Exist>
								</Button>
							</Box>
						</Paper>
					</Exist>
					<Exist when={!league.isJoined}>
						<Paper>
							<Box p={2}>
								<Typography variant="body1" mb={2}>
									{i18n.t("league_setting.join_league.title", "Join League")}
								</Typography>
								<Button fullWidth variant="contained" onClick={joinLeague}>
									<Exist when={!isLeaguePresenceRequestLoading}>
										{i18n.t(
											"league_setting.button_join_league.label",
											"JOIN LEAGUE"
										)}
									</Exist>
									<Exist when={isLeaguePresenceRequestLoading}>
										<Preloader />
									</Exist>
								</Button>
							</Box>
						</Paper>
					</Exist>
				</Stack>
			</Box>
		</Stack>
	);
});

export default LeagueSettingsPage;
