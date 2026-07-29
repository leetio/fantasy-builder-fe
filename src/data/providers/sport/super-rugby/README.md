# Super Rugby Sport-Specific Providers

This folder contains API providers specific to Super Rugby fantasy game.

## Structure

```
super-rugby/
└── team_api.provider.ts    # Team management API (lineup, autopick, captains, etc.)
```

## Team API Provider

Handles all team-related operations for Super Rugby:

### Endpoints

- **updateTeam** - Update team lineup, bench, formation, and captains
- **autopick** - Auto-generate a valid team within budget
- **getMyTeam** - Fetch current user's team
- **getTeamByUser** - Fetch another user's team
- **changeCaptain** - Set captain or vice-captain
- **swapPlayers** - Swap players between lineup and bench
- **applyBooster** - Apply power-ups/boosters to players
- **removeBooster** - Remove active boosters

### Usage

```typescript
import {Bindings} from "bindings";
import {useViewController} from "data/hooks";

const {teamStore} = useViewController(Bindings.SuperRugbyTeamStore);

// Fetch my team
await teamStore.fetchMyTeam();

// Update lineup
await teamStore.updateTeam({
	lineup: {...},
	bench: {...},
	formation: "2-1-2-3-1-1-2-3/1-1-1-1-1-1-1-1",
	captainId: 123,
});

// Autopick
await teamStore.autopick();
```

## Super Rugby Specific Rules

### Positions
- Prop (2 in lineup + 1 bench)
- Hooker (1 in lineup + 1 bench)
- Lock (2 in lineup + 1 bench)
- Loose Forward (3 in lineup + 1 bench)
- Fly Half (1 in lineup + 1 bench)
- Scrum Half (1 in lineup + 1 bench)
- Center (2 in lineup + 1 bench)
- Outside Back (3 in lineup + 1 bench)

### Constraints
- Total: 23 players (15 in lineup + 8 bench)
- Salary Cap: 100,000,000
- Max 4 players from same squad
- Allowed formations defined in game config

### Scoring Stats
See `src/data/types/sport/super-rugby.d.ts` for full list of stats and scoring rules.

Key stats:
- Tries (T): 15 points
- Try Assists (TA): 9 points
- Conversions (C): 2 points
- Penalty Goals (PG): 3 points
- Yellow Card (YC): -5 points
- Red Card (RC): -10 points
- Tackles (TK): 1 point each
- And many more...

## Related Files

- **Types**: `src/data/types/sport/super-rugby.d.ts`
- **Enums**: `src/data/enums/super-rugby.ts`
- **Store**: `src/data/stores/sport/super-rugby/team.store.ts`
- **Game Config**: Backend `/apps/client/config/configs/super_rugby/game_play_fantasy.php`
