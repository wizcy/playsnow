import dynamic from "next/dynamic";

const gameComponents: Record<string, ReturnType<typeof dynamic>> = {
  "2048": dynamic(() => import("@/components/games/Game2048"), { ssr: false }),
  "snake": dynamic(() => import("@/components/games/GameSnake"), { ssr: false }),
  "tetris": dynamic(() => import("@/components/games/GameTetris"), { ssr: false }),
  "flappy-bird": dynamic(() => import("@/components/games/GameFlappyBird"), { ssr: false }),
  "minesweeper": dynamic(() => import("@/components/games/GameMinesweeper"), { ssr: false }),
  "pacman": dynamic(() => import("@/components/games/GamePacman"), { ssr: false }),
  "sudoku": dynamic(() => import("@/components/games/GameSudoku"), { ssr: false }),
  "chess": dynamic(() => import("@/components/games/GameChess"), { ssr: false }),
  "tic-tac-toe": dynamic(() => import("@/components/games/GameTicTacToe"), { ssr: false }),
  "memory-match": dynamic(() => import("@/components/games/GameMemoryMatch"), { ssr: false }),
  "breakout": dynamic(() => import("@/components/games/GameBreakout"), { ssr: false }),
  "connect-four": dynamic(() => import("@/components/games/GameConnectFour"), { ssr: false }),
  "wordle": dynamic(() => import("@/components/games/GameWordle"), { ssr: false }),
  "solitaire": dynamic(() => import("@/components/games/GameSolitaire"), { ssr: false }),
  "checkers": dynamic(() => import("@/components/games/GameCheckers"), { ssr: false }),
  "magic-tower": dynamic(() => import("@/components/games/GameMagicTower"), { ssr: false }),
};

export function getGameComponent(slug: string) {
  return gameComponents[slug] || null;
}
