# Development Guidelines

## Code Quality Standards

### Import Organization
- ES6 module imports at file top
- External libraries first, then local modules
- Named exports for classes: `export class ClassName`
- Default exports for React components: `export default ComponentName`

### Naming Conventions
- **Classes**: PascalCase (e.g., `MainMenu`, `Preloader`)
- **Variables/Functions**: camelCase (e.g., `canMoveSprite`, `changeScene`)
- **Constants**: camelCase for local scope (e.g., `menuX`, `barWidth`)
- **Scene Names**: String identifiers match class names (e.g., `'MainMenu'`)

### Code Formatting
- 4-space indentation standard
- Method chaining on same line when concise: `.setInteractive({ useHandCursor: true })`
- Multi-line chaining indented for readability
- Arrow functions for callbacks: `() => this.method()`
- Object literals with trailing properties on new lines

### Comment Style
- Inline comments with `//` for disabled/future code
- Minimal comments - code should be self-documenting
- Poetic philosophical comments for error handling (see log.js)

## Phaser 3 Patterns

### Scene Structure
```javascript
export class SceneName extends Scene {
    constructor() {
        super('SceneName');
    }
    
    init() { /* Setup before preload */ }
    preload() { /* Asset loading */ }
    create() { /* Scene initialization */ }
}
```

### Asset Management
- Centralized loading in Preloader scene
- Asset keys use kebab-case: `'menu-bg'`, `'slime-bleu'`
- Audio configured with options: `{ loop: true, volume: 0.5 }`
- Images positioned at center coordinates (960, 540 for 1920x1080)

### Animation & Tweens
- Use `this.tweens.add()` for animations
- Chain tweens with delay offsets for sequences
- Common easing functions: `'Quad.easeOut'`, `'Sine.easeInOut'`
- Infinite animations: `repeat: -1` with `yoyo: true`
- Callbacks: `onStart`, `onComplete` for sequencing

### Interactive Elements
- Enable with `.setInteractive({ useHandCursor: true })`
- Event handlers: `on('pointerdown')`, `on('pointerover')`, `on('pointerout')`
- Hover effects change color: `setColor('#ffff00')` on hover, `setColor('#ffffff')` on out
- Manual cleanup with `.destroy()` for modal elements

### Text Styling Pattern
```javascript
const style = {
    fontFamily: 'Arial',
    fontSize: 32,
    color: '#ffffff',
    stroke: '#000000',
    strokeThickness: 4
};
```

### Coordinate Calculations
- Define base positions as constants: `menuX`, `menuY`
- Use spacing multipliers: `menuY + spacing * 1`
- Calculate relative positions: `yesY + gap`
- String-based relative tweens: `y: '+=15'`

## React Integration Patterns

### Component Structure
- Functional components with hooks
- `useRef` for Phaser game instance access
- `useState` for React-managed state
- Props passed via ref: `ref={phaserRef}`

### React-Phaser Communication
- EventBus for Phaser-to-React: `EventBus.emit('current-scene-ready', this)`
- Direct scene method calls for React-to-Phaser: `phaserRef.current.scene.method()`
- Callback props for scene events: `currentActiveScene={currentScene}`

### State Management
- Local component state for UI concerns
- Scene reference for game state access
- Conditional logic based on scene key: `scene.scene.key === 'MainMenu'`

## Project-Specific Idioms

### Scene Launching
- Parallel scenes: `this.scene.launch('DevGrid')` for debug overlay
- Scene transitions: `this.scene.start('Game')` for navigation

### French Localization
- UI text in French: `'Nouvelle Partie'`, `'Statistiques'`, `'Paramètres'`
- Modal content in French with proper accents

### Magic Numbers
- Screen center: (960, 540) for 1920x1080 resolution
- Common scales: 0.32 for sprites, 0.6-0.8 for UI elements
- Animation durations: 200-300ms for quick, 1500-2000ms for ambient

### Error Handling
- Silent failures with `process.exit(1)` in utility scripts
- Try-catch blocks for network operations
- No user-facing error messages in logging utilities

## Build & Development

### Script Patterns
- Chained commands with `&`: `node log.js dev & vite --config`
- Separate nolog variants for development without telemetry
- ES modules with `.mjs` extensions for Vite configs
- Dynamic imports: `import * as fs from 'fs'`

### File Organization
- Scene files in `/src/game/scenes/`
- Debug utilities in `/src/game/debug/`
- React components in `/src/` root
- Assets organized by type in `/public/assets/`
