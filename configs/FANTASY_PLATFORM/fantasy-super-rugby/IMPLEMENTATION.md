# Super Rugby Fantasy Implementation

Complete implementation of Super Rugby fantasy game for FANTASY_PLATFORM client.

## Created Files

### Sport-Specific Types & Enums

**`src/data/types/sport/super-rugby.d.ts`**
- Player positions (Prop, Hooker, Lock, Loose Forward, etc.)
- Stats keys (Tries, Tackles, Conversions, etc.)
- Scoring rules interface
- Team lineup and bench structures
- Gameplay constants
- Player and Squad interfaces

**`src/data/enums/super-rugby.ts`**
- `SuperRugbyPlayerPosition` enum
- `SuperRugbyStatKey` enum
- `SuperRugbyPlayerAvailability` enum

### Sport-Specific API Providers

**`src/data/providers/sport/super-rugby/team_api.provider.ts`**
Team management API with endpoints:
- `updateTeam` - Update lineup, bench, formation, captains
- `autopick` - Auto-generate valid team
- `getMyTeam` - Fetch current user's team
- `getTeamByUser` - Fetch another user's team
- `changeCaptain` - Set captain/vice-captain
- `swapPlayers` - Swap lineup/bench players
- `applyBooster` - Apply power-ups
- `removeBooster` - Remove boosters

**`src/data/providers/sport/super-rugby/README.md`**
Documentation for Super Rugby providers

### Sport-Specific Stores

**`src/data/stores/sport/super-rugby/team.store.ts`**
MobX store managing Super Rugby team state with methods matching the API provider.

### Dependency Injection

**Updated `src/bindings.ts`**
Added symbols:
- `SuperRugbyTeamApiProvider`
- `SuperRugbyTeamStore`

**Updated `src/dependencies.ts`**
Registered:
- Provider: `SuperRugbyTeamApiProvider` → `SuperRugbyTeamApiProvider`
- Store: `SuperRugbyTeamStore` → `SuperRugbyTeamStore` (singleton)

### Game-Specific Overrides

**`configs/FANTASY_PLATFORM/fantasy-super-rugby/src/overrides.module.ts`**
DI overrides module with:
- `SuperRugbyLandingController` override
- Documentation of Super Rugby features

**`configs/FANTASY_PLATFORM/fantasy-super-rugby/src/overrides/landing.controller.ts`**
Landing controller override (currently using base implementation)

### Landing Page

**Custom Super Rugby Landing Page** created at:
- `src/overrides/landing.page.tsx` - Custom branded page component
- `src/overrides/landing.controller.ts` - Extended controller with rugby content
- Automatically loaded when `VITE_PROJECT=FANTASY_PLATFORM/fantasy-super-rugby`
- Includes login, registration, and forgot password modals
- Available at root route `/`

**Features:**
- Rugby-themed green gradient design (#0a4d3c, #1a7a5e, #2a9d8f)
- Rugby orange CTA buttons (#ff6b35)
- Sport-specific content (squad picking, formations, competitions)
- Game features showcase (live scores, transfers, leagues, etc.)
- Quick facts display (salary cap, team size, rounds, max per squad)
- Responsive mobile design
- i18n-ready with translation keys

See [`LANDING_PAGE.md`](./LANDING_PAGE.md) for complete documentation.

## Super Rugby Rules Summary

### Team Composition
- **Total Players**: 23 (15 lineup + 8 bench)
- **Salary Cap**: 100,000,000
- **Max per Squad**: 4 players
- **Season**: 2026
- **Rounds**: 16

### Positions & Formation
```
Lineup (15):
- Prop: 2
- Hooker: 1
- Lock: 2
- Loose Forward: 3
- Fly Half: 1
- Scrum Half: 1
- Center: 2
- Outside Back: 3

Bench (8):
- One of each position
```

### Allowed Formations
- `2-1-2-3-1-1-2-3/1-1-1-1-1-1-1-1`
- `2-2-1-3-1-1-2-3/1-1-1-1-1-1-1-1`
- `2-2-1-2-2-1-2-3/1-1-1-1-1-1-1-1`

### Scoring Rules (Key Stats)
- **Tries (T)**: 15 points
- **Try Assists (TA)**: 9 points
- **Conversions (C)**: 2 points
- **Penalty Goals (PG)**: 3 points
- **Drop Goals (DG)**: 3 points
- **Yellow Card (YC)**: -5 points
- **Red Card (RC)**: -10 points
- **Turnovers Won (TW)**: 4 points
- **Interceptions (I)**: 5 points
- **Line Breaks (LB)**: 7 points
- **Tackles (TK)**: 1 point
- **Missed Tackles (MT)**: -1 point

Full scoring rules defined in backend config and frontend types.

## API Endpoints Used

All endpoints use the `GAME_SLUG` prefix (set via `VITE_GAME_SLUG` env var).

### Team Management
- `POST /{slug}/team/update` - Update team
- `POST /{slug}/team/autopick` - Autopick team
- `GET /{slug}/team/show-my` - Get my team
- `GET /{slug}/team/get-by-user/{userId}` - Get user team
- `POST /{slug}/team/change-captain` - Change captain
- `POST /{slug}/team/change-vice-captain` - Change vice-captain
- `POST /{slug}/team/swap-players` - Swap players
- `POST /{slug}/team/booster` - Apply booster
- `POST /{slug}/team/booster/{boosterId}` - Remove booster

### Shared Endpoints (via existing providers)
- Authentication (login/register)
- Leagues management
- Leaderboards
- User profile
- Players data (JSON)
- Squads data (JSON)
- Rounds data (JSON)

## Usage

### Local Development

```bash
# Select Super Rugby game
npm start
# → Choose: FANTASY_PLATFORM/fantasy-super-rugby

# Or direct
node tools/choose_app.mjs -p FANTASY_PLATFORM/fantasy-super-rugby && npm start
```

### Docker

```bash
docker build --build-arg VITE_PROJECT=FANTASY_PLATFORM/fantasy-super-rugby -t fantasy-super-rugby .
docker run -p 8080:80 fantasy-super-rugby
```

### Using Team Store in Components

```typescript
import {useViewController} from "data/hooks";
import {Bindings} from "bindings";

const MyTeamPage = observer(() => {
	const {myTeam, fetchMyTeam, updateTeam} = useViewController(
		Bindings.SuperRugbyTeamStore
	);

	useEffect(() => {
		void fetchMyTeam();
	}, [fetchMyTeam]);

	if (!myTeam) return <Loading />;

	return (
		<div>
			<h1>{myTeam.name}</h1>
			<p>Budget: {myTeam.budget}</p>
			<p>Total Points: {myTeam.totalPoints}</p>
			{/* Render lineup/bench */}
		</div>
	);
});
```

## Next Steps

To complete the Super Rugby fantasy game, consider adding:

### UI Components
- [ ] Team selection page (pick players, set formation)
- [ ] Player list/search with Super Rugby stats
- [ ] Squad (team) overview pages
- [ ] Live scores and round updates
- [ ] Player stats breakdown (tries, tackles, etc.)
- [ ] Formation selector UI

### Additional Features
- [ ] Transfers system
- [ ] Trade functionality
- [ ] Team history
- [ ] Rankings/leaderboards specific views
- [ ] Push notifications for round start
- [ ] Player news/injuries display

### Game Logic Overrides
- [ ] Formation validation logic
- [ ] Budget calculator with Super Rugby constraints
- [ ] Captain points multiplier (if applicable)
- [ ] Booster system UI

### Testing
- [ ] Unit tests for stores
- [ ] Integration tests for API providers
- [ ] E2E tests for team selection flow

## Related Documentation

- Main docs: [`docs/MULTI_PROJECT_SETUP.md`](../../../docs/MULTI_PROJECT_SETUP.md)
- Docker: [`docs/DOCKER.md`](../../../docs/DOCKER.md)
- Project README: [`README.md`](./README.md)
- Backend config: `/apps/client/config/configs/super_rugby/game_play_fantasy.php`
