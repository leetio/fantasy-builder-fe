export enum RequestState {
	IDLE,
	PENDING,
	SUCCESS,
	ERROR,
}

export enum ModalType {
	ERROR,
	CONFIRM,
	SUCCESS,
	LOGIN,
	REGISTRATION,
	FORGOT_PASSWORD,
}

export enum SortOrder {
	ASC = "asc",
	DESC = "desc",
}

export enum RoundStatus {
	SCHEDULED = "scheduled",
	PLAYING = "playing",
	COMPLETED = "completed",
}

export enum SocialNetwork {
	FACEBOOK,
	TWITTER,
	NATIVE,
}

export enum ShareType {
	GENERAL = "general",
	LEAGUE = "league",
}

export enum Locale {
	EN_US = "en-US",
}

export enum Language {
	EN = "en",
}

export enum LeaguePrivacy {
	PUBLIC = "public",
	PRIVATE = "private",
}

export enum LeagueType {
	REGULAR = "regular",
	OVERALL = "overall",
}

export enum LeagueStatus {
	COMPLETED = "completed",
	PLAYING = "playing",
	SCHEDULED = "scheduled",
}

export enum ServerErrorCode {
	/**
	 * Client errors
	 */
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	/**
	 * Server errors
	 */
	INTERNAL_SERVER_ERROR = 500,
	NOT_IMPLEMENTED = 501,
	BAD_GATEWAY = 502,
	SERVICE_UNAVAILABLE = 503,
}
