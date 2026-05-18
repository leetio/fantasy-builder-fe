import React from "react";
import {useViewController} from "data/hooks";
import type {IMyAccountController} from "views/pages/my_account/my_account.controller";
import {observer} from "mobx-react";
import {Bindings} from "bindings";
import {ErrorText, Input, Label} from "views/components/form";
import {Exist} from "views/components/exist/exist.component";
import styled from "@emotion/styled";
import {
	Box,
	Button,
	Container,
	Divider,
	FormControl,
	Paper,
	Stack,
	Switch,
	Typography,
} from "@mui/material";
import {NavLink} from "react-router-dom";
import {DeleteAccount} from "views/components/delete_account/delete_account.component";

const UnderLine = styled(NavLink)`
	text-decoration: underline;
	font-weight: 700;
`;

export const MyAccountPage: React.FC = observer(() => {
	const {
		i18n,
		user,
		error,
		displayName,
		isFormDisabled,
		isUpdateDisabled,
		isNotificationFormDisabled,
		handleInputDisplayNameValue,
		handleFormSubmit,
		handleClearErrorOnChange,
		handleNotificationFormSubmit,
		handleNotificationFormChange,
		handleLogout,
	} = useViewController<IMyAccountController>(Bindings.MyAccountController);

	return (
		<Container
			sx={{
				px: {xs: 0, md: 2},
			}}>
			<Box py={{xs: 2, md: 4}} px={{xs: 2, md: 0}}>
				<Typography variant={"h3"} fontSize={{xs: "24px", md: "28px"}}>
					{i18n.t("my_account.page.title", "My Account")}
				</Typography>
			</Box>
			<Stack gap={3} direction={{xs: "column", md: "row"}} sx={{paddingBottom: 2}}>
				<Box flex={1}>
					<Paper>
						<Box p={2}>
							<Stack gap={2.5}>
								<Stack gap={0.5}>
									<Typography variant={"h5"} fontSize={{xs: "16px"}}>
										{i18n.t("my_account.details.title", "Personal Information")}
									</Typography>
									<Typography variant={"body1"} fontSize={{xs: "14px"}}>
										{i18n.t(
											"my_account.details.info_part_one",
											"All fields are required. If you face any issues, please"
										)}{" "}
										<UnderLine to={"/help/contact-us"}>
											{i18n.t("my_account.details.click_here", "Click here")}
										</UnderLine>{" "}
										{i18n.t(
											"my_account.details.info_part_two",
											"to contact our support team."
										)}
									</Typography>
								</Stack>
								<form
									onSubmit={handleFormSubmit}
									onChange={handleClearErrorOnChange}
									noValidate={true}>
									<Stack direction="column" gap={3}>
										<FormControl fullWidth>
											<Input
												defaultValue={user.email}
												disabled={isFormDisabled}
												label="Email"
												name="email"
												type="email"
												placeholder="Email"
												required={true}
												error={Boolean(error?.email)}
												helperText={error?.email}
											/>
										</FormControl>
										<FormControl fullWidth>
											<Input
												disabled={isFormDisabled}
												value={displayName}
												onInput={handleInputDisplayNameValue}
												label="Display name"
												name="displayName"
												type="text"
												placeholder="Display name"
												slotProps={{
													htmlInput: {
														maxLength: 40,
													},
												}}
												required={true}
												error={Boolean(error?.displayName)}
												helperText={error?.displayName}
											/>
										</FormControl>
										<Exist when={error?.common}>
											<ErrorText>{error?.common}</ErrorText>
										</Exist>
										<Button
											disabled={isUpdateDisabled}
											fullWidth
											sx={{maxWidth: {xs: "100%", md: 200}}}
											type="submit">
											{i18n.t("my_account.update.copy_button", "Update")}
										</Button>
									</Stack>
								</form>

								<Divider className="my-4" />

								<form
									onSubmit={handleNotificationFormSubmit}
									onChange={handleNotificationFormChange}>
									<Typography mb={1.5}>
										{i18n.t(
											"my_account.notifications.title",
											"Notification Settings"
										)}
									</Typography>
									<Stack
										className="mt-4"
										direction="row"
										alignItems="center"
										spacing={2}>
										<Switch
											key={`notif-${user.isNotificationsEnabled}`}
											defaultChecked={user.isNotificationsEnabled}
											disabled={isFormDisabled}
											name="isNotificationsEnabled"
											id="isNotificationsEnabled"
										/>
										<Label htmlFor="isNotificationsEnabled">
											{i18n.t("registration.notifications.label")}
										</Label>
									</Stack>
									<Button
										disabled={isNotificationFormDisabled}
										sx={{minWidth: {xs: "100%", md: 200}}}
										type="submit">
										{i18n.t("my_account.update.copy_cpoo_button", "Update")}
									</Button>
								</form>
							</Stack>
						</Box>
					</Paper>
				</Box>
				<Box flex={1} maxWidth={{xs: "100%", md: 380}}>
					<Stack gap={3}>
						<Paper>
							<Box p={2}>
								<DeleteAccount />
							</Box>
						</Paper>
						<Paper>
							<Box p={2}>
								<Stack gap={1.5}>
									<Typography variant={"h5"} fontSize={"16px"}>
										{i18n.t("my_account.logout.title", "Log Out Of My Account")}
									</Typography>
									<Button
										variant="outlined"
										onClick={handleLogout}
										fullWidth
										sx={{mr: 0}}>
										{i18n.t("my_account.logout.copy_button", "Logout")}
									</Button>
								</Stack>
							</Box>
						</Paper>
					</Stack>
				</Box>
			</Stack>
		</Container>
	);
});

export default MyAccountPage;
