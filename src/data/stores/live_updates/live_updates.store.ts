import {inject, injectable} from "inversify";
import {Bindings} from "bindings";
import {action, makeAutoObservable, observable} from "mobx";
import type {TChecksums, IChecksumStore} from "data/stores/checksum/checksum.store";
import {forEach} from "lodash-es";
import {MS_IN_SECOND, SEC_IN_MINUTE} from "data/utils";

export type TChecksumActions = Record<keyof TChecksums, () => Promise<void> | void>;

interface IMeta {
	rafID: number | null;
	updateAt: number | null;
}

interface IChecksumMeta extends IMeta {
	actions: TChecksumActions;
}

interface IIntervalAction {
	startAt: number;
	frequency: number;
	callback: () => Promise<void> | void;
}

interface IIntervalMeta extends IMeta {
	actions: IIntervalAction[];
}

export interface ILiveUpdatesStore {
	startChecksumUpdates: (actions: TChecksumActions, interval?: number) => void;
	startIntervalActions: () => void;
	addIntervalAction: (callback: () => Promise<void> | void, frequency: number) => void;
	stopIntervalActions: () => void;
	stopChecksumUpdates: () => void;
}

const LIVE_UPDATES_FETCH_TIMING = SEC_IN_MINUTE * MS_IN_SECOND; // one miniten in milliseconds

/**
 * This store is responsible for handling live data updates using:
 * - Checksum-based polling to detect changes and trigger associated actions.
 * - Custom periodic interval actions independent of checksums.
 *
 * Usage:
 *
 * 1. Checksum-based polling:
 *
 * this._liveUpdatesStore.startChecksumUpdates({
 *   rounds: this.fetchRounds,
 *   users: this.fetchUsers,
 * });
 *
 * // By default, the polling interval is 1 minute (LIVE_UPDATES_FETCH_TIMING).
 * // To specify a custom interval (e.g., 15 seconds):
 *
 * this._liveUpdatesStore.startChecksumUpdates({
 *   rounds: this.fetchRounds,
 * }, 15000);
 *
 * Notes:
 * - Callback actions will only be called if the corresponding checksum value has changed.
 * - Actions are not called immediately after subscribing; they trigger only after the first interval has passed.
 * - If ChecksumStore is instantiated as a factory (not singleton), each subscription will behave independently.
 * - Always call `stopChecksumUpdates()` when polling is no longer needed to reduce CPU/memory usage.
 *
 * 2. Custom interval-based actions:
 *
 * this._liveUpdatesStore.addIntervalAction(this.refreshUI, 10); // every 10 seconds
 * this._liveUpdatesStore.startIntervalActions();
 *
 * Notes:
 * - Interval actions are executed no more frequently than once per second.
 * - Each action runs after its configured delay in seconds.
 * - Call `stopIntervalActions()` to stop all interval timers and clear memory.
 */
@injectable()
export class LiveUpdatesStore implements ILiveUpdatesStore {
	private SEC = 1000;

	@observable private _checksum: IChecksumMeta = {
		rafID: null,
		updateAt: null,
		actions: {},
	};

	@observable private _intervals: IIntervalMeta = {
		rafID: null,
		updateAt: null,
		actions: [],
	};

	constructor(@inject(Bindings.ChecksumStore) private _checksumStore: IChecksumStore) {
		makeAutoObservable(this);
	}

	/**
	 * Indicates whether the document is currently hidden/inactive (e.g., tab is not visible).
	 * Used to avoid unnecessary processing while the page is in the background.
	 */
	private get isDocumentInvisible() {
		return document.visibilityState === "hidden";
	}

	/**
	 * Starts polling `checksums.json` at the specified interval and triggers
	 * actions only when individual checksum values change.
	 */
	@action
	public startChecksumUpdates(actions: TChecksumActions, interval = LIVE_UPDATES_FETCH_TIMING) {
		this.stopChecksumUpdates();
		this.invokeChecksums();

		this._checksum.actions = actions;

		const tick = () => {
			const now = Date.now();

			if (!this._checksum.updateAt) this._checksum.updateAt = now;

			// Allow to request checksums once per interval and only when page is active
			if (this.isDocumentInvisible || now - this._checksum.updateAt < interval) {
				this._checksum.rafID = requestAnimationFrame(tick);
				return;
			}

			this.invokeChecksums();

			this._checksum.updateAt = now;
			this._checksum.rafID = requestAnimationFrame(tick);
		};

		this._checksum.rafID = requestAnimationFrame(tick);
	}

	/**
	 * Triggers a checksums.json fetch and processes any changed checksums.
	 * This is called internally; not typically used directly by consumers.
	 */
	private invokeChecksums = () => {
		void this._checksumStore.fetchChecksums().then(() => {
			this.invokeActionsOfChangedChecksum();
		});
	};

	/**
	 * Stops the checksum polling loop and prevents any further action invocations.
	 * Call this to release resources when live checksum updates are no longer needed.
	 */
	@action
	public stopChecksumUpdates() {
		if (this._checksum.rafID) {
			cancelAnimationFrame(this._checksum.rafID);
			this._checksum.rafID = null;
			this._checksum.updateAt = null;
		}
	}

	/**
	 * Compares the current checksum values to the previous state
	 * and invokes associated actions if a value has changed.
	 * This runs internally after each successful checksums.json fetch.
	 */
	@action
	private invokeActionsOfChangedChecksum() {
		forEach(this._checksumStore.changedChecksums, (_, key) => {
			const action = this._checksum.actions[key];

			if (action && typeof action === "function") {
				void action();
			}
		});
	}

	/**
	 * Starts executing custom interval-based actions. Each action runs according to its frequency
	 * and is not tied to checksum changes. This method must be called once to enable the timer loop.
	 */
	public startIntervalActions = (): void => {
		const tick = () => {
			const now = Date.now();

			if (!this._intervals.updateAt) this._intervals.updateAt = now;

			// Allow to perform action once per second and only when page is active
			if (this.isDocumentInvisible || now - this._intervals.updateAt < this.SEC) {
				this._intervals.rafID = requestAnimationFrame(tick);
				return;
			}

			this._intervals.updateAt = now;

			this._intervals.actions.forEach((it) => {
				if (it.startAt > now) return;

				void it.callback();
				it.startAt = now + it.frequency * this.SEC;
			});

			this._intervals.rafID = requestAnimationFrame(tick);
		};

		this._intervals.rafID = requestAnimationFrame(tick);
	};

	/**
	 * Adds a new custom interval-based action to be executed periodically.
	 */
	public addIntervalAction = (callback: () => Promise<void> | void, frequency: number) => {
		this._intervals.actions.push({
			frequency,
			startAt: Date.now() + frequency * this.SEC,
			callback: callback,
		});
	};

	/**
	 * Stops all interval-based actions and clears their internal state.
	 * Should be called when periodic callbacks are no longer necessary.
	 */
	public stopIntervalActions = (): void => {
		if (!this._intervals.rafID) return;

		cancelAnimationFrame(this._intervals.rafID);
		this._intervals.rafID = null;
		this._intervals.updateAt = null;
		this._intervals.actions = [];
	};
}
