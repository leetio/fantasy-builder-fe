/*
 * Disabled the rule as MUI theme override required override interfaces
 * More info on custom theming for Typography can be found here
 * https://mui.com/material-ui/customization/typography/#adding-amp-disabling-variants
 */
/* eslint-disable @typescript-eslint/naming-convention */
import type React from "react";
import type {ThemeOptions} from "@mui/material/styles";

declare module "@mui/material/styles" {
	interface TypographyVariants {
		body3: React.CSSProperties;
		body4: React.CSSProperties;
	}

	// allow configuration using `createTheme`
	interface TypographyVariantsOptions {
		body3?: React.CSSProperties;
		body4?: React.CSSProperties;
	}
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
	interface TypographyPropsVariantOverrides {
		body3: true;
		body4: true;
	}
}

export const typographyTheme: ThemeOptions = {
	typography: {
		allVariants: {
			fontFamily: "var(--font-main)",
			fontWeight: 700,
			color: "#151B34",
		},
		h1: {
			fontSize: "40px",
			lineHeight: "120%",
		},
		h2: {
			fontSize: "32px",
			lineHeight: "125%",
		},
		h3: {
			fontSize: "28px",
			lineHeight: "125%",
		},
		h4: {
			fontSize: "24px",
			lineHeight: "135%",
		},
		h5: {
			fontSize: "20px",
			lineHeight: "140%",
		},
		h6: {
			fontSize: "16px",
			lineHeight: "145%",
		},
		body3: {
			fontSize: "12px",
			lineHeight: "16px",
		},
		body4: {
			fontFamily: "var(--font-second)",
		},
	},
	components: {
		MuiTypography: {
			defaultProps: {
				variantMapping: {
					body3: "p", // Map the new variant to render a 'p' tag by default
					body4: "p", // Map the new variant to render a 'p' tag by default
				},
			},
		},
	},
};
