import React, {Fragment} from "react";
import {useViewController} from "data/hooks";
import {observer} from "mobx-react";
import {Bindings} from "bindings";
import {Button, Container, FormControl, Stack, Typography} from "@mui/material";
import {ErrorText, Input} from "views/components/form";
import {Exist} from "views/components/exist/exist.component";
import {PASSWORD_PATTERN} from "data/constants";
import type {IResetPasswordController} from "views/pages/reset_password/reset_password.controller";

export const ResetPasswordPage: React.FC = observer(() => {
	const {handleFormSubmit, handleFormOnChange, error, isFormDisabled, isSuccess} =
		useViewController<IResetPasswordController>(Bindings.ResetPasswordController);

	return (
		<Container>
			<Exist when={!isSuccess}>
				<form onSubmit={handleFormSubmit} onChange={handleFormOnChange} noValidate={true}>
					<Stack direction="column" gap={3}>
						<Typography textAlign="center" variant="h2">
							Reset password
						</Typography>
						<Typography>Please provide your new password here:</Typography>
						<FormControl fullWidth>
							<Input
								disabled={isFormDisabled}
								label="Enter new password"
								name="password"
								type="password"
								placeholder="Enter new password"
								required={true}
								slotProps={{
									htmlInput: {
										minLength: 8,
										maxLength: 128,
										pattern: PASSWORD_PATTERN,
									},
								}}
								error={Boolean(error?.password)}
								helperText={error?.password}
							/>
						</FormControl>
						<FormControl fullWidth>
							<Input
								disabled={isFormDisabled}
								label="Confirm new password"
								name="confirmPassword"
								type="password"
								placeholder="Confirm new password"
								required={true}
								slotProps={{
									htmlInput: {
										minLength: 8,
										maxLength: 128,
										pattern: PASSWORD_PATTERN,
									},
								}}
								error={Boolean(error?.confirmPassword)}
								helperText={error?.confirmPassword}
							/>
						</FormControl>
						<FormControl>
							<Exist when={error?.common}>
								<ErrorText>{error?.common}</ErrorText>
							</Exist>
							<Button
								size="large"
								sx={{mt: 3}}
								type="submit"
								fullWidth
								variant="contained"
								disabled={isFormDisabled}>
								Submit
							</Button>
						</FormControl>
					</Stack>
				</form>
			</Exist>
			<Exist when={isSuccess}>
				<Fragment>
					<Typography variant="h2">SUCCESS!</Typography>
					<Typography variant="body2" fontWeight={500}>
						Your new password is configured!
						<br />
						You can now Log in and access your account with your new password
					</Typography>
				</Fragment>
			</Exist>
		</Container>
	);
});

export default ResetPasswordPage;
