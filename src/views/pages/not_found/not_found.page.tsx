import React from "react";
import {NavLink} from "react-router-dom";
import styled from "@emotion/styled";
import {useViewController} from "data/hooks";
import type {ILocalizationController} from "views/controllers/localization/localization.controller";
import {Bindings} from "bindings";
import ErrorIcon from "@mui/icons-material/Error";
import {Button} from "@mui/material";

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	min-height: 60vh;
	gap: 8px;

	a {
		margin-top: 20px;
		width: 100%;
		@media (min-width: 768px) {
			max-width: 200px;
		}
	}
`;

const Title = styled.h2`
	font-size: 24px;
	font-style: normal;
	font-weight: 700;
	line-height: 135%;
	color: #151b34;
`;

const Description = styled.div`
	text-align: center;
	font-size: 16px;
	font-style: normal;
	font-weight: 400;
	line-height: 150%;
	color: #151b34;
`;

const Icon = styled.div`
	width: 80px;

	svg {
		width: 100%;
		height: auto;
		fill: #d12b2b;
	}
`;

export const NotFound: React.FC = () => {
	const {i18n} = useViewController<ILocalizationController>(Bindings.LocalizationController);
	return (
		<Wrapper>
			<Icon>
				<ErrorIcon />
			</Icon>
			<Title>{i18n.t("help.header", "404 Error")}</Title>
			<Description>
				{i18n.t("help.description", "Oh no, the page you are looking for can’t be found.")}
			</Description>
			<Button component={NavLink} to={"/"}>
				{i18n.t("help.button", "Return")}
			</Button>
		</Wrapper>
	);
};

export default NotFound;
