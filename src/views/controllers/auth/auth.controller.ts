import {ViewController} from "data/types/structure";
import {inject, injectable} from "inversify";
import type {IUserStore} from "data/stores/user/user.store";
import {Bindings} from "bindings";
import {makeAutoObservable} from "mobx";

export interface IAuthController extends ViewController {
	get isAuthorized(): boolean;
	get wasLoggedOut(): boolean;
}

@injectable()
export class AuthController implements IAuthController {
	constructor(@inject(Bindings.UserStore) private _userStore: IUserStore) {
		makeAutoObservable(this);
	}

	get isAuthorized(): boolean {
		return this._userStore.isAuthorized;
	}

	get wasLoggedOut(): boolean {
		return this._userStore.wasLoggedOut;
	}
}
