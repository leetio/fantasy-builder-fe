/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
	readonly VITE_META_ROBOT: string;
	readonly VITE_NAME: string;
	readonly VITE_DESCRIPTION: string;
	readonly VITE_TWITTER_CREATOR: string;
	readonly VITE_BASE_URL: string;
	readonly VITE_SENTRY_DSN_URL: string;
	readonly VITE_ZENDESK_KEY: string;
	readonly VITE_API_URL: string;
	readonly VITE_JSON_URL: string;
	readonly VITE_CONTENT_JSON_URL: string;
	readonly VITE_IMAGES_URL: string;
	readonly VITE_SHARE_URL: string;
	readonly VITE_FACEBOOK_APP_ID: string;
	readonly VITE_IS_SECRET_ENABLED: string;
	readonly VITE_GAME_SLUG: string;
	readonly VITE_SITE_URL: string;
	readonly VITE_SENTRY_ENV: string;
	readonly VITE_SENTRY_APPLICATION_KEY: string;
	readonly VITE_SENTRY_PROJECT_NAME: string;
	readonly VITE_PROJECT: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
