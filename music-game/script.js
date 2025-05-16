// Audio context for playing sounds
let audioContext = null;
// TODO: get the best score
// Notes for "Mary had a little lamb" with pauses
const songSequence = [
    "E",
    "D",
    "C",
    "D",
    "E",
    "E",
    "E",
    "pause",
    "D",
    "D",
    "D",
    "pause",
    "E",
    "G",
    "G",
    "pause",
    "E",
    "D",
    "C",
    "D",
    "E",
    "E",
    "E",
    "E",
    "D",
    "D",
    "E",
    "D",
    "C",
];

// Colors for different notes
const noteColors = {
    C: "#FF5733",
    D: "#33FF57",
    E: "#3357FF",
    G: "#FF9933",
};

// Note frequencies (in Hz)
const noteFrequencies = {
    C: 261.63,
    D: 293.66,
    E: 329.63,
    G: 392.0,
};

// DOM elements
const gameContainer = document.querySelector(".game-container");
const pianoKeys = document.querySelectorAll(".piano-key");
const demoBtn = document.getElementById("demo-btn");
const scoreValue = document.getElementById("score-value");
const nextNoteDisplay = document.getElementById("next-note");
const gameMessage = document.getElementById("game-message");
const endGameModal = document.getElementById("end-game-modal");
const finalScore = document.getElementById("final-score");
const playAgainBtn = document.getElementById("play-again-btn");

// Game state
let score = 0;
let currentNoteIndex = 0;
let isPlaying = false;
let isDemoPlaying = false;
let noteTimeout;
let activeNotes = [];

// Initialize audio context
function initAudio() {
    if (audioContext === null) {
        audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
    }
    return audioContext;
}

// Play a note with the given frequency
function playNote(frequency, duration = 0.5) {
    const context = initAudio();

    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(0.3, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        context.currentTime + duration - 0.05
    );

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + duration);
}

// Create a visual note and animate it
function createNote(noteName, isCorrect = true) {
    const note = document.createElement("div");
    note.className = "note";
    note.textContent = noteName;
    note.style.backgroundColor = isCorrect
        ? noteColors[noteName]
        : "#ff6b6b";

    // Find the piano key for this note
    const keyIndex = Array.from(pianoKeys).findIndex(
        (key) => key.dataset.note === noteName
    );
    const keyElement = pianoKeys[keyIndex];
    const keyRect = keyElement.getBoundingClientRect();
    const containerRect = gameContainer.getBoundingClientRect();

    // Position the note above the correct piano key
    const left = keyRect.left - containerRect.left + keyRect.width / 2 - 20;

    note.style.left = `${left}px`;
    note.style.top = "0px";

    gameContainer.appendChild(note);
    activeNotes.push({
        element: note,
        position: 0,
    });

    // Start animation if it's not already running
    if (activeNotes.length === 1) {
        animateNotes();
    }
}

// Animate notes moving down
function animateNotes() {
    const containerHeight = gameContainer.offsetHeight;

    for (let i = activeNotes.length - 1; i >= 0; i--) {
        const noteObj = activeNotes[i];
        noteObj.position += 3;
        noteObj.element.style.top = `${noteObj.position}px`;

        // Remove note when it's off screen
        if (noteObj.position > containerHeight) {
            noteObj.element.remove();
            activeNotes.splice(i, 1);
        }
    }

    if (activeNotes.length > 0) {
        requestAnimationFrame(animateNotes);
    }
}

// Play a note by name (connects the visual note and audio)
function playNoteByName(noteName, duration = 0.5, isCorrect = true) {
    // Find the piano key for this note
    const keyElement = Array.from(pianoKeys).find(
        (key) => key.dataset.note === noteName
    );
    if (!keyElement) return;

    // Create visual note
    createNote(noteName, isCorrect);

    // Play audio
    playNote(noteFrequencies[noteName], duration);

    // Highlight the piano key
    keyElement.classList.add(isCorrect ? "correct" : "incorrect");
    setTimeout(() => {
        keyElement.classList.remove("correct");
        keyElement.classList.remove("incorrect");
    }, duration * 1000);
}

// Play the song as a demo
function playDemo() {
    if (isDemoPlaying) return;

    isDemoPlaying = true;
    demoBtn.disabled = true;
    disablePianoKeys(true);

    const beatDuration = 0.4; // seconds per beat
    const pauseDuration = 0.8; // seconds for pauses
    let demoNoteIndex = 0;

    function playNextDemoNote() {
        if (!isDemoPlaying || demoNoteIndex >= songSequence.length) {
            isDemoPlaying = false;
            demoBtn.disabled = false;
            disablePianoKeys(false);
            return;
        }

        const note = songSequence[demoNoteIndex];

        if (note === "pause") {
            // For pauses, just wait without playing a note
            noteTimeout = setTimeout(playNextDemoNote, beatDuration * 1000);
        } else {
            // Play the note (both audio and visual)
            playNoteByName(note, beatDuration);

            // Schedule next note
            noteTimeout = setTimeout(playNextDemoNote, beatDuration * 1000);
        }

        demoNoteIndex++;
    }

    // Play the first note
    playNextDemoNote();
}

// Start a new game
function startNewGame() {
    score = 0;
    currentNoteIndex = 0;
    isPlaying = true;

    updateScore(0);
    updateNextNote();

    gameMessage.textContent = "";
    gameMessage.className = "game-message";

    enablePianoKeys();
}

// End the game and show the final score
function endGame() {
    isPlaying = false;
    disablePianoKeys(true);

    // Show end game modal
    finalScore.textContent = score;
    endGameModal.style.display = "flex";
}

// Update the score display
function updateScore(newScore) {
    score = newScore;
    scoreValue.textContent = score;
}

// Update the next note display
function updateNextNote() {
    if (currentNoteIndex < songSequence.length) {
        const nextNote = songSequence[currentNoteIndex];
        if (nextNote === "pause") {
            // Skip pauses in gameplay - move to the next note
            currentNoteIndex++;
            updateNextNote();
        } else {
            nextNoteDisplay.textContent = nextNote;
        }
    } else {
        nextNoteDisplay.textContent = "✓";
    }
}

// Enable or disable piano keys
function disablePianoKeys(disabled) {
    pianoKeys.forEach((key) => {
        key.style.pointerEvents = disabled ? "none" : "auto";
        key.style.opacity = disabled ? "0.7" : "1";
    });
}

// Enable piano keys
function enablePianoKeys() {
    disablePianoKeys(false);
}

// Show a message
function showMessage(text, isSuccess) {
    gameMessage.textContent = text;
    gameMessage.className =
        "game-message " + (isSuccess ? "success" : "error");

    setTimeout(() => {
        gameMessage.style.opacity = "0";
    }, 2000);
}

// Handle note click
function handleNoteClick(e) {
    if (!isPlaying) return;

    const keyElement = e.currentTarget;
    const clickedNote = keyElement.dataset.note;

    // Skip any pauses in the sequence
    while (
        currentNoteIndex < songSequence.length &&
        songSequence[currentNoteIndex] === "pause"
    ) {
        currentNoteIndex++;
    }

    // Check if we've reached the end of the sequence
    if (currentNoteIndex >= songSequence.length) {
        endGame();
        return;
    }

    const expectedNote = songSequence[currentNoteIndex];

    if (clickedNote === expectedNote) {
        // Correct note
        playNoteByName(clickedNote, 0.5, true);
        updateScore(score + 10);
        currentNoteIndex++;

        // Skip any pauses after the current note
        updateNextNote();

        // Check if song is complete
        if (currentNoteIndex >= songSequence.length) {
            setTimeout(() => {
                endGame();
            }, 1000);
        }
    } else {
        // Incorrect note
        playNoteByName(clickedNote, 0.3, false);
        updateScore(Math.max(0, score - 5));
        showMessage("Wrong note! Try again.", false);
    }
}

// Set up event listeners for piano keys
pianoKeys.forEach((key) => {
    key.addEventListener("mousedown", handleNoteClick);

    // Also respond to touch for mobile devices
    key.addEventListener("touchstart", (e) => {
        e.preventDefault(); // Prevent default touch behavior
        handleNoteClick(e);
    });
});

// Button event listeners
demoBtn.addEventListener("click", playDemo);
playAgainBtn.addEventListener("click", () => {
    endGameModal.style.display = "none";
    startNewGame();
});

// Initialize the game
startNewGame();