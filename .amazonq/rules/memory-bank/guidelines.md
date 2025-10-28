# Slime Identity - Development Guidelines

## Code Quality Standards

### File Structure and Naming
- Use PascalCase for class names and scene files (e.g., `MapScene.js`, `GameScene.js`)
- Use camelCase for variables, functions, and object properties
- Use UPPER_CASE for constants and enums (e.g., `CARD_TYPES`, `RARITY`)
- Organize imports with external libraries first, then internal modules
- Group related functionality in dedicated directories (`scenes/`, `systems/`, `config/`)

### Code Formatting Patterns
- Use consistent indentation (4 spaces observed throughout codebase)
- Place opening braces on same line as function/class declarations
- Use semicolons consistently at end of statements
- Prefer template literals for string interpolation
- Use destructuring for object property extraction where appropriate

### Documentation Standards
- Include JSDoc-style comments for complex functions and classes
- Use descriptive variable names that explain purpose
- Add inline comments for complex game logic and calculations
- Document magic numbers with explanatory comments

## Architectural Patterns

### Scene-Based Architecture
- Extend Phaser's `Scene` class for all game screens
- Use `constructor()` to call `super()` with scene key
- Implement standard lifecycle methods: `init()`, `preload()`, `create()`
- Use EventBus for cross-scene communication
- Store scene-specific data in class properties

### Entity Management
- Create dedicated entity classes (Card, Enemy) extending Phaser objects
- Encapsulate entity behavior within class methods
- Use composition over inheritance for complex behaviors
- Implement consistent update patterns for entity state

### State Management
- Use GameProgress system for persistent game state
- Implement save/load functionality with localStorage
- Maintain separate state for temporary vs persistent data
- Use progress objects with clear property naming

## Common Implementation Patterns

### Asset Loading
```javascript
// Consistent asset loading pattern
this.load.image('keyName', 'assets/path/to/image.png');
this.load.spritesheet('spriteKey', 'path/to/sprite.png', {
    frameWidth: 128,
    frameHeight: 128
});
```

### Animation Creation
```javascript
// Standard animation setup
this.anims.create({
    key: 'animationName',
    frames: this.anims.generateFrameNumbers('spriteKey', { start: 0, end: 4 }),
    frameRate: 8,
    repeat: -1
});
```

### Tween Animations
```javascript
// Consistent tween patterns for smooth animations
this.tweens.add({
    targets: gameObject,
    property: targetValue,
    duration: 300,
    ease: 'Back.easeOut',
    onComplete: () => callback()
});
```

### Event Handling
```javascript
// Interactive object setup
gameObject.setInteractive({ useHandCursor: true });
gameObject.on('pointerdown', () => this.handleClick());
gameObject.on('pointerover', () => this.handleHover());
```

## Data Structure Conventions

### Configuration Objects
- Use exported constants for game data (CARD_DATABASE, mapData)
- Structure data with clear hierarchies and consistent property names
- Include type definitions and enums for better code clarity
- Use factory functions for dynamic data generation

### Game State Objects
```javascript
// Standard game state structure
const gameState = {
    playerHealth: number,
    enemyHealth: number,
    mana: number,
    handSize: number,
    turnNumber: number
};
```

### Effect System Pattern
```javascript
// Consistent effect definition structure
effects: [
    { type: 'effectType', value: number, duration: number },
    { type: 'anotherEffect', stacks: number }
]
```

## Performance Optimization Patterns

### Object Pooling
- Reuse game objects when possible instead of creating new ones
- Implement destroy() calls for temporary objects
- Use container management for grouped objects

### Memory Management
- Clean up event listeners in scene shutdown
- Destroy unused tweens and animations
- Implement proper cleanup in object destruction

### Rendering Optimization
- Use depth sorting for proper z-index management
- Batch similar operations together
- Minimize texture switches by grouping similar sprites

## Error Handling and Validation

### Defensive Programming
- Check for object existence before accessing properties
- Validate array bounds before accessing elements
- Use optional chaining where appropriate
- Implement fallback values for missing data

### Game State Validation
- Verify save data integrity before loading
- Implement bounds checking for game values
- Handle edge cases in game logic gracefully

## Testing and Debugging

### Debug Features
- Implement toggle-able debug displays (grid coordinates, state info)
- Use keyboard shortcuts for debug functionality
- Include development-only scenes for testing
- Log important state changes for debugging

### Code Organization for Testing
- Separate game logic from presentation code
- Use dependency injection for testable components
- Implement clear interfaces between systems