# Project Structure

## Directory Organization

### `/src/game/` - Core Game Logic
Main game implementation using Phaser 3 framework.

#### `/src/game/scenes/` - Phaser Scenes
- **Boot.js**: Initial boot scene for game initialization
- **Preloader.js**: Asset loading scene
- **MainMenu.js**: Main menu interface
- **MapScene.js**: Map navigation and path selection
- **GameScene.js**: Main battle scene orchestrating combat
- **CardRewardScene.js**: Card selection after battles
- **Narration.js**: Story/narrative display
- **CardDebugScene.js**: Development testing scene
- **Game.js**: Scene configuration and setup

#### `/src/game/systems/` - Game Systems
- **BattleManager.js**: Combat flow, player/enemy creation, victory/defeat
- **CardManager.js**: Deck, hand, discard pile management
- **CardViewManager.js**: UI for viewing deck/discard contents
- **UIManager.js**: UI element creation and management
- **TurnManager.js**: Turn order and enemy turn execution
- **CardEffects.js**: Card effect implementations and logic
- **CardAI.js**: Enemy AI decision-making
- **GameProgress.js**: Save/load game state persistence

#### `/src/game/entities/` - Game Objects
- **Card.js**: Card entity with drag/drop, visual states
- **Enemy.js**: Enemy entity with health, attack, behaviors

#### `/src/game/config/` - Data Configuration
- **CardDatabase.js**: All card definitions and properties
- **CardTypes.js**: Card type constants and categorization
- **EnemyDatabase.js**: Enemy definitions and stats
- **PlayerDeck.js**: Starting deck configuration
- **MapConfig.js**: Map layout and encounter definitions

#### `/src/game/map/` - Map System
- **mapData.js**: Map node structure and path data

#### `/src/game/debug/` - Development Tools
- **DevGrid.js**: Debug overlay for development

#### Root Game Files
- **EventBus.js**: Event communication system
- **main.js**: Phaser game configuration and initialization

### `/src/` - React Integration
- **main.jsx**: React application entry point
- **App.jsx**: Main React component
- **PhaserGame.jsx**: React-Phaser bridge component

### `/public/assets/` - Game Assets
- **Audio/**: Sound effects and music
- **Background/**: Battle and scene backgrounds
- **Cards/**: Card artwork and visuals
- **Effects/**: Visual effect sprites
- **Enemies/**: Enemy sprites and animations
- **GUI/**: UI elements and buttons
- **Map/**: Map node and path graphics
- **Sprites/**: Player and other sprites
- **Story/**: Narrative images

### `/vite/` - Build Configuration
- **config.dev.mjs**: Development build settings
- **config.prod.mjs**: Production build settings

## Core Component Relationships

### Scene Flow
```
Boot → Preloader → MainMenu → MapScene ↔ GameScene → CardRewardScene
                                  ↓
                              Narration
```

### System Dependencies
- **GameScene** orchestrates: BattleManager, CardManager, UIManager, CardViewManager, TurnManager
- **BattleManager** uses: CardEffects, GameProgress
- **TurnManager** uses: CardAI, CardEffects
- **CardManager** manages: Card entities, deck/hand/discard
- **Card** uses: CardEffects for execution

## Architectural Patterns

### Manager Pattern
Systems are organized as manager classes that encapsulate specific responsibilities (BattleManager, CardManager, UIManager, etc.)

### Scene-Based Architecture
Phaser scenes represent different game states with clear separation of concerns

### Event-Driven Communication
EventBus facilitates decoupled communication between React and Phaser

### Data-Driven Design
Card and enemy behaviors defined in database files for easy modification

### Entity-Component Pattern
Game objects (Card, Enemy) are self-contained entities with their own logic and state
