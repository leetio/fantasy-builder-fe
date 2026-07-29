/**
 * Super Rugby Sport-Specific Types
 */

/** Player Positions in Super Rugby */
export enum PlayerPosition {
	PROP = "prop",
	HOOKER = "hooker",
	LOCK = "lock",
	LOOSE_FORWARD = "loose_forward",
	FLY_HALF = "fly_half",
	SCRUM_HALF = "scrum_half",
	CENTER = "center",
	OUTSIDE_BACK = "outside_back",
}

/** Stats keys for Super Rugby */
export type TStatKey =
	| "MP" // Minutes Played
	| "T" // Tries
	| "TA" // Try Assists
	| "C" // Conversions
	| "CM" // Missed Conversions
	| "PG" // Penalty Goals
	| "PGM" // Missed Penalty Goals
	| "YC" // Yellow Cards
	| "RC" // Red Cards
	| "TW" // Turnovers Won
	| "TC" // Turnovers Conceded
	| "I" // Interceptions
	| "O" // Offloads
	| "LB" // Line Breaks
	| "LC" // Line Break Assists
	| "MG" // Metres Gained
	| "PC" // Penalties Conceded
	| "DG" // Drop Goals
	| "DGM" // Missed Drop Goals
	| "LT" // Lineout Won
	| "LS" // Lineout Steal
	| "LE" // Lineout Lost
	| "TK" // Tackles
	| "MT" // Missed Tackles
	| "E" // Errors
	| "TB" // Tacklers Beaten
	| "SW" // Scrums Won
	| "K_50_22"; // 50-22 Kicks

/** Scoring rules by stat */
export interface IScoringRules {
	T: number; // Tries
	TA: number; // Try Assists
	C: number; // Conversions
	CM: number; // Missed Conversions
	PG: number; // Penalty Goals
	PGM: number; // Missed Penalty Goals
	DG: number; // Drop Goals
	DGM: number; // Missed Drop Goals
	YC: number; // Yellow Cards
	RC: number; // Red Cards
	TW: number; // Turnovers Won
	I: number; // Interceptions
	LT: number; // Lineout Won
	LS: number; // Lineout Steal
	LE: number; // Lineout Lost
	TK: number; // Tackles
	MT: number; // Missed Tackles
	TB: number; // Tacklers Beaten
	O: number; // Offloads
	LB: number; // Line Breaks
	LC: number; // Line Break Assists
	MG_PER: number; // Metres per carry
	PC: number; // Penalties Conceded
	E: number; // Errors
	K_50_22: number; // 50-22 Kicks
}

/** Scoring rules by position (overrides) */
export type TScoringRulesByPosition = Partial<Record<PlayerPosition, Partial<IScoringRules>>>;

/** Player stats for Super Rugby */
export interface IPlayerStats {
	playerId: number;
	roundId: number;
	stats: Partial<Record<TStatKey, number>>;
	totalPoints: number;
}

/** Formation string (e.g., "2-1-2-3-1-1-2-3/1-1-1-1-1-1-1-1") */
export type TFormation = string;

/** Team lineup structure */
export interface ILineup {
	[PlayerPosition.PROP]: number[];
	[PlayerPosition.HOOKER]: number[];
	[PlayerPosition.LOCK]: number[];
	[PlayerPosition.LOOSE_FORWARD]: number[];
	[PlayerPosition.FLY_HALF]: number[];
	[PlayerPosition.SCRUM_HALF]: number[];
	[PlayerPosition.CENTER]: number[];
	[PlayerPosition.OUTSIDE_BACK]: number[];
}

/** Bench structure */
export type TBench = ILineup;

/** Super Rugby gameplay constants */
export interface ISuperRugbyGameplay {
	season: number;
	feed: string;
	rounds: number;
	completeTeamPlayers: number;
	playersPerSquadLimit: number;
	salaryCap: number;
	allowedFormations: TFormation[];
	emptyLineup: ILineup;
	emptyBench: TBench;
	scoringRules: IScoringRules;
	scoringRulesByPosition: TScoringRulesByPosition;
	h2hSizes: number[];
	h2hWinPoints: number;
	h2hDrawPoints: number;
}

/** Player with Super Rugby specific data */
export interface ISuperRugbyPlayer {
	id: number;
	name: string;
	position: PlayerPosition;
	squadId: number;
	squadName: string;
	price: number;
	totalPoints: number;
	roundPoints: number;
	availability: "available" | "injured" | "suspended" | "unknown";
	stats?: Partial<Record<TStatKey, number>>;
}

/** Squad (team) in Super Rugby */
export interface ISuperRugbySquad {
	id: number;
	name: string;
	shortName: string;
	logoUrl?: string;
}
