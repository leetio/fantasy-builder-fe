import type {ComponentType} from "react";
import type {AxiosError} from "axios";
import {get, noop} from "lodash-es";

type TFactory<T> = () => Promise<{
	default: ComponentType<T>;
}>;

const RETRY_MAX_TIMES = 5;
const RETRY_INTERVAL_MS = 1000;

export function retryFailLoad<T>(
	fn: TFactory<T>,
	retriesLeft = RETRY_MAX_TIMES,
	interval = RETRY_INTERVAL_MS
): TFactory<T> {
	return () =>
		new Promise((resolve, reject) => {
			fn()
				.then(resolve)
				.catch((error: unknown) => {
					// This code is boilerplate solution that we don't want to modify
					// eslint-disable-next-line sonarjs/no-nested-functions
					setTimeout(() => {
						if (retriesLeft === 1) {
							// We're not sure what kind of error comes here, so we just re-throw what comes.
							// eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
							reject(error);
							return;
						}

						retryFailLoad(fn, retriesLeft - 1, interval)().then(resolve, reject);
					}, interval);
				});
		});
}

export const fromErrorToMessage = <T extends AxiosError>(error: T) =>
	get(error, "response.data.errors.[0].message", error.message);

export const copyToClipboard = async (content: string) => {
	try {
		await navigator.clipboard.writeText(content);
		return true;
	} catch (error) {
		noop(error);
		return false;
	}
};

export const getNumbersOnly = (value: string) => value.replace(/\d/g, "");

export * from "data/utils/countdown";
export * from "data/utils/social_share";
