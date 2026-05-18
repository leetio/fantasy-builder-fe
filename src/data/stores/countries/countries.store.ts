import {action, makeAutoObservable, observable, runInAction} from "mobx";
import {inject, injectable} from "inversify";
import type {
	ICountriesJsonProvider,
	ICountry,
} from "data/providers/countries_json/countries_json.provider";
import {Bindings} from "bindings";

export type {ICountry} from "data/providers/countries_json/countries_json.provider";

export interface ICountriesStore {
	fetchCountries(): Promise<void>;
	list: ICountry[];
}

@injectable()
export class CountriesStore implements ICountriesStore {
	@observable private _list: ICountry[] = [];

	get list() {
		return this._list;
	}

	constructor(
		@inject(Bindings.CountriesJsonProvider) private _jsonProvider: ICountriesJsonProvider
	) {
		makeAutoObservable(this);
	}

	@action async fetchCountries() {
		const {data} = await this._jsonProvider.countries();

		runInAction(() => {
			this._list = data;
		});
	}
}
