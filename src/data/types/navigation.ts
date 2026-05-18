import type {SyntheticEvent} from "react";

export interface IMenuItem {
	name: string;
	path: string;
	onClick?: (event: SyntheticEvent<HTMLElement>) => void;
	isEnd?: (path: string) => boolean;
	isHideOnMobile?: boolean;
}

export interface INestedMenuItem extends IMenuItem {
	items: IMenuItem[];
}
