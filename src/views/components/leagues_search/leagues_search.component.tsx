import React from "react";
import {observer} from "mobx-react";
import {useViewController} from "data/hooks";
import {Bindings} from "bindings";
import {type ILeaguesSearchController} from "views/components/leagues_search/leagues_search.controller";
import styled from "@emotion/styled";
import {Box, Button, FormControl, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {SearchInput} from "views/components/form";
import {JoinLeagueList} from "views/components/join_league_list/join_league_list.component";
import {Exist} from "views/components/exist/exist.component";

const Wrapper = styled.div`
	margin-top: 20px;
	padding: 20px;
	background: #ffffff;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	border-radius: 4px;
	margin-bottom: 20px;
	border: 1px solid #e5e5ea;

	@media screen and (max-width: 960px) {
		margin-top: 0;
	}
`;

const LinkStyled = styled(Link)`
	width: 100%;
	@media (min-width: 789px) {
		width: 200px;
	}
`;

export const LeaguesSearch: React.FC = observer(() => {
	const {i18n, searchValue, onSearchLeagueForJoinChange} =
		useViewController<ILeaguesSearchController>(Bindings.LeaguesSearchController);

	return (
		<Wrapper>
			<Typography variant="h5" mb={1} fontSize={"20px"}>
				{i18n.t("join_leagues.search_bar.header", "Invited to a league?")}
			</Typography>

			<FormControl fullWidth variant="standard" sx={{mb: 2}}>
				<SearchInput
					required
					name="search"
					variant="filled"
					value={searchValue}
					placeholder={i18n.t(
						"join_leagues.search_bar.copy",
						"Enter League PIN or League Name"
					)}
					onChange={onSearchLeagueForJoinChange}
				/>
			</FormControl>

			<Typography variant="h5" mb={2} fontSize={"20px"}>
				{i18n.t("join_leagues.create.header", "Or Create Your Own League")}
			</Typography>

			<Box display="flex">
				<Button component={LinkStyled} to="/leagues/create" sx={{width: "auto"}}>
					{i18n.t("join_leagues.create.copy_button", "Create A League")}
				</Button>
			</Box>
		</Wrapper>
	);
});

export const MyLeaguesSearch: React.FC = observer(() => {
	const {i18n, searchValue, onSearchLeagueForJoinChange} =
		useViewController<ILeaguesSearchController>(Bindings.LeaguesSearchController);

	return (
		<React.Fragment>
			<Wrapper>
				<Typography mb={2} variant="h5" fontSize={"20px"}>
					{i18n.t("leagues.search.title", "Invited To A league?")}
				</Typography>

				<FormControl fullWidth variant="standard" sx={{mb: 2}}>
					<SearchInput
						required
						variant="filled"
						name="search"
						value={searchValue}
						placeholder={i18n.t(
							"leagues.search.placeholder",
							"Enter League PIN or League Name"
						)}
						onChange={onSearchLeagueForJoinChange}
					/>
				</FormControl>

				<Typography mb={2} variant="h5" fontSize={"20px"}>
					{i18n.t("leagues.search.option", "Or Select An Option Below")}
				</Typography>

				<Box display="flex" gap={1}>
					<Button component={Link} to="/leagues/create">
						{i18n.t("leagues.search.create", "Create A League")}
					</Button>
					<Button variant="outlined" component={Link} to="/leagues/join">
						{i18n.t("leagues.search.join", "Join A League")}
					</Button>
				</Box>
			</Wrapper>
			<Exist when={searchValue !== ""}>
				<JoinLeagueList />
			</Exist>
		</React.Fragment>
	);
});
