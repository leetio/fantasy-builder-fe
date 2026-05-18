import {inject, injectable} from "inversify";
import {Bindings} from "bindings";
import {RoundStatus} from "data/enums";
import type {AxiosResponse} from "axios";
import type {IHttpClientService} from "data/services/http";
import {SITE_URL} from "data/constants";

export interface IRound {
	id: number;
	status: RoundStatus;
	startDate: string;
	endDate: string;
}

export interface IRoundsJsonProvider {
	rounds(): Promise<AxiosResponse<IRound[]>>;
}

@injectable()
export class RoundsJsonProvider implements IRoundsJsonProvider {
	constructor(@inject(Bindings.JsonHTTPClient) private _jsonClient: IHttpClientService) {}

	rounds = () => {
		if (!SITE_URL.includes("boilerplate")) {
			return this._jsonClient.get<IRound[]>("rounds.json");
		}

		const dates = {
			startDate: new Date().toISOString(),
			endDate: new Date().toISOString(),
		};

		return Promise.resolve({
			data: [
				{
					id: 1,
					status: RoundStatus.COMPLETED,
					...dates,
				},
				{
					id: 2,
					status: RoundStatus.PLAYING,
					...dates,
				},
				{
					id: 3,
					status: RoundStatus.SCHEDULED,
					...dates,
				},
				{
					id: 4,
					status: RoundStatus.SCHEDULED,
					...dates,
				},
			],
		}) as Promise<AxiosResponse<IRound[]>>;
	};
}
