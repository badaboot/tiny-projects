// Game variables
let score = 0;
let basketPosition = window.innerWidth / 2;
let basketSpeed = 10;
let basketWidth = 100;
let eggSpeed = 3;
let eggs = [];
let chickens = [];
let gameContainer = document.getElementById("game-container");
let scoreElement = document.getElementById("score");
let basket = document.getElementById("basket");
let gameActive = true;
let cluckSound;
let missSound;
let catchSound;
let keys = {
    left: false,
    right: false,
};

// Initialize game
function init() {
    // Set up chickens array
    chickens = Array.from(document.querySelectorAll(".chicken"));

    // Set up audio
    setupAudio();

    // Start game loop
    gameLoop();

    // Start laying eggs randomly
    setInterval(layEggRandomly, 2000);

    // Setup keyboard controls
    setupControls();
}

// Setup audio elements
// TODO: fix this
function setupAudio() {
    // Cluck sound
    cluckSound = new Audio();
    cluckSound.src =
        "data:audio/wav;base64,UklGRigBAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQBAABpXFRQTEZCPz07PEBBQkFBPz06ODc3OTs9OzY0MzI0NTc5PDw5NjM0NDQ1NTU1NTY6P0NFR0dEQj88Oz1BQ0VGR0ZFRUVFQ0E/PDo3NjU1NTc5PDw7Ojg1MzM0NTg7PD5AP0A/Pj49PD5BQ0VFQ0A9Ozo7PD1AQUFDQD07Ojk4OTo8PT49PDw6OTk4OTo8PT9BQUFDQ0JBPz07OTc2Njc5PD9CQ0RDQj88Ojg2NjY4OTw/QUJCQkA+PDo3NjM0NTg7PkBBQkE+PDk2NTQ0Njk9QENEREVEQj88OTc1NTY5PD9CRT8=";

    // Miss sound
    missSound = new Audio();
    missSound.src =
        "data:audio/wav;base64,UklGRigBAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQBAABsY15ZVE9KRkNBPz09PkBBQkJBPz07OTg4OTo8PT07OTY0MzM0NTc5Ozs5NjQzMzQ1NTU1Njc8QUVHR0RCQD48PDxAQ0VGRUVDQUBBQD89Ozk3NTQzNDY5Ozw7Ojg2NDM0NTY5PD5AQEA/Pj09PD1AQUNFQ0E+PDo6Ozw9P0FCQkE+PDo5OTk5Oz0+Pz49PDo5OTg5Oz0/QUJDQkNDQUE/Pjs4NjY2Nzk8P0JEQ0NCQD48Ojg2NjY4Oz0/QkJCQj8+Ozk3NjU1Nzk8PkFCQkE/PTk3NTQ0Njg8P0NEREVEQkA+PDk2NTY4Oz5BQz8=";

    // Catch sound
    catchSound = new Audio();
    catchSound.src =
        "data:audio/wav;base64,UklGRigBAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQBAABmXVhUUU1JRkNBPz4+PkBBQkJCQD48Ozo5OTo7PT49PDo3NTU2Njc5Ozw8Ojg2NDM0NDU2NTY4O0FFR0dFQ0E+PT0+QENFR0dGRUNCQT8+PDo4NjU1NTY4Oz08Ozo4NjU0NDY4Ozw+QEBAQUFAPz49PUFDRUVDQT89Ozs7PD0/QUJCQT89Ozk5OTo8PkA/Pz49PDo5OTk7PD5AQUJDQ0NCQUA+PDo3NjY3ODo9QENCQ0JBPz06ODc2NjY5PD9CQ0NDQT89Ozk3NjY3ODo9QEFCQkE/PTu4NjU1NTc6PUBDREVFQkFAPTs5NjY3OTw/Qj8=";
}

// Setup game controls
function setupControls() {
    // Keyboard controls
    window.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") {
            keys.left = true;
        } else if (e.key === "ArrowRight") {
            keys.right = true;
        }
    });

    window.addEventListener("keyup", function (e) {
        if (e.key === "ArrowLeft") {
            keys.left = false;
        } else if (e.key === "ArrowRight") {
            keys.right = false;
        }
    });

    // Mobile touch controls
    let touchStartX = 0;
    let currentTouchX = 0;
    let isTouching = false;

    gameContainer.addEventListener("touchstart", function (e) {
        touchStartX = e.touches[0].clientX;
        currentTouchX = touchStartX;
        isTouching = true;
        e.preventDefault();
    });

    gameContainer.addEventListener("touchmove", function (e) {
        currentTouchX = e.touches[0].clientX;
        e.preventDefault();
    });

    gameContainer.addEventListener("touchend", function (e) {
        isTouching = false;
        e.preventDefault();
    });

    // Smooth basket movement function
    function updateBasketPosition() {
        // Keyboard movement
        if (keys.left && basketPosition > basketWidth / 2) {
            basketPosition -= basketSpeed;
        }

        if (
            keys.right &&
            basketPosition < window.innerWidth - basketWidth / 2
        ) {
            basketPosition += basketSpeed;
        }

        // Touch movement
        if (isTouching) {
            const diff = currentTouchX - touchStartX;
            basketPosition = Math.max(
                basketWidth / 2,
                Math.min(
                    window.innerWidth - basketWidth / 2,
                    window.innerWidth / 2 + diff
                )
            );
        }

        // Apply smooth movement with CSS transitions
        basket.style.transition = "left 0.1s ease-out";
        basket.style.left = basketPosition + "px";

        requestAnimationFrame(updateBasketPosition);
    }

    // Start the smooth movement loop
    updateBasketPosition();
}

// Choose a random chicken to lay an egg
function layEggRandomly() {
    if (!gameActive) return;

    const chickenIndex = Math.floor(Math.random() * 3);
    const chicken = chickens[chickenIndex];

    // Make chicken "alert" before laying (eyes get bigger)
    const eyes = chicken.querySelectorAll(".chicken-eye");
    eyes.forEach((eye) => eye.classList.add("big"));

    // Play cluck sound
    cluckSound.currentTime = 0;
    cluckSound.play();

    // Wait a moment, then lay the egg
    setTimeout(() => {
        layEgg(chicken);
        eyes.forEach((eye) => eye.classList.remove("big"));
    }, 800);
}

// Create an egg from a specific chicken
function layEgg(chicken) {
    const chickenRect = chicken.getBoundingClientRect();
    const egg = document.createElement("div");
    egg.className = "egg";
    egg.style.left = chickenRect.left + chickenRect.width / 2 - 12.5 + "px";
    egg.style.top = chickenRect.top + chickenRect.height + "px";

    gameContainer.appendChild(egg);
    eggs.push({
        element: egg,
        x: parseFloat(egg.style.left),
        y: parseFloat(egg.style.top),
    });
}

// Main game loop
function gameLoop() {
    // Move eggs
    for (let i = eggs.length - 1; i >= 0; i--) {
        const egg = eggs[i];
        egg.y += eggSpeed;
        egg.element.style.top = egg.y + "px";

        // Check if egg hits bottom
        if (egg.y >= document.getElementsByClassName('grass')[0].getBoundingClientRect().top - 30) {
            // Check if egg is caught by basket
            const eggX = egg.x + 12.5; // Center of egg
            const isCaught =
                eggX > basketPosition - basketWidth / 2 &&
                eggX < basketPosition + basketWidth / 2;

            if (isCaught) {
                // Caught egg
                score++;
                catchSound.currentTime = 0;
                catchSound.play();
            } else {
                // Missed egg
                score = Math.max(0, score - 2);
                missSound.currentTime = 0;
                missSound.play();
            }

            // Update score display
            scoreElement.textContent = "Score: " + score;

            // Remove egg
            gameContainer.removeChild(egg.element);
            eggs.splice(i, 1);
        }
    }

    // Adjust difficulty based on score
    eggSpeed = 3 + Math.min(5, Math.floor(score / 10));

    // Continue game loop
    requestAnimationFrame(gameLoop);
}

// Initialize game when window loads
const startButton = document.getElementById("start-button");
startButton.addEventListener("click", function (e) {
    init()
    startButton.style.display = "none";
})