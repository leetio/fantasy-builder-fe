import React from "react";
import {observer} from "mobx-react";
import {useViewController} from "data/hooks";
import {Bindings} from "bindings";
import {type ILeagueManageController} from "views/pages/league_manage/league_manage.controller";
import styled from "@emotion/styled";
import {
	Box,
	Stack,
	Paper,
	Typography,
	Button,
	styled as materialStyled,
	CircularProgress,
} from "@mui/material";
import {useParams} from "react-router-dom";
import {isEqual, isEmpty} from "lodash-es";
import {Exist} from "views/components/exist/exist.component";
import {Preloader} from "views/components/preloader";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";

const Wrapper = styled.div`
	background: #ffffff;
	padding: 15px;

	@media screen and (max-width: 960px) {
		padding: 0;
	}
`;

const TableHeader = materialStyled(Stack)`
	flex-flow: row;
	justify-content: space-between;
	padding: 12px 16px;
	align-items: center;
	height: 52px;
	background: #373b57;
	color: #fff;
`;

const LeagueRow = materialStyled(Stack)`
	flex-flow: row;
	justify-content: space-between;
	padding: 12px 16px;
	border-bottom: 1px solid #dbdbdb;
	align-items: center;
	color: #ffffff;

	&.user-row {
		background: #0000dc;
	}
`;

export const LeagueManagePage: React.FC = observer(() => {
	const {i18n, leagueUsers, isLeagueStarted, userID, loadMoreUsers, isLoading, removeUser} =
		useViewController<ILeagueManageController>(Bindings.LeagueManageController, {
			leagueId: Number(useParams<{leagueId: string}>().leagueId),
		});

	return (
		<Wrapper>
			<Typography variant="h6" mb={3} fontSize={"16px"} marginBottom={"10px"}>
				{i18n.t("league_manage.title", "Remove Users")}
			</Typography>
			<Stack
				gap={3}
				direction={{xs: "column-reverse", md: "row"}}
				borderRadius={"2px"}
				paddingBottom={2}>
				<Box flex={1}>
					<Stack flex={1} gap={1.5}>
						<Paper>
							<Box p={2} display={{md: "none", xs: "block"}}>
								<Typography variant={"body2"} fontWeight={700}>
									Remove Users
								</Typography>
							</Box>
							<TableHeader>
								<Typography variant={"body2"} fontWeight={700} color={"#ffffff"}>
									{i18n.t("league_manage.table.member", "League Member")}
								</Typography>
								<Typography variant={"body2"} fontWeight={700} color={"#ffffff"}>
									{i18n.t("league_manage.table.remove", "Remove")}
								</Typography>
							</TableHeader>
							{leagueUsers?.users.map((user) => {
								const ID = user.userId;
								const isUserRow = isEqual(userID, ID);
								const isRemovable = !isLeagueStarted && !isUserRow;
								const rowColor = isUserRow ? "#ffffff" : "#151B34";

								return (
									<LeagueRow className={isUserRow ? "user-row" : ""} key={ID}>
										<Stack>
											<Typography
												variant={"body1"}
												fontWeight={700}
												color={rowColor}>
												{user.displayName}
											</Typography>
											<Exist when={!!user.displayName}>
												<Typography
													variant={"body1"}
													fontWeight={400}
													color={rowColor}
													fontSize={"12px"}>
													{i18n.t(
														"league_manage.table.this_is_you",
														"This is you!"
													)}
												</Typography>
											</Exist>
										</Stack>

										<Exist when={isRemovable}>
											<Button
												sx={{minWidth: 0}}
												onClick={() => removeUser(ID)}
												color={"error"}>
												<DeleteForeverRoundedIcon color="error" />
											</Button>
										</Exist>
									</LeagueRow>
								);
							})}
							<Exist when={isEmpty(leagueUsers?.users)}>
								<Exist when={isLoading}>
									<Stack p={2} justifyContent={"center"} alignItems={"center"}>
										<CircularProgress size={"20px"} color={"primary"} />
									</Stack>
								</Exist>
								<Exist when={isLoading}>
									<Box p={2}>
										<Typography textAlign="center">
											{i18n.t(
												"league_setting.users_list.empty",
												"There are no users yet"
											)}
										</Typography>
									</Box>
								</Exist>
							</Exist>
							<Exist when={leagueUsers?.nextPage}>
								<Stack py={2} justifyContent="center" direction="row">
									<Button variant="text" onClick={loadMoreUsers}>
										<Exist when={!isLoading}>
											{i18n.t(
												"league_setting.button_load_more_users.label",
												"Load More"
											)}
										</Exist>
										<Exist when={isLoading}>
											<Preloader />
										</Exist>
									</Button>
								</Stack>
							</Exist>
						</Paper>
						{/*<Box display={{md: "none", xs: "block"}}>*/}
						{/*	<SmallAdvert />*/}
						{/*</Box>*/}
					</Stack>
				</Box>
				{/*<Stack flex={1} maxWidth={{xs: "100%", md: 380}} gap={2}>*/}
				{/*	<Box display={{xs: "none", md: "block"}}>*/}
				{/*		<MainAdvert />*/}
				{/*	</Box>*/}
				{/*</Stack>*/}
			</Stack>
		</Wrapper>
	);
});

export default LeagueManagePage;
