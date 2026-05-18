import type {ThemeOptions} from "@mui/material/styles";
import {checkboxClasses} from "@mui/material";

// https://github.com/mui/material-ui/issues/33424
function container() {
	return document.getElementById("#root");
}

export const componentsThemeOptions: ThemeOptions = {
	components: {
		MuiButton: {
			defaultProps: {
				disableElevation: true,
				variant: "contained",
			},
			styleOverrides: {},
			variants: [
				{
					props: {variant: "contained", color: "primary"},
					style: {
						borderRadius: "100px",
						background: "#0000DC",
						color: "#ffffff",
						fontWeight: "700",
						height: "48px",
						textTransform: "none",
						fontSize: "16px",
						boxShadow: "none",
						"&:disabled": {
							background: "#E6ECFF",
							color: "#636366",
							cursor: "inherit",
						},
						"&:hover": {
							background: "#4E7BF5",
						},
					},
				},
				{
					props: {variant: "outlined", color: "primary"},
					style: {
						borderRadius: "100px",
						background: "transparent",
						color: "#151B34",
						borderColor: "#151B34",
						fontWeight: "700",
						height: "48px",
						textTransform: "none",
						fontSize: "16px",
						boxShadow: "none",
						borderWidth: "2px",
						"&:disabled": {
							borderColor: "#F4F7FF",
							background: "#F4F7FF",
							color: "#636366",
							cursor: "inherit",
						},
						"&:hover": {
							borderColor: "#373B57",
							background: "#373B57",
							color: "#fff",
						},
					},
				},
				{
					props: {variant: "outlined", color: "error"},
					style: {
						letterSpacing: "normal",
						color: "#E40000",
						borderColor: "#E40000",
					},
				},
				{
					props: {className: "menu-button"},
					style: {
						height: "48px",
						backgroundColor: "#25347B",
					},
				},
			],
		},
		MuiCheckbox: {
			styleOverrides: {
				root: {
					color: "#636366",
					[`&.${checkboxClasses.checked}`]: {
						color: "#0000DC",
					},
				},
			},
		},
		MuiTextField: {
			defaultProps: {
				variant: "outlined",
				fullWidth: true,
			},
		},
		MuiFilledInput: {
			styleOverrides: {
				root: {
					"&.MuiInputBase-root": {
						backgroundColor: "#f2f2f7",
					},
					"&::before": {
						borderBottomColor: "#C7C7CC",
					},
					"&:hover:not(.Mui-disabled)::before": {
						borderBottomColor: "#0000DC",
					},
					"&:active": {
						borderBottomColor: "#0000DC",
					},
				},
			},
		},
		MuiPopover: {
			defaultProps: {
				container,
			},
		},
		MuiPopper: {
			defaultProps: {
				container,
			},
		},
		MuiDialog: {
			defaultProps: {
				container,
			},
		},
		MuiSelect: {
			defaultProps: {
				variant: "outlined",
				fullWidth: true,
			},
		},
	},
};
