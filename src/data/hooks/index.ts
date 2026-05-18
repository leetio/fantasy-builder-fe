import {useContext, useEffect, useRef} from "react";
import type {ServiceIdentifier} from "inversify";
import type {ViewController} from "data/types/structure";
import {InjectionContext} from "views/components/injection_provider/injection_provider.component";
import {isEqual} from "lodash-es";

type TMaybeCleanUpFn = void | (() => void);

function useDeepCompareEffect<T = unknown[]>(
	create: () => TMaybeCleanUpFn,
	input: T,
	equal: (a: T, b: T) => boolean = isEqual
) {
	const prevRef = useRef<T>(input);
	const didMountRef = useRef(false);

	useEffect(() => {
		let cleanup: TMaybeCleanUpFn | undefined;

		// On first mount, always run like a normal useEffect
		if (!didMountRef.current) {
			didMountRef.current = true;
			cleanup = create();
			prevRef.current = input;

			return cleanup;
		}

		// On updates, only run if inputs changed by the custom comparator
		if (!equal(input, prevRef.current)) {
			prevRef.current = input;
			cleanup = create();
		}

		return cleanup;
	}, [input, equal, create]);
}

/**
 * React hook that used to receive ViewModel(aka ViewController) from the DI container.
 * @param identifier - The first parameter is a ViewModel identifier by which a class was registered.
 * We highly recommend to use "Symbol" for this.
 * @param param - The second parameter is an optional parameter that will be passed to the "init" method on instance creation.
 * The parameter type is inferred from a generic type.
 *
 * @description A ViewModel(aka ViewController) has 3 lifecycle methods:
 * - init - calls once a component is mounted
 * - onChange - calls everytime if some of the props passed to init method were changed. It doesn't call on initial render.
 * - dispose - call once when a component become destroyed.
 *
 * @example
 * const {decrement, increment, counter} = useViewController<IController>(IController, {
 *     initialCounter: 5
 * });
 */
export function useViewController<
	T extends ViewController<T2>,
	T2 = T extends ViewController<infer TParam> ? TParam : undefined,
>(
	identifier: ServiceIdentifier<T>,
	...param: T extends ViewController<infer TParam> ? [TParam] : []
): Omit<T, "init" | "dispose" | "onChange"> {
	const {container} = useContext(InjectionContext);

	if (!container) {
		throw new Error("InversifyJS container must be provided to <InversifyProvider> component");
	}

	const vmRef = useRef<T>(container.get<T>(identifier));
	const isMountedRef = useRef(false);
	const isMounted = isMountedRef.current;
	const payload = param[0];

	useEffect(() => {
		const vm = vmRef.current;

		void Promise.resolve(vm.init?.(payload));
		isMountedRef.current = true;

		return () => {
			void Promise.resolve(vm.dispose?.());
		};

		/**
		 * We don't want to call the "init" method one more time if parameter was changed.
		 * This effect should be called once, on a component initialization
		 */
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useDeepCompareEffect(() => {
		if (!isMounted) return;
		void Promise.resolve(vmRef.current.onChange?.(payload));
	}, [payload]);

	return vmRef.current;
}

export const useIsSupportNativeShare = () => {
	return typeof navigator !== "undefined" && "share" in navigator;
};
