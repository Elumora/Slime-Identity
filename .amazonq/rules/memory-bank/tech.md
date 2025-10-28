# Slime Identity - Technology Stack

## Programming Languages
- **JavaScript (ES6+)**: Primary development language with modern syntax
- **JSX**: React component markup for UI integration

## Core Frameworks & Libraries
- **Phaser 3 (v3.90.0)**: Game engine for 2D game development, rendering, and physics
- **React (v19.0.0)**: UI framework for game interface and menu systems
- **React DOM (v19.0.0)**: React rendering for web browsers

## Build System & Development Tools
- **Vite (v6.3.1)**: Fast build tool and development server
- **Terser (v5.39.0)**: JavaScript minification for production builds
- **ESLint (v9.22.0)**: Code linting and style enforcement
- **@vitejs/plugin-react (v4.3.4)**: React integration for Vite

## Development Configuration
- **Node.js**: Runtime environment (ES modules enabled)
- **EditorConfig**: Consistent coding style across editors
- **Git**: Version control with standard .gitignore patterns

## Asset Formats Supported
- **Images**: PNG for sprites, backgrounds, and UI elements
- **Audio**: MP3 and OGG formats for music and sound effects
- **Fonts**: Web fonts for text rendering
- **Data**: JSON for configuration and game data

## Development Commands
```bash
# Development server with logging
npm run dev

# Development server without logging
npm run dev-nolog

# Production build with logging
npm run build

# Production build without logging
npm run build-nolog
```

## Project Configuration
- **Module Type**: ES modules for modern JavaScript features
- **Build Target**: Web browsers with modern JavaScript support
- **Development Port**: Configurable via Vite settings
- **Asset Optimization**: Automatic optimization for production builds

## Browser Compatibility
- Modern browsers supporting ES6+ features
- WebGL support required for Phaser 3 rendering
- Web Audio API support for game audio