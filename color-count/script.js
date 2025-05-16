// Game constants
const BOARD_WIDTH = 8;
const BOARD_HEIGHT = 12;
const CELL_SIZE = 30;
const COLORS = [
    "#FF5252", // Red
    "#FFD740", // Yellow
    "#69F0AE", // Green
    "#40C4FF", // Blue
    "#E040FB", // Purple
    "#FF6E40", // Orange
];

// Game variables
let board = Array(BOARD_HEIGHT)
    .fill()
    .map(() => Array(BOARD_WIDTH).fill(null));
let currentPiece = null;
let nextPieceColors = null; // Will store two colors
let score = 0;
let gameInterval = null;
let isPaused = false;
let isGameOver = false;

// DOM Elements
const canvas = document.getElementById("game-board");
const startButton = document.getElementById("start-button");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const finalScoreElement = document.getElementById("final-score");
const bestScoreElement = document.getElementById("best-score");
const restartButton = document.getElementById("restart-button");
const gameOverElem = document.getElementById("game-over");
const gameContainerElement = document.querySelector(".game-container");

function formatNumberWithCommas(number) {
    return number.toLocaleString('en-US');
}

// Initialize game
function initGame() {
    // Reset game state
    board = Array(BOARD_HEIGHT)
        .fill()
        .map(() => Array(BOARD_WIDTH).fill(null));
    score = 0;
    scoreDisplay.textContent = score;
    isGameOver = false;
    gameOverElem.style.display = "none";
    gameContainerElement.classList.remove("half-opacity");

    // Create first piece
    createNewPiece();

    // Clear any existing interval
    if (gameInterval) clearInterval(gameInterval);

    // Start game loop
    gameInterval = setInterval(gameLoop, 500);
}

// Game loop
function gameLoop() {
    if (isPaused || isGameOver) return;

    if (!moveDown()) {
        placePiece();
        removeMatches();
        createNewPiece();

        // Check if game is over (new piece can't be placed)
        if (
            currentPiece &&
            (checkCollision(currentPiece.x, currentPiece.y) ||
                checkCollision(currentPiece.x, currentPiece.y + 1))
        ) {
            gameOver();
        }
    }

    drawGame();
}

// Create a new piece
function createNewPiece() {
    // If next piece colors are not set (first time), generate randomly
    if (nextPieceColors === null) {
        // Generate two different colors
        let color1 = Math.floor(Math.random() * COLORS.length);
        let color2;
        do {
            color2 = Math.floor(Math.random() * COLORS.length);
        } while (color2 === color1); // Ensure colors are different

        nextPieceColors = [color1, color2];
    }

    currentPiece = {
        x: Math.floor(BOARD_WIDTH / 2),
        y: 0,
        colors: [...nextPieceColors], // Top and bottom colors
    };

    // Check if the piece can be placed (game over check)
    if (
        checkCollision(currentPiece.x, currentPiece.y) ||
        checkCollision(currentPiece.x, currentPiece.y + 1)
    ) {
        gameOver();
        return;
    }

    // Generate next piece colors (different from each other)
    let color1 = Math.floor(Math.random() * COLORS.length);
    let color2;
    do {
        color2 = Math.floor(Math.random() * COLORS.length);
    } while (color2 === color1);
    nextPieceColors = [color1, color2];
}

// Check if a position would cause a collision
function checkCollision(x, y) {
    // Out of bounds check
    if (x < 0 || x >= BOARD_WIDTH || y >= BOARD_HEIGHT) {
        return true;
    }

    // Check if position is already occupied
    if (y >= 0 && board[y][x] !== null) {
        return true;
    }

    return false;
}

// Move piece down
function moveDown() {
    if (checkCollision(currentPiece.x, currentPiece.y + 2)) {
        return false;
    }

    currentPiece.y += 1;
    return true;
}

// Move piece left
function moveLeft() {
    if (
        checkCollision(currentPiece.x - 1, currentPiece.y) ||
        checkCollision(currentPiece.x - 1, currentPiece.y + 1)
    ) {
        return false;
    }

    currentPiece.x -= 1;
    drawGame();
    return true;
}

// Move piece right
function moveRight() {
    if (
        checkCollision(currentPiece.x + 1, currentPiece.y) ||
        checkCollision(currentPiece.x + 1, currentPiece.y + 1)
    ) {
        return false;
    }

    currentPiece.x += 1;
    drawGame();
    return true;
}

// Place the current piece on the board
function placePiece() {
    board[currentPiece.y][currentPiece.x] = currentPiece.colors[0]; // Top block
    board[currentPiece.y + 1][currentPiece.x] = currentPiece.colors[1]; // Bottom block
}

// Find and remove matches
function removeMatches() {
    // Check both cells of the 1x2 piece
    const positions = [
        [currentPiece.y, currentPiece.x, currentPiece.colors[0]],
        [currentPiece.y + 1, currentPiece.x, currentPiece.colors[1]],
    ];

    let totalMatchedCells = new Set();

    for (const [y, x, color] of positions) {
        // Cells to check for matches (including itself)
        const cellsToCheck = [[y, x]];
        const matchedCells = new Set();

        // Use BFS to find all connected cells of the same color
        while (cellsToCheck.length > 0) {
            const [cy, cx] = cellsToCheck.shift();
            const cellKey = `${cy},${cx}`;

            // Skip if already processed or out of bounds
            if (
                matchedCells.has(cellKey) ||
                cy < 0 ||
                cy >= BOARD_HEIGHT ||
                cx < 0 ||
                cx >= BOARD_WIDTH
            ) {
                continue;
            }

            // Check if this cell matches the color
            if (board[cy][cx] === color) {
                matchedCells.add(cellKey);

                // Add adjacent cells to check
                cellsToCheck.push([cy + 1, cx]); // Down
                cellsToCheck.push([cy - 1, cx]); // Up
                cellsToCheck.push([cy, cx + 1]); // Right
                cellsToCheck.push([cy, cx - 1]); // Left
            }
        }

        // Add matched cells to total set
        if (matchedCells.size > 1) {
            matchedCells.forEach((cell) => totalMatchedCells.add(cell));
        }
    }

    // Remove all matched cells
    if (totalMatchedCells.size > 0) {
        totalMatchedCells.forEach((cell) => {
            const [cy, cx] = cell.split(",").map(Number);
            board[cy][cx] = null;
        });

        // Update score based on matches
        const matchScore = totalMatchedCells.size * 10;
        score += matchScore;
        scoreDisplay.textContent = formatNumberWithCommas(score);

        // Apply gravity to make cells fall
        applyGravity();
    }
}

// Apply gravity to make cells fall after removals
// TODO: not working as expected
function applyGravity() {
    for (let x = 0; x < BOARD_WIDTH; x++) {
        // Start from bottom and move up
        let emptySpace = null;

        for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
            if (board[y][x] === null && emptySpace === null) {
                emptySpace = y;
            } else if (board[y][x] !== null && emptySpace !== null) {
                // Move this cell down to the empty space
                board[emptySpace][x] = board[y][x];
                board[y][x] = null;

                // Find the next empty space above this one
                y++; // Recheck this row
                emptySpace = null;
            }
        }
    }
}

// Draw the game state
function drawGame() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the grid
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;

    // Draw horizontal grid lines
    for (let y = 0; y <= BOARD_HEIGHT; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * CELL_SIZE);
        ctx.lineTo(BOARD_WIDTH * CELL_SIZE, y * CELL_SIZE);
        ctx.stroke();
    }

    // Draw vertical grid lines
    for (let x = 0; x <= BOARD_WIDTH; x++) {
        ctx.beginPath();
        ctx.moveTo(x * CELL_SIZE, 0);
        ctx.lineTo(x * CELL_SIZE, BOARD_HEIGHT * CELL_SIZE);
        ctx.stroke();
    }

    // Draw the board
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            if (board[y][x] !== null) {
                ctx.fillStyle = COLORS[board[y][x]];
                ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

                // Add a cell border
                ctx.strokeStyle = "#333";
                ctx.strokeRect(
                    x * CELL_SIZE,
                    y * CELL_SIZE,
                    CELL_SIZE,
                    CELL_SIZE
                );
            }
        }
    }

    // Draw current piece (vertical 1x2)
    if (currentPiece) {
        // Draw top block
        ctx.fillStyle = COLORS[currentPiece.colors[0]];
        ctx.fillRect(
            currentPiece.x * CELL_SIZE,
            currentPiece.y * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE
        );

        // Draw bottom block
        ctx.fillStyle = COLORS[currentPiece.colors[1]];
        ctx.fillRect(
            currentPiece.x * CELL_SIZE,
            (currentPiece.y + 1) * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE
        );

        // Add cell borders
        ctx.strokeStyle = "#333";
        ctx.strokeRect(
            currentPiece.x * CELL_SIZE,
            currentPiece.y * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE
        );
        ctx.strokeRect(
            currentPiece.x * CELL_SIZE,
            (currentPiece.y + 1) * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE
        );
    }
}

// Game over
function gameOver() {
    isGameOver = true;
    clearInterval(gameInterval);
    gameContainerElement.classList.add("half-opacity");
    gameOverElem.style.display = "block";
    const bestScore = Math.max(score, parseInt(localStorage.getItem("bestScore") || 0))
    localStorage.setItem("bestScore", bestScore);
    finalScoreElement.textContent = formatNumberWithCommas(score);
    bestScoreElement.textContent = formatNumberWithCommas(bestScore)
}

// Handle keyboard input
document.addEventListener("keydown", (e) => {
    if (isPaused || isGameOver) return;

    switch (e.key) {
        case "ArrowLeft":
            moveLeft();
            break;
        case "ArrowRight":
            moveRight();
            break;
        // TODO: why is pressing p again not resuming?
        case "p":
        case "P":
            isPaused = !isPaused;
            break;
        case " ":
            while (moveDown()) { }
            placePiece();
            removeMatches();
            createNewPiece();

            if (
                currentPiece &&
                (checkCollision(currentPiece.x, currentPiece.y) ||
                    checkCollision(currentPiece.x, currentPiece.y + 1))
            ) {
                gameOver();
            }

            drawGame();
            break;
    }
});

// Button event listeners
restartButton.addEventListener("click", () => {
    isPaused = false;
    initGame();
});

// Start the game
startButton.addEventListener("click", () => {
    initGame();
    startButton.style.display = "none";
});