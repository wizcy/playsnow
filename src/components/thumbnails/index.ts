import Thumb2048 from "./Thumb2048";
import ThumbSnake from "./ThumbSnake";
import ThumbTetris from "./ThumbTetris";
import ThumbFlappyBird from "./ThumbFlappyBird";
import ThumbMinesweeper from "./ThumbMinesweeper";
import ThumbPacman from "./ThumbPacman";
import ThumbSudoku from "./ThumbSudoku";
import ThumbChess from "./ThumbChess";
import ThumbTicTacToe from "./ThumbTicTacToe";
import ThumbMemoryMatch from "./ThumbMemoryMatch";
import ThumbBreakout from "./ThumbBreakout";
import ThumbConnectFour from "./ThumbConnectFour";
import ThumbWordle from "./ThumbWordle";
import ThumbSolitaire from "./ThumbSolitaire";
import ThumbCheckers from "./ThumbCheckers";
import ThumbMagicTower from "./ThumbMagicTower";

export const thumbnails: Record<string, React.ComponentType> = {
  "2048": Thumb2048,
  "snake": ThumbSnake,
  "tetris": ThumbTetris,
  "flappy-bird": ThumbFlappyBird,
  "minesweeper": ThumbMinesweeper,
  "pacman": ThumbPacman,
  "sudoku": ThumbSudoku,
  "chess": ThumbChess,
  "tic-tac-toe": ThumbTicTacToe,
  "memory-match": ThumbMemoryMatch,
  "breakout": ThumbBreakout,
  "connect-four": ThumbConnectFour,
  "wordle": ThumbWordle,
  "solitaire": ThumbSolitaire,
  "checkers": ThumbCheckers,
  "magic-tower": ThumbMagicTower,
};
