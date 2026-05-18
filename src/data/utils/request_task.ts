import {makeAutoObservable} from "mobx";
import {RequestState} from "data/enums";
import {type AxiosError, isAxiosError} from "axios";

const {IDLE, PENDING, SUCCESS, ERROR} = RequestState;

/**
 * RequestTask
 * ----------
 * A tiny MobX-friendly wrapper around an async operation lifecycle.
 *
 * What it gives you:
 * - Observable `state` (IDLE / PENDING / SUCCESS / ERROR)
 * - Observable `error` (last error, if any)
 * - A `run()` method that starts an async task immediately and returns a chain
 *   where you can attach *one* onSuccess/onError/finally handler (last call wins).
 *
 * Typical usage:
 *
 *   const request = new RequestTask();
 *
 *   const result = await request
 *     .run(() => api.fetchSomething())
 *     .onSuccess((data) => { ...side effects... })
 *     .onError((e) => { ...handle error...; return fallback; })
 *     .finally(() => { ...cleanup... })
 *     .asPromise();
 *
 * Notes:
 * - `run()` expects a function returning a Promise, not a Promise itself.
 *   This allows RequestTask to set PENDING before the task starts and also
 *   converts synchronous throws into rejected promises.
 * - By default, if there is no `onError(...)` handler, errors are rethrown
 *   (to avoid silent failures / unhandled behavior differences).
 */
export class RequestTask {
	private _state: RequestState = IDLE;
	private _error: unknown = null;

	constructor(initial: RequestState = IDLE) {
		this._state = initial;
		// autoBind: methods keep correct `this` when passed as callbacks
		makeAutoObservable(this, {}, {autoBind: true});
	}

	get axiosError(): AxiosError | null {
		if (isAxiosError(this._error)) {
			return this._error;
		}

		return null;
	}

	get state() {
		return this._state;
	}

	/** True while the request is in progress. */
	get isLoading() {
		return this._state === PENDING;
	}

	/** True if the last run ended with an error. */
	get isError() {
		return this._state === ERROR;
	}

	/** True if the last run ended with success. */
	get isSuccess() {
		return this._state === SUCCESS;
	}

	/**
	 * Reset lifecycle to IDLE and clear stored error.
	 * Useful when leaving a screen or when user retries from a clean state.
	 */
	reset() {
		this._state = IDLE;
		this._error = null;
	}

	/**
	 * Start an async task immediately and return a chain object.
	 *
	 * The chain is typed:
	 * - T is inferred from the Promise returned by `task`.
	 * - The final output type may widen after you attach `onError(...)`.
	 *
	 * Example (T inferred):
	 *   const p = request.run(() => store.fetchMyLeagues());
	 *   // p is RequestChain<MyLeaguesResponse, MyLeaguesResponse>
	 */
	run<T>(task: () => Promise<T>) {
		// Output type initially equals the task result type
		return new RequestChain<T, T>(this, task);
	}

	/** Internal: set PENDING and clear previous error. */
	_setPending() {
		this._state = PENDING;
		this._error = null;
	}

	/** Internal: set SUCCESS. */
	_setSuccess() {
		this._state = SUCCESS;
	}

	/** Internal: set ERROR and store error. */
	_setError(error: unknown) {
		this._state = ERROR;
		this._error = error;
	}
}

/**
 * RequestChain<TIn, TOut>
 * ----------------------
 * A chainable object created by RequestTask.run().
 *
 * Type parameters:
 * - TIn  : the actual task result type (what `task()` resolves to)
 * - TOut : the final output type after applying error recovery (onError)
 *
 * Why two types?
 * - Because `onError()` may recover with a value of a *different* type
 *   (or recover with nothing), so the "final" awaited type can become
 *   a union.
 *
 * Handler model:
 * - onSuccess: single handler (last call wins)
 * - onError  : single handler (last call wins)
 * - finally  : single handler (last call wins)
 *
 * Execution model:
 * - The task starts immediately in the constructor (auto-run).
 * - Internally we use `Promise.resolve().then(task)` to ensure that if `task`
 *   throws synchronously, it becomes a rejected promise (consistent async behavior).
 */
class RequestChain<TIn, TOut> {
	private onSuccessHandler: ((r: TIn) => void) | null = null;
	private onErrorHandler: ((e: unknown) => unknown) | null = null;
	private onFinallyHandler: (() => void) | null = null;

	/** If true, error will be rethrown even if onError is provided. */
	private forceThrow = false;

	/** Promise representing the final resolved value of the chain. */
	private readonly promise: Promise<TOut>;

	constructor(
		private readonly request: RequestTask,
		task: () => Promise<TIn>
	) {
		// Mark request as pending BEFORE the task starts.
		this.request._setPending();

		// NOTE: Promise.resolve().then(task) turns sync throws into rejected promises.
		// eslint-disable-next-line sonarjs/no-async-constructor
		this.promise = Promise.resolve()
			.then(task)
			.then((result) => {
				// Update MobX state within an action.
				this.request._setSuccess();

				// Optional side-effect handler.
				this.onSuccessHandler?.(result);

				// At this stage TOut === TIn (until onError widens the output type).
				return result as unknown as TOut;
			})
			.catch(async (error) => {
				// Store error and update MobX state.
				this.request._setError(error);

				// If user forced throwing — always propagate.
				if (this.forceThrow) throw error;

				// If there is an onError handler, use its return value as recovery.
				// This is the key: the output of onError becomes the chain's resolved value.
				if (this.onErrorHandler) {
					const recovered = await this.onErrorHandler(error);
					return recovered as TOut;
				}

				// No handler => propagate (avoid silent failures).
				throw error;
			})
			.finally(() => {
				// Finally side effects run regardless of success/error.
				this.onFinallyHandler?.();
			});
	}

	/**
	 * Force error propagation even if onError handler exists.
	 *
	 * Useful when you want a local side effect (e.g., show modal),
	 * but still want the caller to be able to catch/handle the rejection.
	 *
	 * Example:
	 *   await request
	 *     .run(() => api.fetch())
	 *     .onError((e) => { modals.show(e); }) // side-effect only
	 *     .throwOnError()
	 *     .asPromise(); // will still reject
	 */
	throwOnError() {
		this.forceThrow = true;
		return this;
	}

	/**
	 * Success side effect (single handler; last call wins).
	 * Does NOT change the output type.
	 *
	 * Example:
	 *   request.run(() => api.fetch())
	 *     .onSuccess((data) => analytics.track("loaded"))
	 *     .asPromise();
	 */
	onSuccess(handler: (r: TIn) => void) {
		this.onSuccessHandler = handler;
		return this;
	}

	/**
	 * Error recovery.
	 *
	 * Overloads:
	 * 1) handler returns void/undefined => output becomes TOut | undefined
	 * 2) handler returns R             => output becomes TOut | R
	 *
	 * IMPORTANT TS NOTE:
	 * - The generic overload MUST be declared first.
	 *   Otherwise TypeScript may choose the `void` overload even if your function
	 *   returns something (because functions returning a value are assignable to
	 *   void-returning signatures).
	 *
	 * Examples:
	 *
	 * 1) Side-effect only (swallow into undefined):
	 *   const value = await request
	 *     .run(() => api.fetchLeagues())              // TIn = Leagues[]
	 *     .onError((e) => { modals.showError(e); })   // returns void
	 *     .asPromise();
	 *   // value: Leagues[] | undefined
	 *
	 * 2) Recover with a fallback value (same type):
	 *   const value = await request
	 *     .run(() => api.fetchLeagues())
	 *     .onError(() => [])                          // returns Leagues[]
	 *     .asPromise();
	 *   // value: Leagues[]
	 *
	 * 3) Recover with a different format:
	 *   const value = await request
	 *     .run(() => api.fetchLeagues())              // TIn = Leagues[]
	 *     .onError(() => ({ leagues: [], fromCache: true })) // R is an object
	 *     .asPromise();
	 *   // value: Leagues[] | { leagues: Leagues[]; fromCache: true }
	 *
	 * If you want to *always* propagate error even when onError exists:
	 *   ...onError(...).throwOnError().asPromise()
	 */
	// Put the generic overload FIRST, otherwise TS often picks the void one
	onError<E, R>(handler: (e: E) => R | Promise<R>): RequestChain<TIn, TOut | Awaited<R>>;
	onError<E>(handler: (e: E) => void): RequestChain<TIn, TOut | undefined>;
	onError<E, R>(handler: (e: E) => R | Promise<R> | void) {
		this.onErrorHandler = (e: unknown) => handler(e as E);
		return this as unknown as RequestChain<TIn, TOut | Awaited<R> | undefined>;
	}

	/**
	 * Finally side-effect (single handler; last call wins).
	 *
	 * Example:
	 *   request.run(() => api.fetch())
	 *     .finally(() => ui.stopSpinner())
	 *     .asPromise();
	 */
	finally(handler: () => void) {
		this.onFinallyHandler = handler;
		return this;
	}

	/**
	 * Promise of the final output type.
	 *
	 * - Resolves with TIn on success.
	 * - Resolves with the return value of onError (which may widen the type).
	 * - Rejects if no onError is provided, OR if throwOnError() is enabled.
	 *
	 * Example:
	 *   const result = await request.run(() => api.fetch()).asPromise();
	 */
	asPromise(): Promise<TOut> {
		return this.promise;
	}
}
