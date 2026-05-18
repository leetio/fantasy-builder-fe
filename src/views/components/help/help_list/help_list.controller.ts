import {ViewController} from "data/types/structure";
import {action, makeAutoObservable, observable} from "mobx";
import {injectable} from "inversify";

export type {TArticle} from "data/stores/static_content/static_content.store";

export interface IHelpListController extends ViewController {
	get currentTab(): number | null;

	setCurrentTab: (tab: number | null) => void;
	isCurrentTab: (tab: number) => boolean;
}

@injectable()
export class HelpListController implements IHelpListController {
	@observable private _currentTab: number | null = null;

	get currentTab() {
		return this._currentTab;
	}

	constructor() {
		makeAutoObservable(this);
	}

	isCurrentTab = (tab: number) => tab === this._currentTab;

	@action setCurrentTab = (tab: number | null) => (this._currentTab = tab);
}
