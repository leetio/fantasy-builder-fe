# Super Rugby Custom Landing Page

Custom-branded landing page for Fantasy Super Rugby with rugby-specific content, design, and messaging.

## Overview

The landing page override provides a fully customized experience for Super Rugby users:

- **Rugby-themed branding** - Green gradient colors (#0a4d3c, #1a7a5e, #2a9d8f)
- **Sport-specific content** - Rugby terminology, positions, and gameplay
- **Enhanced features section** - Game features showcase
- **Quick facts display** - Salary cap, team size, rounds, squad limits
- **Optimized CTAs** - "Start Playing Now" with rugby-orange accent color

## Files Created

### Controller Override
**`src/overrides/landing.controller.ts`**

Extended `LandingController` with Super Rugby specific computed properties:

```typescript
@computed get gameTitle(): string         // "Fantasy Super Rugby 2026"
@computed get tagline(): string          // "Build Your Ultimate Rugby Dream Team"
@computed get description(): string      // Main hero description
@computed get step1Title(): string       // "Pick Your Squad"
@computed get step1Description(): string // Step instructions
@computed get step2Title(): string       // "Set Your Formation"
@computed get step2Description(): string
@computed get step3Title(): string       // "Compete & Win"
@computed get step3Description(): string
@computed get ctaButtonText(): string    // "Start Playing Now"
@computed get features(): string[]       // Array of 6 game features
@computed get quickFacts(): Array<{      // Salary cap, team size, etc.
  label: string;
  value: string;
}>
```

All text is i18n-ready with translation keys like:
- `landing.super_rugby.title`
- `landing.super_rugby.tagline`
- `landing.super_rugby.step1.title`
- etc.

### Page Component Override
**`src/overrides/landing.page.tsx`**

Custom React component with styled sections:

1. **Hero Section**
   - Large title with rugby green gradient background
   - Tagline and description
   - Prominent CTA button (rugby orange #ff6b35)

2. **How to Play Section**
   - 3-step process with numbered cards
   - Pick Squad → Set Formation → Compete & Win
   - Hover animations on cards

3. **Game Features Section**
   - Feature chips grid
   - 6 key features displayed

4. **Quick Facts Section**
   - 4 stat cards: Salary Cap, Team Size, Rounds, Max per Squad
   - Secondary CTA button

5. **Modals**
   - Login modal
   - Registration modal
   - Forgot password modal

### Routes Integration
**Updated `src/routes.tsx`**

Automatic detection of custom landing pages:

```typescript
const projectLandingPages = import.meta.glob(
  "../configs/*/src/overrides/landing.page.tsx",
  {eager: false}
);

const projectKey = `../configs/${import.meta.env.VITE_PROJECT}/src/overrides/landing.page.tsx`;
const hasCustomLanding = projectKey in projectLandingPages;

const Home = hasCustomLanding
  ? lazy(retryFailLoad(() => projectLandingPages[projectKey]()))
  : lazy(retryFailLoad(() => import("views/pages/landing/landing.page")));
```

When `VITE_PROJECT=FANTASY_PLATFORM/fantasy-super-rugby`, the custom landing page is automatically used.

## Design System

### Colors

**Primary (Rugby Green)**
- `#0a4d3c` - Dark green
- `#1a7a5e` - Medium green
- `#2a9d8f` - Light green
- Gradient: `linear-gradient(135deg, #0a4d3c 0%, #1a7a5e 50%, #2a9d8f 100%)`

**Accent (Rugby Orange)**
- `#ff6b35` - Primary CTA color
- `#ff5722` - Hover state

**Neutral**
- `#f5f5f5` - Light background
- `#ffffff` - White sections
- `#555` - Body text
- `#0a0a0a` - Dark text

### Typography

- **Hero Title**: 56px (36px mobile), weight 900
- **Tagline**: 28px (20px mobile), weight 600
- **Body**: 18px (16px mobile), line-height 1.6
- **Section Titles**: 36px (28px mobile), weight 700
- **Card Titles**: 24px, weight 700

### Components

**CTA Button**
```css
background: #ff6b35;
font-size: 18px;
font-weight: 700;
padding: 16px 48px;
border-radius: 8px;
box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
```

**Step Cards**
```css
border-radius: 12px;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
hover: translateY(-8px) + elevated shadow
```

**Step Number Badge**
```css
60px circle
gradient background
28px number, weight 900
```

## Content Structure

### Hero Section
- Game title
- Tagline
- Description (max 700px width)
- Primary CTA

### Steps Section (Gray background #f5f5f5)
- "How to Play" heading
- 3 cards in grid:
  1. Pick Your Squad (23 players, $100M cap)
  2. Set Your Formation (15 lineup + 8 bench)
  3. Compete & Win (leagues, transfers, rankings)

### Features Section (White background)
- "Game Features" heading
- 6 feature chips:
  - Live scoring and stats
  - Weekly transfers
  - Private & public leagues
  - Head-to-head battles
  - Power-ups and boosters
  - Mobile app support

### Quick Facts Section (Green gradient)
- "Quick Facts" heading
- 4 stat cards:
  - $100M (Salary Cap)
  - 23 players (Team Size)
  - 16 (Season Rounds)
  - 4 (Max per Squad)
- Secondary CTA

## Responsive Design

- **Desktop (≥960px)**: Full 3-column grid layout
- **Mobile (<960px)**: Single column, stacked cards
- Touch-friendly button sizes
- Optimized font sizes for mobile

## Accessibility

- Semantic HTML structure
- ARIA labels on buttons
- Sufficient color contrast
- Keyboard navigation support
- Focus indicators

## Testing

### Visual Testing
```bash
# Start dev server with Super Rugby config
node tools/choose_app.mjs -p FANTASY_PLATFORM/fantasy-super-rugby && npm start

# Visit http://localhost:8080/
```

### Verify Overrides Loaded
Check browser console for DI container logs or add:
```typescript
console.log("Super Rugby Landing Page Loaded");
```

### Test User Flows
1. Click "Start Playing Now" → Login modal opens
2. Close login → Click "Register" → Registration modal
3. Test forgot password flow
4. Verify mobile responsive breakpoints

## Customization

### Changing Colors

Edit `src/overrides/landing.page.tsx`:

```typescript
const HeroSection = styled.div`
  background: linear-gradient(135deg, YOUR_COLOR_1, YOUR_COLOR_2, YOUR_COLOR_3);
  // ...
`;

const CTAButton = styled(Button)`
  background: YOUR_ACCENT_COLOR;
  // ...
`;
```

### Adding More Features

Edit controller:

```typescript
@computed get features(): string[] {
  return [
    ...existing,
    this.i18n.t("landing.super_rugby.feature7", "New feature"),
  ];
}
```

### Changing Content

Update translation keys or edit computed getters in controller.

## Translations

To add translations, create translation files for your locales:

```json
{
  "landing": {
    "super_rugby": {
      "title": "Fantasy Super Rugby 2026",
      "tagline": "Build Your Ultimate Rugby Dream Team",
      "description": "Compete with rugby fans worldwide...",
      "step1": {
        "title": "Pick Your Squad",
        "description": "Select 23 players..."
      },
      "feature1": "Live scoring and stats",
      "facts": {
        "salary_cap": "Salary Cap",
        "team_size": "Team Size"
      }
    }
  }
}
```

## Future Enhancements

- [ ] Add hero background image (rugby stadium)
- [ ] Include player showcase carousel
- [ ] Add video trailer section
- [ ] Display current season leaderboard preview
- [ ] Show featured leagues
- [ ] Add testimonials section
- [ ] Include "How Scoring Works" explainer
- [ ] Add FAQ accordion
- [ ] Display prize pool information (if applicable)

## Related Files

- Base landing: `src/views/pages/landing/landing.page.tsx`
- Base controller: `src/views/pages/landing/landing.controller.ts`
- Modals: `src/views/components/modals/`
- Routes: `src/routes.tsx`
- Overrides module: `configs/FANTASY_PLATFORM/fantasy-super-rugby/src/overrides.module.ts`
