# Fantasy Super Rugby

Complete fantasy rugby game implementation for FANTASY_PLATFORM client with custom branding, sport-specific features, and rugby gameplay mechanics.

## Structure

```
fantasy-super-rugby/
├── env/                    # Environment-specific configuration
│   ├── .env               # Base config
│   ├── .env.development   # Dev environment
│   ├── .env.preprod       # Pre-production
│   └── .env.production    # Production
├── public/                 # Static assets (favicon, manifest, etc.)
├── src/                    # Game-specific logic overrides
│   └── overrides.module.ts
└── README.md
```

## Game Slug

`super-rugby` - Used in API endpoints and content URLs.

## Client

Part of `FANTASY_PLATFORM` - shared branding and infrastructure with other fantasy sports games.

## Environment

Set `VITE_PROJECT=FANTASY_PLATFORM/fantasy-super-rugby` to use this configuration.

## Local Development

```bash
# Interactive selection
npm run start
# Choose: FANTASY_PLATFORM/fantasy-super-rugby

# Direct selection
node tools/choose_app.mjs -p FANTASY_PLATFORM/fantasy-super-rugby && npm run start
```

## Docker

```bash
docker build --build-arg VITE_PROJECT=FANTASY_PLATFORM/fantasy-super-rugby -t fantasy-super-rugby .
docker run -p 8080:80 fantasy-super-rugby
```

## Implementation Status

✅ **Complete Foundation** - Ready for UI implementation

### Created Components
- ✅ Sport-specific types (8 positions, 27 stat types)
- ✅ API providers (8 team management endpoints)
- ✅ MobX stores (singleton team store)
- ✅ DI registration (providers + stores)
- ✅ Custom landing page (rugby-branded)
- ✅ Controller overrides (extended with rugby content)
- ✅ Routes integration (automatic override detection)

### Game Configuration
- ✅ Environment files (dev/preprod/prod)
- ✅ Public assets (manifest, robots.txt)
- ✅ Game rules (23 players, $100M cap, 16 rounds)
- ✅ Scoring system (27 stat types)
- ✅ Position constraints (8 positions with lineup/bench)
- ✅ Formation rules (3 allowed formations)

## Documentation

- **[SUMMARY.md](./SUMMARY.md)** - Quick overview and status
- **[IMPLEMENTATION.md](./IMPLEMENTATION.md)** - Technical details
- **[LANDING_PAGE.md](./LANDING_PAGE.md)** - Landing page customization
- **[README.md](./README.md)** - This file

## Quick Start

```bash
# Local development
npm start
# → Select: FANTASY_PLATFORM/fantasy-super-rugby

# Docker
docker build --build-arg VITE_PROJECT=FANTASY_PLATFORM/fantasy-super-rugby -t fantasy-super-rugby .
docker run -p 8080:80 fantasy-super-rugby
```

## Custom Landing Page

The game includes a fully custom rugby-branded landing page:
- Rugby green gradient design (#0a4d3c-#2a9d8f)
- Sport-specific messaging and content
- Game features showcase
- Quick facts display (cap, team size, rounds, max per squad)
- Responsive mobile design

See [`LANDING_PAGE.md`](./LANDING_PAGE.md) for customization guide.

## API Integration

Team management via `SuperRugbyTeamStore`:

```typescript
import {useViewController} from "data/hooks";
import {Bindings} from "bindings";

const {myTeam, fetchMyTeam, updateTeam} = useViewController(
  Bindings.SuperRugbyTeamStore
);

// Fetch team
await fetchMyTeam();

// Update team
await updateTeam({
  lineup: {...},
  bench: {...},
  formation: "2-1-2-3-1-1-2-3/1-1-1-1-1-1-1-1",
  captainId: 123,
});
```

See [`IMPLEMENTATION.md`](./IMPLEMENTATION.md) for full API documentation.

## Next Steps

To complete the game, implement:
1. Team selection UI (pick 23 players)
2. Player list/search page
3. Formation builder interface
4. Live scores display
5. Rankings/leaderboards views
6. Transfers system UI

See [`SUMMARY.md`](./SUMMARY.md) for detailed roadmap.

## Game-Specific Overrides

Custom business logic in `src/overrides/`:
- Extended landing controller with rugby content
- Custom landing page component
- Future: Scoring calculators, formation validators, etc.

See [`docs/MULTI_PROJECT_SETUP.md`](../../../docs/MULTI_PROJECT_SETUP.md) for architecture details.
