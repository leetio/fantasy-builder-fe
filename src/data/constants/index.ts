export const SITE_URL = import.meta.env.VITE_SITE_URL || "";
export const API_URL = import.meta.env.VITE_API_URL || "";
export const JSON_URL = import.meta.env.VITE_JSON_URL || "";
export const CONTENT_JSON_URL = import.meta.env.VITE_CONTENT_JSON_URL || "";
export const BASE_URL = import.meta.env.VITE_BASE_URL || "/";
export const SENTRY_DSN_URL = import.meta.env.VITE_SENTRY_DSN_URL;
export const SHARE_URL = import.meta.env.VITE_SHARE_URL || "";
export const IMAGES_URL = import.meta.env.VITE_IMAGES_URL || "";
export const SENTRY_PROJECT_NAME = import.meta.env.VITE_SENTRY_PROJECT_NAME || "";

export const EMAIL_REGEXP = "\\S+@\\S+\\.\\S+";
export const PASSWORD_PATTERN =
	// eslint-disable-next-line sonarjs/no-hardcoded-passwords
	"^((?=.*?\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[\\-!@#$%^&*\\(\\)_+\\|~=`\\{\\}\\[\\]:\";'<>?,.\\/])).{8,}$";

export const PASSWORD_REQUIREMENTS =
	// eslint-disable-next-line sonarjs/no-hardcoded-passwords
	"Password must include 8 characters, including 1 upper case character, 1 number and 1 special character";

export const FACEBOOK_ID = import.meta.env.VITE_FACEBOOK_APP_ID || false;

export const GAME_SLUG = import.meta.env.VITE_GAME_SLUG || "";
