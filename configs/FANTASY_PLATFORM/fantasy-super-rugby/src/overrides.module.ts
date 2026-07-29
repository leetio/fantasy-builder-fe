import {ContainerModule} from "inversify";
import {Bindings} from "bindings";
import {SuperRugbyLandingController} from "./overrides/landing.controller";

/**
 * Per-game DI overrides for Fantasy Super Rugby.
 *
 * This module is loaded automatically when VITE_PROJECT=FANTASY_PLATFORM/fantasy-super-rugby.
 * Use `rebind` to swap base stores/controllers/providers with game-specific implementations.
 *
 * Super Rugby Features:
 * - Rugby-specific player positions (Prop, Hooker, Lock, etc.)
 * - Rugby-specific scoring rules (Tries, Conversions, Penalties, etc.)
 * - Team formation constraints (2-1-2-3-1-1-2-3/1-1-1-1-1-1-1-1)
 * - Salary cap of 100,000,000
 * - 23 players per team (lineup + bench)
 * - Max 4 players from same squad
 */
export const projectOverrides = new ContainerModule(({rebind}) => {
	// Override landing controller with Super Rugby branding/behavior
	rebind(Bindings.LandingController).to(SuperRugbyLandingController);

	// Future overrides can be added here:
	// - Custom team selection logic with rugby-specific formations
	// - Rugby-specific player stat displays
	// - Custom scoring calculations
});
