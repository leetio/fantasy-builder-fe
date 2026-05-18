import styled from "@emotion/styled";
import {Search} from "@mui/icons-material";
import {IconButton, InputAdornment, TextField, type TextFieldProps} from "@mui/material";
import React from "react";

export const Input = styled(TextField)`
	background: transparent;
	color: #a3a3a3;
	border-radius: 4px;
	text-align: left;

	.MuiFilledInput-root {
		background: transparent;
	}

	.MuiInputLabel-root,
	.MuiInputLabel-root.Mui-focused {
		color: #a3a3a3;
	}

	.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
		border-color: var(--color-primary);
	}

	.MuiFilledInput-root::before,
	.MuiFilledInput-root::after {
		border-radius: 3px;
	}

	.MuiFilledInput-root::after {
		border-color: #a3a3a3;
	}
`;

export const SearchInputStyled = styled(Input)`
	& .MuiInputBase-input {
		font-size: 16px;
		padding: 12px;
	}
`;

export const SearchInput: React.FC<TextFieldProps> = (props) => (
	<SearchInputStyled
		slotProps={{
			input: {
				endAdornment: (
					<InputAdornment position="end">
						<IconButton edge="end">
							<Search />
						</IconButton>
					</InputAdornment>
				),
			},
		}}
		{...props}
	/>
);
