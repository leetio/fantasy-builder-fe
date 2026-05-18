import {action, makeAutoObservable, observable} from "mobx";
import {injectable} from "inversify";
import {ModalType} from "data/enums";
import type {AxiosError} from "axios";
import type {IApiResponse} from "data/types/http";
import {fromErrorToMessage} from "data/utils";

export interface IModalPayload {
	title?: string;
	message?: string;
	callback?: (payload?: unknown) => void;
}

export type TModalArguments = [type: ModalType] | [type: ModalType, content: IModalPayload];

export interface IModalsStore {
	get modal(): ModalType | null;
	get modalContent(): IModalPayload | null;

	showModal: (...args: TModalArguments) => void;
	showErrorModal: (error: AxiosError<IApiResponse>) => void;
	hideModal: () => void;
}

@injectable()
export class ModalsStore implements IModalsStore {
	@observable _visibleModal: ModalType | null = null;
	@observable _modalContent: IModalPayload | null = null;

	get modal() {
		return this._visibleModal;
	}

	get modalContent() {
		return this._modalContent;
	}

	constructor() {
		makeAutoObservable(this);
	}

	@action showModal = (...args: TModalArguments) => {
		const [modalType, content = null] = args;

		this._visibleModal = modalType;
		this._modalContent = content;
	};

	@action hideModal = () => {
		this._visibleModal = null;
		this._modalContent = null;
	};

	showErrorModal = (error: AxiosError<IApiResponse>) => {
		this.showModal(ModalType.ERROR, {
			message: fromErrorToMessage(error),
		});
	};
}
