import {makeAutoObservable, observable} from "mobx";
import {ViewController} from "data/types/structure";
import {inject, injectable} from "inversify";
import {Bindings} from "bindings";
import {ModalType} from "data/enums";
import type {IModalsStore, IModalPayload} from "data/stores/modals/modals.store";
import type {ILocalizationStore} from "data/stores/localization/localization.store";

interface IProps {
	type: ModalType;
}

export interface IModalController extends ViewController<IProps> {
	readonly i18n: ILocalizationStore;

	get isOpen(): boolean;
	get modalContent(): IModalPayload | null;

	close: () => void;
}

@injectable()
export class ModalController implements IModalController {
	@observable _modalType?: ModalType | null = null;

	constructor(
		@inject(Bindings.LocalizationStore) readonly i18n: ILocalizationStore,
		@inject(Bindings.ModalsStore) private readonly _modalsStore: IModalsStore
	) {
		makeAutoObservable(this);
	}

	get isOpen(): boolean {
		return this._modalsStore.modal === this._modalType;
	}

	get modalContent() {
		return this._modalsStore.modalContent;
	}

	close = () => this._modalsStore.hideModal();

	init(param: IProps) {
		this._modalType = param.type;
	}
}
