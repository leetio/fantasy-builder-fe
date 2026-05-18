/*
 * Disabled the rule as MUI theme override required override interfaces
 */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {PaletteColorOptions, ThemeOptions, Theme as MUITheme} from "@mui/material/styles";

declare module "@mui/material/styles" {
	// Extend the text palette type through the public module
	interface TypeText {
		light?: string;
		medium?: string;
		dark?: string;
		custom?: string;
	}

	// Custom fields of palette
	interface CustomPalette {
		apple: PaletteColorOptions;
	}

	interface Palette extends CustomPalette {}
	interface PaletteOptions extends CustomPalette {}

	// If you need to add custom shades or fields to a specific palette color,
	// uncomment and extend this section:
	// interface PaletteColor {
	//   lighter?: string;
	//   darker?: string;
	//   50?: string;
	//   100?: string;
	//   950?: string;
	// }
}

declare module "@emotion/react" {
	export interface Theme extends MUITheme {
		palette: NonNullable<MUITheme["palette"]>;
	}
}

export const paletteTheme: ThemeOptions = {
	palette: {
		primary: {
			main: "#151B34",
			light: "#95ECFD",
			dark: "#0000DC",
		},
		secondary: {
			main: "#373B57",
			light: "#636366",
		},
		apple: {
			main: "#FFF",
		},
		error: {
			main: "#ff0000",
		},
		warning: {
			main: "#fff100",
		},
		info: {
			main: "#95ECFD",
		},
		success: {
			main: "#60ff00",
		},
		text: {
			light: "#FFF",
			medium: "#6D6D6D",
			dark: "#151B34",
			custom: "#25347B",
		},
	},
};
