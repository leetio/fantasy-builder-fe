import React from "react";
import {observer} from "mobx-react";
import {
	Button,
	Checkbox,
	Container,
	FilledInput,
	IconButton,
	InputAdornment,
	InputLabel,
	Stack,
	Typography,
} from "@mui/material";
import {PASSWORD_PATTERN} from "data/constants";
import {Exist} from "views/components/exist/exist.component";
import {useViewController} from "data/hooks";
import {Bindings} from "bindings";
import type {IRegistrationFormController} from "views/components/registration_form/registration_form.controller";
import styled from "@emotion/styled";
import {PureButton} from "views/components/buttons/buttons.component";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import {ErrorText, Label} from "views/components/form";
import {useNavigate} from "react-router-dom";
import {FormControlStyled} from "views/components/form/styles";

const LoginForm = styled.form`
	width: 100%;
	max-width: 360px;
	margin: 20px auto;

	@media screen and (max-width: 960px) {
		margin: 10px auto;
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

const Title = styled.h2`
	font-size: 24px;
	font-style: normal;
	font-weight: 700;
	line-height: 135%;
	color: #0f0f0f;
`;

export const RegistrationForm: React.FC = observer(() => {
	const {
		i18n,
		error,
		isFormDisabled,
		handleFormSubmit,
		handleFormOnChange,
		handleValidatePassword,
		goToLogin,
	} = useViewController<IRegistrationFormController>(Bindings.RegistrationFormController, {
		navigate: useNavigate(),
	});

	const [showPassword, setShowPassword] = React.useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

	const handleClickShowPassword = () => setShowPassword((show) => !show);
	const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};
	const handleMouseDownConfirmPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	const labelDisplayName = i18n.t("registration.email.display_name", "Display Name*");
	const labelEmail = i18n.t("registration.email.label", "Email");
	const labelConfirmEmail = i18n.t("registration.confirm_email.label", "Confirm Email*");
	const labelPassword = i18n.t("registration.password.label", "Password*");
	const labelConfirmPassword = i18n.t("registration.confirm_password.label", "Confirm Password*");

	return (
		<Container>
			<LoginForm onSubmit={handleFormSubmit} onChange={handleFormOnChange} noValidate={true}>
				<Stack direction="column" gap={3}>
					<Title>{i18n.t("registration.form.title", "Register An Account")}</Title>
					<FormControlStyled fullWidth variant="filled">
						<InputLabel
							htmlFor="filled-registration-displayName"
							error={Boolean(error?.displayName)}>
							{labelDisplayName}
						</InputLabel>
						<FilledInput
							id={"filled-registration-displayName"}
							disabled={isFormDisabled}
							name="displayName"
							type="text"
							placeholder={labelDisplayName}
							required={true}
							error={Boolean(error?.displayName)}
						/>
						<Exist when={error?.displayName}>
							<ErrorText>{error?.displayName}</ErrorText>
						</Exist>
					</FormControlStyled>
					<FormControlStyled fullWidth variant="filled">
						<InputLabel
							htmlFor="filled-registration-email"
							error={Boolean(error?.email)}>
							{labelEmail}
						</InputLabel>
						<FilledInput
							id={"filled-registration-email"}
							disabled={isFormDisabled}
							name="email"
							type="email"
							placeholder={labelEmail}
							required={true}
							error={Boolean(error?.email)}
						/>
						<Exist when={error?.email}>
							<ErrorText>{error?.email}</ErrorText>
						</Exist>
					</FormControlStyled>
					<FormControlStyled fullWidth variant="filled">
						<InputLabel
							htmlFor="filled-registration-confirmEmail"
							error={Boolean(error?.confirmEmail)}>
							{labelConfirmEmail}
						</InputLabel>
						<FilledInput
							id={"filled-registration-confirmEmail"}
							disabled={isFormDisabled}
							name="confirmEmail"
							type="email"
							placeholder={labelConfirmEmail}
							required={true}
							error={Boolean(error?.confirmEmail)}
						/>
						<Exist when={error?.confirmEmail}>
							<ErrorText>{error?.confirmEmail}</ErrorText>
						</Exist>
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
										edge="end">
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							}
							disabled={isFormDisabled}
							name="password"
							inputProps={{
								minLength: 8,
								maxLength: 128,
								pattern: PASSWORD_PATTERN,
							}}
							placeholder={labelPassword}
							onChange={handleValidatePassword}
							required={true}
						/>
						<Exist when={error?.password}>
							<ErrorText>{error?.password}</ErrorText>
						</Exist>
					</FormControlStyled>
					<FormControlStyled fullWidth variant="filled">
						<InputLabel
							htmlFor="filled-adornment-confirmPassword"
							error={Boolean(error?.confirmPassword)}>
							{labelConfirmPassword}
						</InputLabel>
						<FilledInput
							id="filled-adornment-confirmPassword"
							type={showConfirmPassword ? "text" : "password"}
							endAdornment={
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={handleClickShowConfirmPassword}
										onMouseDown={handleMouseDownConfirmPassword}
										edge="end">
										{showConfirmPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							}
							disabled={isFormDisabled}
							name="confirmPassword"
							inputProps={{
								minLength: 8,
								maxLength: 128,
								pattern: PASSWORD_PATTERN,
							}}
							placeholder={labelConfirmPassword}
							required={true}
						/>
						<Exist when={error?.confirmPassword}>
							<ErrorText>{error?.confirmPassword}</ErrorText>
						</Exist>
					</FormControlStyled>
					<Stack direction="column" gap={2.5}>
						<div className="flex gap-2 items-center">
							<Checkbox
								disabled={isFormDisabled}
								name="terms"
								id="terms"
								required={true}
							/>
							<Label
								className="[&_>_a]:underline [&_>_a:hover]:no-underline"
								htmlFor="terms"
								dangerouslySetInnerHTML={{
									__html: "I have read and accepted the <a href='/help/terms-and-conditions' target='_blank'>Terms & Conditions</a>",
								}}
							/>
						</div>
						<Exist when={error?.terms}>
							<ErrorText>{error?.terms}</ErrorText>
						</Exist>
					</Stack>
					<Exist when={error?.common}>
						<ErrorText>{error?.common}</ErrorText>
					</Exist>
					<Button
						className="mx-auto"
						type="submit"
						fullWidth
						variant="contained"
						size="large"
						disabled={isFormDisabled || Boolean(error)}>
						{i18n.t("registration.form.submit", "Register")}
					</Button>

					<Typography textAlign="center">
						{i18n.t("registration.have_account.text", "Already have an account?")}{" "}
						<ButtonStyled onClick={goToLogin}>
							{i18n.t("registration.sign_in.text", "Sign In")}
						</ButtonStyled>
					</Typography>
				</Stack>
			</LoginForm>
		</Container>
	);
});
