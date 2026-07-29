/**
 * Super Rugby Sport-Specific Enums
 */

export enum SuperRugbyPlayerPosition {
	PROP = "prop",
	HOOKER = "hooker",
	LOCK = "lock",
	LOOSE_FORWARD = "loose_forward",
	FLY_HALF = "fly_half",
	SCRUM_HALF = "scrum_half",
	CENTER = "center",
	OUTSIDE_BACK = "outside_back",
}

export enum SuperRugbyStatKey {
	MP = "MP", // Minutes Played
	T = "T", // Tries
	TA = "TA", // Try Assists
	C = "C", // Conversions
	CM = "CM", // Missed Conversions
	PG = "PG", // Penalty Goals
	PGM = "PGM", // Missed Penalty Goals
	YC = "YC", // Yellow Cards
	RC = "RC", // Red Cards
	TW = "TW", // Turnovers Won
	TC = "TC", // Turnovers Conceded
	I = "I", // Interceptions
	O = "O", // Offloads
	LB = "LB", // Line Breaks
	LC = "LC", // Line Break Assists
	MG = "MG", // Metres Gained
	PC = "PC", // Penalties Conceded
	DG = "DG", // Drop Goals
	DGM = "DGM", // Missed Drop Goals
	LT = "LT", // Lineout Won
	LS = "LS", // Lineout Steal
	LE = "LE", // Lineout Lost
	TK = "TK", // Tackles
	MT = "MT", // Missed Tackles
	E = "E", // Errors
	TB = "TB", // Tacklers Beaten
	SW = "SW", // Scrums Won
	K_50_22 = "K_50_22", // 50-22 Kicks
}

export enum SuperRugbyPlayerAvailability {
	AVAILABLE = "available",
	INJURED = "injured",
	SUSPENDED = "suspended",
	UNKNOWN = "unknown",
}
