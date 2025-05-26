// Get references to the canvas and its 2D rendering context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Get references to score and bubble count display elements
const scoreDisplay = document.getElementById("score");
const bubbleCountDisplay = document.getElementById("bubbleCount");
const gameOverOverlay = document.getElementById("gameOverOverlay");
const restartButton = document.getElementById("restartButton");

// Game configuration constants
const GRAVITY = 0.5; // How fast bubbles fall
// TODO: make bubbles stack on top of each other. can even make them 3D
// TODO: add to this when the largest bubble is merged
const BUBBLE_TYPES = [
    { id: 0, radius: 15, color: "red", nextType: 1 }, // Small Pink
    { id: 1, radius: 25, color: 'green', nextType: 2 }, // Medium Green
    { id: 2, radius: 35, color: "purple", nextType: 3 },
    { id: 3, radius: 45, color: "orange", nextType: 4 },
    { id: 4, radius: 55, color: "blue", nextType: 5 },
    { id: 5, radius: 65, color: "pink", nextType: null },
];
const SPAWN_Y = 50; // Y-coordinate where new bubbles appear
// Delay in ms before a new bubble becomes available for control after the previous one drops.
const NEXT_BUBBLE_APPEAR_DELAY = 0; // Changed to 0 for immediate next bubble spawn

// Game state variables
let bubbles = []; // Array to hold all active bubbles
let score = 0;
let gameOver = false;
let currentBubble = null; // The bubble currently being controlled by the player
// Timestamp of when the last bubble finished dropping (used for spawning delay)
let lastBubbleDropTime = 0;

// --- Bubble Class Definition ---
class Bubble {
    constructor(x, y, typeId) {
        this.type = BUBBLE_TYPES[typeId];
        this.x = x;
        this.y = y;
        this.radius = this.type.radius;
        this.color = this.type.color;
        this.velocityY = 0; // Vertical velocity
        this.isDropping = false; // True when the bubble is falling
        this.isMerging = false; // True when the bubble is in the process of merging (prevents double merges)
    }

    // Draws the bubble on the canvas
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
    }

    // Updates the bubble's position and state
    update() {
        if (this.isDropping) {
            this.velocityY += GRAVITY; // Apply gravity
            this.y += this.velocityY; // Update vertical position

            // Prevent bubble from going out of bounds horizontally during drop
            if (this.x - this.radius < 0) {
                this.x = this.radius;
            } else if (this.x + this.radius > canvas.width) {
                this.x = canvas.width - this.radius;
            }
        }
    }
}

// --- Game Initialization and Reset ---
function initGame() {
    // Set canvas dimensions based on its CSS size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    bubbles = [];
    score = 0;
    gameOver = false;
    currentBubble = null;
    lastBubbleDropTime = 0; // Reset drop time

    scoreDisplay.textContent = score;
    bubbleCountDisplay.textContent = bubbles.length;
    gameOverOverlay.classList.add("hidden"); // Hide game over screen

    // Generate the first bubble immediately when the game starts
    spawnNewControllableBubble();
    gameLoop(); // Start the game loop
}

// --- Spawns a new bubble that the player can control ---
function spawnNewControllableBubble() {
    // Randomly choose a bubble type (small or medium initially)
    const randomType = Math.floor(Math.random() * 2); // 0 or 1
    // Spawn in the middle top
    currentBubble = new Bubble(canvas.width / 2, SPAWN_Y, randomType);
}

// --- Collision Detection ---
function checkCollision(bubble1, bubble2) {
    const dx = bubble1.x - bubble2.x;
    const dy = bubble1.y - bubble2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < bubble1.radius + bubble2.radius;
}

// --- Game Logic Update ---
function update() {
    if (gameOver) return;

    // Handle the current bubble's dropping state
    if (currentBubble && currentBubble.isDropping) {
        currentBubble.update(); // Update its position

        let hasSettled = false;

        // Check if it hits the bottom of the canvas
        if (currentBubble.y + currentBubble.radius >= canvas.height) {
            currentBubble.y = canvas.height - currentBubble.radius;
            currentBubble.velocityY = 0;
            hasSettled = true;
        } else {
            // Check for collision with existing bubbles to see if it settles on them
            for (const existingBubble of bubbles) {
                // Only check if they are different bubbles and existingBubble is not merging
                if (
                    currentBubble !== existingBubble &&
                    !existingBubble.isMerging &&
                    checkCollision(currentBubble, existingBubble)
                ) {
                    // If current bubble is moving downwards and overlaps with an existing bubble,
                    // it has settled on top of it.
                    if (
                        currentBubble.velocityY > 0 &&
                        currentBubble.y + currentBubble.radius >
                        existingBubble.y - existingBubble.radius
                    ) {
                        // Adjust position to be exactly on top
                        currentBubble.y =
                            existingBubble.y -
                            existingBubble.radius -
                            currentBubble.radius;
                        currentBubble.velocityY = 0; // Stop its movement
                        hasSettled = true;
                        break; // Found a bubble it settled on, no need to check others
                    }
                }
            }
        }

        if (hasSettled) {
            // Once settled, add it to the main bubbles array and clear currentBubble
            bubbles.push(currentBubble);
            currentBubble = null;
            lastBubbleDropTime = Date.now(); // Record time when this bubble finished dropping
        }
    }

    // Update all existing bubbles (those already settled or merged)
    for (let i = 0; i < bubbles.length; i++) {
        const bubble = bubbles[i];
        bubble.update(); // Continue updating their position (e.g., if they are still settling after a merge)

        // Check for collisions with other bubbles
        for (let j = i + 1; j < bubbles.length; j++) {
            const otherBubble = bubbles[j];

            // Only check for collisions if both bubbles are not merging
            if (
                !bubble.isMerging &&
                !otherBubble.isMerging &&
                checkCollision(bubble, otherBubble)
            ) {
                // Collision detected!
                if (bubble.type.id === otherBubble.type.id) {
                    // Identical types, attempt to merge
                    const newTypeId = bubble.type.nextType;

                    if (newTypeId !== null) {
                        // Mark bubbles as merging to prevent multiple merges
                        bubble.isMerging = true;
                        otherBubble.isMerging = true;

                        // Calculate new bubble position (midpoint of merged bubbles)
                        const newX = (bubble.x + otherBubble.x) / 2;
                        const newY = (bubble.y + otherBubble.y) / 2;

                        // Remove old bubbles
                        bubbles.splice(j, 1); // Remove otherBubble first to maintain correct index for i
                        bubbles.splice(i, 1);

                        // Add new, larger bubble
                        const newBubble = new Bubble(newX, newY, newTypeId);
                        newBubble.isDropping = true; // New bubble immediately starts dropping
                        bubbles.push(newBubble);

                        score += 100 * (newTypeId + 1); // Score based on merged type
                    } else {
                        // Two big purple bubbles (type 2) merge and disappear
                        bubbles.splice(j, 1);
                        bubbles.splice(i, 1);
                        score += 500; // Bonus points for max merge
                    }
                    // Re-adjust loop indices after splicing
                    i--; // Decrement i because an element was removed at index i
                    break; // Break inner loop to re-evaluate collisions for the current (new) bubble
                }
            }
        }

        // Keep bubbles within vertical bounds (bottom of canvas)
        if (bubble.y + bubble.radius > canvas.height) {
            bubble.y = canvas.height - bubble.radius;
            bubble.velocityY = 0; // Stop vertical movement
        }
    }

    // Logic to spawn a new controllable bubble after a delay
    if (
        currentBubble === null &&
        Date.now() - lastBubbleDropTime > NEXT_BUBBLE_APPEAR_DELAY
    ) {
        spawnNewControllableBubble();
    }

    // Game Over condition: If any bubble overflows the top of the canvas
    // This is a common game over condition for merge games like this
    for (const bubble of bubbles) {
        if (bubble.y - bubble.radius < 0) {
            // If any part of a bubble is above the top edge
            gameOver = true;
            gameOverOverlay.classList.remove("hidden");
            break;
        }
    }

    // Update UI
    scoreDisplay.textContent = score;
    bubbleCountDisplay.textContent =
        bubbles.length + (currentBubble ? 1 : 0); // Include current bubble in count
}

// --- Drawing Function ---
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Draw all active bubbles
    for (const bubble of bubbles) {
        bubble.draw();
    }

    // Draw the current bubble being controlled
    if (currentBubble) {
        currentBubble.draw();

        // Draw dotted line for alignment if dragging and not dropping
        if (isDragging && !currentBubble.isDropping) {
            ctx.beginPath();
            ctx.setLineDash([5, 5]); // Set dotted line pattern
            ctx.strokeStyle = "#555"; // Darker grey for visibility
            ctx.lineWidth = 1;
            // Start just below the bubble, go to the bottom of the canvas
            ctx.moveTo(currentBubble.x, currentBubble.y + currentBubble.radius);
            ctx.lineTo(currentBubble.x, canvas.height);
            ctx.stroke();
            ctx.setLineDash([]); // Reset line dash to solid for other drawings
        }
    }
}

// --- Main Game Loop ---
function gameLoop() {
    update();
    draw();
    if (!gameOver) {
        requestAnimationFrame(gameLoop); // Continue the loop
    }
}

// --- Event Listeners for Player Input ---

let isDragging = false;

// Mouse events
canvas.addEventListener("mousedown", (e) => {
    if (gameOver || !currentBubble) return;
    isDragging = true;
    const rect = canvas.getBoundingClientRect();
    currentBubble.x = e.clientX - rect.left; // Set initial position on click
});

canvas.addEventListener("mousemove", (e) => {
    if (gameOver || !currentBubble || currentBubble.isDropping) return;
    if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        currentBubble.x = e.clientX - rect.left;
    }
});

canvas.addEventListener("mouseup", () => {
    if (gameOver || !currentBubble) return;
    isDragging = false;
    if (!currentBubble.isDropping) {
        currentBubble.isDropping = true; // Start dropping on mouse up
    }
});

canvas.addEventListener("mouseleave", () => {
    // If mouse leaves canvas while dragging, stop dragging
    isDragging = false;
});

// Touch events
canvas.addEventListener(
    "touchstart",
    (e) => {
        if (gameOver || !currentBubble) return;
        e.preventDefault(); // Prevent scrolling
        isDragging = true;
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        currentBubble.x = touch.clientX - rect.left; // Initial position on touch
    },
    { passive: false }
);

canvas.addEventListener(
    "touchmove",
    (e) => {
        if (gameOver || !currentBubble || currentBubble.isDropping) return;
        if (isDragging) {
            e.preventDefault(); // Prevent scrolling
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            currentBubble.x = touch.clientX - rect.left;
        }
    },
    { passive: false }
);

canvas.addEventListener("touchend", () => {
    if (gameOver || !currentBubble) return;
    isDragging = false;
    if (!currentBubble.isDropping) {
        currentBubble.isDropping = true; // Start dropping on touch end
    }
});

// Restart button functionality
restartButton.addEventListener("click", () => {
    initGame();
});

// Initial game setup when the window loads
window.onload = function () {
    initGame();
};

// Handle window resize to adjust canvas dimensions
window.addEventListener("resize", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    // Optionally, reposition bubbles if they go off-screen on resize
    for (const bubble of bubbles) {
        if (bubble.x + bubble.radius > canvas.width) {
            bubble.x = canvas.width - bubble.radius;
        } else if (bubble.x - bubble.radius < 0) {
            bubble.x = bubble.radius;
        }
    }
    if (currentBubble) {
        if (currentBubble.x + currentBubble.radius > canvas.width) {
            currentBubble.x = canvas.width - currentBubble.radius;
        } else if (currentBubble.x - currentBubble.radius < 0) {
            currentBubble.x = currentBubble.radius;
        }
    }
});