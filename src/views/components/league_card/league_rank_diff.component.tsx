import React from "react";
import {observer} from "mobx-react";
import {isNull} from "lodash-es";
import {RankIcon} from "views/components/league_card/styles";
import {Exist} from "views/components/exist/exist.component";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

interface IProps {
	rank: number | null;
	prevRank: number | null;
}

export const LeagueRankDiff: React.FC<IProps> = observer(({rank, prevRank}) => {
	if (isNull(rank) || isNull(prevRank)) {
		return null;
	}

	return (
		<RankIcon>
			<Exist when={rank < prevRank}>
				<ArrowDropUpIcon className="up" />
			</Exist>
			<Exist when={rank > prevRank}>
				<ArrowDropDownIcon className="down" />
			</Exist>
		</RankIcon>
	);
});
