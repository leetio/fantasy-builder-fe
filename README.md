# Fantasy Super Rugby

Game-specific configuration for Fantasy Super Rugby under the FANTASY_PLATFORM client.

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

## Game-Specific Overrides

Add custom business logic in `src/overrides/` to extend base classes:

- Different scoring rules
- Team constraints (e.g., max players per real team)
- Position requirements
- Budget systems

See [`docs/MULTI_PROJECT_SETUP.md`](../../../docs/MULTI_PROJECT_SETUP.md) for details.
