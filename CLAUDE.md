# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Educational memory game built with React Native and Expo to teach animations using React Native Reanimated and Gesture Handler. Uses feature-based MVVM architecture where ViewModels are organized by feature (both view and viewModel in same directory).

## Development Commands

```bash
# Install dependencies
npm install

# Start Expo development server (use Expo Go app to test)
npm start

# Run on platforms
npm run android
npm run ios

# Linting
npm run lint
```

## Architecture: Feature-Based MVVM

**Key Pattern**: Views and ViewModels are co-located in feature directories under `src/viewModels/{feature}/`

```
src/
├── app/                        # Expo Router (file-based routing)
│   ├── (public)/login.tsx     # Login screen
│   ├── (private)/home.tsx     # Challenge selection (IMPLEMENTED)
│   ├── (private)/game.tsx     # Game screen (skeleton)
│   ├── (private)/ranking.tsx  # Ranking (skeleton)
│   ├── _layout.tsx            # Root with auth guards
│   └── index.tsx              # Loading screen
│
├── viewModels/                # Feature-based (View + ViewModel together)
│   ├── {feature}/
│   │   ├── {feature}.view.tsx      # React component
│   │   └── {feature}.viewmodel.ts  # Zustand store
│   └── home/
│       ├── home.view.tsx           # (exists but not currently used)
│       └── home.viewmodel.ts       # Difficulty state
│
├── store/                     # Global Zustand stores
│   └── auth.ts               # Auth state (isAuthenticated, userName)
│
├── models/                    # Domain entities
│   ├── challenge.model.ts    # Challenge themes, difficulty configs
│   ├── card.model.ts
│   ├── game.model.ts
│   └── score.model.ts
│
├── components/                # Reusable UI components
│   ├── AppInput.tsx          # Styled text input
│   └── DifficultyIcon.tsx    # Bar indicator for difficulty
│
├── repositories/              # Data persistence (AsyncStorage)
│   ├── auth.repository.ts
│   ├── ranking.repository.ts
│   └── storage.repository.ts
│
├── constants/
│   └── colors.ts             # Color system and gradients
│
└── utils/
    └── format.ts
```

### Routing with Expo Router

- File-based routing in `src/app/`
- `(public)` group = unauthenticated routes
- `(private)` group = authenticated routes  
- `_layout.tsx` contains navigation guards that check auth state
- Navigation uses `useRouter()` from `expo-router`

### Authentication Flow

1. App starts at `src/app/index.tsx` (loading screen)
2. Loads auth state from AsyncStorage via `loadAuthState()`
3. `_layout.tsx` navigation guard checks `isAuthenticated`
4. Redirects to login if not authenticated, home if authenticated
5. User data persisted with keys: `@memory-game:auth` and `@memory-game:userName`

**Important**: Navigation requires `setTimeout` to prevent "navigate before mounting" errors:

```typescript
// In _layout.tsx and index.tsx
setTimeout(() => {
  router.replace('/(private)/home');
}, 100);
```

## Import Aliases

Configured via Babel and TypeScript for `@/` prefix:

```typescript
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/auth';
import { AppInput } from '@/components/AppInput';
```

**Config files:**
- `tsconfig.json` - TypeScript path mapping (`@/*` → `./src/*`)
- `babel.config.js` - module-resolver plugin
- `eslint.config.js` - TypeScript resolver

## Design System

### Colors (`src/constants/colors.ts`)

```typescript
colors.grayscale.*  // UI backgrounds and text
colors.accent.*     // Brand colors (purple, blue, cyan, green, orange, red)
colors.semantic.*   // Status colors (success, error, warning, info)
colors.ranking.*    // Podium colors (gold, silver, bronze)

gradients.purpleDark   // ['#0A0A14', '#020916'] - Login background
gradients.colorful     // ['#AA2AF4', '#4121E8', '#1D8A95'] - Button gradient
```

### Challenge Theme Gradients

Defined in `src/models/challenge.model.ts` - each theme has unique gradient:
- Languages: `['#1F1B3D', '#0F1A2A']` (dark purple to dark blue)
- Frameworks: `['#0F1A2A', '#122A2A']` (dark blue to dark teal)
- Tools: `['#1A2818', '#2A1F15']` (dark green to dark brown)

### Styling Guidelines

- **Use StyleSheet API** (required for Reanimated compatibility)
- No inline styles
- Component-level styles at bottom of file
- No code comments per project conventions

## Game Logic

### Difficulty System

Defined in `src/models/challenge.model.ts`:

| Difficulty | Time Limit | Card Pairs |
|------------|------------|------------|
| Fácil      | 5 minutes  | 6 pairs (12 cards) |
| Médio      | 4 minutes  | 6 pairs (12 cards) |
| Difícil    | 3 minutes  | 6 pairs (12 cards) |

**Critical**: All difficulties use exactly **6 pairs**. Only time limit varies.

### Challenge Themes

**Only 3 themes are active** (filtered with `.slice(0, 3)` in home screen):

1. **Linguagens de Programação**
   - Gradient: `['#1F1B3D', '#0F1A2A']`
   - Arrow color: `#9D7FF5` (purple)
   
2. **Frameworks e Bibliotecas**
   - Gradient: `['#0F1A2A', '#122A2A']`
   - Arrow color: `#7DAFFF` (blue)
   
3. **Ferramentas de Desenvolvimento**
   - Gradient: `['#1A2818', '#2A1F15']`
   - Arrow color: `#55EAE1` (cyan)

Each theme object includes:
- `id`, `title`, `icon`
- `cards[]` array with 12 items
- `gradient` array for card background
- `arrowColor` for the arrow button

### Screen Flow

**Current implementation status:**

1. ✅ **Login** - User enters name, persisted to AsyncStorage
2. ✅ **Home** - Select difficulty (Fácil/Médio/Difícil) and challenge theme
3. ❌ **Countdown** - Not implemented (skeleton exists)
4. ❌ **Game** - Not implemented (skeleton exists)
5. ❌ **Finish** - Not implemented
6. ❌ **Ranking** - Not implemented (skeleton exists)

## React Native Reanimated

### Version and Compatibility

- Using `react-native-reanimated ~4.1.1` (Expo SDK 54 compatible)
- Reanimated plugin **must be last** in `babel.config.js` plugins array
- **Run with Expo Go** (not development build - has worklets compatibility issues)

### Running the App

```bash
npm start  # Start metro bundler
# Scan QR with Expo Go app on phone
```

**Do NOT use**:
- `expo run:ios` or `expo run:android` (development builds have worklets conflicts)

### Animation Principles (for future implementation)

- Use Reanimated for all animations (not Animated API)
- StyleSheet required (no styled-components)
- Worklets run on UI thread for 60fps
- Planned animations: card flip 3D, countdown scale, match celebration

## Component Patterns

### Custom Components

**AppInput** (`src/components/AppInput.tsx`):
- Extends TextInputProps
- Dark background with border
- Placeholder color management

**DifficultyIcon** (`src/components/DifficultyIcon.tsx`):
- Shows 1-3 vertical bars based on difficulty
- Bars have varying heights (6px, 10px, 14px)
- Selected/unselected color states

### LinearGradient Usage

**Correct syntax**:
```typescript
<LinearGradient colors={gradients.purpleDark} />
<LinearGradient colors={['#1F1B3D', '#0F1A2A']} />
```

**Incorrect**:
```typescript
<LinearGradient colors={gradients.purpleDark.colors} />  // NO .colors property!
```

## State Management

### Auth Store (`src/store/auth.ts`)

```typescript
interface AuthState {
  isAuthenticated: boolean;
  userName: string | null;
  setAuthenticated: (value: boolean, name?: string) => Promise<void>;
  loadAuthState: () => Promise<void>;
}
```

AsyncStorage keys:
- `@memory-game:auth` - boolean stringified
- `@memory-game:userName` - string

### Home ViewModel (`src/viewModels/home/home.viewmodel.ts`)

```typescript
interface HomeViewModel {
  selectedDifficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
}
```

## Common Pitfalls

1. **Navigation timing**: Always use `setTimeout` when navigating from auth guards or loading screens
2. **Gradient syntax**: Use array directly, no `.colors` property
3. **Card count**: Always 6 pairs regardless of difficulty
4. **Challenge themes**: Only first 3 themes are shown (`.slice(0, 3)`)
5. **Arrow colors**: Each theme has specific `arrowColor`, not generic
6. **Reanimated version**: Must be `~4.1.1` for Expo SDK 54
7. **No comments**: Remove all code comments per project conventions

## Future Implementation

Screens to be implemented (skeletons exist):
- Countdown screen with scale animations
- Game screen with card flip, match logic, timer
- Finish screen with results and celebration
- Ranking screen with score history

Animation concepts planned:
- Shared Values, Animated Styles
- Gesture Composition, Worklets
- Layout Animations
