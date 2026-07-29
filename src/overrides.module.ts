import {ContainerModule} from "inversify";

/**
 * Per-game DI overrides for Fantasy Super Rugby.
 *
 * This module is loaded automatically when VITE_PROJECT=FANTASY_PLATFORM/fantasy-super-rugby.
 * Use `rebind` to swap base stores/controllers/providers with game-specific implementations.
 *
 * @example
 * import {Bindings} from "bindings";
 * import {SuperRugbyLeaguesStore} from "./overrides/leagues.store";
 *
 * export const projectOverrides = new ContainerModule(({rebind}) => {
 *     rebind(Bindings.LeaguesStore).to(SuperRugbyLeaguesStore).inSingletonScope();
 * });
 */
export const projectOverrides = new ContainerModule(() => {
	// No overrides yet. Add game-specific logic here as needed.
	// Example: Super Rugby might have different scoring rules, team constraints, etc.
});
