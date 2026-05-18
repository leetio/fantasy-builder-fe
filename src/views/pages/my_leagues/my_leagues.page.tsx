import React from "react";
import {observer} from "mobx-react";
import {useViewController} from "data/hooks";
import {Bindings} from "bindings";
import {type IMyLeaguesController} from "views/pages/my_leagues/my_leagues.controller";
import {Box, Button, Container, Stack, Typography} from "@mui/material";
import {isEmpty} from "lodash-es";
import {Exist} from "views/components/exist/exist.component";
import {Preloader} from "views/components/preloader";
import {LeagueCard} from "views/components/league_card/league_card.component";
import {MyLeaguesSearch} from "views/components/leagues_search/leagues_search.component";

export const MyLeaguesPage: React.FC = observer(() => {
	const {
		i18n,
		leagues: {leagues, nextPage},
		loadMoreMyLeagues,
		isLoading,
	} = useViewController<IMyLeaguesController>(Bindings.MyLeaguesController);
	const hasLeagues = !isEmpty(leagues);

	return (
		<Container>
			<Stack gap={3} direction={{xs: "column-reverse", md: "row"}} marginBottom={"60px"}>
				<Box flex={1}>
					<MyLeaguesSearch />

					<Typography variant="h5" mb={2} fontSize={"20px"}>
						{i18n.t("my_leagues.page.title", "My Leagues")}
					</Typography>

					<Exist when={hasLeagues}>
						<Stack direction="column" gap={2}>
							{leagues.map((league) => (
								<LeagueCard league={league} key={league.id} />
							))}
							<Exist when={nextPage}>
								<Button onClick={loadMoreMyLeagues} disabled={isLoading}>
									<Exist when={isLoading}>
										<Preloader />
									</Exist>
									<Exist when={!isLoading}>
										{i18n.t("my_leagues.list.load_more", "Load More")}
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
								{i18n.t("my_leagues.list.not_found", "Leagues not found")}
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

export default MyLeaguesPage;
