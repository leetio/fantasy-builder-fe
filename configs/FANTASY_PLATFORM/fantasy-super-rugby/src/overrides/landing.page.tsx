import React, {Fragment} from "react";
import {observer} from "mobx-react";
import {useViewController} from "data/hooks";
import {Bindings} from "bindings";
import {Button, Container, Grid, Typography, Box, Card, CardContent, Chip} from "@mui/material";
import styled from "@emotion/styled";
import type {SuperRugbyLandingController} from "./landing.controller";
import {ModalLogin} from "views/components/modals/modal_login/modal_login.component";
import {ModalForgotPassword} from "views/components/modals/modal_forgot_password/modal_forgot_password.component";
import {ModalRegistration} from "views/components/modals/modal_registration/modal_registration.component";

const HeroSection = styled.div`
	background: linear-gradient(135deg, #0a4d3c 0%, #1a7a5e 50%, #2a9d8f 100%);
	width: 100%;
	padding: 80px 0 60px 0;
	text-align: center;
	color: #ffffff;

	@media screen and (max-width: 960px) {
		padding: 60px 20px 40px 20px;
	}

	h1 {
		font-size: 56px;
		font-weight: 900;
		margin-bottom: 16px;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);

		@media screen and (max-width: 960px) {
			font-size: 36px;
		}
	}

	h2 {
		font-size: 28px;
		font-weight: 600;
		margin-bottom: 20px;
		opacity: 0.95;

		@media screen and (max-width: 960px) {
			font-size: 20px;
		}
	}

	p {
		font-size: 18px;
		line-height: 1.6;
		max-width: 700px;
		margin: 0 auto 30px;
		opacity: 0.9;

		@media screen and (max-width: 960px) {
			font-size: 16px;
		}
	}
`;

const CTAButton = styled(Button)`
	background: #ff6b35;
	color: #ffffff;
	font-size: 18px;
	font-weight: 700;
	padding: 16px 48px;
	border-radius: 8px;
	text-transform: none;
	box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
	transition: all 0.3s ease;

	&:hover {
		background: #ff5722;
		box-shadow: 0 6px 20px rgba(255, 107, 53, 0.6);
		transform: translateY(-2px);
	}
`;

const StepsSection = styled.div`
	background: #f5f5f5;
	padding: 60px 0;

	@media screen and (max-width: 960px) {
		padding: 40px 20px;
	}
`;

const StepCard = styled(Card)`
	height: 100%;
	border-radius: 12px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	transition: transform 0.3s ease, box-shadow 0.3s ease;
	background: #ffffff;

	&:hover {
		transform: translateY(-8px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
	}

	.MuiCardContent-root {
		padding: 32px;
		text-align: center;
	}

	h3 {
		font-size: 24px;
		font-weight: 700;
		color: #0a4d3c;
		margin-bottom: 16px;
	}

	p {
		font-size: 16px;
		line-height: 1.6;
		color: #555;
	}
`;

const StepNumber = styled.div`
	width: 60px;
	height: 60px;
	border-radius: 50%;
	background: linear-gradient(135deg, #2a9d8f 0%, #1a7a5e 100%);
	color: #ffffff;
	font-size: 28px;
	font-weight: 900;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 auto 20px;
	box-shadow: 0 4px 12px rgba(42, 157, 143, 0.3);
`;

const FeaturesSection = styled.div`
	background: #ffffff;
	padding: 60px 0;

	@media screen and (max-width: 960px) {
		padding: 40px 20px;
	}

	h2 {
		text-align: center;
		font-size: 36px;
		font-weight: 700;
		color: #0a4d3c;
		margin-bottom: 40px;
	}
`;

const FeatureChip = styled(Chip)`
	font-size: 16px;
	padding: 20px 16px;
	margin: 8px;
	background: #e8f4f2;
	color: #0a4d3c;
	font-weight: 600;

	&:hover {
		background: #d1ebe7;
	}
`;

const QuickFactsSection = styled.div`
	background: linear-gradient(135deg, #1a7a5e 0%, #0a4d3c 100%);
	padding: 50px 0;
	color: #ffffff;

	@media screen and (max-width: 960px) {
		padding: 30px 20px;
	}
`;

const FactCard = styled(Box)`
	text-align: center;
	padding: 20px;

	h4 {
		font-size: 32px;
		font-weight: 900;
		margin-bottom: 8px;
		color: #ff6b35;
	}

	p {
		font-size: 16px;
		opacity: 0.9;
	}
`;

const SectionTitle = styled(Typography)`
	text-align: center;
	font-size: 20px;
	font-weight: 600;
	margin-bottom: 24px;
	opacity: 0.95;
`;

export const SuperRugbyLandingPage: React.FC = observer(() => {
	const controller = useViewController<SuperRugbyLandingController>(Bindings.LandingController);

	const {
		gameTitle,
		tagline,
		description,
		step1Title,
		step1Description,
		step2Title,
		step2Description,
		step3Title,
		step3Description,
		ctaButtonText,
		features,
		quickFacts,
		openAuthorizationModal,
	} = controller;

	return (
		<Fragment>
			<HeroSection>
				<Container maxWidth="lg">
					<h1>{gameTitle}</h1>
					<h2>{tagline}</h2>
					<p>{description}</p>
					<CTAButton onClick={openAuthorizationModal}>{ctaButtonText}</CTAButton>
				</Container>
			</HeroSection>

			<StepsSection>
				<Container maxWidth="lg">
					<Typography
						variant="h3"
						textAlign="center"
						sx={{
							fontSize: {xs: "28px", md: "36px"},
							fontWeight: 700,
							color: "#0a4d3c",
							mb: 5,
						}}
					>
						How to Play
					</Typography>
					<Grid container spacing={4}>
						<Grid item xs={12} md={4}>
							<StepCard>
								<CardContent>
									<StepNumber>1</StepNumber>
									<h3>{step1Title}</h3>
									<p>{step1Description}</p>
								</CardContent>
							</StepCard>
						</Grid>
						<Grid item xs={12} md={4}>
							<StepCard>
								<CardContent>
									<StepNumber>2</StepNumber>
									<h3>{step2Title}</h3>
									<p>{step2Description}</p>
								</CardContent>
							</StepCard>
						</Grid>
						<Grid item xs={12} md={4}>
							<StepCard>
								<CardContent>
									<StepNumber>3</StepNumber>
									<h3>{step3Title}</h3>
									<p>{step3Description}</p>
								</CardContent>
							</StepCard>
						</Grid>
					</Grid>
				</Container>
			</StepsSection>

			<FeaturesSection>
				<Container maxWidth="lg">
					<h2>Game Features</h2>
					<Box textAlign="center">
						{features.map((feature, index) => (
							<FeatureChip key={index} label={feature} />
						))}
					</Box>
				</Container>
			</FeaturesSection>

			<QuickFactsSection>
				<Container maxWidth="lg">
					<SectionTitle variant="h4">Quick Facts</SectionTitle>
					<Grid container spacing={3}>
						{quickFacts.map((fact, index) => (
							<Grid item xs={6} md={3} key={index}>
								<FactCard>
									<h4>{fact.value}</h4>
									<p>{fact.label}</p>
								</FactCard>
							</Grid>
						))}
					</Grid>
					<Box textAlign="center" mt={4}>
						<CTAButton onClick={openAuthorizationModal}>{ctaButtonText}</CTAButton>
					</Box>
				</Container>
			</QuickFactsSection>

			<ModalLogin />
			<ModalRegistration />
			<ModalForgotPassword />
		</Fragment>
	);
});

export default SuperRugbyLandingPage;
