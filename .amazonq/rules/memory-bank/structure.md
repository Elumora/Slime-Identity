# Project Structure

## Directory Organization

### `/src` - Source Code
- **`/game`**: Phaser 3 game logic and scenes
  - **`/scenes`**: Game scene implementations (Boot, Preloader, MainMenu, Game)
  - **`/debug`**: Development utilities (DevGrid)
  - **`EventBus.js`**: Event communication system between Phaser and React
  - **`main.js`**: Phaser game configuration and initialization
- **`App.jsx`**: Main React application component
- **`main.jsx`**: React application entry point
- **`PhaserGame.jsx`**: React wrapper component for Phaser game instance

### `/public` - Static Assets
- **`/assets`**: Game resources organized by type
  - **`/Audio`**: Sound effects and music files
  - **`/Cards`**: Card-related graphics
  - **`/GUI`**: User interface elements (buttons, modals, logo)
  - **`/Story`**: Story-related visual assets
- **`style.css`**: Global styles
- **`favicon.png`**: Application icon

### `/vite` - Build Configuration
- **`config.dev.mjs`**: Development build settings
- **`config.prod.mjs`**: Production build settings

### Root Configuration Files
- **`package.json`**: Dependencies and scripts
- **`index.html`**: Application entry HTML
- **`log.js`**: Custom logging utility for build processes
- **`.eslintrc.cjs`**: Code linting rules
- **`.editorconfig`**: Editor formatting standards

## Core Components

### Scene Architecture
1. **Boot**: Initial scene for basic setup
2. **Preloader**: Asset loading with progress tracking
3. **MainMenu**: Main menu with animations and navigation
4. **Game**: Core gameplay scene
5. **DevGrid**: Debug overlay for development

### React-Phaser Integration
- React manages UI layer and application state
- Phaser handles game rendering and logic
- EventBus facilitates bidirectional communication
- PhaserGame component bridges both frameworks

## Architectural Patterns
- **Scene-based architecture**: Modular game states using Phaser scenes
- **Event-driven communication**: Decoupled React-Phaser interaction via EventBus
- **Asset preloading**: Centralized asset management in Preloader scene
- **Component composition**: React components wrap Phaser game instance
