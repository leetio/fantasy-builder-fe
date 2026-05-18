import React, {Fragment} from "react";
import {useViewController} from "data/hooks";
import {type ILandingController} from "views/pages/landing/landing.controller";
import {observer} from "mobx-react";
import {Button, Container} from "@mui/material";
import {Bindings} from "bindings";
import styled from "@emotion/styled";
import {ModalLogin} from "views/components/modals/modal_login/modal_login.component";
import {ModalForgotPassword} from "views/components/modals/modal_forgot_password/modal_forgot_password.component";
import {ModalRegistration} from "views/components/modals/modal_registration/modal_registration.component";

const Wrapper = styled.div`
	background: #161616;
	width: 100%;
	flex: 1;
`;

const Description = styled.div`
	text-align: center;
	width: 100%;
	margin: 100px 0;

	@media screen and (max-width: 960px) {
		margin-top: 260px;
		padding: 0 40px;
	}

	h3 {
		font-size: 40px;
		font-style: normal;
		font-weight: 700;
		line-height: 120%;
		text-transform: capitalize;
		color: #ffffff;
	}

	div {
		color: #ffffff;
		font-size: 16px;
		font-style: normal;
		font-weight: 700;
		line-height: 150%;
		max-width: 600px;
		margin: 15px auto 10px auto;
	}

	a {
		margin-top: 20px;
		width: 140px;
	}
`;

const StepsWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 20px 0 70px 0;

	@media screen and (max-width: 960px) {
		flex-direction: column;
	}
`;

const StepBlock = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	width: 340px;
	height: 140px;
	background: #ffffff;
	border-radius: 4px;

	@media screen and (max-width: 960px) {
		margin: 10px 0;
	}

	h4 {
		font-size: 20px;
		font-style: normal;
		font-weight: 700;
		line-height: 140%;
		color: #0a0a0a;
		margin-top: 10px;
	}

	div {
		font-size: 14px;
		font-style: normal;
		font-weight: 400;
		line-height: 140%;
		color: #0a0a0a;
		margin: 0 20px;
		text-align: center;
	}
`;

export const LandingPage: React.FC = observer(() => {
	const {i18n, openAuthorizationModal} = useViewController<ILandingController>(
		Bindings.LandingController
	);

	return (
		<Fragment>
			<Wrapper>
				<Container>
					<Description>
						<h3>{i18n.t("landing.page.title", "Title")}</h3>
						<div>{i18n.t("landing.page.description", "Description")}</div>
						<Button onClick={openAuthorizationModal}>
							{i18n.t("landing.page.play_now", "Play Now")}
						</Button>
					</Description>

					<StepsWrapper>
						<StepBlock>
							<h4>{i18n.t("landing.page.step1.title", "Step 1 title")}</h4>
							<div>
								{i18n.t("landing.page.step1.description", "Step 1 Description")}
							</div>
						</StepBlock>
						<StepBlock>
							<h4>{i18n.t("landing.page.step2.title", "Step 2 title")}</h4>
							<div>
								{i18n.t("landing.page.step2.description", "Step 2 Description")}
							</div>
						</StepBlock>
						<StepBlock>
							<h4>{i18n.t("landing.page.step3.title", "Step 3 title")}</h4>
							<div>
								{i18n.t("landing.page.step3.description", "Step 3 Description")}
							</div>
						</StepBlock>
					</StepsWrapper>
				</Container>
			</Wrapper>
			<ModalLogin />
			<ModalRegistration />
			<ModalForgotPassword />
		</Fragment>
	);
});

export default LandingPage;
