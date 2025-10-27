# Technology Stack

## Programming Languages
- **JavaScript (ES6+)**: Primary language for game logic and React components
- **JSX**: React component syntax

## Core Frameworks & Libraries
- **Phaser 3.90.0**: Game engine for 2D game development
- **React 19.0.0**: UI framework for application structure
- **React DOM 19.0.0**: React rendering for web

## Build System
- **Vite 6.3.1**: Fast build tool and development server
- **@vitejs/plugin-react 4.3.4**: React integration for Vite
- **Terser 5.39.0**: JavaScript minification for production

## Development Tools
- **ESLint 9.22.0**: Code linting and quality enforcement
  - eslint-plugin-react-hooks: React Hooks linting rules
  - eslint-plugin-react-refresh: React Fast Refresh support
- **EditorConfig**: Consistent coding styles across editors

## Development Commands

### Start Development Server
```bash
npm run dev
```
Launches Vite dev server with logging utility

### Build for Production
```bash
npm run build
```
Creates optimized production build with logging

### Alternative Commands (No Logging)
```bash
npm run dev-nolog    # Development without log.js
npm run build-nolog  # Production build without log.js
```

## Configuration Files
- **vite/config.dev.mjs**: Development server configuration
- **vite/config.prod.mjs**: Production build optimization
- **.eslintrc.cjs**: Linting rules and standards
- **.editorconfig**: Editor formatting preferences
- **package.json**: Project metadata and dependencies

## Browser Compatibility
Modern browsers with ES6+ support required for Phaser 3 and React 19
