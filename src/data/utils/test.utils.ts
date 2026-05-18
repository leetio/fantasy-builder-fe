import {type AxiosResponse, AxiosHeaders} from "axios";
import {ServerErrorCode} from "data/enums";

type TError = {message: string};
type TResponse<TResponse = unknown, TError = {message: string}> = Promise<
	AxiosResponse<{success: TResponse; errors: TError[]}>
>;

const commonFields = {
	statusText: "",
	headers: new AxiosHeaders(),
	config: {
		headers: new AxiosHeaders(),
	},
} as const;

export const createApiSuccessResponse = <T = unknown>(
	response: T,
	errors: TError[] = []
): TResponse<T> =>
	Promise.resolve({
		data: {
			success: response,
			errors,
		},
		status: 200,
		...commonFields,
	});

export const createApiFailedResponse = (
	errors: TError[] = [],
	status = ServerErrorCode.BAD_REQUEST
): TResponse<never> =>
	// This reject emulates BE API response so can't have reason, but should be with a strict structure
	// eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
	Promise.reject({
		response: {
			data: {
				success: {},
				errors,
			},
			status,
			...commonFields,
		},
	});

export const createJsonSuccessResponse = <T = unknown>(response: T): Promise<AxiosResponse<T>> =>
	Promise.resolve({
		data: response,
		status: 200,
		...commonFields,
	});
