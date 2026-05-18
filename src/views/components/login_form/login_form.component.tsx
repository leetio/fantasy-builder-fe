import React from "react";
import {useViewController} from "data/hooks";
import type {ILoginFormController} from "views/components/login_form/login_form.controller";
import {observer} from "mobx-react";
import {Bindings} from "bindings";
import {
	Button,
	FilledInput,
	FormControl,
	IconButton,
	InputAdornment,
	InputLabel,
	Stack,
	Typography,
} from "@mui/material";
import {ErrorText} from "views/components/form";
import {Exist} from "views/components/exist/exist.component";
import styled from "@emotion/styled";
import {PureButton} from "views/components/buttons/buttons.component";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {useNavigate} from "react-router-dom";

const LoginFormComponent = styled.form`
	width: 100%;
	max-width: 360px;
	padding: 20px;
	margin: 0 auto;
`;

const ButtonStyled = styled(PureButton)`
	font-weight: 700;
	color: #0f0f0f;
	text-decoration: underline;
	font-size: 16px;
	font-style: normal;
	line-height: 150%;
`;

const Title = styled.h2`
	font-size: 24px;
	font-style: normal;
	font-weight: 700;
	line-height: 135%;
	color: #151b34;
	margin-top: 50px;
`;

const FormControlStyled = styled(FormControl)`
	.MuiInputBase-root.MuiFilledInput-root {
		background: #f6f6f6;

		&:before,
		&:after {
			border-color: #0000dc;
		}
	}

	.MuiInputLabel-formControl.Mui-focused {
		color: #707070;
	}
`;

const ErrorBlock = styled.div`
	font-size: 12px;
	font-style: normal;
	font-weight: 400;
	line-height: 20px;
	letter-spacing: 0.4px;
	color: #e40000;
	padding: 10px 0 0 15px;
	text-align: left;
`;

const Description = styled.div`
	font-size: 16px;
	font-style: normal;
	font-weight: 400;
	line-height: 150%;
`;

export const LoginForm: React.FC = observer(() => {
	const {
		i18n,
		handleFormSubmit,
		handleFormOnChange,
		error,
		isFormDisabled,
		isSaveDisabled,
		goToForgotPassword,
		goToRegistration,
	} = useViewController<ILoginFormController>(Bindings.LoginFormController, {
		navigate: useNavigate(),
	});

	const labelEmail = i18n.t("login_form.email.label", "Email Address*");
	const labelPassword = i18n.t("login_form.password.label", "Password*");
	const [showPassword, setShowPassword] = React.useState(false);

	const handleClickShowPassword = () => setShowPassword((show) => !show);
	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	return (
		<LoginFormComponent onSubmit={handleFormSubmit} onChange={handleFormOnChange} noValidate>
			<Stack direction="column" gap={3}>
				<Title>{i18n.t("login_form.form.title", "Log In To Your Account")}</Title>

				<FormControlStyled fullWidth variant="filled">
					<InputLabel htmlFor="filled-adornment-password" error={Boolean(error?.email)}>
						{labelEmail}
					</InputLabel>
					<FilledInput
						id="filled-adornment-weight filled-error-helper-text"
						aria-describedby="filled-weight-helper-text"
						disabled={isFormDisabled}
						name="email"
						type="email"
						placeholder={labelEmail}
						required={true}
					/>
					<ErrorBlock>{error?.email}</ErrorBlock>
				</FormControlStyled>

				<FormControlStyled fullWidth variant="filled">
					<InputLabel
						htmlFor="filled-adornment-password"
						error={Boolean(error?.password)}>
						{labelPassword}
					</InputLabel>
					<FilledInput
						id="filled-adornment-password"
						type={showPassword ? "text" : "password"}
						endAdornment={
							<InputAdornment position="end">
								<IconButton
									aria-label="toggle password visibility"
									onClick={handleClickShowPassword}
									onMouseDown={handleMouseDownPassword}
									type="button"
									edge="end">
									{showPassword ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						}
						disabled={isFormDisabled}
						name="password"
						placeholder={labelPassword}
						required={true}
					/>
					<ErrorBlock>{error?.password}</ErrorBlock>
				</FormControlStyled>

				<Typography textAlign="right">
					<Button variant="text" type="button" onClick={goToForgotPassword}>
						{i18n.t("login_form.forgot_password.link", "Forgot Password?")}
					</Button>
				</Typography>
				<FormControl fullWidth>
					<Exist when={error?.common}>
						<ErrorText>{error?.common}</ErrorText>
					</Exist>
					<Button type="submit" fullWidth size="large" disabled={isSaveDisabled}>
						{i18n.t("login_form.form.submit", "Log In")}
					</Button>
				</FormControl>
				<Description>
					{i18n.t("login_form.new.text", "New?")}{" "}
					<ButtonStyled type="button" onClick={goToRegistration}>
						{i18n.t("login_form.sign_up.text", "Register Now")}
					</ButtonStyled>
				</Description>
			</Stack>
		</LoginFormComponent>
	);
});
