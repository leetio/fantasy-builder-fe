# FANTASY_PLATFORM Client

Fantasy sports games platform with multiple game configurations under one brand.

## Games

- **fantasy-super-rugby** - Fantasy Super Rugby game

## Structure

Each game under this client has its own isolated configuration:

```
FANTASY_PLATFORM/
├── fantasy-super-rugby/
│   ├── env/                    # Environment configs
│   ├── public/                 # Game-specific assets
│   ├── src/                    # Game-specific overrides
│   └── README.md
└── [future games]/
```

## Adding a New Game

1. Create game folder:
   ```bash
   mkdir -p configs/FANTASY_PLATFORM/new-game/{env,public,src}
   ```

2. Copy and customize env files from an existing game

3. Set `VITE_PROJECT=FANTASY_PLATFORM/new-game` in all env files

4. Configure game-specific variables (slug, URLs, etc.)

5. Add assets and overrides as needed

## Usage

### Local Development

```bash
# Interactive selection
npm start

# Direct selection
node tools/choose_app.mjs -p FANTASY_PLATFORM/fantasy-super-rugby && npm start
```

### Docker

```bash
# Build
docker build --build-arg VITE_PROJECT=FANTASY_PLATFORM/fantasy-super-rugby -t fantasy-super-rugby .

# Run
docker run -p 8080:80 fantasy-super-rugby
```

## Shared Infrastructure

All games under FANTASY_PLATFORM share:
- Base React application code
- Common UI components
- Shared services and utilities
- InversifyJS DI container
- MobX state management

Game-specific customization is achieved through:
- Per-game environment variables
- Custom assets in `public/`
- DI overrides in `src/overrides.module.ts`

See [`docs/MULTI_PROJECT_SETUP.md`](../../docs/MULTI_PROJECT_SETUP.md) for details on the architecture.
