import React from "react";
import {observer} from "mobx-react";
import {useViewController} from "data/hooks";
import {Bindings} from "bindings";
import {type ICreateLeagueController} from "views/pages/create_league/create_league.controller";
import {
	Box,
	Button,
	Container,
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
import {Exist} from "views/components/exist/exist.component";
import {Preloader} from "views/components/preloader";
import {Input, Select} from "views/components/form";
import {isEmpty} from "lodash-es";
import {LeaguePrivacy} from "data/enums";
import {LeagueInviteForm} from "views/components/league_invite_form/league_invite_form.component";
import {NavLink} from "react-router-dom";

export const CreateLeaguePage: React.FC = observer(() => {
	const {
		i18n,
		rounds,
		tmpLeague,
		isLoading,
		formValue,
		isFormDisabled,
		isCreateButtonDisabled,
		handleCreateLeague,
		handleFormChange,
		startRoundChange,
	} = useViewController<ICreateLeagueController>(Bindings.CreateLeagueController);

	const {PUBLIC, PRIVATE} = LeaguePrivacy;
	const leagueNameLabel = i18n.t("league_create.league_name.label", "League Name");
	const startRoundLabel = i18n.t("league_create.start_round.label", "Start round");

	return (
		<Container>
			<Typography textAlign="center" variant="h2" mb={2}>
				{i18n.t("league_create.page.title", "Create a league")}
			</Typography>
			<Stack gap={3} direction={{xs: "column", md: "row"}}>
				<Box flex={1}>
					<Paper>
						<Box p={2}>
							<Typography variant="h6" mb={2}>
								{i18n.t("league_create.step_1.title", "STEP 1: League Settings")}
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
											disabled={isFormDisabled}
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
													<MenuItem key={round.id} value={round.id}>
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
											defaultValue={PRIVATE}
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
										disabled={isCreateButtonDisabled}
										onClick={handleCreateLeague}>
										<Exist when={!isLoading}>
											{i18n.t(
												"league_create.button_create.label",
												"Create league"
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
				</Box>
				<Box flex={1}>
					<Exist when={tmpLeague}>
						<Paper>
							<Box p={2}>
								<Typography variant="h6" mb={2}>
									{i18n.t(
										"league_create.step_2.title",
										"STEP 2: Invite your friends"
									)}
								</Typography>
								<Box mb={2}>
									<LeagueInviteForm league={tmpLeague} />
								</Box>
								<Button
									fullWidth
									variant="contained"
									component={NavLink}
									to={`/leagues/${tmpLeague?.id ?? ""}`}>
									{i18n.t("league_create.button_go_to.label", "Go to league")}
								</Button>
							</Box>
						</Paper>
					</Exist>
				</Box>
			</Stack>
		</Container>
	);
});

export default CreateLeaguePage;
