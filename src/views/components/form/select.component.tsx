import styled from "@emotion/styled";
import {FormControl} from "@mui/material";
import SelectMUI, {type SelectProps} from "@mui/material/Select";
import React from "react";
import InputLabel from "@mui/material/InputLabel";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export const SelectFormControl = styled(FormControl)`
	background: transparent;
	border-radius: 4px;

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

	.MuiFilledInput-root::after {
		border-color: #a3a3a3;
	}

	.MuiSelect-outlined {
		text-align: left;
	}

	.MuiSvgIcon-root {
		font-size: 28px;
		color: rgba(0, 0, 0, 0.87);
	}
`;

export const SelectStyled = styled(SelectMUI)`
	color: currentColor;
	border-radius: 4px;

	&.MuiFilledInput-root::before,
	&.MuiFilledInput-root::after {
		border-radius: 3px;
	}
`;

export const Select: React.FC<SelectProps> = ({
	label,
	defaultValue = "",
	name,
	required,
	children,
	disabled,
	...rest
}) => (
	<SelectFormControl variant="outlined" fullWidth className={"select-form-control"}>
		<InputLabel disabled={disabled} required={required}>
			{label}
		</InputLabel>
		<SelectStyled
			defaultValue={defaultValue}
			name={name}
			label={label}
			disabled={disabled}
			required={required}
			IconComponent={KeyboardArrowDownIcon}
			{...rest}>
			{children}
		</SelectStyled>
	</SelectFormControl>
);
