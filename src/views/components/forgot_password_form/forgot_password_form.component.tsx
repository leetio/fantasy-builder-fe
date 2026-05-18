import React, {Fragment} from "react";
import {useViewController} from "data/hooks";
import {observer} from "mobx-react";
import {Bindings} from "bindings";
import {Button, FilledInput, FormControl, InputLabel, Typography} from "@mui/material";
import {Exist} from "views/components/exist/exist.component";
import type {IForgotPasswordFormController} from "views/components/forgot_password_form/forgot_password_form.controller";
import styled from "@emotion/styled";
import {ErrorText} from "views/components/form";
import {PureButton} from "views/components/buttons/buttons.component";

const Form = styled.form`
	width: 100%;
	max-width: 360px;
	margin: 20px auto 10px auto;

	@media screen and (max-width: 960px) {
		margin: 10px auto;
	}
`;

const Title = styled.h2`
	font-size: 24px;
	font-style: normal;
	font-weight: 700;
	line-height: 140%;

	@media screen and (max-width: 960px) {
		font-size: 20px;
	}
`;

const Description = styled.div`
	font-size: 16px;
	font-style: normal;
	font-weight: 400;
	line-height: 140%;
	margin: 10px 0;

	@media screen and (max-width: 960px) {
		font-size: 14px;
	}
`;

const FormControlStyled = styled(FormControl)`
	.MuiInputBase-root.MuiFilledInput-root {
		background: #f6f6f6;

		&:before,
		&:after {
			border-color: #ffe000;
		}
	}

	.MuiInputLabel-formControl.Mui-focused {
		color: #707070;
	}

	.MuiSelect-select {
		text-align: left;
	}
`;

const ButtonStyled = styled(PureButton)`
	font-weight: 700;
	color: #0f0f0f;
	text-decoration: underline;
	font-size: 16px;
	font-style: normal;
	line-height: 150%;
`;

export const ForgotPasswordForm: React.FC = observer(() => {
	const {i18n, handleFormSubmit, handleFormOnChange, error, isFormDisabled, goToRegistration} =
		useViewController<IForgotPasswordFormController>(Bindings.ForgotPasswordFormController);

	return (
		<Fragment>
			<Form onSubmit={handleFormSubmit} onChange={handleFormOnChange} noValidate={true}>
				<Title>{i18n.t("forgot_password.title", "Forgot Your Password?")}</Title>
				<Description>
					{i18n.t(
						"forgot_password.description",
						"Please enter the email address you’re currently registered with."
					)}
				</Description>
				<FormControlStyled fullWidth>
					<InputLabel htmlFor="filled-registration-firstName" error={Boolean(error)}>
						Email Address*
					</InputLabel>
					<FilledInput
						disabled={isFormDisabled}
						name="email"
						type="email"
						placeholder="Email"
						required={true}
						error={Boolean(error)}
					/>
					<Exist when={error}>
						<ErrorText>{error}</ErrorText>
					</Exist>
				</FormControlStyled>
				<Button size="large" sx={{mt: 3}} type="submit" fullWidth disabled={isFormDisabled}>
					Submit
				</Button>
			</Form>
			<Typography textAlign="center">
				{i18n.t("login_form.new.text", "New?")}{" "}
				<ButtonStyled type="button" onClick={goToRegistration}>
					{i18n.t("login_form.sign_up.text", "Register Now")}
				</ButtonStyled>
			</Typography>
		</Fragment>
	);
});
