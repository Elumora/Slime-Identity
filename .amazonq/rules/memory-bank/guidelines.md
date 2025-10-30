# Development Guidelines

## Code Quality Standards

### File Structure and Organization
- One class per file with matching filename (e.g., `CardAI` class in `CardAI.js`)
- ES6 module imports at the top of files
- Export classes and functions using named exports
- Group related functionality into manager classes (BattleManager, CardManager, UIManager)

### Naming Conventions
- **Classes**: PascalCase (e.g., `CardManager`, `GameScene`, `Enemy`)
- **Files**: PascalCase matching class names (e.g., `CardManager.js`, `GameScene.js`)
- **Variables/Functions**: camelCase (e.g., `currentPathIndex`, `takeDamage`, `updateHealthBar`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `CARD_TYPES`, `MAP_VERSION`, `RARITY`)
- **Private properties**: Regular camelCase (no underscore prefix)

### Code Formatting
- Use 4-space indentation consistently
- No semicolons at end of statements (except in specific cases)
- Use single quotes for strings
- Use template literals for string interpolation
- Line breaks between logical sections of code
- Carriage return + line feed (`\r\n`) line endings

### Documentation
- Minimal inline comments - code should be self-documenting
- Comments used sparingly for complex logic or non-obvious behavior
- No JSDoc or formal documentation blocks
- Descriptive variable and function names preferred over comments

## Architectural Patterns

### Phaser Scene Pattern
All game scenes extend `Phaser.Scene` and follow this structure:
```javascript
export class SceneName extends Scene {
    constructor() {
        super('SceneName');
    }

    init(data) {
        // Initialize with passed data
    }

    preload() {
        // Load assets (if needed)
    }

    create() {
        // Setup scene, create game objects
        EventBus.emit('current-scene-ready', this);
    }
}
```

### Manager System Pattern
Managers are instantiated in scene `init()` and handle specific responsibilities:
```javascript
init(data) {
    this.battleManager = new BattleManager(this);
    this.cardManager = new CardManager(this);
    this.uiManager = new UIManager(this);
}
```

### Entity Pattern (Phaser Containers)
Game entities extend `Phaser.GameObjects.Container`:
```javascript
export class Enemy extends Phaser.GameObjects.Container {
    constructor(scene, x, y, enemyType, scale = 1) {
        super(scene, x, y);
        this.scene = scene;
        // Add sprites and UI elements to container
        this.add(this.sprite);
        scene.add.existing(this);
    }
}
```

### Data-Driven Configuration
Game data stored in separate database files as exported constants:
```javascript
export const CARD_DATABASE = [
    {
        name: 'Card Name',
        type: CARD_TYPES.ATTACK,
        value: 6,
        cost: 1,
        rarity: RARITY.COMMON,
        effects: [{ type: 'effect', value: 1 }]
    }
];
```

## Common Implementation Patterns

### Event Communication
Use EventBus for React-Phaser communication:
```javascript
import { EventBus } from '../EventBus';

// Emit events
EventBus.emit('current-scene-ready', this);

// Listen to events
EventBus.on('event-name', callback);
```

### State Management with LocalStorage
Persistent game state saved to localStorage:
```javascript
export class GameProgress {
    static save(progress) {
        localStorage.setItem('gameProgress', JSON.stringify(progress));
    }

    static load() {
        const saved = localStorage.getItem('gameProgress');
        return saved ? JSON.parse(saved) : defaultProgress;
    }
}
```

### Phaser Tweens for Animations
Use Phaser's tween system for smooth animations:
```javascript
this.tweens.add({
    targets: object,
    property: targetValue,
    duration: 500,
    ease: 'Power2',
    yoyo: true,
    repeat: -1,
    onComplete: () => {
        // Callback after animation
    }
});
```

### Delayed Execution
Use Phaser's time system for delays:
```javascript
this.time.delayedCall(1500, () => {
    // Execute after delay
});
```

### Isometric Coordinate Conversion
Convert grid coordinates to isometric display coordinates:
```javascript
const isoX = (x - y) * ((this.tileWidth + this.spacing) / 2);
const isoY = (x + y) * ((this.tileHeight + this.spacing) / 2);
```

### Container Depth Sorting
Sort container children by depth for proper rendering order:
```javascript
sortContainerByDepth() {
    this.mapContainer.list.sort((a, b) => a.depth - b.depth);
}
```

### Drag and Drop Implementation
Set up interactive drag behavior:
```javascript
// In create()
this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
    gameObject.emit('drag', pointer, dragX, dragY);
});

// On game object
gameObject.setInteractive({ draggable: true });
gameObject.on('drag', (pointer, dragX, dragY) => {
    this.x = dragX;
    this.y = dragY;
});
```

### Health Bar Updates with Tweens
Animate health bar changes smoothly:
```javascript
const healthPercent = this.health / this.maxHealth;
const targetWidth = (barWidth - 1) * healthPercent;

this.scene.tweens.add({
    targets: this.healthBarFill,
    width: targetWidth,
    duration: 300,
    ease: 'Power2'
});

const color = healthPercent > 0.5 ? 0x00ff00 : 
              healthPercent > 0.25 ? 0xffff00 : 0xff675e;
this.healthBarFill.setFillStyle(color);
```

## Internal API Usage

### Scene Management
```javascript
// Start a new scene
this.scene.start('SceneName', { data: value });

// Launch scene in parallel
this.scene.launch('SceneName');

// Stop current scene
this.scene.stop();
```

### Asset Loading
```javascript
// In preload()
this.load.image('key', 'path/to/asset.png');
this.load.spritesheet('key', 'path/to/spritesheet.png', {
    frameWidth: 32,
    frameHeight: 32
});
```

### Animation Creation
```javascript
this.anims.create({
    key: 'animation-name',
    frames: this.anims.generateFrameNumbers('spritesheet', { 
        start: 0, 
        end: 4 
    }),
    frameRate: 15,
    hideOnComplete: true
});
```

### Input Handling
```javascript
// Pointer events
this.input.on('pointerdown', (pointer) => { });
this.input.on('pointermove', (pointer) => { });
this.input.on('pointerup', () => { });

// Keyboard events
this.input.keyboard.on('keydown-G', () => { });

// Mouse wheel
this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => { });
```

### Interactive Objects
```javascript
const object = this.add.image(x, y, 'key')
    .setInteractive({ useHandCursor: true });

object.on('pointerdown', () => { });
object.on('pointerover', () => { });
object.on('pointerout', () => { });
```

### Camera Control
```javascript
// Set background color
this.cameras.main.setBackgroundColor('#C8FFC8');

// Get camera center
const centerX = this.cameras.main.centerX;
const centerY = this.cameras.main.centerY;
```

### Sound Management
```javascript
// Play sound
this.sound.play('sound-key', { loop: true, volume: 0.5 });

// Stop all sounds
this.sound.stopAll();
```

### Particle Effects
```javascript
const particles = this.add.particles(x, y, 'particle', {
    speed: { min: 30, max: 60 },
    angle: { min: 0, max: 360 },
    alpha: { start: 0.6, end: 0 },
    scale: { start: 0.3, end: 0.8 },
    lifespan: 800,
    frequency: 30,
    blendMode: 'ADD'
});

particles.start();
particles.stop();
```

## Code Idioms

### Null/Undefined Checks
```javascript
if (!this.healthText || !this.scene) return;
```

### Array Shuffling (Fisher-Yates)
```javascript
for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
}
```

### Clamping Values
```javascript
const scale = Phaser.Math.Clamp(value, min, max);
```

### Optional Chaining for Safety
```javascript
if (this.scene && this.scene.checkVictory) {
    this.scene.checkVictory();
}
```

### Ternary for Conditional Values
```javascript
const color = healthPercent > 0.5 ? 0x00ff00 : 0xff0000;
const text = `${value} card${value > 1 ? 's' : ''}`;
```

### Object Destructuring
```javascript
const { playerHealth, enemyHealth, mana, handSize } = gameState;
```

### Default Parameters
```javascript
constructor(scene, x, y, enemyType, scale = 1) { }
```

### Array Methods for Data Processing
```javascript
// Filter and map
const topCards = Object.entries(this.cardScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);

// Find
const monsterData = mapData.monsters.find(m => m.x === x && m.y === y);

// ForEach
this.coins.forEach(coin => { });
```

### Logical OR for Defaults
```javascript
this.cardScores[cardName] = (this.cardScores[cardName] || 0) + reward;
```

### Template Literals for Keys
```javascript
const key = `${x},${y}`;
const stateKey = `${healthBucket}-${enemyBucket}-${manaBucket}`;
```

## Best Practices

### Resource Management
- Destroy unused game objects to prevent memory leaks: `object.destroy()`
- Kill tweens when no longer needed: `this.tweens.killTweensOf(object)`
- Clean up event listeners when scenes stop

### Performance Optimization
- Use object pooling for frequently created/destroyed objects
- Batch similar operations together
- Use containers to group related objects for efficient transforms
- Set appropriate depth values for proper rendering order

### Error Prevention
- Check for null/undefined before accessing properties
- Validate array indices before access
- Use optional chaining for nested property access
- Provide default values for function parameters

### State Consistency
- Always update UI after state changes
- Save progress after important game events
- Validate loaded data before using it
- Use versioning for saved data to handle schema changes

### Scene Lifecycle
- Initialize managers in `init()` method
- Load assets in `preload()` method
- Create game objects in `create()` method
- Emit 'current-scene-ready' at end of `create()`
- Clean up resources when scene stops
