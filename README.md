# Anti-Chess

A modern implementation of Anti-Chess (also known as Losing Chess or Giveaway Chess) built with PixiJS and TypeScript.

## Game Rules

In Anti-Chess, the objective is to lose all your pieces:

- Capturing is mandatory when possible
- The king has no special status (no check or checkmate)
- Pawns can promote when reaching the opposite end of the board
- The player who loses all their pieces first wins the game

## Project Structure

- `src/`: Source code files
  - `core/`: Core game logic and initialization
  - `entities/`: Game objects (Board, Pieces, etc.)
  - `utils/`: Utility classes and helpers
  - `ui/`: User interface components
  - `assets/`: Asset management
- `public/`: Static assets and HTML entry point
  - `assets/`: Game assets (images, sounds)

## Development

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open your browser to `http://localhost:3000`

### Building for Production

```
npm run build
```

## License

MIT
