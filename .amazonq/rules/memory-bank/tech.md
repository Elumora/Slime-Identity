# Technology Stack

## Programming Languages
- **JavaScript (ES6+)**: Primary language for game logic
- **JSX**: React component syntax
- **HTML/CSS**: Web interface and styling

## Core Frameworks & Libraries

### Game Engine
- **Phaser 3.90.0**: HTML5 game framework for rendering, physics, and game loop
  - Scene management
  - Sprite and animation system
  - Input handling (drag/drop, pointer events)
  - Tweens and visual effects

### Frontend Framework
- **React 19.0.0**: UI framework for React-Phaser integration
- **React DOM 19.0.0**: React rendering

## Build System & Tools

### Build Tool
- **Vite 6.3.1**: Fast build tool and dev server
  - Hot module replacement for development
  - Optimized production builds
  - ES modules support

### Code Quality
- **ESLint 9.22.0**: JavaScript linting
  - React hooks plugin
  - React refresh plugin
  - Custom configuration in `.eslintrc.cjs`
- **EditorConfig**: Consistent coding styles

### Optimization
- **Terser 5.39.0**: JavaScript minification for production

## Development Commands

### Start Development Server
```bash
npm run dev
```
Starts Vite dev server with logging (port typically 5173)

### Development Without Logs
```bash
npm run dev-nolog
```
Starts dev server without custom logging

### Production Build
```bash
npm run build
```
Creates optimized production build with logging

### Production Build Without Logs
```bash
npm run build-nolog
```
Creates production build without custom logging

## Configuration Files

### Build Configuration
- `vite/config.dev.mjs`: Development environment settings
- `vite/config.prod.mjs`: Production build optimization

### Code Quality
- `.eslintrc.cjs`: ESLint rules and configuration
- `.editorconfig`: Editor formatting standards

### Project
- `package.json`: Dependencies and scripts
- `index.html`: Application entry HTML

## Asset Management
- Assets loaded from `/public/assets/` directory
- Phaser AssetLoader handles game asset loading
- Organized by type (Audio, Background, Cards, Effects, Enemies, GUI, Map, Sprites, Story)

## Module System
- ES6 modules with `import`/`export`
- Type: "module" in package.json
- Class-based architecture for game systems

## Browser Compatibility
- Modern browsers with ES6+ support
- HTML5 Canvas and WebGL support required for Phaser
