import styled from "@emotion/styled";
import {FormControl} from "@mui/material";

export const FormControlStyled = styled(FormControl)`
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
