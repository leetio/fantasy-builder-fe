import React from "react";
import {observer} from "mobx-react";
import {useViewController} from "data/hooks";
import {Bindings} from "bindings";
import {type ILeagueInviteController} from "views/pages/league_invite/league_invite.controller";
import {Stack, Typography, Box, Divider, Button} from "@mui/material";
import {Exist} from "views/components/exist/exist.component";
import {useParams} from "react-router-dom";
import styled from "@emotion/styled";
import {ContentCopyRounded, LinkRounded} from "@mui/icons-material";
import FBIcon from "assets/img/sharing/fb.svg?react";
import MobIcon from "assets/img/sharing/mob.svg?react";
import TwIcon from "assets/img/sharing/tw.svg?react";

const Wrapper = styled.div`
	background: #ffffff;
	padding: 15px;
`;

const Buttons = styled(Stack)`
	max-width: 445px;
	width: 100%;
	gap: 12px;
	flex-flow: row;
	margin: 20px 0;

	@media screen and (max-width: 960px) {
		flex-flow: column;
		max-width: none;
		& > button {
			flex: 1;
			text-transform: none;
			max-width: none;
			width: 100%;
		}
	}

	& > button {
		flex: 1;
		text-transform: none;
		width: 100%;
	}

	.small-layout & {
		flex-flow: column;
		max-width: none;
		& > button {
			flex: 1;
			text-transform: none;
			max-width: none;
			width: 100%;
		}
	}
`;

const Icon = styled.div`
	width: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	svg {
		width: 100%;
		height: auto;
	}
`;

export const LeagueInvitePage: React.FC = observer(() => {
	const {
		i18n,
		copyCode,
		isCodeCopied,
		copyLink,
		isLinkCopied,
		isMobileShareVisible,
		shareViaFB,
		shareViaTW,
		shareViaMobile,
	} = useViewController<ILeagueInviteController>(Bindings.LeagueInviteController, {
		leagueId: Number(useParams<{leagueId: string}>().leagueId),
	});

	return (
		<Wrapper>
			<Box>
				<Typography variant="h5" mb={1.5} marginTop={"20px"}>
					{i18n.t("league_invite.invite_code.title", "Invite Friends To Your League")}
				</Typography>
				<Buttons>
					<Button endIcon={<ContentCopyRounded />} type="button" onClick={copyCode}>
						<Exist when={!isCodeCopied}>
							{i18n.t("league_invite.invite_code.button_copy", "Copy Code")}
						</Exist>
						<Exist when={isCodeCopied}>
							{i18n.t("league_invite.invite_code.button_copied", "Code Copied")}
						</Exist>
					</Button>
					<Button endIcon={<LinkRounded />} type="button" onClick={copyLink}>
						<Exist when={!isLinkCopied}>
							{i18n.t(
								"league_invite.invite_code.button_copy_link",
								"Copy League Link"
							)}
						</Exist>
						<Exist when={isLinkCopied}>
							{i18n.t("league_invite.invite_code.button_link_copied", "Link Copied")}
						</Exist>
					</Button>
				</Buttons>
			</Box>
			<Divider />
			<Box>
				<Typography variant="h5" mb={1.5} marginTop={"20px"}>
					{i18n.t("league_invite.invite_social.title", "Invite Via Social")}
				</Typography>
				<Buttons>
					<Exist when={!isMobileShareVisible}>
						<Button
							endIcon={
								<Icon>
									<FBIcon />
								</Icon>
							}
							variant="outlined"
							onClick={shareViaFB}>
							{i18n.t("league_invite.invite_social.facebook", "Facebook")}
						</Button>
						<Button
							endIcon={
								<Icon>
									<TwIcon />
								</Icon>
							}
							variant="outlined"
							onClick={shareViaTW}>
							{i18n.t("league_invite.invite_social.twitter", "Twitter")}
						</Button>
					</Exist>

					<Exist when={isMobileShareVisible}>
						<Button
							endIcon={
								<Icon>
									<MobIcon />
								</Icon>
							}
							onClick={shareViaMobile}>
							{i18n.t("league_invite.invite_social.button_share", "Share")}
						</Button>
					</Exist>
				</Buttons>
			</Box>
		</Wrapper>
	);
});

export default LeagueInvitePage;
