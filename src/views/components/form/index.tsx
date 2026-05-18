import styled from "@emotion/styled";

export const Label = styled.label`
	cursor: pointer;
	text-align: left;
	font-size: 14px;
	line-height: 18px;
	font-weight: 500;
`;

export const ErrorText = styled.p`
	color: var(--color-invalid);
	font-size: 12px;
	font-weight: 500;
	line-height: 18px;
	margin-bottom: 20px;
`;

export * from "views/components/form/input.component";
export * from "views/components/form/select.component";
