export interface IApiResponse<TResponse = unknown, TError = {message: string}> {
	success: TResponse;
	errors: TError[];
}
