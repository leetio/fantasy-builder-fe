/**
 * Abstract class for a ViewController constructors.
 * It's apply a generic class which is described what param must be passed
 * to the "init" method on controller initialization.
 *
 * The class may have 3 methods:
 * - init - calls on React.Component initialization. May accept parameter with a type provided in the generic.
 * - onChange - calls when some value of arguments passed to init method was changed, for example route path.
 * Accepts parameter with a type provided in the generic.
 * - dispose - calls on React.Component destroy
 *
 * @example
 * Without generic:
 * export interface IHomeController extends ViewController {
 *     counter: number;
 * }
 *
 * @injectable()
 * export class LoginController implements IHomeController {
 *     @observable counter = 0;
 *     dispose(): void {}
 *     onChange(): void {}
 *     init(): void {}
 * }
 *
 * With generic:
 * export interface IHomeController extends ViewController<Record<string, number>> {
 *     counter: number;
 * }
 *
 * @injectable()
 * export class LoginController implements IHomeController {
 *     @observable counter = 0;
 *
 *     dispose(): void {}
 *
 *     onChange(args: Record<string, number>): void {}
 *
 *     init(args: Record<string, number>): void {
 *         this.counter = args.initialCounter;
 *     }
 * }
 */
export abstract class ViewController<T = void> {
	/**
	 * Calls on initial render of React.Component
	 * May be used to pass default params to a ViewModel on creation
	 */
	abstract init?(params: T): void | Promise<void>;

	/**
	 * Calls when any of the parameter which was passed to the init method is changed.
	 * May be used to pass updated params to a ViewModel on re-render
	 */
	abstract onChange?(params: T): void | Promise<void>;

	/**
	 * Calls when React.Component destroying
	 */
	abstract dispose?(): void | Promise<void>;
}
