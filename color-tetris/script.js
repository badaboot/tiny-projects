// Game Constants
const BOARD_WIDTH = 8;
const BOARD_HEIGHT = 12;
const BLOCK_SIZE = 30;
const COLORS = [
    "#FF0000", // Red
    "#00FF00", // Green
    "#0000FF", // Blue
    "#FFFF00", // Yellow
    "#FF00FF", // Magenta
    "#00FFFF", // Cyan
];

// Game variables
let board = Array(BOARD_HEIGHT)
    .fill()
    .map(() => Array(BOARD_WIDTH).fill(0));
let score = 0;
let level = 1;
let lines = 0;
let gameOver = false;
let isPaused = false;
let dropInterval;
let currentPiece = null;
let nextPiece = null;

// DOM Elements
const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const gameOverElement = document.getElementById("game-over");
const finalScoreElement = document.getElementById("final-score");
const restartButton = document.getElementById("restart-button");

function formatNumberWithCommas(number) {
    return number.toLocaleString('en-US');
}

// Initialize the game
function init() {
    board = Array(BOARD_HEIGHT)
        .fill()
        .map(() => Array(BOARD_WIDTH).fill(0));
    score = 0;
    level = 1;
    lines = 0;
    gameOver = false;
    isPaused = false;

    // Update UI
    scoreElement.textContent = score;
    gameOverElement.style.display = "none";

    // Create first pieces
    createNewPiece();
    createNewPiece();

    // Start the game loop
    if (dropInterval) clearInterval(dropInterval);
    dropInterval = setInterval(moveDown, getDropSpeed());

    // Render the initial state
    render();
}

// Piece creation
function createNewPiece() {
    if (currentPiece === null) {
        currentPiece = generatePiece();
        nextPiece = generatePiece();
    } else {
        currentPiece = nextPiece;
        nextPiece = generatePiece();
    }

    // Check if game over
    if (isCollision()) {
        gameOver = true;
        clearInterval(dropInterval);
        gameOverElement.style.display = "block";
        finalScoreElement.textContent = formatNumberWithCommas(score);
    }
}
const getColorIndex = () => Math.floor(Math.random() * COLORS.length);
function generatePiece() {
    // Generate a piece with two 1x1 blocks stacked vertically
    const blocks = [];

    // Generate random colors for both blocks
    const colorIndex1 = getColorIndex();

    let colorIndex2 = getColorIndex()
    while (colorIndex2 === colorIndex1) {
        colorIndex2 = getColorIndex();
    }

    // Place the blocks in the center, stacked vertically
    blocks.push({
        x: Math.floor(BOARD_WIDTH / 2),
        y: 0,
        color: colorIndex1,
    });

    blocks.push({
        x: Math.floor(BOARD_WIDTH / 2),
        y: 1,
        color: colorIndex2,
    });

    return {
        blocks,
        rotation: 0,
    };
}

// Game logic
function moveDown() {
    if (gameOver || isPaused) return;

    // Make a copy of the current piece, move it down
    const movedPiece = JSON.parse(JSON.stringify(currentPiece));
    movedPiece.blocks.forEach((block) => block.y++);

    // Check if it collides
    if (checkCollision(movedPiece)) {
        // Place the piece on the board
        placePiece();
        // Check for matches and clear them
        checkMatches();
        // Create a new piece
        createNewPiece();
    } else {
        // Move the piece down
        currentPiece = movedPiece;
    }

    render();
}

function moveLeft() {
    if (gameOver || isPaused) return;

    const movedPiece = JSON.parse(JSON.stringify(currentPiece));
    movedPiece.blocks.forEach((block) => block.x--);

    if (!checkCollision(movedPiece)) {
        currentPiece = movedPiece;
        render();
    }
}

function moveRight() {
    if (gameOver || isPaused) return;

    const movedPiece = JSON.parse(JSON.stringify(currentPiece));
    movedPiece.blocks.forEach((block) => block.x++);

    if (!checkCollision(movedPiece)) {
        currentPiece = movedPiece;
        render();
    }
}

function rotate() {
    if (gameOver || isPaused) return;

    // Rotate the two blocks
    const rotatedPiece = JSON.parse(JSON.stringify(currentPiece));
    const center = rotatedPiece.blocks[0];

    // Only rotate the second block around the first
    if (rotatedPiece.blocks.length > 1) {
        const block = rotatedPiece.blocks[1];
        const dx = block.x - center.x;
        const dy = block.y - center.y;

        block.x = center.x - dy;
        block.y = center.y + dx;

        if (!checkCollision(rotatedPiece)) {
            currentPiece = rotatedPiece;
            render();
        }
    }
}

function drop() {
    if (gameOver || isPaused) return;

    let dropped = false;

    while (!dropped) {
        const movedPiece = JSON.parse(JSON.stringify(currentPiece));
        movedPiece.blocks.forEach((block) => block.y++);

        if (checkCollision(movedPiece)) {
            placePiece();
            checkMatches();
            createNewPiece();
            dropped = true;
        } else {
            currentPiece = movedPiece;
        }
    }

    render();
}

function placePiece() {
    currentPiece.blocks.forEach((block) => {
        if (
            block.y >= 0 &&
            block.y < BOARD_HEIGHT &&
            block.x >= 0 &&
            block.x < BOARD_WIDTH
        ) {
            board[block.y][block.x] = block.color + 1; // Store color index + 1 (0 is empty)
        }
    });
}

function checkMatches() {
    // Find connected blocks of the same color
    let blocksRemoved = 0;
    let visited = Array(BOARD_HEIGHT)
        .fill()
        .map(() => Array(BOARD_WIDTH).fill(false));

    for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            // Skip if already visited or empty
            if (visited[y][x] || board[y][x] === 0) continue;

            // Find all connected blocks of the same color
            const colorIndex = board[y][x];
            const connectedBlocks = [];

            // DFS to find connected blocks
            const dfs = (x, y, colorIndex) => {
                // Check boundaries and if already visited
                if (
                    x < 0 ||
                    x >= BOARD_WIDTH ||
                    y < 0 ||
                    y >= BOARD_HEIGHT ||
                    visited[y][x] ||
                    board[y][x] !== colorIndex
                ) {
                    return;
                }

                visited[y][x] = true;
                connectedBlocks.push({ x, y });

                // Check adjacent blocks (horizontal and vertical only)
                dfs(x + 1, y, colorIndex); // right
                dfs(x - 1, y, colorIndex); // left
                dfs(x, y + 1, colorIndex); // down
                dfs(x, y - 1, colorIndex); // up
            };

            dfs(x, y, colorIndex);

            // Apply rules if we found connected blocks
            if (connectedBlocks.length > 1) {
                // If even number of blocks with this color
                if (connectedBlocks.length % 2 === 0) {
                    // Remove all blocks of this color
                    connectedBlocks.forEach((block) => {
                        board[block.y][block.x] = 0;
                        blocksRemoved++;
                    });
                } else {
                    // If odd number of blocks, remove all but one
                    for (let i = 0; i < connectedBlocks.length - 1; i++) {
                        board[connectedBlocks[i].y][connectedBlocks[i].x] = 0;
                        blocksRemoved++;
                    }
                }
            }
        }
    }

    // Update score
    if (blocksRemoved > 0) {
        score += blocksRemoved * level * 10;
        scoreElement.textContent = score;

        // Check if we need to move blocks down
        collapseEmptySpaces();
    }
}

function collapseEmptySpaces() {
    let linesCleared = 0;

    // Collapse each column independently
    for (let x = 0; x < BOARD_WIDTH; x++) {
        // Count empty spaces and move blocks down
        let emptySpaces = 0;

        for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
            if (board[y][x] === 0) {
                emptySpaces++;
            } else if (emptySpaces > 0) {
                // Move block down by emptySpaces
                board[y + emptySpaces][x] = board[y][x];
                board[y][x] = 0;
            }
        }
    }

    // Check for completely cleared lines
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
        let lineComplete = true;
        for (let x = 0; x < BOARD_WIDTH; x++) {
            if (board[y][x] !== 0) {
                lineComplete = false;
                break;
            }
        }

        if (lineComplete) {
            linesCleared++;
        }
    }

    if (linesCleared > 0) {
        lines += linesCleared;

        // Level up every 10 lines
        // TODO: consider removing this
        const newLevel = Math.floor(lines / 10) + 1;
        if (newLevel > level) {
            level = newLevel;

            // Update drop speed
            clearInterval(dropInterval);
            dropInterval = setInterval(moveDown, getDropSpeed());
        }
    }
}

// Helper functions
function checkCollision(piece) {
    return piece.blocks.some((block) => {
        // Check boundaries
        if (
            block.x < 0 ||
            block.x >= BOARD_WIDTH ||
            block.y >= BOARD_HEIGHT
        ) {
            return true;
        }

        // Check if space is occupied
        if (block.y >= 0 && board[block.y][block.x] !== 0) {
            return true;
        }

        return false;
    });
}

function isCollision() {
    return checkCollision(currentPiece);
}

function getDropSpeed() {
    return 500
}

// Rendering functions
function render() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the board
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            const colorIndex = board[y][x];
            if (colorIndex > 0) {
                drawBlock(ctx, x, y, COLORS[colorIndex - 1]);
            }
        }
    }

    // Draw the current piece
    if (currentPiece) {
        currentPiece.blocks.forEach((block) => {
            if (block.y >= 0) {
                drawBlock(ctx, block.x, block.y, COLORS[block.color]);
            }
        });
    }

    // Draw grid lines
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 0.5;

    for (let x = 0; x <= BOARD_WIDTH; x++) {
        ctx.beginPath();
        ctx.moveTo(x * BLOCK_SIZE, 0);
        ctx.lineTo(x * BLOCK_SIZE, BOARD_HEIGHT * BLOCK_SIZE);
        ctx.stroke();
    }

    for (let y = 0; y <= BOARD_HEIGHT; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * BLOCK_SIZE);
        ctx.lineTo(BOARD_WIDTH * BLOCK_SIZE, y * BLOCK_SIZE);
        ctx.stroke();
    }
}
function drawBlock(context, x, y, color, size = BLOCK_SIZE) {
    context.fillStyle = color;
    context.fillRect(x * size, y * size, size, size);

    // Add 3D effect
    context.fillStyle = "rgba(255, 255, 255, 0.3)";
    context.fillRect(x * size, y * size, size, size / 5);
    context.fillRect(x * size, y * size, size / 5, size);

    context.fillStyle = "rgba(0, 0, 0, 0.3)";
    context.fillRect(x * size, y * size + size - size / 5, size, size / 5);
    context.fillRect(x * size + size - size / 5, y * size, size / 5, size);

    // Add border
    context.strokeStyle = "#000";
    context.lineWidth = 1;
    context.strokeRect(x * size, y * size, size, size);
}

// Event listeners
document.addEventListener("keydown", (e) => {
    if (gameOver) return;

    switch (e.key) {
        case "ArrowLeft":
            moveLeft();
            break;
        case "ArrowRight":
            moveRight();
            break;
        case "ArrowDown":
            moveDown();
            break;
        case "ArrowUp":
            rotate();
            break;
        case " ":
            e.preventDefault();
            drop();
            break;
        case "p":
        case "P":
            isPaused = !isPaused;
            break;
    }
});

restartButton.addEventListener("click", init);

// Start the game
init();