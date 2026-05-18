import React, {type PropsWithChildren} from "react";
import {Dialog, IconButton, useMediaQuery} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {Exist} from "views/components/exist/exist.component";
import {theme} from "assets/theming/theme";

interface IProps {
	isOpen: boolean;
	onClose?: () => void;
}

export const ModalHOC: React.FC<PropsWithChildren<IProps>> = (props) => {
	const breakpointKey = "sm";
	const fullScreen = useMediaQuery(theme.breakpoints.down(breakpointKey));
	const {isOpen, onClose, children} = props;

	return (
		<Dialog
			className="text-center"
			fullWidth
			disablePortal
			maxWidth={breakpointKey}
			open={isOpen}
			onClose={onClose}
			fullScreen={fullScreen}
			transitionDuration={0}>
			<Exist when={onClose}>
				<IconButton aria-label="close" onClick={onClose} className="absolute right-1 top-1">
					<CloseIcon />
				</IconButton>
			</Exist>
			{children}
		</Dialog>
	);
};
