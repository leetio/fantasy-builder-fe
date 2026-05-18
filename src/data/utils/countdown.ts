export const MS_IN_SECOND = 1000;
export const SEC_IN_MINUTE = 60;
export const MIN_IN_HOUR = 60;
export const HRS_IN_DAY = 24;

const SEC_IN_HOUR = MIN_IN_HOUR * SEC_IN_MINUTE;
const SEC_IN_DAY = HRS_IN_DAY * SEC_IN_HOUR;

type TCallbackFn = (days: number, hours: number, minutes: number, seconds: number) => void;

/**
 * @example
 * const timer = new Countdown(new Date()); // <- Initialize countdown
 *
 * timer.onTick((days, hours, minutes, seconds) => { // <- add listener to call it on each tick
 * 	days = String(days).padStart(2, '0');
 * 	hours = String(hours).padStart(2, '0');
 * 	minutes = String(minutes).padStart(2, '0');
 * 	seconds = String(seconds).padStart(2, '0');
 *
 * 	// Do whatever you want with these values
 * 	console.log(days, hours, minutes, seconds);
 * }).onComplete((days, hours, minutes, seconds) => { // <- add listener to call on complete
 * 	// Do whatever you want with these values, all of them are equal to 0 here
 * 	console.log(days, hours, minutes, seconds);
 * }).run(); // <- run timer
 *
 * ---===  Usage at react component ===---
 *
 * interface IProps {
 * 	date?: string;
 * }
 *
 * export const Countdown: React.FC<IProps> = ({ date = new Date().toISOString() }) => {
 * 	const dispatch = useDispatch();
 * 	const timerRef = useRef(new Timer(new Date(date)));
 *
 * 	const [{days, hours, minutes, seconds}, setTime] = useState({
 * 		days: "00",
 * 		hours: "00",
 * 		minutes: "00",
 * 		seconds: "00",
 * 	});
 *
 * 	useEffect(() => {
 * 		const timer = timerRef.current;
 *
 * 		timer
 * 			.clear()
 * 			.updateDate(new Date(date))
 * 			.onTick((days, hours, minutes, seconds) =>
 * 				setTime({
 * 					days: days.toString().padStart(2, "0"),
 * 					hours: hours.toString().padStart(2, "0"),
 * 					minutes: minutes.toString().padStart(2, "0"),
 * 					seconds: seconds.toString().padStart(2, "0"),
 * 				})
 * 			)
 * 			.onComplete(() => dispatch(someEvent()))
 * 			.run();
 *
 * 		return () => {
 * 			timer.clear();
 * 		};
 * 	}, [dispatch, timerRef, date]);
 *
 * 	return <Fragment>{days}:{hours}:{minutes}:{seconds}</Fragment>;
 * };
 */
export class Countdown {
	private _onTickCallbacks: TCallbackFn[] = [];
	private _onCompleteCallbacks: TCallbackFn[] = [];

	private _intervalID?: ReturnType<typeof setInterval>;

	/**
	 * Variables below initialize later, inside the constructor
	 */
	private _msToFinish!: number;
	private _days!: number;
	private _hours!: number;
	private _minutes!: number;
	private _seconds!: number;

	constructor(
		/**
		 * Define to what date the timer should count down.
		 */
		private _date: Date,
		/**
		 * Time interval when one tick will happen. Maybe useful for a timer accuracy.
		 */
		private _updateFrequencyMs = 500
	) {
		this._setTimeDiff();
	}

	get isComplete() {
		return this._msToFinish <= 0;
	}

	private _setTimeDiff() {
		this._msToFinish = Number(this._date) - Date.now();

		if (this._msToFinish <= 0) {
			this._msToFinish = 0;
		}

		const secToFinish = Math.floor(this._msToFinish / MS_IN_SECOND);

		this._days = Math.floor(secToFinish / SEC_IN_DAY);
		this._hours = Math.floor(secToFinish / SEC_IN_HOUR) % HRS_IN_DAY;
		this._minutes = Math.floor(secToFinish / MIN_IN_HOUR) % MIN_IN_HOUR;
		this._seconds = Math.floor(secToFinish % SEC_IN_MINUTE);

		return this;
	}

	_tick() {
		this._setTimeDiff()._callOnTick();

		if (this.isComplete) {
			this.stop()._callOnComplete();
		}

		return this;
	}

	_callOnTick() {
		this._onTickCallbacks.forEach((callback) => {
			callback(this._days, this._hours, this._minutes, this._seconds);
		});

		return this;
	}

	_callOnComplete() {
		this._onCompleteCallbacks.forEach((callback) => {
			callback(this._days, this._hours, this._minutes, this._seconds);
		});

		return this;
	}

	onTick(callback: TCallbackFn) {
		this._onTickCallbacks.push(callback);

		return this;
	}

	onComplete(callback: TCallbackFn) {
		this._onCompleteCallbacks.push(callback);

		return this;
	}

	run() {
		this.stop()._callOnTick();

		if (!this.isComplete) {
			this._intervalID = setInterval(() => this._tick(), this._updateFrequencyMs);
		}

		return this;
	}

	stop() {
		if (this._intervalID) {
			clearInterval(this._intervalID);
		}

		return this;
	}

	updateDate(date: Date) {
		this._date = date;
		this._setTimeDiff();

		return this;
	}

	clear() {
		this.stop();
		this._onTickCallbacks = [];
		this._onCompleteCallbacks = [];

		return this;
	}
}
