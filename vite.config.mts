import {defineConfig, type ViteUserConfig} from "vitest/config";
import {createLogger, loadEnv} from "vite";
import react from "@vitejs/plugin-react-swc";
import viteTsconfigPaths from "vite-tsconfig-paths";
import basicSsl from "@vitejs/plugin-basic-ssl";
import {createHtmlPlugin} from "vite-plugin-html";
import eslint from "vite-plugin-eslint2";
import browserslistToEsbuild from "browserslist-to-esbuild";
import svgr from "vite-plugin-svgr";
import {sentryVitePlugin} from "@sentry/vite-plugin";
import tailwindcss from "@tailwindcss/vite";

const logger = createLogger();
const loggerInfo = logger.info;
const HOST_REGEXP = /https:\/\/(?:\x1b\[[0-9;]*m)*[a-zA-Z0-9.\-]+(?:\x1b\[[0-9;]*m)*:(?:\x1b\[[0-9;]*m)*\d+(?:\x1b\[[0-9;]*m)*\//g;

const LOCAL_DOMAIN = "frontend.dev.loc";
const LOCAL_PORT = 8080;


/** @type {import("vite").ViteUserConfig} */
export default ({mode = "development"}: ViteUserConfig) => {
	// https://vitejs.dev/config/#using-environment-variables-in-config
	const envVariables = loadEnv(mode, process.cwd(), "");
	const env = mode === "test"
		? Object.assign({}, loadEnv("development", process.cwd(), ""), envVariables)
		: envVariables;
	const PUBLIC_URL = new URL(env.PUBLIC_URL);
	const LOCAL_SERVER_URL = new URL(`https://${LOCAL_DOMAIN}:${LOCAL_PORT}`);
	LOCAL_SERVER_URL.pathname = env.VITE_BASE_URL;

	logger.info = (msg, options) => {
		msg = msg.replace("localhost", LOCAL_DOMAIN);

		if(msg.match(HOST_REGEXP)) {
			msg = msg.endsWith('/') ? msg : `${msg}/`
		}

		loggerInfo(msg, options);
	};

	const sentryConfig = env.VITE_SENTRY_ENV === "production" ? sentryVitePlugin({
		applicationKey: env.VITE_SENTRY_PROJECT_NAME,
		project: env.VITE_SENTRY_PROJECT_NAME,
		sourcemaps: {
			disable: true,
		},
		release: {
			name: `${env.VITE_SENTRY_PROJECT_NAME}-${new Date().getTime()}`,
			deploy: {
				env: env.VITE_SENTRY_ENV,
			},
		},
	}) : undefined;

	return defineConfig({
		base: env.PUBLIC_URL, // https://vitejs.dev/config/shared-options#base
		appType: "spa",
		customLogger: logger,
		resolve: {
			alias: {
				lodash: "lodash-es",
			},
		},
		build: {
			outDir: "build",
			target: browserslistToEsbuild([
				">0.5%",
				"last 2 versions",
				"not dead",
				"not op_mini all",
			]),
			chunkSizeWarningLimit: 768,
			rollupOptions: {
				output: {
					chunkFileNames: "static/js/[name]-[hash].js",
					entryFileNames: "static/js/[name]-[hash].js",
					manualChunks(id) {
						const HUGE_LIBRARIES = [
							"@mui",
							"lodash-es",
							"framer-motion",
							"react-slick",
							"date-fns",
							"inversify",
							"mobx",
							"@emotion",
						];

						if (HUGE_LIBRARIES.some((name) => id.includes(`node_modules/${name}`))) {
							return id.toString().split("node_modules/")[1].split("/")[0].toString();
						}
					},
					assetFileNames: ({names}) => {
						if (names.some(it => /\.(gif|jpe?g|png|svg|avif|webp)$/.test(it))) {
							return "static/media/[name]-[hash][extname]";
						}

						if (names.some(it => /\.css$/.test(it))) {
							return "static/css/[name]-[hash][extname]";
						}

						if (names.some(it => /\.(woff|woff2|otf|ttf)$/.test(it))) {
							return "static/fonts/[name]-[hash][extname]";
						}

						// default value
						// ref: https://rollupjs.org/guide/en/#outputassetfilenames
						return "static/assets/[name]-[hash][extname]";
					},
				},
			},
		},
		plugins: [
			viteTsconfigPaths(),
			basicSsl(),
			tailwindcss(),
			createHtmlPlugin({entry: "/src/index.tsx"}),
			react({tsDecorators: true}),
			svgr(),
			eslint({cache: false}),
			sentryConfig,
		],
		server: {
			host: "0.0.0.0",
			open: LOCAL_SERVER_URL.href,
			port: LOCAL_PORT,
			strictPort: true,
			hmr: {
				host: LOCAL_DOMAIN,
				port: LOCAL_PORT,
			},
			proxy: {
				"/api": {
					target: PUBLIC_URL.origin,
					changeOrigin: true,
					ws: true,
					headers: {
						host: PUBLIC_URL.host,
						origin: env.PUBLIC_URL,
						referer: env.PUBLIC_URL,
					},
				},
				"/json": {
					target: PUBLIC_URL.origin,
					changeOrigin: true,
					ws: true,
				},
				"/help_center": {
					target: PUBLIC_URL.origin,
					changeOrigin: true,
					ws: true,
				},
			},
		},
		test: {
			globals: true,
			environment: "jsdom",
			setupFiles: "/src/setupTests.ts",
			css: true,
			reporters: ["verbose"],
			coverage: {
				provider: "v8",
				reporter: ["text", "json", "html"],
				include: ["src/**/*"],
				exclude: [],
			},
		},
	});
};