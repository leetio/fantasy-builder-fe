import axios, {
	type AxiosInstance,
	type AxiosInterceptorManager,
	type AxiosRequestConfig,
	type AxiosResponse,
	type InternalAxiosRequestConfig,
} from "axios";

type TRequestConfig = [url: string, params?: object, requestConfig?: AxiosRequestConfig];

export interface IHttpClientService {
	interceptors: {
		request: AxiosInterceptorManager<InternalAxiosRequestConfig>;
		response: AxiosInterceptorManager<AxiosResponse>;
	};

	/**
	 * Used to append locale/lang parameter in between BASE_URL and API path.
	 */
	setLocale(locale: string): void;
	request<T = unknown>(requestConfig: AxiosRequestConfig): Promise<AxiosResponse<T>>;
	get<T = unknown>(...args: TRequestConfig): Promise<AxiosResponse<T>>;
	post<T = unknown>(...args: TRequestConfig): Promise<AxiosResponse<T>>;
	put<T = unknown>(...args: TRequestConfig): Promise<AxiosResponse<T>>;
	delete<T = unknown>(...args: TRequestConfig): Promise<AxiosResponse<T>>;
	patch<T = unknown>(...args: TRequestConfig): Promise<AxiosResponse<T>>;
}

/**
 * HTTP Client created as wrapper of axios library.
 * Can be used to perform post/get/put/delete http methods via common interface.
 *
 * ### Example of usage
 * ```js
 * import axios from 'axios';
 *
 * const APIClient = new HttpClientService({
 * 	baseURL: import.meta.env.VITE_API_URL || '',
 * 	withCredentials: true,
 * });
 *
 * APIClient.post('login', credentials);
 * APIClient.get('user/show_my');
 *
 * const JSONClient = new Http_clientService({
 * 	baseURL: import.meta.env.VITE_JSON_URL || '',
 * });
 *
 * JSONClient.get('players.json');
 * ```
 */
export class HttpClientService implements IHttpClientService {
	private readonly config: AxiosRequestConfig;
	private readonly HttpClient: AxiosInstance;
	private readonly _requestCache = new Map<string, Promise<AxiosResponse>>();
	private _locale?: string;

	public get interceptors() {
		return this.HttpClient.interceptors;
	}

	constructor(config: AxiosRequestConfig) {
		this.config = config;
		this.HttpClient = axios.create(this.config);
	}

	setLocale(locale: string) {
		this._locale = locale;
	}

	private constructURL(url: string) {
		return this._locale ? `${this._locale}/${url}` : url;
	}

	private async cachedRequest<T>(
		method: string,
		url: string,
		params?: object,
		requestConfig?: AxiosRequestConfig
	): Promise<AxiosResponse<T>> {
		const cacheKey = `${method}:${url}:${JSON.stringify(params)}`;

		if (!this._requestCache.has(cacheKey)) {
			const request = this.request<T>({
				method,
				url: this.constructURL(url),
				...(method === "get" ? {params} : {data: params}),
				...requestConfig,
			}).finally(() => {
				this._requestCache.delete(cacheKey); // Remove cache once request is complete
			});

			this._requestCache.set(cacheKey, request);
		}

		return this._requestCache.get(cacheKey) as unknown as Promise<AxiosResponse<T>>;
	}

	/**
	 * Performs pure request without calling unknown hooks.
	 */
	public request<T = unknown>(requestConfig: AxiosRequestConfig) {
		return this.HttpClient.request<T>(requestConfig);
	}

	/**
	 * Performs `get` http method with call of all existing hooks.
	 */
	public get<T = unknown>(url: string, params?: object, requestConfig?: AxiosRequestConfig) {
		return this.cachedRequest<T>("get", url, params, requestConfig);
	}

	/**
	 * Performs `delete` http method with call of all existing hooks.
	 */
	public delete<T = unknown>(url: string, params?: object, requestConfig?: AxiosRequestConfig) {
		return this.cachedRequest<T>("delete", url, params, requestConfig);
	}

	/**
	 * Performs `post` http method with call of all existing hooks.
	 */
	public post<T = unknown>(url: string, params?: object, requestConfig?: AxiosRequestConfig) {
		return this.cachedRequest<T>("post", url, params, requestConfig);
	}

	/**
	 * Performs `put` http method with call of all existing hooks.
	 */
	public put<T = unknown>(url: string, params?: object, requestConfig?: AxiosRequestConfig) {
		return this.cachedRequest<T>("put", url, params, requestConfig);
	}

	/**
	 * Performs `put` http method with call of all existing hooks.
	 */
	public patch<T = unknown>(url: string, params?: object, requestConfig?: AxiosRequestConfig) {
		return this.cachedRequest<T>("patch", url, params, requestConfig);
	}
}
