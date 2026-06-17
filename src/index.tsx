import "reflect-metadata";
import "assets/css/core.css";
import "assets/css/fonts.css";

import React from "react";
import reportWebVitals from "reportWebVitals";
import {mainRouter, restrictedRouter} from "routes";
import {
	breadcrumbsIntegration,
	browserTracingIntegration,
	init,
	thirdPartyErrorFilterIntegration,
} from "@sentry/react";
import {RouterProvider} from "react-router-dom";
import {createRoot} from "react-dom/client";
import type {ContainerModule} from "inversify";
import {DIContainer, controllers, providers, services, stores} from "dependencies";
import {InjectionProvider} from "views/components/injection_provider/injection_provider.component";
import {StyledEngineProvider} from "@mui/material/styles";
import {ThemeProvider} from "@mui/material";
import {SENTRY_DSN_URL, SENTRY_PROJECT_NAME} from "data/constants";
import {SecretGateController} from "views/controllers/secret_gate/secret_gate.controller";
import {Bootstrap} from "views/components/bootstrap/bootstrap.component";
import {theme} from "assets/theming/theme";

if (SENTRY_DSN_URL) {
	init({
		dsn: SENTRY_DSN_URL,
		integrations: [
			browserTracingIntegration(),
			breadcrumbsIntegration({
				console: false,
			}),
			thirdPartyErrorFilterIntegration({
				filterKeys: [SENTRY_PROJECT_NAME],
				behaviour: "drop-error-if-contains-third-party-frames",
			}),
		],
		environment: import.meta.env.VITE_SENTRY_ENV || "development",
		allowUrls: [
			"*.f2p.media.geniussports.com",
			// TODO Add Prod domain before first release
		],
		ignoreErrors: [
			"Abort due to cancellation of share",
			"AbortError: Share canceled",
			/Network Error/i,
			/Fetch Error/i,
			"Can't find variable: _AutofillCallbackHandler", //Instagram browser issue
			"Can't find variable: gmo",
		],
		denyUrls: [
			"quantcast",
			"xsca",
			// browser's extensions
			/extensions\//i,
			/^chrome:\/\//i,
			/^moz-extension:\/\//i,
		],
		sampleRate: 0.1,
	});
}

const root = document.getElementById("root");

if (!root) {
	throw Error("Root element was not found");
}

await DIContainer.load(services, providers, stores, controllers);

const overrideModules = import.meta.glob<{projectOverrides?: ContainerModule}>(
	"../configs/*/src/overrides.module.ts",
	{eager: true}
);
const projectKey = `../configs/${import.meta.env.VITE_PROJECT}/src/overrides.module.ts`;
const projectModule = overrideModules[projectKey];

if (projectModule?.projectOverrides) {
	await DIContainer.load(projectModule.projectOverrides);
}

const router = SecretGateController.IS_SECRET_PASSED ? mainRouter : restrictedRouter;

createRoot(root).render(
	<React.StrictMode>
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>
				<InjectionProvider container={DIContainer}>
					<Bootstrap>
						<RouterProvider router={router} />
					</Bootstrap>
				</InjectionProvider>
			</ThemeProvider>
		</StyledEngineProvider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
