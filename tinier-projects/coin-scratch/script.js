document.addEventListener("DOMContentLoaded", () => {
    const scratchCanvas = document.getElementById("scratchCanvas");
    const ctx = scratchCanvas.getContext("2d");
    const lottoContent = document.getElementById("lottoContent");
    const resultText = document.getElementById("resultText");
    const resetButton = document.getElementById("resetButton");

    let isScratching = false;
    let revealPercentage = 0;
    const revealThreshold = 60; // Percentage of pixels to scratch to fully reveal

    // Variables to store the last known mouse/touch position for directional scratching
    let lastX = null;
    let lastY = null;

    /**
     * Sets up the canvas dimensions and draws the initial scratch-off layer.
     */
    function setupCanvas() {
        // Set canvas dimensions to match its parent container
        scratchCanvas.width = lottoContent.offsetWidth;
        scratchCanvas.height = lottoContent.offsetHeight;

        // Clear any previous drawings
        ctx.clearRect(0, 0, scratchCanvas.width, scratchCanvas.height);

        // Draw the scratch-off layer with a metallic gradient
        const gradient = ctx.createLinearGradient(
            0,
            0,
            scratchCanvas.width,
            scratchCanvas.height
        );
        gradient.addColorStop(0, "#a0a0a0"); // Darker gray
        gradient.addColorStop(0.5, "#c0c0c0"); // Lighter gray
        gradient.addColorStop(1, "#a0a0a0"); // Darker gray
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);

        // Add some texture or text to the scratch-off layer
        ctx.font = "bold 2rem Inter, sans-serif";
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)"; // Slightly transparent black for text
        ctx.textAlign = "center";
        ctx.textBaseline = "middle"; // Center text vertically
        ctx.fillText(
            "SCRATCH ME!",
            scratchCanvas.width / 2,
            scratchCanvas.height / 2
        );
    }

    /**
     * Determines the outcome of the ticket (win or lose).
     * @returns {string} 'win' or 'lose'.
     */
    function determineOutcome() {
        // 50/50 chance of winning
        return Math.random() < 0.5 ? "win" : "lose";
    }

    /**
     * Sets the text and styling for the revealed outcome.
     */
    function setOutcome() {
        const outcome = determineOutcome();
        resultText.classList.remove("win", "lose"); // Clear previous classes
        if (outcome === "win") {
            resultText.textContent = "YOU WON!";
            resultText.classList.add("win");
        } else {
            resultText.textContent = "Nah, try again.";
            resultText.classList.add("lose");
        }
    }

    /**
     * Gets the mouse or touch position relative to the canvas.
     * @param {HTMLCanvasElement} canvas - The canvas element.
     * @param {MouseEvent|TouchEvent} evt - The event object.
     * @returns {{x: number, y: number}} The x and y coordinates.
     */
    function getCanvasPos(canvas, evt) {
        const rect = canvas.getBoundingClientRect();
        let clientX = evt.clientX;
        let clientY = evt.clientY;

        if (evt.touches && evt.touches.length > 0) {
            clientX = evt.touches[0].clientX;
            clientY = evt.touches[0].clientY;
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top,
        };
    }
    const scratchAudio = new Audio('scratch.m4a')
    scratchAudio.loop = true
    /**
     * Starts the scratching process.
     * @param {MouseEvent|TouchEvent} e - The event object.
     */
    function startScratch(e) {
        scratchAudio.play()
        isScratching = true;
        scratchCanvas.classList.add("scratching");
        const pos = getCanvasPos(scratchCanvas, e);
        lastX = pos.x; // Set initial position
        lastY = pos.y; // Set initial position
        scratch(e); // Scratch immediately on click/touch
    }

    /**
     * Performs the scratching action on the canvas.
     * Draws small, rotated rectangles along the path of the user's drag.
     * @param {MouseEvent|TouchEvent} e - The event object.
     */
    function scratch(e) {
        if (!isScratching) return;

        // Prevent default touch actions like scrolling
        if (e.cancelable) {
            e.preventDefault();
        }

        const pos = getCanvasPos(scratchCanvas, e);
        const currentX = pos.x;
        const currentY = pos.y;

        // If this is the very first point of a scratch, just set lastX/Y and return
        if (lastX === null || lastY === null) {
            lastX = currentX;
            lastY = currentY;
            return;
        }

        ctx.globalCompositeOperation = "destination-out"; // This is the magic!

        // Calculate distance and angle between last and current points
        const dist = Math.sqrt(
            Math.pow(currentX - lastX, 2) + Math.pow(currentY - lastY, 2)
        );
        const angle = Math.atan2(currentY - lastY, currentX - lastX);

        const brushWidth = 25; // Overall width of the scratch path
        const roughnessFactor = 0.5; // How much random offset for jagged edges (0 to 1)
        const numRoughStrokesPerStep = 3; // Number of overlapping strokes to create thickness and roughness

        // Iterate along the path from lastX/Y to currentX/Y
        // The step size (e.g., 5) determines the density of the individual scratch marks
        for (let i = 0; i < dist; i += 5) {
            const x = lastX + Math.cos(angle) * i;
            const y = lastY + Math.sin(angle) * i;

            // Draw multiple small, slightly offset and rotated rectangles for roughness
            for (let j = 0; j < numRoughStrokesPerStep; j++) {
                // Random offset within the brush area to create a scattered effect
                const offsetX =
                    (Math.random() - 0.5) * brushWidth * roughnessFactor;
                const offsetY =
                    (Math.random() - 0.5) * brushWidth * roughnessFactor;

                // Random length and width for each individual stroke
                const strokeLength = 10 + Math.random() * 10; // Length of individual scratch marks
                const strokeWidth = 3 + Math.random() * 5; // Width of individual scratch marks

                // Small random rotation offset to make edges jagged
                const rotationOffset = ((Math.random() - 0.5) * Math.PI) / 8;

                ctx.save(); // Save current context state (translation, rotation)
                // Move to the calculated position for the stroke
                ctx.translate(x + offsetX, y + offsetY);
                // Apply rotation: align with path direction + small random offset
                ctx.rotate(angle + rotationOffset);
                // Draw a filled rectangle (representing a scratch mark)
                ctx.fillRect(
                    -strokeLength / 2,
                    -strokeWidth / 2,
                    strokeLength,
                    strokeWidth
                );
                ctx.restore(); // Restore context state to avoid affecting subsequent drawings
            }
        }

        // Update last position for the next frame
        lastX = currentX;
        lastY = currentY;

        calculateRevealPercentage();
    }

    /**
     * Ends the scratching process.
     */
    function endScratch() {
        scratchAudio.pause()

        isScratching = false;
        scratchCanvas.classList.remove("scratching");
        lastX = null; // Reset last position when scratching ends
        lastY = null; // Reset last position when scratching ends
        // Fully reveal if enough has been scratched
        if (revealPercentage >= revealThreshold) {
            ctx.clearRect(0, 0, scratchCanvas.width, scratchCanvas.height); // Clear the whole canvas
        }
    }

    /**
     * Calculates the percentage of the canvas that has been scratched away.
     */
    function calculateRevealPercentage() {
        const imageData = ctx.getImageData(
            0,
            0,
            scratchCanvas.width,
            scratchCanvas.height
        );
        const pixels = imageData.data;
        let transparentPixels = 0;

        for (let i = 0; i < pixels.length; i += 4) {
            // Check the alpha channel (index 3). If 0, it's transparent.
            if (pixels[i + 3] === 0) {
                transparentPixels++;
            }
        }
        revealPercentage = (transparentPixels / (pixels.length / 4)) * 100;

        // If threshold reached, clear the entire canvas to fully reveal
        if (revealPercentage >= revealThreshold) {
            ctx.clearRect(0, 0, scratchCanvas.width, scratchCanvas.height);
            // Disable further scratching by removing event listeners
            scratchCanvas.removeEventListener("mousedown", startScratch);
            scratchCanvas.removeEventListener("mousemove", scratch);
            scratchCanvas.removeEventListener("mouseup", endScratch);
            scratchCanvas.removeEventListener("mouseleave", endScratch);
            scratchCanvas.removeEventListener("touchstart", startScratch);
            scratchCanvas.removeEventListener("touchmove", scratch);
            scratchCanvas.removeEventListener("touchend", endScratch);
            scratchCanvas.removeEventListener("touchcancel", endScratch);
            scratchCanvas.style.cursor = "default"; // Change cursor to default
        }
    }

    /**
     * Resets the ticket to its initial state for a new game.
     */
    function resetTicket() {
        ctx.globalCompositeOperation = "source-over"; // Reset composite operation for drawing
        setupCanvas(); // Redraw the scratch layer
        setOutcome(); // Set a new outcome
        revealPercentage = 0;

        // Re-enable event listeners for a new game
        scratchCanvas.addEventListener("mousedown", startScratch);
        scratchCanvas.addEventListener("mousemove", scratch);
        scratchCanvas.addEventListener("mouseup", endScratch);
        scratchCanvas.addEventListener("mouseleave", endScratch);
        scratchCanvas.addEventListener("touchstart", startScratch);
        scratchCanvas.addEventListener("touchmove", scratch, {
            passive: false,
        });
        scratchCanvas.addEventListener("touchend", endScratch);
        scratchCanvas.addEventListener("touchcancel", endScratch);
        // scratchCanvas.style.cursor = "grab"; // Reset cursor
    }

    // --- Event Listeners ---
    scratchCanvas.addEventListener("mousedown", startScratch);
    scratchCanvas.addEventListener("mousemove", scratch);
    scratchCanvas.addEventListener("mouseup", endScratch);
    scratchCanvas.addEventListener("mouseleave", endScratch); // End scratching if mouse leaves canvas

    scratchCanvas.addEventListener("touchstart", startScratch);
    // Use { passive: false } for touchmove to allow preventDefault
    scratchCanvas.addEventListener("touchmove", scratch, {
        passive: false,
    });
    scratchCanvas.addEventListener("touchend", endScratch);
    scratchCanvas.addEventListener("touchcancel", endScratch);

    resetButton.addEventListener("click", resetTicket);

    // Initial setup when the page loads
    setOutcome(); // Set the initial win/lose state
    setupCanvas(); // Draw the scratch-off layer

    // Handle window resizing to keep canvas responsive
    window.addEventListener("resize", () => {
        // Re-setup canvas on resize to adjust dimensions
        setupCanvas();
        // If already scratched, re-apply the reveal (or keep it fully revealed)
        if (revealPercentage >= revealThreshold) {
            ctx.clearRect(0, 0, scratchCanvas.width, scratchCanvas.height);
        } else {
            // If not fully revealed, redraw the scratch layer
            // This might reset partial scratches, which is acceptable for simplicity
            // For a more complex solution, one would save scratch data.
            setupCanvas();
        }
    });
});