import React from "react";
import {observer} from "mobx-react";
import {useViewController} from "data/hooks";
import {Bindings} from "bindings";
import type {
	ILeague,
	ILeagueInviteFormController,
} from "views/components/league_invite_form/league_invite_form.controller";
import {Box, Button, FormControl, Stack, Typography} from "@mui/material";
import {Input} from "views/components/form";
import {Preloader} from "views/components/preloader";
import {Exist} from "views/components/exist/exist.component";

interface IProps {
	league: ILeague | null;
}

export const LeagueInviteForm: React.FC<IProps> = observer(({league}) => {
	const {
		i18n,
		isCodeCopied,
		isEmailsSend,
		areEmailsValid,
		isMobileShareVisible,
		copyCode,
		shareViaFB,
		shareViaTW,
		shareViaMobile,
		validateEmailsInput,
		handleInvite,
	} = useViewController<ILeagueInviteFormController>(Bindings.LeagueInviteFormController, {
		league,
	});

	if (!league) return <Preloader />;

	return (
		<form onChange={validateEmailsInput} onSubmit={handleInvite}>
			<Stack direction="column" gap={3}>
				<Box>
					<Typography variant="body1" mb={1.5}>
						{i18n.t("league_invite.invite_code.title", "Invite Via Code")}
					</Typography>
					<Typography
						variant="body2"
						mb={1.5}
						dangerouslySetInnerHTML={{
							__html: i18n.t(
								"league_invite.invite_code.text",
								"Great, now that you have created a league, invite others to join.<br/>Your unique league code for {{ name }} is: {{ code }}",
								{name: league.name, code: league.code}
							),
						}}
					/>
					<Button variant="contained" type="button" onClick={copyCode}>
						<Exist when={!isCodeCopied}>
							{i18n.t("league_invite.invite_code.button_copy", "Copy Code")}
						</Exist>
						<Exist when={isCodeCopied}>
							{i18n.t("league_invite.invite_code.button_copied", "Code Copied")}
						</Exist>
					</Button>
				</Box>
				<Box>
					<Typography variant="body1" mb={1.5}>
						{i18n.t("league_invite.invite_email.title", "Invite Via Email")}
					</Typography>
					<Stack gap={1.5}>
						<FormControl fullWidth>
							<Input
								label={i18n.t("league_invite.invite_email.label", "Email Address")}
								name="emails"
								type="text"
								placeholder={i18n.t(
									"league_invite.invite_email.placeholder",
									"Enter email separated by `,` for multiple"
								)}
							/>
						</FormControl>
						<Button
							variant="contained"
							type="submit"
							fullWidth
							disabled={!areEmailsValid}>
							<Exist when={!isEmailsSend}>
								{i18n.t(
									"league_invite.invite_email.button_sent_invites",
									"Send Invites"
								)}
							</Exist>
							<Exist when={isEmailsSend}>
								{i18n.t(
									"league_invite.invite_email.button_send_invites",
									"Invites were send"
								)}
							</Exist>
						</Button>
					</Stack>
				</Box>
				<Box>
					<Typography variant="body1" mb={1.5}>
						{i18n.t("league_invite.invite_social.title", "Invite Via Social")}
					</Typography>
					<Exist when={!isMobileShareVisible}>
						<Stack direction="row" gap={2}>
							<Button variant="contained" onClick={shareViaFB}>
								Facebook
							</Button>
							<Button variant="contained" onClick={shareViaTW}>
								Twitter
							</Button>
						</Stack>
					</Exist>
					<Exist when={isMobileShareVisible}>
						<Button variant="contained" onClick={shareViaMobile}>
							{i18n.t("league_invite.invite_social.button_share", "Share")}
						</Button>
					</Exist>
				</Box>
			</Stack>
		</form>
	);
});
