import React from "react";
import {observer} from "mobx-react";
import {useViewController} from "data/hooks";
import {Bindings} from "bindings";
import {type IJoinLeaguesController} from "views/controllers/join_leagues/join_leagues.controller";
import {Box, Button, Container, Stack, Typography} from "@mui/material";
import {isEmpty} from "lodash-es";
import {Exist} from "views/components/exist/exist.component";
import {Preloader} from "views/components/preloader";
import {useNavigate, useParams} from "react-router-dom";
import {LeaguesSearch} from "views/components/leagues_search/leagues_search.component";
import {LeagueJoinCard} from "views/components/league_card/league_join_card.component";

export const JoinLeaguesPage: React.FC = observer(() => {
	const {
		i18n,
		leagues: {leagues, nextPage},
		loadMoreMyLeagues,
		isLoading,
		joinLeague,
		isJoinInProgress,
	} = useViewController<IJoinLeaguesController>(Bindings.JoinLeaguesController, {
		code: useParams<{code?: string}>()?.code,
		navigate: useNavigate(),
	});

	const hasLeagues = !isEmpty(leagues);

	return (
		<Container>
			<Typography textAlign="center" variant="h2" mb={2}>
				{i18n.t("join_leagues.page.title", "Join a League")}
			</Typography>
			<Stack gap={3} direction={{xs: "column-reverse", md: "row"}}>
				<Box flex={1}>
					<LeaguesSearch />
					<Exist when={hasLeagues}>
						<Typography variant="h5" mb={2} fontSize={"20px"}>
							{i18n.t("join_leagues.page.public_leagues", "Public Leagues")}
						</Typography>
						<Stack direction="column" gap={2}>
							{leagues.map((league) => (
								<LeagueJoinCard
									league={league}
									joinLeague={joinLeague}
									isJoinInProgress={isJoinInProgress}
									isLoading={isLoading}
									key={league.id}
								/>
							))}
							<Exist when={nextPage}>
								<Button onClick={loadMoreMyLeagues} disabled={isLoading}>
									<Exist when={isLoading}>
										<Preloader />
									</Exist>
									<Exist when={!isLoading}>
										{i18n.t("join_leagues.list.load_more", "Load More")}
									</Exist>
								</Button>
							</Exist>
						</Stack>
					</Exist>
					<Exist when={!hasLeagues}>
						<Exist when={isLoading}>
							<Preloader />
						</Exist>
						<Exist when={!isLoading}>
							<Typography textAlign="center" variant="body1">
								{i18n.t("join_leagues.list.not_found", "Leagues not found")}
							</Typography>
						</Exist>
					</Exist>
				</Box>
				<Box flex={1} maxWidth={{xs: "100%", md: 320}}>
					{/*	Widgets */}
				</Box>
			</Stack>
		</Container>
	);
});

export default JoinLeaguesPage;
