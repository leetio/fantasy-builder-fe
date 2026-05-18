import React from "react";
import {useViewController} from "data/hooks";
import type {
	IHelpListController,
	TArticle,
} from "views/components/help/help_list/help_list.controller";
import {Collapse, List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import {observer} from "mobx-react";
import {Bindings} from "bindings";
import {HelpContent} from "views/components/help/help_content/help_content.component";

interface IProps {
	list: TArticle[];
}

export const HelpListComponent: React.FC<IProps> = observer(({list}) => {
	const {currentTab, isCurrentTab, setCurrentTab} = useViewController<IHelpListController>(
		Bindings.HelpListController
	);

	const handleClick = (event: React.SyntheticEvent<HTMLDivElement>) => {
		const id = Number(event.currentTarget.dataset.tab);
		if (!id) return;
		setCurrentTab(currentTab === id ? null : id);
	};

	return (
		<List classes="p-0">
			{list.map(({id, title, body}) => (
				<ListItem key={id}>
					<ListItemButton onClick={handleClick} data-tab={id}>
						<ListItemText primary={title} />
						{isCurrentTab(id) ? <ExpandLess /> : <ExpandMore />}
					</ListItemButton>
					<Collapse in={isCurrentTab(id)} timeout="auto" unmountOnExit>
						<List component="div" className="p-4 border-solid border-b border-gray-400">
							<HelpContent dangerouslySetInnerHTML={{__html: body}} />
						</List>
					</Collapse>
				</ListItem>
			))}
		</List>
	);
});
