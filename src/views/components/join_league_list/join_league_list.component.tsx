import {observer} from "mobx-react";
import React from "react";
import {Exist} from "views/components/exist/exist.component";
import {Button, Stack, Typography} from "@mui/material";
import {LeagueJoinCard} from "views/components/league_card/league_join_card.component";
import {Preloader} from "views/components/preloader";
import {useViewController} from "data/hooks";
import {Bindings} from "bindings";
import type {IJoinLeaguesController} from "views/controllers/join_leagues/join_leagues.controller";
import {useNavigate, useParams} from "react-router-dom";

export const JoinLeagueList: React.FC = observer(() => {
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
	return (
		<Exist when={leagues.length}>
			<Typography variant="h5" mb={2} fontSize={"20px"}>
				{i18n.t("join_leagues.title", "Leagues for join")}
			</Typography>
			<Stack direction="column" gap={2} marginBottom={"20px"}>
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
							{i18n.t("join_leagues.button.load_more", "Load More")}
						</Exist>
					</Button>
				</Exist>
			</Stack>
		</Exist>
	);
});
