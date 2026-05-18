import React from "react";
import styled from "@emotion/styled";

const PreloaderWrapper = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const PreloaderContent = styled.div`
	display: inline-block;
	position: relative;
	width: 80px;
	height: 24px;

	@keyframes lds-ellipsis1 {
		0% {
			transform: scale(0);
		}
		100% {
			transform: scale(1);
		}
	}

	@keyframes lds-ellipsis3 {
		0% {
			transform: scale(1);
		}
		100% {
			transform: scale(0);
		}
	}

	@keyframes lds-ellipsis2 {
		0% {
			transform: translate(0, 0);
		}
		100% {
			transform: translate(24px, 0);
		}
	}

	div {
		position: absolute;
		top: 5px;
		width: 13px;
		height: 13px;
		border-radius: 50%;
		background: currentColor;
		animation-timing-function: cubic-bezier(0, 1, 1, 0);

		&:nth-of-type(1) {
			left: 8px;
			animation: lds-ellipsis1 0.6s infinite;
		}

		&:nth-of-type(2) {
			left: 8px;
			animation: lds-ellipsis2 0.6s infinite;
		}

		&:nth-of-type(3) {
			left: 32px;
			animation: lds-ellipsis2 0.6s infinite;
		}

		&:nth-of-type(4) {
			left: 56px;
			animation: lds-ellipsis3 0.6s infinite;
		}
	}
`;

export const Preloader: React.FC = () => (
	<PreloaderWrapper>
		<PreloaderContent>
			<div />
			<div />
			<div />
			<div />
		</PreloaderContent>
	</PreloaderWrapper>
);

const Overlay = styled.div`
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
	background: #dfdfdf;
	z-index: 100;
`;

export const PagePreloader: React.FC = () => (
	<Overlay>
		<Preloader />
	</Overlay>
);
