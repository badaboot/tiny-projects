// Game state
const state = {
    round: 1,
    challenge: 1,
    score: 0,
    currentTargetColor: null,
    redValue: 0,
    greenValue: 0,
    blueValue: 0,
    completed: false
};

// Game configuration
const rounds = [
    {
        name: "Primary Colors",
        challenges: [
            { name: "Red", r: 100, g: 0, b: 0 },
            { name: "Green", r: 0, g: 100, b: 0 },
            { name: "Blue", r: 0, g: 0, b: 100 }
        ]
    },
    {
        name: "Secondary Colors",
        challenges: [
            { name: "Yellow", r: 100, g: 100, b: 0 },
            { name: "Cyan", r: 0, g: 100, b: 100 },
            { name: "Magenta", r: 100, g: 0, b: 100 }
        ]
    },
    {
        name: "Tertiary Colors",
        challenges: [
            { name: "Light Gray", r: 90, g: 90, b: 90 },
            { name: "Medium Gray", r: 60, g: 60, b: 60 },
            { name: "Dark Gray", r: 30, g: 30, b: 30 }
        ]
    }
];

// DOM Elements
const redSlider = document.getElementById('red-slider');
const greenSlider = document.getElementById('green-slider');
const blueSlider = document.getElementById('blue-slider');
const redValue = document.getElementById('red-value');
const greenValue = document.getElementById('green-value');
const blueValue = document.getElementById('blue-value');
const userColorDisplay = document.getElementById('user-color');
const targetColorDisplay = document.getElementById('target-color');
const checkButton = document.getElementById('check-button');
const nextButton = document.getElementById('next-button');
const roundNumber = document.getElementById('round-number');
const roundName = document.getElementById('round-name');
const targetColorName = document.getElementById('target-color-name');
const message = document.getElementById('message');
const scoreDisplay = document.getElementById('score');

// Initialize the game
function initGame() {
    state.round = 1;
    state.challenge = 1;
    state.score = 0;
    state.completed = false;
    checkButton.classList.remove('hide');

    resetSliders();
    setRound(1);
    setChallenge(1);
    updateScore();
}

// Set the current round
function setRound(roundNum) {
    state.round = roundNum;
    roundNumber.textContent = roundNum;
    roundName.textContent = rounds[roundNum - 1].name;
}

function setChallenge(challengeNum) {
    state.challenge = challengeNum;
    const currentRound = rounds[state.round - 1];
    const currentChallenge = currentRound.challenges[challengeNum - 1];

    state.currentTargetColor = currentChallenge;
    targetColorName.textContent = currentChallenge.name;

    // Convert percentage values to RGB (0-255)
    const rgbRed = Math.round((currentChallenge.r / 100) * 255);
    const rgbGreen = Math.round((currentChallenge.g / 100) * 255);
    const rgbBlue = Math.round((currentChallenge.b / 100) * 255);

    targetColorDisplay.style.backgroundColor = `rgb(${rgbRed}, ${rgbGreen}, ${rgbBlue})`;
    message.textContent = `Use sliders to mix ${currentChallenge.name}.`;
    message.className = 'message';
}

// Reset sliders to zero
function resetSliders() {
    redSlider.value = 0;
    greenSlider.value = 0;
    blueSlider.value = 0;
    updateSliderValues();
}

// Update the slider values and color display
function updateSliderValues() {
    state.redValue = parseInt(redSlider.value);
    state.greenValue = parseInt(greenSlider.value);
    state.blueValue = parseInt(blueSlider.value);

    redValue.textContent = state.redValue;
    greenValue.textContent = state.greenValue;
    blueValue.textContent = state.blueValue;

    // Convert percentage values to RGB (0-255)
    const rgbRed = Math.round((state.redValue / 100) * 255);
    const rgbGreen = Math.round((state.greenValue / 100) * 255);
    const rgbBlue = Math.round((state.blueValue / 100) * 255);

    userColorDisplay.style.backgroundColor = `rgb(${rgbRed}, ${rgbGreen}, ${rgbBlue})`;
}

// Check if the user's color matches the target color
function checkColor() {
    const target = state.currentTargetColor;
    const tolerance = 10; // Tolerance in percentage points

    const redDiff = Math.abs(state.redValue - target.r);
    const greenDiff = Math.abs(state.greenValue - target.g);
    const blueDiff = Math.abs(state.blueValue - target.b);

    // Check if all color components are within tolerance
    if (redDiff <= tolerance && greenDiff <= tolerance && blueDiff <= tolerance) {
        state.score += 1;
        updateScore();
        message.textContent = `Correct!`;
        message.className = 'message success';
        checkButton.disabled = true;

        // Automatically advance to the next challenge after a delay
        setTimeout(() => {
            nextChallenge();
        }, 1500);
    } else {
        message.textContent = "Not quite right. Try adjusting your sliders!";
        message.className = 'message error';

        // Provide hints
        let hint = "Hint: ";
        if (redDiff > tolerance) {
            hint += state.redValue < target.r ? "Increase red. " : "Decrease red. ";
        }
        if (greenDiff > tolerance) {
            hint += state.greenValue < target.g ? "Increase green. " : "Decrease green. ";
        }
        if (blueDiff > tolerance) {
            hint += state.blueValue < target.b ? "Increase blue. " : "Decrease blue. ";
        }

        setTimeout(() => {
            message.textContent = hint;
        }, 1500);
    }
}

// Advance to the next challenge or round
function nextChallenge() {
    const currentRound = rounds[state.round - 1];

    if (state.challenge < currentRound.challenges.length) {
        // Next challenge in current round
        setChallenge(state.challenge + 1);
    } else if (state.round < rounds.length) {
        // Next round
        setRound(state.round + 1);
        setChallenge(1);
    } else {
        // Game complete
        completeGame();
        return;
    }

    resetSliders();
    checkButton.disabled = false;
}

// Complete the game
function completeGame() {
    state.completed = true;
    message.innerHTML = `<div class="congrats">Congratulations! You completed all challenges!</div>`
    message.className = 'message success';

    checkButton.classList.add('hide');

    // Add a reset button
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Play Again';

    resetButton.addEventListener('click', initGame);
    message.appendChild(resetButton);
}

// Calculate total challenges
function getTotalChallenges() {
    return rounds.reduce((total, round) => total + round.challenges.length, 0);
}

// Update score display
function updateScore() {
    scoreDisplay.textContent = state.score;
}

// Event listeners
redSlider.addEventListener('input', updateSliderValues);
greenSlider.addEventListener('input', updateSliderValues);
blueSlider.addEventListener('input', updateSliderValues);
checkButton.addEventListener('click', checkColor);

// Initialize the game
document.getElementById('total-challenges').textContent = getTotalChallenges();
initGame();