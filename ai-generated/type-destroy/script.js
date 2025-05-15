// TODO: need more words, or a way to change words, or different stories to get words from
// TOOD: words ought to be unique
const words = ["raven", "midnight", "dreary", "pondering", "weak", "weary", "ancient", "volume", "forgotten", "lore", "nodding", "nearly", "napping", "suddenly", "tapping", "chamber", "door", "visitor", "entrance", "nothing", "more", "silken", "rustling", "purple", "curtain", "thrilled", "filled", "fantastic", "terrors", "unknown", "before", "beating", "heart", "stilled", "repeating", "tis", "some", "late", "guest", "entreating", "enter", "nevermore", "ebony", "bird", "perching", "pallid", "bust", "pallas", "above", "doorway", "stately", "spoke", "prophet", "devil", "thing", "evil", "tempted", "still", "blessed", "respite", "sorrow", "lost", "lenore", "quoth", "rare", "singular", "answer", "name", "evermore", "ghastly", "grim", "gaunt", "ungainly", "fowl", "beguiling", "sad", "fancy", "smiling", "melancholy", "meaning", "bore", "soul", "darkness", "floating", "floor", "shadow", "lamplight", "maiden", "radiant", "nepenthe", "balm", "gilead", "quaff", "here", "forevermore", "leave", "loneliness", "token", "parting", "prophet", "thing", "evil", "angel", "tempter", "plutonian", "shore", "shall", "lifted", "home", "hope", "broken", "tomorrow", "sorrow", "remember", "december"]
// This is a simple typing game where the player must type words that fall from the top of the screen.
// The game increases in difficulty as the player scores points by typing the words correctly.
// The game ends when a word reaches the bottom of the screen without being typed.
// The player can choose to play again or exit the game after a game over.
let activeWords = [];
let score = 0;
let gameActive = true;
let spawnSpeed = 3000; // Initial spawn rate in milliseconds
let minSpawnSpeed = 1000; // Fastest spawn rate
let fallSpeed = 1; // Initial fall speed
let maxFallSpeed = 3; // Maximum fall speed

const gameContainer = document.getElementById('game-container');
const inputField = document.getElementById('input-field');
const scoreDisplay = document.getElementById('score-display');
const gameOverScreen = document.getElementById('game-over');
const finalScoreDisplay = document.getElementById('final-score');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');

// Focus the input field when the game starts
window.addEventListener('load', () => {
    inputField.focus();
});

// Ensure input field stays focused
gameContainer.addEventListener('click', () => {
    inputField.focus();
});

// Listen for input field changes
inputField.addEventListener('input', (e) => {
    const currentInput = e.target.value.trim().toLowerCase();

    // Check for matching words
    let foundMatch = false;

    activeWords.forEach(wordObj => {
        const word = wordObj.word.toLowerCase();

        if (currentInput === word) {
            // Remove the word block from the DOM
            wordObj.element.remove();

            // Remove the word from active words array
            const index = activeWords.indexOf(wordObj);
            if (index > -1) {
                activeWords.splice(index, 1);
            }

            // Increase score
            score += word.length * 10;
            scoreDisplay.textContent = `Score: ${score}`;

            // Clear input field
            inputField.value = '';

            // Increase difficulty
            increaseGameDifficulty();

            foundMatch = true;
        }
        else if (word.startsWith(currentInput)) {
            // Highlight the matching word
            wordObj.element.classList.add('matching');
        } else {
            wordObj.element.classList.remove('matching');
        }
    });

    // Show the active word the player is currently typing
    if (currentInput.length > 0 && !foundMatch) {
        activeWords.forEach(wordObj => {
            if (wordObj.word.toLowerCase().startsWith(currentInput)) {
                wordObj.element.classList.add('active');
            } else {
                wordObj.element.classList.remove('active');
            }
        });
    } else {
        activeWords.forEach(wordObj => {
            wordObj.element.classList.remove('active');
        });
    }
});

// Generate a word block
function spawnWordBlock() {
    if (!gameActive) return;

    // Choose a random word
    // Alternatively on game start, shuffle the words array
    // and pop words from it
    // the game ought to end when the array is empty
    const randomIndex = Math.floor(Math.random() * words.length);
    const word = words[randomIndex];

    // Create a new word block element
    const wordBlock = document.createElement('div');
    wordBlock.classList.add('word-block');
    wordBlock.textContent = word;

    // Set initial position (random X position at the top)
    const blockWidth = 200; // Estimated width
    const maxX = gameContainer.clientWidth - blockWidth;
    const randomX = Math.random() * maxX;

    wordBlock.style.left = `${randomX}px`;
    wordBlock.style.top = '0';

    // Add to the game container
    gameContainer.appendChild(wordBlock);

    // Add to active words array
    const wordObj = {
        word: word,
        element: wordBlock,
        yPos: 0,
        speed: fallSpeed * (0.8 + Math.random() * 0.4) // Random speed variation
    };

    activeWords.push(wordObj);

    // Schedule next word spawn
    const nextSpawnTime = Math.max(minSpawnSpeed,
        spawnSpeed - (score / 200) * 100);
    setTimeout(spawnWordBlock, nextSpawnTime);
}

// Game update loop
function updateGame() {
    if (!gameActive) return;

    // Update positions of all word blocks
    for (let i = activeWords.length - 1; i >= 0; i--) {
        const wordObj = activeWords[i];
        wordObj.yPos += wordObj.speed;
        wordObj.element.style.top = `${wordObj.yPos}px`;

        // Check if the word hit the bottom
        if (wordObj.yPos > gameContainer.clientHeight - 100) {
            gameOver();
            return;
        }
    }

    // Continue the game loop
    requestAnimationFrame(updateGame);
}

// Increase game difficulty based on score
function increaseGameDifficulty() {
    // Increase fall speed based on score
    fallSpeed = Math.min(maxFallSpeed, 1 + (score / 500));

    // Decrease spawn time (increase frequency)
    spawnSpeed = Math.max(minSpawnSpeed, 3000 - (score / 100) * 100);
}

// Game over function
function gameOver() {
    gameActive = false;

    // Show game over screen
    finalScoreDisplay.textContent = `Score: ${score}`;
    gameOverScreen.style.display = 'flex';

    // Remove all word blocks
    activeWords.forEach(wordObj => {
        wordObj.element.remove();
    });
    activeWords = [];
}

// Reset game function
function resetGame() {
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    gameActive = true;
    spawnSpeed = 3000;
    fallSpeed = 1;

    // Hide game over screen
    gameOverScreen.style.display = 'none';

    // Focus the input field
    inputField.value = '';
    inputField.focus();

    // Start game loop
    spawnWordBlock();
    updateGame();
}

// Event listeners for play again buttons
yesBtn.addEventListener('click', resetGame);
noBtn.addEventListener('click', () => {
    gameOverScreen.innerHTML = '<div>Thanks for playing!</div>';
});

// Start the game
resetGame();