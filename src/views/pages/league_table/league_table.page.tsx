import React from "react";
import {observer} from "mobx-react";
import {useViewController} from "data/hooks";
import {Bindings} from "bindings";
import {
	Box,
	Typography,
	Stack,
	Paper,
	Container,
	Button,
	CircularProgress,
	useMediaQuery,
} from "@mui/material";
import {Exist} from "views/components/exist/exist.component";
import {Preloader} from "views/components/preloader";
import {isEmpty, isEqual} from "lodash-es";
import styled from "@emotion/styled";
import {LeaderboardControls} from "views/components/leaderboard_controls/leaderboard_controls.component";
import {useParams} from "react-router-dom";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import type {ILeagueTableController} from "views/pages/league_table/league_table.controller";
import {SortOrder} from "data/enums";

const Wrapper = styled.div`
	background: #ffffff;
	padding: 15px;

	@media screen and (max-width: 960px) {
		padding: 0;
	}
`;

const LeaderboardRow = styled(Stack)`
	flex-flow: row;
	width: 100%;
	justify-content: space-between;
	border-bottom: 1px solid #dbdbdb;
	padding: 4px 16px;
	align-items: center;

	&.user-row {
		background: #151b34;
	}
`;

const TableHeader = styled(Stack)`
	flex-flow: row;
	background: #373737;
	color: #fff;
	padding: 0 16px;
	height: 52px;
	align-items: center;
	justify-content: space-between;
`;

const Cell = styled(Box)`
	width: 100%;
	display: flex;
	font-size: 14px;
	font-weight: 700;
	flex-shrink: 0;
	flex-grow: 0;
`;

const TeamInfoCell = styled(Box)`
	max-width: 100%;
	width: 100%;
	flex: 1 1 100%;
	display: flex;
	flex-flow: column;
	overflow: hidden;
	p {
		white-space: normal;
		overflow: hidden;
		text-overflow: ellipsis;
	}
`;

const DesktopSelectWrapper = styled.div`
	position: absolute;
	right: -15px;
	width: 180px;
	top: -115px;
`;

const SortButton = styled.button`
	background: transparent;
	border: none;
	position: relative;
	white-space: nowrap;
	font-size: 14px;
	font-weight: 700;
	color: #fff;

	.asc,
	.desc {
		position: absolute;
		left: 50%;
		font-size: 16px;
		color: #636366;

		&.active {
			color: #ffffff;
		}
	}

	.asc {
		top: 0;
		transform: translate(-30%, -65%);
	}
	.desc {
		bottom: 0;
		transform: translate(-30%, 65%);
	}
`;

const LoadMoreButton = styled(Button)`
	background: #95ecfd;
	color: #0000dc;
	border-radius: 0;
	height: 60px;
	text-decoration: underline;
	font-size: 16px;
	font-style: normal;
	font-weight: 700;
`;

const checkAscStat = (order: SortOrder, currentSortBy: string, statName: string) => (
	<ArrowDropUpIcon
		className={`asc ${currentSortBy === statName && order === SortOrder.ASC ? "active" : ""}`}
	/>
);

const checkDescStat = (order: SortOrder, currentSortBy: string, statName: string) => (
	<ArrowDropDownIcon
		className={`desc ${currentSortBy === statName && order === SortOrder.DESC ? "active" : ""}`}
	/>
);

export const LeagueTablePage: React.FC = observer(() => {
	const {
		i18n,
		rankingsList,
		nextPage,
		isLoading,
		isLoadingMore,
		loadMoreUsers,
		userItem,
		rounds,
		selectedWeekId,
		onChangeWeekId,
		currentSortBy,
		currentOrder,
		onSortByStat,
	} = useViewController<ILeagueTableController>(Bindings.LeagueTableController, {
		leagueId: Number(useParams<{leagueId: string}>().leagueId),
	});

	const isMobile = useMediaQuery("(max-width: 900px)");

	return (
		<Wrapper>
			<Container
				sx={{
					px: {xs: 0},
					position: "relative",
				}}>
				<Exist when={!isMobile}>
					<DesktopSelectWrapper>
						<Stack
							direction={"row"}
							alignItems={"center"}
							justifyContent={"space-between"}>
							<Box
								sx={{
									display: {xs: "none", md: "flex"},
									maxWidth: "180px",
									width: "100%",
									background: "#fff",
								}}>
								<LeaderboardControls
									rounds={rounds}
									selectedWeekId={selectedWeekId}
									onWeekChange={onChangeWeekId}
								/>
							</Box>
						</Stack>
					</DesktopSelectWrapper>
				</Exist>
				<Stack gap={3} direction={{xs: "column", md: "row"}}>
					<Box flex={1} width={"100%"}>
						<Paper>
							<Box>
								<Box
									sx={{
										display: {xs: "flex", md: "none"},
										margin: "10px",
										background: "#f6f6f6",
									}}>
									<LeaderboardControls
										rounds={rounds}
										selectedWeekId={selectedWeekId}
										onWeekChange={onChangeWeekId}
									/>
								</Box>

								<TableHeader>
									<Cell maxWidth={50}>
										{i18n.t("league.table.head.rank", "Rank")}
									</Cell>
									<TeamInfoCell></TeamInfoCell>
									<Cell maxWidth={75} justifyContent={"center"}>
										<SortButton onClick={() => onSortByStat("points")}>
											{checkAscStat(currentOrder, currentSortBy, "points")}
											{i18n.t("league.table.head.round_pts", "Round Pts")}
											{checkDescStat(currentOrder, currentSortBy, "points")}
										</SortButton>
									</Cell>
									<Cell maxWidth={75} justifyContent={"center"}>
										<SortButton onClick={() => onSortByStat("overall_points")}>
											{checkAscStat(
												currentOrder,
												currentSortBy,
												"overall_points"
											)}
											{i18n.t("league.table.head.total_pts", "Total Pts")}
											{checkDescStat(
												currentOrder,
												currentSortBy,
												"overall_points"
											)}
										</SortButton>
									</Cell>
								</TableHeader>
								<Exist when={!isLoading}>
									{rankingsList.map((user) => {
										const ID = user.userId;
										const isUserRow = isEqual(userItem?.userId, ID);

										return (
											<LeaderboardRow
												className={isUserRow ? "user-row" : ""}
												key={ID}>
												<Cell maxWidth={50}>{user.rank}</Cell>

												<TeamInfoCell>
													<Typography variant={"body1"} fontWeight={700}>
														{user.userName}
													</Typography>
													<Exist when={!!user.teamName}>
														<Typography
															variant={"body1"}
															fontWeight={400}
															fontSize={"12px"}>
															{user.teamName}
														</Typography>
													</Exist>
												</TeamInfoCell>

												<Cell maxWidth={75} justifyContent={"center"}>
													{user.points === null ? "--" : user.points}
												</Cell>
												<Cell maxWidth={75} justifyContent={"center"}>
													{user.overallPoints === null
														? "--"
														: user.overallPoints}
												</Cell>
											</LeaderboardRow>
										);
									})}
								</Exist>
								<Exist when={isLoading}>
									<Preloader />
								</Exist>
								<Exist when={isEmpty(rankingsList)}>
									<Exist when={isLoading}>
										<Stack
											p={2}
											justifyContent={"center"}
											alignItems={"center"}>
											<CircularProgress size={"20px"} color={"primary"} />
										</Stack>
									</Exist>
									<Exist when={!isLoading}>
										<Box p={2}>
											<Typography textAlign="center">
												{i18n.t(
													"league.table.users_list.empty",
													"Leaderboards will be available at the completion of the first match"
												)}
											</Typography>
										</Box>
									</Exist>
								</Exist>

								<Exist when={nextPage}>
									<Stack py={2} justifyContent="center" direction="row">
										<LoadMoreButton
											variant="text"
											onClick={() => void loadMoreUsers()}
											fullWidth>
											<Exist when={!isLoadingMore}>
												{i18n.t(
													"league.table.button_load_more_users.label",
													"Load More"
												)}
											</Exist>
											<Exist when={isLoadingMore}>
												<Preloader />
											</Exist>
										</LoadMoreButton>
									</Stack>
								</Exist>
							</Box>
						</Paper>
					</Box>
				</Stack>
			</Container>
		</Wrapper>
	);
});

export default LeagueTablePage;
