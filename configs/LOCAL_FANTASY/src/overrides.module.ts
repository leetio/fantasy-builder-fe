import {ContainerModule} from "inversify";

/**
 * Per-project DI overrides for LOCAL_FANTASY.
 *
 * Use `rebind` to swap a base store/controller/provider with a project-specific subclass.
 * See `docs/MULTI_PROJECT_SETUP.md` → "Per-project logic overrides" for details.
 *
 * @example
 * import {Bindings} from "bindings";
 * import {ProjectLeaguesStore} from "./overrides/leagues.store";
 *
 * export const projectOverrides = new ContainerModule(({rebind}) => {
 *     rebind(Bindings.LeaguesStore).to(ProjectLeaguesStore).inSingletonScope();
 * });
 */
export const projectOverrides = new ContainerModule(() => {
	// No overrides registered yet.
});
