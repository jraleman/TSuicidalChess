# TTTSuicidalChess ♟♟️

A modern 3D anti-chess game built with Three.js, TailwindCSS and TypeScript with React, hence the name (TTTS)uicidal Chess ;)

> In this unique twist on chess, players must strategically lose their pieces to win the game.

[Live Demo](https://jraleman.com/TTTSuicidalChess)

## 📁 Project Structure

```
TTTSuicidalChess/
├── src/
│   ├── components/         # React components
│   │   ├── Board/         # Chess board and piece components
│   │   ├── UI/            # User interface components
│   │   └── Game/          # Game-related components
│   ├── services/          # Game logic and services
│   │   ├── chess/         # Chess rules and validation
│   │   └── game/          # Game state management
│   ├── models/            # TypeScript interfaces and types
│   ├── utils/             # Utility functions and helpers
│   ├── hooks/             # Custom React hooks
│   ├── context/           # React context providers
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Application entry point
├── public/                # Static assets
├── dist/                  # Production build output
└── config files          # Various configuration files
```

### Key Files and Their Purposes

#### Components
- `src/components/Board/`: Contains the 3D chess board implementation
  - `ChessBoard.tsx`: Main board component with Three.js integration
  - `Piece.tsx`: Individual chess piece component
- `src/components/UI/`: User interface components
  - `StatusBar.tsx`: Game status and score display
  - `Controls.tsx`: Game control buttons and settings
- `src/components/Game/`: Game-specific components
  - `GameOver.tsx`: Game over modal and results display

#### Services
- `src/services/chess/`: Chess game logic
  - `rules.ts`: Chess movement rules and validation
  - `board.ts`: Board state management
- `src/services/game/`: Game state management
  - `store.ts`: Zustand store for game state
  - `actions.ts`: Game actions and state updates

#### Core Files
- `src/App.tsx`: Main application component and game container
- `src/main.tsx`: Application entry point and React initialization
- `src/models/`: TypeScript interfaces for game entities
- `src/utils/`: Helper functions for game logic
- `src/hooks/`: Custom React hooks for game functionality
- `src/context/`: React context providers for global state

## 🎮 Game Rules

### Anti-Chess Rules
1. **Objective**: Lose all your pieces to win the game
2. **Forced Captures**: If a capture is available, it must be made
3. **Scoring**: Players earn points when their pieces are captured
4. **Turn Order**: Players alternate turns, starting with White
5. **Piece Movement**: Pieces move according to standard chess rules
6. **Game End**: The game ends when one player loses all their pieces

### Scoring System
- Each captured piece is worth 1 point
- The player with the most points when they lose all pieces wins
- If a player has no legal moves, they lose the game

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation
1. Clone the repository:
```bash
git clone https://github.com/jraleman/TTTSuicidalChess.git
cd TTTSuicidalChess
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run host` - Start server with host access
- `npm run deploy` - Deploy to GitHub Pages

## 🌐 Deployment

### GitHub Pages Deployment
1. Build the project:
```bash
npm run build
```

2. Deploy to GitHub Pages:
```bash
npm run deploy
```

3. The site will be available at: https://jraleman.com/TSuicidalChess/

### Local Production Preview
To preview the production build locally:
```bash
npm run build
npm run preview
```

## 🛠️ Tech Stack

### Core Technologies
- **Frontend Framework**: React 18
- **3D Graphics**: Three.js
- **Type Safety**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Build Tool**: Vite

### Key Dependencies
- `@react-three/drei`: React components for Three.js
- `@react-three/fiber`: React renderer for Three.js
- `@react-three/postprocessing`: Post-processing effects
- `three`: 3D graphics library
- `zustand`: State management
- `autoprefixer`: CSS post-processor
- `postcss`: CSS transformation tool

## 🎨 Features

### Game Features
- 3D interactive chessboard
- Real-time piece movement
- Forced capture validation
- Score tracking
- Game progress indicator
- Mobile-responsive design

### UI/UX Features
- Smooth piece animations
- Capture sound effects
- Status bar with game information
- Game over modal
- Sound toggle controls
- Volume adjustment

## 📱 Mobile Support
The game is fully responsive and optimized for:
- Desktop browsers
- Mobile devices
- Tablet screens
- Different aspect ratios

## 🤝 Contributing

### How to Contribute
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain consistent code style
- Add tests for new features
- Update documentation as needed
- Keep commits clean and descriptive

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors
- Jose Ramon - Initial work - [jraleman](https://github.com/jraleman)

## 🙏 Acknowledgments
- Three.js community for 3D graphics support
- React team for the amazing framework
- Tailwind CSS team for the utility-first CSS framework
- All contributors and supporters

## 🔮 Future Enhancements
- [-] Game Modes
  - [x] Free mode (single player)
  - [x] AI opponent
  - [x] Multiplayer (local)
  - [-] Room Multiplayer (online)
- [ ] More sound effects
- [ ] Game replay feature
  - [ ] Save game replay as file
  - [ ] Upload file and play game replay

## 📞 Support
For support, please open an issue in the GitHub repository or contact the maintainers.
