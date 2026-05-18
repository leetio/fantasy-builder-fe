import type {AxiosError, AxiosRequestConfig} from "axios";
import {HttpClientService} from "data/services/http/http.service";
import type {IApiResponse} from "data/types/http";
import {ServerErrorCode} from "data/enums";

export abstract class HttpClientFactory {
	static createApiClient(config: AxiosRequestConfig) {
		// You can add interceptors here to adjust or modify any of requests/responses values.
		const client = new HttpClientService(config);

		// interceptor to remove user data if session is expired
		client.interceptors.response.use(
			(response) => response,
			(error: AxiosError<IApiResponse>) => {
				const isAuthRequired = error.response?.status === ServerErrorCode.UNAUTHORIZED;

				if (isAuthRequired) {
					window.dispatchEvent(new Event("DEAUTHORIZE"));
				}

				return Promise.reject(error);
			}
		);

		return client;
	}

	static createJSONClient(config: AxiosRequestConfig) {
		// You can add interceptors here to adjust or modify any of requests/responses values.
		return new HttpClientService(config);
	}
}
