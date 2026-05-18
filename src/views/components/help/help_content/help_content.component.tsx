import styled from "@emotion/styled";

export const HelpContent = styled.div`
	font-size: 100%;

	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		color: currentColor;
		margin-bottom: 0.75em;
	}

	h4 {
		font-size: 1.125em;
		line-height: 1.75em;
	}

	h3 {
		font-size: 1.25em;
		line-height: 2em;
		margin-bottom: 0.625em;
	}

	li {
		line-height: 18px;
	}

	p,
	table,
	ul,
	ol {
		font-size: 14px;
		line-height: 20px;
		margin-bottom: 1em;

		@media (min-width: 640px) {
			margin-bottom: 2em;
		}
	}

	ol,
	ul {
		margin-left: 1em;
	}

	ul {
		list-style-type: circle;
	}

	ol {
		list-style-type: decimal;
	}

	i {
		font-style: italic;
	}

	b,
	strong {
		font-weight: bold;
	}

	a {
		color: inherit;
	}

	table {
		border-collapse: collapse;
		border-spacing: 0;

		@media (max-width: 639px) {
			width: 100%;
		}

		td {
			text-align: left;
			padding: 10px;
			border: 1px solid #eaeaea;
			background-color: #ffffff;
		}
	}

	img {
		max-width: 100%;
	}

	*:last-child {
		margin-bottom: 0;
	}
`;
