import {ViewController} from "data/types/structure";
import {inject, injectable} from "inversify";
import type {ILocalizationStore} from "data/stores/localization/localization.store";
import {Bindings} from "bindings";

export interface ILocalizationController extends ViewController {
	readonly i18n: ILocalizationStore;
}

@injectable()
export class LocalizationController implements ILocalizationController {
	constructor(@inject(Bindings.LocalizationStore) readonly i18n: ILocalizationStore) {}
}
