import styled from "@emotion/styled";
import {css} from "@mui/material/styles";
import {NavLink} from "react-router-dom";
import React, {type AnchorHTMLAttributes, type PropsWithChildren} from "react";

export const linkStyles = css`
	display: inline-flex;
	outline: none;
	text-decoration: none;
	background-image: linear-gradient(currentColor, currentColor);
	background-position: 0 100%;
	background-repeat: no-repeat;
	transition: background-size 0.5s;
	cursor: pointer;
	background-size: 0 1px;

	&:hover,
	&:focus {
		background-size: 100% 1px;
	}
`;

export const ExternalLinkStyled = styled.a`
	${linkStyles};
`;

export const ExternalLink: React.FC<PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement>>> = ({
	children,
	...props
}) => (
	<ExternalLinkStyled target="_blank" rel="noreferrer noopener" {...props}>
		{children}
	</ExternalLinkStyled>
);

export const InternalLink = styled(NavLink)`
	${linkStyles};
`;
