import {createTheme} from "@mui/material/styles";
import {typographyTheme} from "assets/theming/typography.theme";
import {paletteTheme} from "assets/theming/palette.theme";
import {componentsThemeOptions} from "assets/theming/components.theme";

export const theme = createTheme(typographyTheme, paletteTheme, componentsThemeOptions);
