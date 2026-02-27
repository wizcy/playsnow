export interface GameFAQ {
  question: string;
  answer: string;
}

export interface Game {
  slug: string;
  title: string;
  description: string;
  category: string;
  color: string;
  emoji: string;
  keywords: string[];
  longDescription: string;
  howToPlay: { desktop: string; mobile: string };
  features: string[];
  tips: string[];
  faq: GameFAQ[];
}

export const games: Game[] = [
  {
    slug: "2048",
    title: "2048",
    description: "Slide numbered tiles to combine them and reach the 2048 tile.",
    category: "Puzzle",
    color: "#edc22e",
    emoji: "🔢",
    keywords: ["2048 online", "2048 game free", "2048 unblocked", "play 2048"],
    longDescription: "2048 was created by Italian developer Gabriele Cirulli in March 2014 as a weekend project. Inspired by Threes! and 1024, it became a viral sensation overnight, reaching millions of players within days. The game's elegant simplicity — sliding tiles on a 4×4 grid to combine matching numbers — makes it one of the most addictive puzzle games ever made.",
    howToPlay: {
      desktop: "Use the arrow keys (Up, Down, Left, Right) to slide all tiles in that direction. When two tiles with the same number collide, they merge into one tile with their combined value. After each move, a new tile (2 or 4) appears randomly on the board. Plan your moves carefully to keep building larger numbers without running out of space.",
      mobile: "Swipe in any direction (up, down, left, right) to slide all tiles. The mechanics are identical to desktop — matching tiles merge when they collide. Try to keep your highest tile in a corner and build around it."
    },
    features: [
      "Simple one-touch controls that anyone can learn in seconds",
      "Endless strategic depth — easy to play, hard to master",
      "Score tracking to beat your personal best",
      "Clean, minimalist design with smooth animations",
      "No time pressure — think as long as you need"
    ],
    tips: [
      "Keep your highest tile in a corner — pick one corner and never move it away",
      "Build a chain of descending values along one edge of the board",
      "Avoid pressing Up if your highest tile is in the bottom-left corner",
      "Focus on keeping tiles organized rather than chasing merges",
      "When the board gets crowded, look for chain reactions that clear multiple merges"
    ],
    faq: [
      { question: "What is the highest possible tile in 2048?", answer: "Theoretically, the highest tile is 131072 (2^17), but reaching it requires perfect play on a 4×4 grid. Most skilled players aim for the 2048 tile, and reaching 4096 or 8192 is considered an impressive achievement." },
      { question: "Is it possible to win 2048 every time?", answer: "No, 2048 involves randomness in tile placement. However, using consistent strategies like the corner method significantly increases your chances of reaching 2048. Skilled players can win about 90% of their games." },
      { question: "Who created 2048?", answer: "2048 was created by Gabriele Cirulli, a 19-year-old Italian web developer, in March 2014. He built it over a weekend and released it as open source. The game went viral and has been played billions of times worldwide." },
      { question: "Can I play 2048 on my phone?", answer: "Yes! This version of 2048 works perfectly on mobile devices. Simply swipe in any direction to move the tiles. The game automatically adapts to your screen size." }
    ]
  },
  {
    slug: "snake",
    title: "Snake",
    description: "Guide the snake to eat food and grow longer without hitting walls or yourself.",
    category: "Classic",
    color: "#4ade80",
    emoji: "🐍",
    keywords: ["snake game online", "snake unblocked", "play snake free", "google snake game"],
    longDescription: "Snake has roots going back to the 1976 arcade game Blockade, but it became a global phenomenon when Nokia pre-installed it on their mobile phones in 1998. The Nokia 6110 version, programmed by Taneli Armanto, introduced an entire generation to mobile gaming. Today, Snake remains one of the most recognized and beloved games in history, with Google even featuring a playable version in search results.",
    howToPlay: {
      desktop: "Use the arrow keys to control the snake's direction. The snake moves continuously — you only change its direction. Eat the red food dots to grow longer and earn points. Avoid hitting the walls or your own tail. The game gets progressively harder as your snake grows longer, leaving less room to maneuver.",
      mobile: "Swipe in any direction to change the snake's heading. The snake will continue moving in that direction until you swipe again. Eat food to grow and score points. Be careful — as you get longer, it becomes easier to accidentally run into yourself."
    },
    features: [
      "Classic arcade gameplay faithful to the original",
      "Smooth, responsive controls",
      "Progressive difficulty — the longer you survive, the harder it gets",
      "Score tracking for competitive play",
      "Clean grid-based visuals"
    ],
    tips: [
      "Stay near the center of the board early on — it gives you more escape routes",
      "Plan 2-3 moves ahead, especially when your snake is long",
      "Avoid trapping yourself in corners or along edges",
      "Create a systematic pattern (like following the walls) when your snake gets very long",
      "Don't rush toward food — sometimes the safe path is longer but better"
    ],
    faq: [
      { question: "What is the highest score possible in Snake?", answer: "The maximum score depends on the grid size. On our 20×20 grid, the theoretical maximum is filling every cell, which would give you a score of around 3980 points. In practice, scores above 500 are impressive." },
      { question: "Why is Snake so popular?", answer: "Snake's appeal lies in its perfect simplicity — anyone can understand the rules in seconds, but mastering it takes real skill. It was also one of the first mobile games ever, reaching hundreds of millions of Nokia phone users in the late 1990s." },
      { question: "Is this the same Snake from Nokia phones?", answer: "This is a faithful recreation of the classic Snake gameplay. While the original Nokia Snake had a smaller grid and simpler graphics, the core mechanics — eat, grow, don't crash — are exactly the same." }
    ]
  },
  {
    slug: "tetris",
    title: "Tetris",
    description: "Arrange falling blocks to complete horizontal lines in this legendary puzzle game.",
    category: "Puzzle",
    color: "#60a5fa",
    emoji: "🧱",
    keywords: ["tetris online free", "tetris unblocked", "play tetris", "tetris game"],
    longDescription: "Tetris was invented in 1985 by Soviet software engineer Alexey Pajitnov while working at the Academy of Sciences in Moscow. Named after the Greek prefix 'tetra' (four) and tennis, Pajitnov's favorite sport, Tetris became the first entertainment software exported from the USSR. It has since sold over 520 million copies across all platforms, making it one of the best-selling games of all time.",
    howToPlay: {
      desktop: "Use Left/Right arrow keys to move the falling piece horizontally. Press Up arrow to rotate the piece 90 degrees clockwise. Press Down arrow to speed up the drop. Complete a full horizontal line to clear it and earn points. Clearing multiple lines at once scores bonus points. The game ends when pieces stack up to the top of the board.",
      mobile: "Tap the left or right side of the screen to move pieces. Tap the piece to rotate it. Swipe down to drop faster. The goal is the same — complete full lines to clear them and keep the board from filling up."
    },
    features: [
      "All 7 classic Tetromino pieces (I, O, T, L, J, S, Z)",
      "Line clear scoring with combo bonuses",
      "Increasing speed as you progress",
      "Clean, colorful block design",
      "Instant response controls"
    ],
    tips: [
      "Keep the board as flat as possible — avoid creating deep holes",
      "Save the I-piece (long bar) for clearing 4 lines at once (a 'Tetris')",
      "Build up on one side and leave a column open for the I-piece",
      "Learn to use the T-piece for T-spins — they score extra points in many versions",
      "Don't panic when the speed increases — focus on placement, not speed"
    ],
    faq: [
      { question: "What is a 'Tetris' in Tetris?", answer: "A 'Tetris' is when you clear 4 lines simultaneously using the I-piece (the long straight bar). It's the highest-scoring single move in the game and is considered the signature play of skilled Tetris players." },
      { question: "Who invented Tetris?", answer: "Tetris was created by Alexey Pajitnov, a Soviet software engineer, in June 1985. He developed it on an Elektronika 60 computer at the Moscow Academy of Sciences. The game's rights went through complex international negotiations before becoming a global phenomenon." },
      { question: "What are the 7 Tetris pieces called?", answer: "The 7 pieces are called Tetrominoes, each named after the letter they resemble: I (straight line), O (square), T (T-shape), L (L-shape), J (reverse L), S (S-shape/zigzag), and Z (reverse S/zigzag)." },
      { question: "Can you play Tetris forever?", answer: "Theoretically no — as the speed increases, eventually the pieces fall too fast for human reflexes. However, modern competitive players can survive for hours. The NES Tetris 'kill screen' at level 29 was long considered unbeatable until players developed new techniques." }
    ]
  },
  {
    slug: "flappy-bird",
    title: "Flappy Bird",
    description: "Tap to fly through gaps between pipes. Simple controls, extreme difficulty.",
    category: "Casual",
    color: "#fbbf24",
    emoji: "🐦",
    keywords: ["flappy bird online", "flappy bird unblocked", "play flappy bird free"],
    longDescription: "Flappy Bird was created by Vietnamese developer Dong Nguyen and released in May 2013. It became the most downloaded free app in January 2014, earning an estimated $50,000 per day from ads. Nguyen famously removed it from app stores in February 2014, saying it was 'too addictive.' Its brutal difficulty and one-tap gameplay made it a cultural phenomenon.",
    howToPlay: {
      desktop: "Press Space or click to make the bird flap upward. Gravity constantly pulls the bird down. Navigate through gaps between green pipes by timing your flaps carefully. Each pipe you pass scores one point. A single collision ends the game instantly.",
      mobile: "Tap anywhere on the screen to flap. The timing between taps determines your altitude. Tap too fast and you'll fly too high; tap too slow and you'll sink. Find the rhythm to glide through each gap."
    },
    features: ["One-touch controls — tap to flap", "Extreme difficulty that keeps you coming back", "Instant restart for quick retries", "Score counter to track your best run", "Smooth physics-based flight mechanics"],
    tips: ["Focus on the gaps, not the pipes", "Develop a consistent tapping rhythm rather than reacting to each pipe", "Stay in the middle of the screen when possible — it gives you room to adjust", "Don't tap too rapidly — gentle, spaced taps give better control", "The first few pipes are the hardest because you haven't found your rhythm yet"],
    faq: [
      { question: "Why was Flappy Bird removed from app stores?", answer: "Creator Dong Nguyen removed it in February 2014, tweeting 'I cannot take this anymore.' He said the game's addictive nature was causing problems for players and he felt guilty about it, despite earning $50,000/day from ads." },
      { question: "What is a good score in Flappy Bird?", answer: "Getting past 10 pipes is respectable for beginners. A score of 50+ is considered skilled, and 100+ is expert level. The world record is over 999, achieved by dedicated players who practiced for hundreds of hours." },
      { question: "Can I play Flappy Bird on my phone?", answer: "Yes! This browser version works on all mobile devices. Just tap the screen to flap. It plays identically to the original mobile app." }
    ]
  },
  {
    slug: "minesweeper",
    title: "Minesweeper",
    description: "Uncover squares while avoiding hidden mines. Use logic to clear the board.",
    category: "Puzzle",
    color: "#a78bfa",
    emoji: "💣",
    keywords: ["minesweeper online", "minesweeper free", "play minesweeper", "minesweeper unblocked"],
    longDescription: "Minesweeper was included with Microsoft Windows 3.1 in 1992, originally designed to teach users how to right-click and left-click. Created by Robert Donner and Curt Johnson, it became one of the most-played computer games in history simply because it came pre-installed on every Windows PC. Competitive Minesweeper has a dedicated community, with expert players clearing boards in under 30 seconds.",
    howToPlay: {
      desktop: "Left-click to reveal a square. Numbers indicate how many mines are adjacent to that square (including diagonals). Right-click to place a flag on suspected mines. If you reveal a square with no adjacent mines, all neighboring safe squares are automatically revealed. Use logic to deduce which squares are safe and which contain mines.",
      mobile: "Tap to reveal a square. Long-press to place or remove a flag. The numbers and logic work identically to the desktop version. Use the number clues to figure out where mines are hidden."
    },
    features: ["Classic 10×10 grid with 15 mines", "Flag system to mark suspected mines", "Auto-reveal for zero-count squares", "Right-click flagging support", "Win detection when all safe squares are revealed"],
    tips: ["Start by clicking near the center — corners give less information", "If a '1' square has only one unrevealed neighbor, that neighbor is definitely a mine", "Look for patterns: a '1-2-1' pattern along an edge is very common and solvable", "Flag all confirmed mines before clicking more squares — it helps you count", "When stuck, look for squares where all adjacent mines are already flagged — those are safe to click"],
    faq: [
      { question: "Is Minesweeper pure logic or does it require guessing?", answer: "Most Minesweeper boards can be solved with pure logic, but some configurations require a guess, especially in corners. Expert players estimate about 10-15% of games on standard difficulty require at least one guess." },
      { question: "What do the numbers mean in Minesweeper?", answer: "Each number tells you exactly how many mines are in the 8 squares surrounding it (horizontally, vertically, and diagonally). A '1' means one adjacent mine, '2' means two, and so on. Blank squares have zero adjacent mines." },
      { question: "What is the world record for Minesweeper?", answer: "On the Expert difficulty (30×16, 99 mines), the world record is under 30 seconds. On Beginner (8×8, 10 mines), records are under 1 second. Competitive Minesweeper is tracked at minesweepergame.com." }
    ]
  },
  {
    slug: "pacman",
    title: "Pac-Man",
    description: "Navigate the maze, eat all the dots, and avoid the ghosts.",
    category: "Classic",
    color: "#facc15",
    emoji: "👾",
    keywords: ["pacman online", "pac-man free", "play pacman unblocked", "pacman game"],
    longDescription: "Pac-Man was created by Toru Iwatani at Namco and released in May 1980. Inspired by a pizza with a slice removed, Iwatani designed the character to appeal beyond the male-dominated arcade scene. Pac-Man became the best-selling arcade game of all time, generating over $2.5 billion in quarters, and remains one of the most iconic characters in gaming history.",
    howToPlay: {
      desktop: "Use the arrow keys to navigate Pac-Man through the maze. Eat all the small dots to complete the level. Avoid the colored ghosts — touching one costs a life. Eat the large power pellets to temporarily turn ghosts blue, allowing you to eat them for bonus points.",
      mobile: "Swipe in any direction to change Pac-Man's heading. He continues moving until hitting a wall. Eat dots, avoid ghosts, and grab power pellets to turn the tables."
    },
    features: ["Classic maze-based arcade gameplay", "Ghost AI with distinct behaviors", "Power pellets for ghost-eating combos", "Score tracking", "Arrow key controls"],
    tips: ["Learn the ghost patterns — each ghost has a different chasing strategy", "Use the tunnels on the sides to escape ghosts", "Save power pellets for when ghosts are close", "Clear one section at a time rather than zigzagging randomly", "Ghosts slow down in the tunnel — you don't"],
    faq: [
      { question: "What are the ghosts' names in Pac-Man?", answer: "The four ghosts are Blinky (red), Pinky (pink), Inky (cyan), and Clyde (orange). Each has unique AI: Blinky chases directly, Pinky ambushes from ahead, Inky is unpredictable, and Clyde alternates between chasing and wandering." },
      { question: "Who created Pac-Man?", answer: "Toru Iwatani at Namco designed Pac-Man, inspired by a pizza with a missing slice. He wanted a game that would appeal to women and couples, not just the typical male arcade audience." },
      { question: "What is the perfect Pac-Man score?", answer: "The maximum possible score is 3,333,360 points, achieved by eating every dot, power pellet, fruit, and ghost across all 256 levels. Billy Mitchell was the first to achieve this in 1999." }
    ]
  },
  {
    slug: "sudoku",
    title: "Sudoku",
    description: "Fill the 9×9 grid so every row, column, and 3×3 box contains digits 1-9.",
    category: "Puzzle",
    color: "#f472b6",
    emoji: "🔟",
    keywords: ["sudoku online free", "play sudoku", "sudoku unblocked", "sudoku puzzle"],
    longDescription: "While often associated with Japan, Sudoku was invented by American architect Howard Garns in 1979 under the name 'Number Place.' It was popularized in Japan by Nikoli in 1986, who named it Sudoku ('single number'). The global craze began in 2004 when The Times of London started publishing daily puzzles.",
    howToPlay: {
      desktop: "Click an empty cell to select it, then click a number button (1-9) to fill it in. Each row, column, and 3×3 box must contain all digits 1-9 with no repeats. Pre-filled numbers cannot be changed. Use ✕ to clear a cell.",
      mobile: "Tap an empty cell to select it, then tap a number to place it. Same rules — no repeated digits in any row, column, or 3×3 box. Tap ✕ to erase."
    },
    features: ["Classic 9×9 Sudoku grid", "Pre-filled puzzle with unique solution", "Click-to-fill number input", "Clear button for corrections", "Visual highlighting of selected cell"],
    tips: ["Start with rows or boxes that have the most pre-filled numbers", "Look for 'naked singles' — cells where only one number is possible", "Scan each number 1-9 across the whole board to find where it must go", "Focus on 3×3 boxes when stuck", "Use elimination — cross out impossible numbers mentally"],
    faq: [
      { question: "Does Sudoku require math?", answer: "No! Sudoku is purely a logic puzzle. You could replace digits with any nine distinct symbols and it would work identically. No arithmetic is involved." },
      { question: "How many valid Sudoku puzzles exist?", answer: "There are approximately 6.67 sextillion valid completed Sudoku grids. Accounting for symmetries, there are about 5.47 billion essentially different grids." },
      { question: "What makes a good Sudoku puzzle?", answer: "A well-designed Sudoku has exactly one solution and can be solved through logic alone without guessing. Difficulty depends on which techniques are required, not just how many cells are pre-filled." }
    ]
  },
  {
    slug: "chess",
    title: "Chess",
    description: "Play chess against a friend on the same device. The world's most popular board game.",
    category: "Board",
    color: "#94a3b8",
    emoji: "♟️",
    keywords: ["chess online free", "play chess", "chess unblocked", "chess game"],
    longDescription: "Chess originated in India around the 6th century as 'chaturanga' and evolved through Persian and Arab cultures before reaching Europe by the 10th century. The modern rules were established in the 15th century. Today, chess is played by over 600 million people worldwide and is recognized by the International Olympic Committee as a sport.",
    howToPlay: {
      desktop: "Click a piece to select it, then click the destination square to move. This is a two-player game on the same device — White moves first, then Black. Each piece type moves differently: pawns move forward, rooks move in straight lines, bishops move diagonally, knights move in an L-shape, the queen combines rook and bishop movement, and the king moves one square in any direction.",
      mobile: "Tap a piece to select it, then tap where you want to move it. Players alternate turns on the same device. The board and pieces are sized for comfortable touch interaction."
    },
    features: ["Full chess board with Unicode piece symbols", "Two-player local multiplayer", "Turn indicator showing whose move it is", "Piece selection highlighting", "Reset button to start a new game"],
    tips: ["Control the center of the board early with pawns and knights", "Develop your pieces (move them out) before attacking", "Castle early to protect your king", "Don't move the same piece twice in the opening without good reason", "Think about what your opponent wants to do before making your move"],
    faq: [
      { question: "Can I play against the computer?", answer: "This version is designed for two players on the same device. Computer AI opponents may be added in a future update. For now, grab a friend and enjoy a classic game of chess!" },
      { question: "How old is chess?", answer: "Chess is about 1,500 years old. It originated in India around 600 AD as 'chaturanga,' spread to Persia as 'shatranj,' and reached Europe by the 10th century. The modern rules were finalized in Spain and Italy around 1475." },
      { question: "What is the longest possible chess game?", answer: "Under the 50-move rule (draw if no capture or pawn move in 50 moves), the longest theoretical game is 5,949 moves. In practice, the longest tournament game was 269 moves (Nikolić vs. Arsović, 1989)." }
    ]
  },
  {
    slug: "tic-tac-toe",
    title: "Tic Tac Toe",
    description: "The classic X and O game. Play against a smart computer opponent.",
    category: "Casual",
    color: "#fb923c",
    emoji: "❌",
    keywords: ["tic tac toe online", "play tic tac toe", "tic tac toe free", "noughts and crosses"],
    longDescription: "Tic Tac Toe dates back to ancient Egypt around 1300 BC. The Romans played a version called 'Terni Lapilli.' The modern 3×3 grid version has been mathematically solved — with perfect play from both sides, the game always ends in a draw. Despite this, it remains a beloved game for children and a classic introduction to game theory and AI programming.",
    howToPlay: {
      desktop: "Click any empty square to place your X. The computer automatically responds with O. Get three in a row (horizontally, vertically, or diagonally) to win. The computer plays smart — you'll need good strategy to beat it!",
      mobile: "Tap any empty square to place your mark. Same rules — three in a row wins. The AI opponent responds instantly after your move."
    },
    features: ["Play against a smart AI opponent", "Clean 3×3 grid interface", "Instant AI response", "Win/draw detection", "One-click new game restart"],
    tips: ["Always take the center square if it's available on your first move", "If the opponent takes the center, take a corner", "Create a 'fork' — a position where you have two ways to win", "Block your opponent's two-in-a-row before building your own", "Corner squares are more valuable than edge squares"],
    faq: [
      { question: "Can you always win at Tic Tac Toe?", answer: "No. With perfect play from both sides, Tic Tac Toe always ends in a draw. However, if your opponent makes a mistake, you can win. The first player (X) has a slight advantage with 131,184 possible winning games vs 77,904 for O." },
      { question: "Is Tic Tac Toe a solved game?", answer: "Yes, Tic Tac Toe is completely solved. Mathematicians have mapped every possible game state. With optimal play, neither player can force a win — the result is always a draw." },
      { question: "What is Tic Tac Toe called in other countries?", answer: "In the UK and Australia it's called 'Noughts and Crosses.' In Ireland it's 'Xs and Os.' Other names include 'Tic Tac Toe' (North America), 'Tres en Raya' (Spain), and 'Morpion' (France)." }
    ]
  },
  {
    slug: "memory-match",
    title: "Memory Match",
    description: "Flip cards and find matching pairs. Train your memory and concentration.",
    category: "Puzzle",
    color: "#2dd4bf",
    emoji: "🃏",
    keywords: ["memory game online", "memory match free", "card matching game", "concentration game"],
    longDescription: "Memory Match, also known as Concentration, has been played as a card game since at least the 16th century. The digital version became popular in the early days of personal computing. The game is widely used in education to help children develop memory skills and pattern recognition. It's also studied in cognitive science as a tool for understanding human memory.",
    howToPlay: {
      desktop: "Click on a face-down card to flip it over and reveal the emoji underneath. Then click a second card. If the two cards match, they stay face-up. If they don't match, both cards flip back face-down after a brief moment. Remember the positions and find all matching pairs to win. Try to complete the game in as few moves as possible.",
      mobile: "Tap cards to flip them. The mechanics are identical — find all matching pairs using your memory. The cards are sized for easy tapping on mobile screens."
    },
    features: ["16 cards with 8 matching pairs", "Emoji-based card faces", "Move counter to track efficiency", "Matched pairs stay revealed", "Win detection with move count"],
    tips: ["Start by flipping cards in a systematic pattern rather than randomly", "Pay close attention to cards that don't match — you'll need to remember them later", "Try to remember positions by creating a mental grid (top-left, middle-right, etc.)", "Focus on 2-3 unmatched cards at a time rather than trying to memorize everything", "If you find a card you've seen before, immediately go for its match"],
    faq: [
      { question: "Is Memory Match good for your brain?", answer: "Yes! Studies show that memory games improve working memory, concentration, and visual recognition skills. They're particularly beneficial for children's cognitive development and are used therapeutically for older adults to maintain mental sharpness." },
      { question: "What is a good score in Memory Match?", answer: "With 8 pairs (16 cards), completing the game in 12-15 moves is excellent (near-perfect memory). 16-20 moves is good, and under 25 is respectable. The theoretical minimum is 8 moves (finding every pair on the first try)." },
      { question: "What is this game also called?", answer: "Memory Match goes by many names: Concentration, Pelmanism, Shinkei-suijaku (in Japan), Pairs, and Memory. The gameplay is the same regardless of the name — flip cards and find matching pairs." }
    ]
  },
  {
    slug: "breakout",
    title: "Breakout",
    description: "Smash bricks with a bouncing ball and paddle in this arcade classic.",
    category: "Arcade",
    color: "#f97316",
    emoji: "🧱",
    keywords: ["breakout game online", "breakout unblocked", "play breakout free", "brick breaker game"],
    longDescription: "Breakout was designed by Steve Jobs and Steve Wozniak for Atari and released in 1976. The game was a direct evolution of Pong — instead of two paddles, one player controls a single paddle at the bottom of the screen, bouncing a ball upward to destroy rows of bricks. The story goes that Jobs was given four days to design the game and promised Wozniak half the bonus if he could reduce the chip count. Wozniak, working through the night, created a design using just 44 chips — a feat so elegant that Atari engineers initially didn't believe it was real. Breakout became one of Atari's best-selling arcade games and directly inspired Taito's Arkanoid in 1986, which added power-ups and became its own phenomenon. The core mechanic — a ball that bounces off surfaces and destroys targets — has influenced countless games across every genre. Today, Breakout-style games remain a staple of casual gaming, beloved for their satisfying physics and escalating tension as the ball speeds up. The game rewards both quick reflexes and spatial awareness. As bricks disappear, the ball's trajectory becomes harder to predict, and the paddle must cover more ground. Clearing the top rows first is a common strategy, but letting the ball get behind the brick wall for rapid destruction is the ultimate skill move. Whether you're a retro gaming enthusiast or discovering it for the first time, Breakout delivers pure arcade satisfaction that has stood the test of nearly five decades.",
    howToPlay: {
      desktop: "Move your mouse or use the Left/Right arrow keys to control the paddle at the bottom of the screen. The ball bounces automatically — your job is to keep it in play. Hit the ball into the brick wall to destroy bricks and score points. Don't let the ball fall past your paddle or you lose a life. Clear all bricks to advance.",
      mobile: "Drag your finger left and right to move the paddle. Keep the ball bouncing and destroy all the bricks. The ball speeds up as you progress, so stay focused and react quickly."
    },
    features: [
      "Classic brick-smashing arcade gameplay",
      "Ball physics that speed up as you progress",
      "Multiple rows of bricks with different point values",
      "Lives system for added tension",
      "Mouse and keyboard controls"
    ],
    tips: [
      "Aim for the edges of the brick wall to get the ball behind the bricks for chain destruction",
      "Keep your paddle centered when the ball is far away so you can react in either direction",
      "The ball speeds up over time — anticipate rather than react",
      "Top-row bricks are worth more points, so aim high when possible",
      "Watch the ball's angle off your paddle — hitting with the edge changes direction more sharply"
    ],
    faq: [
      { question: "Who created Breakout?", answer: "Breakout was designed by Steve Jobs and Steve Wozniak for Atari in 1976. Wozniak engineered the hardware in just four days, creating an unusually efficient design. The game was a major commercial success and directly influenced the entire brick-breaker genre." },
      { question: "What is the difference between Breakout and Arkanoid?", answer: "Arkanoid (1986) is a direct sequel concept to Breakout, adding power-ups, enemy ships, and multiple levels. Breakout is the pure original — just a ball, paddle, and bricks. Both are classics, but Breakout's simplicity is part of its timeless appeal." },
      { question: "How do I control the ball's direction?", answer: "The ball's angle depends on where it hits your paddle. Hitting with the center sends it straight up. Hitting with the left edge sends it left, and the right edge sends it right. Mastering this angle control is the key skill in Breakout." },
      { question: "Does the ball speed up?", answer: "Yes! The ball gradually speeds up as you play, increasing the challenge. This is a deliberate design choice from the original 1976 arcade game — it creates natural difficulty progression without changing the rules." }
    ]
  },
  {
    slug: "connect-four",
    title: "Connect Four",
    description: "Drop colored discs to connect four in a row before your opponent.",
    category: "Strategy",
    color: "#eab308",
    emoji: "🔴",
    keywords: ["connect four online", "connect 4 free", "play connect four", "connect four unblocked"],
    longDescription: "Connect Four was invented by Howard Wexler and Ned Strongin and first sold by Milton Bradley in 1974. The game's genius lies in its perfect balance: the rules take seconds to learn, but the strategy runs surprisingly deep. Players alternate dropping colored discs into a 7-column, 6-row vertical grid, and the first to align four discs horizontally, vertically, or diagonally wins. In 1988, mathematicians James Dow Allen and Victor Allis independently proved that Connect Four is a solved game — the first player can always force a win with perfect play. Despite being solved, the game remains enormously popular because human players rarely play perfectly, making every game a genuine contest. Connect Four has sold over 40 million copies worldwide and is a staple of family game nights, school classrooms, and competitive puzzle communities. The game teaches fundamental strategic concepts: controlling the center, creating multiple threats simultaneously, and blocking opponent setups before they become dangerous. The vertical drop mechanic adds a unique constraint not found in most grid games — you can't place a disc just anywhere, only at the top of each column's current stack. This creates fascinating tactical puzzles where the order of moves matters as much as their positions. Whether you're playing casually or studying the game's deep theory, Connect Four offers a uniquely satisfying blend of accessibility and strategic depth.",
    howToPlay: {
      desktop: "Click on any column to drop your disc to the lowest available row in that column. You play as Red, and the computer plays as Yellow. The first player to connect four discs in a row — horizontally, vertically, or diagonally — wins. If the board fills up with no winner, the game is a draw.",
      mobile: "Tap a column to drop your disc. The disc falls to the bottom of that column. Connect four of your discs in any direction to win. Think ahead — the AI will try to block your threats and create its own."
    },
    features: [
      "Classic 7×6 grid with gravity-based disc dropping",
      "Play against an AI opponent",
      "Win detection for all four directions",
      "Color-coded discs for easy tracking",
      "Instant new game restart"
    ],
    tips: [
      "Control the center column — it's part of more winning lines than any other column",
      "Create 'double threats' — two ways to win simultaneously so the opponent can't block both",
      "Watch for diagonal threats, which are easier to miss than horizontal or vertical ones",
      "Don't just react to your opponent — build your own winning setup while blocking",
      "Avoid filling columns too early — you may need them later for a winning move"
    ],
    faq: [
      { question: "Is Connect Four a solved game?", answer: "Yes. In 1988, mathematicians proved that the first player can always force a win with perfect play, starting with the center column. However, since most players don't play perfectly, the game remains competitive and fun at all skill levels." },
      { question: "Who invented Connect Four?", answer: "Connect Four was invented by Howard Wexler and Ned Strongin. Milton Bradley (now Hasbro) first published it in 1974. It has since sold over 40 million copies and remains one of the best-selling strategy games ever made." },
      { question: "What is the best first move in Connect Four?", answer: "The center column (column 4 of 7) is the strongest opening move. It participates in more potential winning lines than any other column. Mathematically, starting in the center is the only first move that guarantees a win with perfect subsequent play." },
      { question: "Can the game end in a draw?", answer: "Yes, if all 42 squares are filled without either player connecting four, the game is a draw. This is rare in practice but can happen, especially when both players play defensively." }
    ]
  },
  {
    slug: "wordle",
    title: "Wordle",
    description: "Guess the hidden 5-letter word in 6 tries. Color clues guide each guess.",
    category: "Puzzle",
    color: "#6aaa64",
    emoji: "🟩",
    keywords: ["wordle game online", "play wordle free", "wordle unblocked", "wordle puzzle"],
    longDescription: "Wordle was created by software engineer Josh Wardle as a gift for his partner, who loved word games. He released it publicly in October 2021, and by January 2022 it had grown from 90 daily players to over 300,000. The New York Times purchased Wordle in January 2022 for a price reported in the low seven figures. The game's viral spread was driven by its shareable emoji grid — players could post their results without spoiling the answer, creating a global daily ritual. Wordle's design is a masterclass in constraint-based game design. Six guesses, five letters, one word per day — these limitations create a shared experience that connects millions of players worldwide. The color feedback system (green for correct position, yellow for wrong position, gray for not in word) is intuitive yet strategically rich. Choosing the right starting word is itself a subject of intense debate among players, with CRANE, SLATE, AUDIO, and RAISE among the most popular choices based on letter frequency analysis. The game has spawned hundreds of variants: Quordle (four words at once), Wordle Unlimited (play anytime), Nerdle (math equations), Heardle (music), and many more. But the original remains the gold standard — a perfectly balanced daily puzzle that takes about three minutes to play and generates conversation worldwide. Whether you're a casual player or a dedicated optimizer tracking your win streaks, Wordle offers a uniquely satisfying daily mental workout.",
    howToPlay: {
      desktop: "Type a 5-letter word and press Enter to submit your guess. Green tiles mean the letter is correct and in the right position. Yellow tiles mean the letter is in the word but in the wrong position. Gray tiles mean the letter is not in the word at all. Use these clues to narrow down the answer in 6 guesses.",
      mobile: "Use the on-screen keyboard to type your 5-letter guess and tap Enter. The color feedback works the same way — green is correct position, yellow is wrong position, gray is not in the word. You have 6 attempts to find the hidden word."
    },
    features: [
      "Classic 5-letter word guessing with 6 attempts",
      "Color-coded feedback: green, yellow, and gray tiles",
      "On-screen keyboard with letter state tracking",
      "New puzzle available every session",
      "Hard mode option for extra challenge"
    ],
    tips: [
      "Start with a word that covers common letters: CRANE, SLATE, or AUDIO are popular choices",
      "Use your second guess to test entirely new letters, not just rearrange yellows",
      "Pay attention to gray letters — they eliminate many possibilities at once",
      "Yellow letters must appear in a different position in your next guess",
      "If you have multiple yellows, try to place them all in new positions simultaneously"
    ],
    faq: [
      { question: "Who created Wordle?", answer: "Wordle was created by Josh Wardle, a software engineer, as a gift for his word-game-loving partner. He released it publicly in October 2021. By January 2022, it had over 300,000 daily players, and the New York Times purchased it for a reported seven-figure sum." },
      { question: "What is the best starting word for Wordle?", answer: "There's no single 'best' word, but high-frequency letter coverage is key. Popular choices include CRANE, SLATE, RAISE, and AUDIO. These words cover common vowels and consonants, giving you maximum information from your first guess." },
      { question: "What do the colors mean in Wordle?", answer: "Green means the letter is correct and in the right position. Yellow means the letter is in the word but in the wrong position. Gray means the letter does not appear in the word at all. Use these clues together to deduce the answer." },
      { question: "How many possible Wordle answers are there?", answer: "The original New York Times Wordle uses a curated list of about 2,309 common 5-letter words as answers, chosen to avoid obscure vocabulary. The full list of valid guesses is much larger — around 10,000+ words." }
    ]
  },
  {
    slug: "solitaire",
    title: "Solitaire",
    description: "The classic Klondike card game. Sort all cards to the foundation piles.",
    category: "Card",
    color: "#22c55e",
    emoji: "🃏",
    keywords: ["solitaire online free", "play solitaire", "klondike solitaire", "solitaire unblocked"],
    longDescription: "Klondike Solitaire is the most played card game in history, largely because Microsoft included it with Windows 3.0 in 1990. Designed by Wes Cherry (who received no royalties), the Windows version was originally intended to teach users how to use a mouse — dragging and dropping cards was perfect practice. It became so popular that businesses reportedly lost billions of dollars in productivity to employees playing it during work hours. The game's origins predate computers by over a century. Klondike-style solitaire games were documented in 19th-century Europe, with the name possibly referring to the Klondike Gold Rush region of Canada. The goal is to move all 52 cards to four foundation piles, sorted by suit from Ace to King. The tableau — seven columns of cards with only the top card face-up — creates the puzzle. You must uncover buried cards by building descending sequences of alternating colors, revealing new options with each move. Solitaire is deceptively strategic. While luck determines the initial layout, skilled players win significantly more often than beginners by planning sequences, managing the stock pile efficiently, and recognizing when a game is unwinnable early. Studies suggest that roughly 79% of Klondike deals are theoretically winnable, but human players typically win only 43% of games. The gap between those numbers represents the game's strategic depth — there's always more to learn about optimal play.",
    howToPlay: {
      desktop: "Click and drag cards to move them. Build descending sequences of alternating colors (red on black, black on red) in the tableau columns. Click the stock pile (top-left) to draw new cards. Move Aces to the foundation piles (top-right) and build each suit from Ace to King. Only Kings can be placed in empty columns.",
      mobile: "Tap a card to select it, then tap the destination to move it. Tap the stock pile to draw cards. Build alternating-color sequences in the tableau and move cards to the foundation piles by suit. Complete all four foundation piles to win."
    },
    features: [
      "Classic Klondike Solitaire with standard 52-card deck",
      "Drag-and-drop card movement",
      "Auto-move to foundation when possible",
      "Stock pile with draw-one or draw-three options",
      "Undo button for correcting mistakes"
    ],
    tips: [
      "Always move Aces and Twos to the foundation immediately",
      "Expose face-down cards as quickly as possible — they're your hidden options",
      "Don't empty a column unless you have a King ready to place there",
      "Prioritize moves that reveal face-down cards over moves that don't",
      "When drawing from the stock, plan several moves ahead before committing"
    ],
    faq: [
      { question: "What percentage of Solitaire games are winnable?", answer: "About 79% of Klondike Solitaire deals are theoretically winnable with perfect play. However, human players typically win around 43% of games. The gap reflects the game's strategic depth — knowing which moves to make requires significant skill and planning." },
      { question: "Who created the Windows Solitaire game?", answer: "Windows Solitaire was programmed by Wes Cherry, an intern at Microsoft, in 1989. It shipped with Windows 3.0 in 1990. Cherry received no royalties despite the game becoming one of the most-played computer games in history." },
      { question: "What is the difference between draw-one and draw-three?", answer: "Draw-one reveals one card at a time from the stock pile, making the game easier. Draw-three reveals three cards but only the top one is playable, making it harder. Draw-three is the traditional Klondike rule and is considered the standard difficulty." },
      { question: "Can I always win Solitaire?", answer: "No. Some deals are mathematically unwinnable regardless of strategy. If you've gone through the stock pile multiple times without progress, the game may be stuck. Recognizing unwinnable positions early saves time and lets you start a fresh deal." }
    ]
  },
  {
    slug: "checkers",
    title: "Checkers",
    description: "Capture all opponent pieces by jumping over them in this classic board game.",
    category: "Strategy",
    color: "#ef4444",
    emoji: "🔴",
    keywords: ["checkers online free", "play checkers", "draughts game", "checkers unblocked"],
    longDescription: "Checkers, known as Draughts outside North America, is one of the oldest board games still played today. Its origins trace back to around 1400 AD in southern France, evolving from an earlier game called Alquerque. The modern 8×8 board version was standardized in the 16th century. In 2007, computer scientists at the University of Alberta announced that checkers had been solved — their program Chinook proved that perfect play from both sides always results in a draw. This made checkers the most complex game ever solved at the time. Despite being solved, checkers remains a beloved game worldwide. The World Checkers/Draughts Federation governs international competition, and the game is played in over 100 countries. American checkers (the most common variant) uses an 8×8 board with 12 pieces per side. Pieces move diagonally forward and must jump over opponent pieces to capture them. When a piece reaches the opposite end of the board, it becomes a King and can move both forward and backward. The game rewards long-term planning, sacrifice tactics, and positional awareness. A key concept is the 'tempo' — controlling the pace of exchanges to force your opponent into unfavorable positions. Checkers also teaches the value of piece activity: a passive piece that can't move is nearly worthless, while an active piece that threatens multiple captures controls the game. Whether you're learning strategy games for the first time or sharpening your tactical thinking, checkers offers a perfect blend of simplicity and depth.",
    howToPlay: {
      desktop: "Click a piece to select it, then click a highlighted square to move. Pieces move diagonally forward one square. If you can jump over an opponent's piece, you must take that capture. Multiple jumps in one turn are allowed and required if available. Reach the opposite end to become a King, which can move both forward and backward.",
      mobile: "Tap a piece to select it, then tap a valid square to move. Mandatory captures apply — if a jump is available, you must take it. Chain multiple jumps in a single turn when possible. Kings are marked and can move in all diagonal directions."
    },
    features: [
      "Classic 8×8 checkers board",
      "Mandatory capture rule enforced",
      "King promotion when reaching the back row",
      "Multi-jump chains in a single turn",
      "Two-player local multiplayer"
    ],
    tips: [
      "Control the center of the board — central pieces have more mobility and attack options",
      "Keep your back row intact as long as possible to prevent opponent Kings",
      "Trade pieces when you have a positional advantage — fewer pieces means your advantage grows",
      "Create 'bridges' — pairs of pieces that protect each other diagonally",
      "Force your opponent into positions where they must make unfavorable captures"
    ],
    faq: [
      { question: "Is checkers a solved game?", answer: "Yes. In 2007, researchers at the University of Alberta solved checkers using their program Chinook. With perfect play from both sides, the game always ends in a draw. This makes checkers the most complex game ever fully solved by a computer." },
      { question: "What is the difference between checkers and draughts?", answer: "They are the same game with different names. 'Checkers' is used in North America, while 'Draughts' is the term in the UK, Ireland, and many other countries. The rules are identical in the standard 8×8 version." },
      { question: "Do you have to jump in checkers?", answer: "Yes, in standard checkers rules, capturing is mandatory. If you have a jump available, you must take it. If multiple jumps are available, you can choose which one to take, but you cannot skip a capture to make a non-capturing move." },
      { question: "How does a piece become a King?", answer: "When one of your pieces reaches the farthest row from your starting side (the opponent's back row), it is crowned a King. Kings can move diagonally in all four directions, making them significantly more powerful than regular pieces." }
    ]
  },
  {
    slug: "magic-tower",
    title: "Magic Tower",
    description: "Navigate a 28-floor dungeon tower, defeat monsters, collect keys and treasures to rescue the princess.",
    category: "Classic",
    color: "#8b5cf6",
    emoji: "🏰",
    keywords: ["magic tower online", "magic tower game", "magic tower h5", "魔塔", "dungeon crawler", "rpg browser game", "magic tower free", "tower of the sorcerer"],
    longDescription: "Magic Tower (魔塔) is a legendary dungeon-crawling puzzle RPG that originated in the early 2000s. Players control a brave warrior ascending a 28-floor tower filled with monsters, locked doors, hidden treasures, and powerful bosses. Every step matters — you must carefully manage your HP, attack, defense, and keys to survive. The game combines strategic resource management with classic RPG combat, creating a deeply satisfying experience that has captivated millions of players across Asia and beyond.",
    howToPlay: {
      desktop: "Use WASD or Arrow Keys to move your hero through the tower. Walk into monsters to fight them (damage is calculated automatically based on stats). Collect yellow, blue, and red keys to open matching doors. Pick up gems to boost attack (red) or defense (blue), and potions to restore HP. Plan your route carefully — the order you fight monsters and collect items determines whether you can survive.",
      mobile: "Tap or swipe in the direction you want to move. The combat and item systems work the same as desktop. Think before each move — resources are limited and every decision counts."
    },
    features: [
      "28 unique dungeon floors with increasing difficulty",
      "Strategic combat — plan which monsters to fight and which to avoid",
      "Three types of keys (yellow, blue, red) for different locked doors",
      "Stat-boosting gems, potions, and special items",
      "Save and load system to track your progress",
      "Classic pixel art style faithful to the original"
    ],
    tips: [
      "Always calculate if you can survive a fight before engaging — check the monster's stats",
      "Yellow keys are common, blue keys are rare, red keys are precious — use them wisely",
      "Pick up all gems and potions on a floor before moving to the next",
      "Some monsters are best avoided early and defeated later when you're stronger",
      "Save frequently — one wrong move can make the game unwinnable",
      "The order you clear floors matters — sometimes going up first gives you better stats for lower floors"
    ],
    faq: [
      { question: "What is Magic Tower?", answer: "Magic Tower (魔塔) is a classic dungeon-crawling puzzle RPG where you ascend a 28-floor tower, fighting monsters, collecting keys, and managing resources to rescue a princess. It originated in the early 2000s and became one of the most popular browser games in Asia." },
      { question: "How does combat work in Magic Tower?", answer: "Combat is automatic and stat-based. When you walk into a monster, damage is calculated based on your attack, defense, and the monster's stats. If your attack exceeds the monster's defense, you deal damage each round, and vice versa. The fight continues until one side's HP reaches zero." },
      { question: "Can I play Magic Tower on mobile?", answer: "Yes! This HTML5 version works on all modern mobile browsers. Use touch controls to navigate your hero through the tower." },
      { question: "Is it possible to get stuck in Magic Tower?", answer: "Yes, it's possible to reach an unwinnable state if you use keys or fight monsters in the wrong order. This is why saving frequently is important. Strategic planning is the key to completing all 28 floors." }
    ]
  },
  {
    slug: "sand-tetris",
    title: "Sand Tetris",
    description: "A physics-based Tetris variant where blocks dissolve into sand particles that pile up naturally.",
    category: "Puzzle",
    color: "#c07830",
    emoji: "⏳",
    keywords: ["sand tetris", "physics tetris", "sand game online", "tetris with sand", "play sand tetris free"],
    longDescription: "Sand Tetris reimagines the classic Tetris formula with a stunning physics twist: when a piece lands, it doesn't lock in place — it dissolves into hundreds of individual sand particles that tumble, slide, and pile up according to real gravity rules. Each particle seeks the lowest available position, creating organic, ever-shifting sand dunes instead of rigid blocks. Lines clear when a row reaches 85% density, and the sand above cascades down to fill the gaps. It's hypnotic, unpredictable, and endlessly satisfying.",
    howToPlay: {
      desktop: "Use Left/Right arrow keys to move the falling piece, Up arrow or Z to rotate, Down arrow to soft drop, and Space to hard drop instantly. The piece will dissolve into sand particles on landing. Clear rows by filling them to 85% density — sand doesn't pack perfectly, so gaps are normal. Plan ahead as sand piles can shift unexpectedly.",
      mobile: "Swipe left/right to move the piece, swipe up to rotate, swipe down to hard drop, or tap the piece to rotate. Use the on-screen buttons below the game for precise control. The touch controls are optimized for one-handed play."
    },
    features: [
      "Real-time sand particle physics — each grain falls and slides independently",
      "90% density line-clear rule creates organic, forgiving gameplay",
      "7 classic Tetromino shapes, each with a unique sand color",
      "Ghost piece preview shows where your piece will land",
      "Progressive difficulty — sand becomes more active at higher levels",
      "Combo scoring: chain clears for up to 3× multiplier",
      "60fps smooth simulation with up to 8,000 sand particles"
    ],
    tips: [
      "Sand spreads sideways — leave small gaps and let physics fill them naturally",
      "Hard drop (Space) is your best friend for precise placement before sand shifts",
      "I-pieces create wide flat layers that are easiest to clear",
      "Watch the sides — sand can pile up in corners faster than the center",
      "At higher levels, sand moves faster between drops — plan 2 pieces ahead",
      "A near-full row will clear even with small gaps, so don't wait for perfection"
    ],
    faq: [
      { question: "Why don't lines clear when they look full?", answer: "Sand Tetris uses a 90% density threshold, not 100%. A row clears when at least 90% of its cells contain sand. If a row looks almost full but hasn't cleared, a few more particles need to settle into it. Sand naturally leaves tiny gaps, which is why the threshold is 90% instead of 100%." },
      { question: "What happens to sand after a line clears?", answer: "When a row clears, all sand in that row disappears and the sand above it becomes subject to gravity again. It cascades down to fill the empty space, often triggering chain reactions that clear additional rows. This settling phase is part of the strategy." },
      { question: "How is Sand Tetris different from regular Tetris?", answer: "In regular Tetris, pieces lock in place as rigid blocks. In Sand Tetris, pieces dissolve into individual sand particles on landing. These particles obey physics — they fall straight down if possible, or slide diagonally if blocked. This creates organic, unpredictable pile shapes that make every game unique." },
      { question: "Can I play Sand Tetris on mobile?", answer: "Yes! Sand Tetris is fully optimized for mobile. Swipe to move and rotate pieces, or use the on-screen control buttons. The canvas automatically scales to fit your screen size." }
    ]
  },
];

export const categories = [
  { slug: "puzzle", name: "Puzzle", description: "Challenge your mind with brain-teasing puzzle games. From number puzzles to pattern matching, these games test your logic, strategy, and problem-solving skills." },
  { slug: "classic", name: "Classic", description: "Relive the golden age of gaming with timeless classics. These iconic games have entertained millions for decades and remain just as fun today." },
  { slug: "casual", name: "Casual", description: "Pick up and play in seconds. These easy-to-learn games are perfect for quick breaks, waiting rooms, or whenever you need a fun distraction." },
  { slug: "board", name: "Board", description: "Digital versions of beloved board games. Play against friends or AI opponents without needing a physical board." },
  { slug: "arcade", name: "Arcade", description: "Fast-paced action games inspired by the golden age of arcades. Test your reflexes and aim for the high score." },
  { slug: "strategy", name: "Strategy", description: "Outthink your opponent with careful planning and tactical moves. These games reward patience, foresight, and strategic thinking." },
  { slug: "card", name: "Card", description: "Classic card games brought to your browser. From solitaire to multiplayer favorites, shuffle up and play." },
];

export function getGame(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug);
}

export function getGamesByCategory(cat: string): Game[] {
  return games.filter((g) => g.category.toLowerCase() === cat.toLowerCase());
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getRelatedGames(slug: string, limit = 5): Game[] {
  const game = getGame(slug);
  if (!game) return [];
  const same = games.filter((g) => g.slug !== slug && g.category === game.category);
  const others = games.filter((g) => g.slug !== slug && g.category !== game.category);
  return [...same, ...others].slice(0, limit);
}
