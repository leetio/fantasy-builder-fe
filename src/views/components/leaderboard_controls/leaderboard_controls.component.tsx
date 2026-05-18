import React from "react";
import {InputLabel, Select, MenuItem, FormControl} from "@mui/material";
import type {IRound} from "data/types/rounds";
import styled from "@emotion/styled";
import {useViewController} from "data/hooks";
import {Bindings} from "bindings";
import type {ILocalizationController} from "views/controllers/localization/localization.controller";

const FormControlStyled = styled(FormControl)`
	.MuiInputBase-root.MuiFilledInput-root {
		&:before,
		&:after {
			border-color: #0000dc;
		}
	}

	.MuiInputLabel-formControl.Mui-focused {
		color: #707070;
	}

	.MuiSelect-select {
		text-align: left;
	}
`;

interface IProps {
	rounds: IRound[];
	selectedWeekId: number;
	onWeekChange: (weekId: number) => void;
}
export const LeaderboardControls: React.FC<IProps> = ({rounds, selectedWeekId, onWeekChange}) => {
	const {i18n} = useViewController<ILocalizationController>(Bindings.LocalizationController);
	return (
		<FormControlStyled variant="filled" fullWidth>
			<InputLabel id="filled-rounds">
				{i18n.t("leaderboard.filter.label", "Rounds")}
			</InputLabel>
			<Select
				id="filled-rounds"
				name={"round"}
				onChange={(event) => onWeekChange(+event.target.value)}
				defaultValue={selectedWeekId}>
				<MenuItem value={0} key={"overall"}>
					{i18n.t("leaderboard.filter.overall", "Overall")}
				</MenuItem>
				{rounds.map((round, key) => (
					<MenuItem value={round.id} key={key}>
						{i18n.t("leaderboard.filter.round", "Round")} {round.id}
					</MenuItem>
				))}
			</Select>
		</FormControlStyled>
	);
};
