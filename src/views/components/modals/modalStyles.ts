import styled from "@emotion/styled";

export const ModalContent = styled.div`
	width: 100%;
	max-height: 90%;
	overflow: auto;
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	gap: 12px;
	outline: none;
	max-width: 600px;
	background: #fff;
	border-radius: 4px;
	text-align: center;
	padding-bottom: 30px;

	@media screen and (max-width: 960px) {
		max-width: unset;
		left: 24px;
		right: 24px;
		width: auto;
		transform: translateY(-50%);
		padding-bottom: 20px;
	}

	button {
		max-width: 300px;
	}
`;

export const CloseBlock = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-end;
	align-items: center;

	button {
		&:hover {
			background: transparent;
		}
	}
`;
