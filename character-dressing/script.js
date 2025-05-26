// Get the canvas element and its 2D rendering context
const canvas = document.getElementById("characterCanvas");
const ctx = canvas.getContext("2d");
// TODO: change to something like this https://codepen.io/zerratar/pen/boPYdp 
// Define canvas dimensions (these are the base dimensions for drawing)
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 600;
// The actual canvas element's width/height will be set by resizeCanvas()

// Character dimensions and positions
const HEAD_RADIUS = 60;
const BODY_WIDTH = 120;
const BODY_HEIGHT = 180;
const ARM_WIDTH = 30;
const ARM_HEIGHT = 100;
const LEG_WIDTH = 40;
const LEG_HEIGHT = 150;

// Character's center X and ground Y relative to the drawing canvas
const CENTER_X = CANVAS_WIDTH / 2;
const GROUND_Y = CANVAS_HEIGHT - 50; // Ground level for feet

// Current customization selections
let currentCustomization = {
    hair: "none",
    upperBody: "none",
    lowerBody: "none",
    shoes: "none",
    jacket: "none",
    hat: "none",
};
// TODO: replace these with real graphcics
/**
 * Draws the base character (head, body, arms, legs).
 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
 */
function drawBaseCharacter(ctx) {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Body color
    ctx.fillStyle = "#ffdbac"; // Skin tone

    // Head
    ctx.beginPath();
    ctx.arc(
        CENTER_X,
        GROUND_Y - LEG_HEIGHT - BODY_HEIGHT - HEAD_RADIUS,
        HEAD_RADIUS,
        0,
        Math.PI * 2
    );
    ctx.fill();
    ctx.closePath();

    // Body
    ctx.fillRect(
        CENTER_X - BODY_WIDTH / 2,
        GROUND_Y - LEG_HEIGHT - BODY_HEIGHT,
        BODY_WIDTH,
        BODY_HEIGHT
    );

    // Arms
    ctx.fillRect(
        CENTER_X - BODY_WIDTH / 2 - ARM_WIDTH,
        GROUND_Y - LEG_HEIGHT - BODY_HEIGHT + 20,
        ARM_WIDTH,
        ARM_HEIGHT
    ); // Left arm
    ctx.fillRect(
        CENTER_X + BODY_WIDTH / 2,
        GROUND_Y - LEG_HEIGHT - BODY_HEIGHT + 20,
        ARM_WIDTH,
        ARM_HEIGHT
    ); // Right arm

    // Legs
    ctx.fillRect(
        CENTER_X - LEG_WIDTH - 10,
        GROUND_Y - LEG_HEIGHT,
        LEG_WIDTH,
        LEG_HEIGHT
    ); // Left leg
    ctx.fillRect(
        CENTER_X + 10,
        GROUND_Y - LEG_HEIGHT,
        LEG_WIDTH,
        LEG_HEIGHT
    ); // Right leg
}

/**
 * Draws the selected hair style.
 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
 * @param {string} style - The hair style ('none', 'short', 'long', 'spiky').
 */
function drawHair(ctx, style) {
    ctx.fillStyle = "#654321"; // Brown hair color
    const headTopY = GROUND_Y - LEG_HEIGHT - BODY_HEIGHT - HEAD_RADIUS;
    const headCenterX = CENTER_X;

    switch (style) {
        case "short":
            ctx.beginPath();
            ctx.arc(
                headCenterX,
                headTopY,
                HEAD_RADIUS + 10,
                Math.PI,
                Math.PI * 2
            ); // Top of head
            ctx.lineTo(headCenterX + HEAD_RADIUS, headTopY);
            ctx.lineTo(headCenterX - HEAD_RADIUS, headTopY);
            ctx.fill();
            ctx.closePath();
            // Simple sideburns
            ctx.fillRect(
                headCenterX - HEAD_RADIUS - 5,
                headTopY + HEAD_RADIUS - 10,
                10,
                20
            );
            ctx.fillRect(
                headCenterX + HEAD_RADIUS - 5,
                headTopY + HEAD_RADIUS - 10,
                10,
                20
            );
            break;
        case "long":
            ctx.beginPath();
            ctx.arc(
                headCenterX,
                headTopY,
                HEAD_RADIUS + 15,
                Math.PI,
                Math.PI * 2
            ); // Top of head
            ctx.lineTo(headCenterX + HEAD_RADIUS + 15, headTopY);
            ctx.lineTo(headCenterX - HEAD_RADIUS - 15, headTopY);
            ctx.fill();
            ctx.closePath();
            // Long hair down sides
            ctx.fillRect(
                headCenterX - HEAD_RADIUS - 10,
                headTopY + HEAD_RADIUS - 5,
                20,
                80
            );
            ctx.fillRect(
                headCenterX + HEAD_RADIUS - 10,
                headTopY + HEAD_RADIUS - 5,
                20,
                80
            );
            break;
        case "spiky":
            ctx.beginPath();
            ctx.moveTo(headCenterX, headTopY - HEAD_RADIUS - 20); // Top spike
            ctx.lineTo(headCenterX + HEAD_RADIUS, headTopY - HEAD_RADIUS);
            ctx.lineTo(headCenterX - HEAD_RADIUS, headTopY - HEAD_RADIUS);
            ctx.fill();
            ctx.closePath();
            // More spikes around the head
            ctx.beginPath();
            ctx.arc(
                headCenterX,
                headTopY,
                HEAD_RADIUS + 5,
                Math.PI,
                Math.PI * 2
            );
            ctx.lineTo(headCenterX + HEAD_RADIUS + 5, headTopY);
            ctx.lineTo(headCenterX - HEAD_RADIUS - 5, headTopY);
            ctx.fill();
            ctx.closePath();
            break;
        case "none":
        default:
            // No hair, just the head
            break;
    }
}

/**
 * Draws the selected upper body clothing.
 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
 * @param {string} style - The clothing style ('none', 'tshirt', 'hoodie', 'shirt').
 */
function drawUpperBody(ctx, style) {
    const bodyTopY = GROUND_Y - LEG_HEIGHT - BODY_HEIGHT;
    const bodyLeftX = CENTER_X - BODY_WIDTH / 2;

    switch (style) {
        case "tshirt":
            ctx.fillStyle = "#60a5fa"; // Blue T-shirt
            ctx.fillRect(bodyLeftX, bodyTopY, BODY_WIDTH, BODY_HEIGHT);
            // Short sleeves
            ctx.fillRect(
                bodyLeftX - ARM_WIDTH,
                bodyTopY + 10,
                ARM_WIDTH + 10,
                50
            );
            ctx.fillRect(
                bodyLeftX + BODY_WIDTH - 10,
                bodyTopY + 10,
                ARM_WIDTH + 10,
                50
            );
            break;
        case "hoodie":
            ctx.fillStyle = "#8b5cf6"; // Purple Hoodie
            ctx.fillRect(
                bodyLeftX - 10,
                bodyTopY - 20,
                BODY_WIDTH + 20,
                BODY_HEIGHT + 30
            ); // Slightly larger for hoodie look
            // Hood
            ctx.beginPath();
            ctx.arc(
                CENTER_X,
                bodyTopY - 20,
                HEAD_RADIUS + 15,
                Math.PI,
                Math.PI * 2
            );
            ctx.fill();
            ctx.closePath();
            // Long sleeves
            ctx.fillRect(
                bodyLeftX - ARM_WIDTH - 10,
                bodyTopY + 10,
                ARM_WIDTH + 20,
                ARM_HEIGHT + 20
            );
            ctx.fillRect(
                bodyLeftX + BODY_WIDTH - 10,
                bodyTopY + 10,
                ARM_WIDTH + 20,
                ARM_HEIGHT + 20
            );
            break;
        case "shirt":
            ctx.fillStyle = "#fcd34d"; // Yellow Collared Shirt
            ctx.fillRect(bodyLeftX, bodyTopY, BODY_WIDTH, BODY_HEIGHT);
            // Collar
            ctx.beginPath();
            ctx.moveTo(CENTER_X - 30, bodyTopY);
            ctx.lineTo(CENTER_X - 10, bodyTopY - 20);
            ctx.lineTo(CENTER_X + 10, bodyTopY - 20);
            ctx.lineTo(CENTER_X + 30, bodyTopY);
            ctx.fill();
            ctx.closePath();
            // Long sleeves
            ctx.fillRect(
                bodyLeftX - ARM_WIDTH,
                bodyTopY + 10,
                ARM_WIDTH + 10,
                ARM_HEIGHT + 10
            );
            ctx.fillRect(
                bodyLeftX + BODY_WIDTH - 10,
                bodyTopY + 10,
                ARM_WIDTH + 10,
                ARM_HEIGHT + 10
            );
            break;
        case "none":
        default:
            // No upper body clothing
            break;
    }
}

/**
 * Draws the selected lower body clothing.
 * @param {CanvasRenderingRenderingContext2D} ctx - The 2D rendering context.
 * @param {string} style - The clothing style ('none', 'pants', 'shorts', 'skirt').
 */
function drawLowerBody(ctx, style) {
    const legTopY = GROUND_Y - LEG_HEIGHT;
    const legLeftX1 = CENTER_X - LEG_WIDTH - 10;
    const legLeftX2 = CENTER_X + 10;

    switch (style) {
        case "pants":
            ctx.fillStyle = "#4b5563"; // Gray Pants
            ctx.fillRect(legLeftX1, legTopY, LEG_WIDTH, LEG_HEIGHT);
            ctx.fillRect(legLeftX2, legTopY, LEG_WIDTH, LEG_HEIGHT);
            break;
        case "shorts":
            ctx.fillStyle = "#10b981"; // Green Shorts
            ctx.fillRect(legLeftX1, legTopY, LEG_WIDTH, LEG_HEIGHT / 2);
            ctx.fillRect(legLeftX2, legTopY, LEG_WIDTH, LEG_HEIGHT / 2);
            break;
        case "skirt":
            ctx.fillStyle = "#ec4899"; // Pink Skirt
            ctx.beginPath();
            ctx.moveTo(CENTER_X - BODY_WIDTH / 2, GROUND_Y - LEG_HEIGHT);
            ctx.lineTo(CENTER_X + BODY_WIDTH / 2, GROUND_Y - LEG_HEIGHT);
            ctx.lineTo(
                CENTER_X + BODY_WIDTH / 2 + 20,
                GROUND_Y - LEG_HEIGHT + 80
            );
            ctx.lineTo(
                CENTER_X - BODY_WIDTH / 2 - 20,
                GROUND_Y - LEG_HEIGHT + 80
            );
            ctx.closePath();
            ctx.fill();
            break;
        case "none":
        default:
            // No lower body clothing
            break;
    }
}

/**
 * Draws the selected shoes.
 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
 * @param {string} style - The shoe style ('none', 'sneakers', 'boots', 'sandals').
 */
function drawShoes(ctx, style) {
    const footY = GROUND_Y;
    const footLeftX1 = CENTER_X - LEG_WIDTH - 10;
    const footLeftX2 = CENTER_X + 10;

    switch (style) {
        case "sneakers":
            ctx.fillStyle = "#ef4444"; // Red Sneakers
            ctx.fillRect(footLeftX1, footY, LEG_WIDTH, 20);
            ctx.fillRect(footLeftX2, footY, LEG_WIDTH, 20);
            break;
        case "boots":
            ctx.fillStyle = "#78350f"; // Brown Boots
            ctx.fillRect(footLeftX1, footY - 40, LEG_WIDTH, 60);
            ctx.fillRect(footLeftX2, footY - 40, LEG_WIDTH, 60);
            break;
        case "sandals":
            ctx.fillStyle = "#f97316"; // Orange Sandals
            ctx.fillRect(footLeftX1, footY, LEG_WIDTH, 10);
            ctx.fillRect(footLeftX2, footY, LEG_WIDTH, 10);
            // Straps
            ctx.strokeStyle = "#a16207";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(footLeftX1, footY);
            ctx.lineTo(footLeftX1 + LEG_WIDTH, footY);
            ctx.moveTo(footLeftX1 + LEG_WIDTH / 2, footY);
            ctx.lineTo(footLeftX1 + LEG_WIDTH / 2, footY - 10);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(footLeftX2, footY);
            ctx.lineTo(footLeftX2 + LEG_WIDTH, footY);
            ctx.moveTo(footLeftX2 + LEG_WIDTH / 2, footY);
            ctx.lineTo(footLeftX2 + LEG_WIDTH / 2, footY - 10);
            ctx.stroke();
            break;
        case "none":
        default:
            // No shoes
            break;
    }
}

/**
 * Draws the selected jacket.
 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
 * @param {string} style - The jacket style ('none', 'denim', 'leather', 'blazer').
 */
function drawJacket(ctx, style) {
    const bodyTopY = GROUND_Y - LEG_HEIGHT - BODY_HEIGHT;
    const bodyLeftX = CENTER_X - BODY_WIDTH / 2;

    switch (style) {
        case "denim":
            ctx.fillStyle = "#3b82f6"; // Blue Denim
            ctx.fillRect(
                bodyLeftX - 15,
                bodyTopY - 10,
                BODY_WIDTH + 30,
                BODY_HEIGHT + 20
            );
            // Sleeves
            ctx.fillRect(
                bodyLeftX - ARM_WIDTH - 15,
                bodyTopY + 10,
                ARM_WIDTH + 30,
                ARM_HEIGHT + 10
            );
            ctx.fillRect(
                bodyLeftX + BODY_WIDTH - 15,
                bodyTopY + 10,
                ARM_WIDTH + 30,
                ARM_HEIGHT + 10
            );
            break;
        case "leather":
            ctx.fillStyle = "#1f2937"; // Dark Gray Leather
            ctx.fillRect(
                bodyLeftX - 20,
                bodyTopY - 15,
                BODY_WIDTH + 40,
                BODY_HEIGHT + 25
            );
            // Sleeves
            ctx.fillRect(
                bodyLeftX - ARM_WIDTH - 20,
                bodyTopY + 5,
                ARM_WIDTH + 40,
                ARM_HEIGHT + 15
            );
            ctx.fillRect(
                bodyLeftX + BODY_WIDTH - 20,
                bodyTopY + 5,
                ARM_WIDTH + 40,
                ARM_HEIGHT + 15
            );
            break;
        case "blazer":
            ctx.fillStyle = "#4c51bf"; // Dark Blue Blazer
            ctx.fillRect(
                bodyLeftX - 10,
                bodyTopY - 5,
                BODY_WIDTH + 20,
                BODY_HEIGHT + 10
            );
            // Lapels
            ctx.beginPath();
            ctx.moveTo(CENTER_X - 40, bodyTopY);
            ctx.lineTo(CENTER_X - 20, bodyTopY - 20);
            ctx.lineTo(CENTER_X + 20, bodyTopY - 20);
            ctx.lineTo(CENTER_X + 40, bodyTopY);
            ctx.fill();
            ctx.closePath();
            // Sleeves
            ctx.fillRect(
                bodyLeftX - ARM_WIDTH - 10,
                bodyTopY + 10,
                ARM_WIDTH + 20,
                ARM_HEIGHT
            );
            ctx.fillRect(
                bodyLeftX + BODY_WIDTH - 10,
                bodyTopY + 10,
                ARM_WIDTH + 20,
                ARM_HEIGHT
            );
            break;
        case "none":
        default:
            // No jacket
            break;
    }
}

/**
 * Draws the selected hat.
 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
 * @param {string} style - The hat style ('none', 'beanie', 'baseballCap', 'topHat').
 */
function drawHat(ctx, style) {
    ctx.fillStyle = "#000000"; // Black hat color
    const headTopY = GROUND_Y - LEG_HEIGHT - BODY_HEIGHT - HEAD_RADIUS;
    const headCenterX = CENTER_X;

    switch (style) {
        case "beanie":
            ctx.beginPath();
            ctx.arc(
                headCenterX,
                headTopY - HEAD_RADIUS / 2,
                HEAD_RADIUS + 10,
                Math.PI,
                Math.PI * 2
            );
            ctx.fill();
            ctx.closePath();
            ctx.fillRect(
                headCenterX - HEAD_RADIUS - 10,
                headTopY - HEAD_RADIUS / 2,
                (HEAD_RADIUS + 10) * 2,
                20
            );
            break;
        case "baseballCap":
            ctx.fillStyle = "#1d4ed8"; // Blue Baseball Cap
            // Cap dome
            ctx.beginPath();
            ctx.arc(
                headCenterX,
                headTopY - HEAD_RADIUS / 2,
                HEAD_RADIUS,
                Math.PI,
                Math.PI * 2
            );
            ctx.fill();
            ctx.closePath();
            // Brim
            ctx.fillRect(
                headCenterX - HEAD_RADIUS - 10,
                headTopY - HEAD_RADIUS / 2 + 10,
                HEAD_RADIUS * 2 + 20,
                15
            );
            break;
        case "topHat":
            ctx.fillStyle = "#334155"; // Dark Gray Top Hat
            // Base
            ctx.fillRect(
                headCenterX - HEAD_RADIUS - 10,
                headTopY - HEAD_RADIUS + 20,
                (HEAD_RADIUS + 10) * 2,
                15
            );
            // Cylinder
            ctx.fillRect(
                headCenterX - HEAD_RADIUS + 10,
                headTopY - HEAD_RADIUS - 50,
                HEAD_RADIUS * 2 - 20,
                70
            );
            break;
        case "none":
        default:
            // No hat
            break;
    }
}

/**
 * Redraws the entire character with current customizations.
 */
function redrawCharacter() {
    // Save the current transformation matrix
    ctx.save();

    // Get the current actual dimensions of the canvas element
    const actualCanvasWidth = canvas.width;
    const actualCanvasHeight = canvas.height;

    // Calculate scaling factors based on original drawing dimensions
    const scaleX = actualCanvasWidth / CANVAS_WIDTH;
    const scaleY = actualCanvasHeight / CANVAS_HEIGHT;

    // Apply scaling to the context
    ctx.scale(scaleX, scaleY);

    // Draw the character elements. All drawing functions use the original CANVAS_WIDTH/HEIGHT
    // and CENTER_X/GROUND_Y, and the scaling factor will adjust them to the actual canvas size.
    drawBaseCharacter(ctx);
    drawUpperBody(ctx, currentCustomization.upperBody);
    drawLowerBody(ctx, currentCustomization.lowerBody);
    drawShoes(ctx, currentCustomization.shoes);
    drawJacket(ctx, currentCustomization.jacket); // Jacket drawn over upper body
    drawHair(ctx, currentCustomization.hair); // Hair drawn over head
    drawHat(ctx, currentCustomization.hat); // Hat drawn over hair/head

    // Restore the context to its original state (remove scaling)
    ctx.restore();
}

// Get select elements
const hairSelect = document.getElementById("hairSelect");
const upperBodySelect = document.getElementById("upperBodySelect");
const lowerBodySelect = document.getElementById("lowerBodySelect");
const shoesSelect = document.getElementById("shoesSelect");
const jacketSelect = document.getElementById("jacketSelect");
const hatSelect = document.getElementById("hatSelect");
const resetButton = document.getElementById("resetButton");

// Add event listeners to update customization
hairSelect.addEventListener("change", (event) => {
    currentCustomization.hair = event.target.value;
    redrawCharacter();
});

upperBodySelect.addEventListener("change", (event) => {
    currentCustomization.upperBody = event.target.value;
    redrawCharacter();
});

lowerBodySelect.addEventListener("change", (event) => {
    currentCustomization.lowerBody = event.target.value;
    redrawCharacter();
});

shoesSelect.addEventListener("change", (event) => {
    currentCustomization.shoes = event.target.value;
    redrawCharacter();
});

jacketSelect.addEventListener("change", (event) => {
    currentCustomization.jacket = event.target.value;
    redrawCharacter();
});

hatSelect.addEventListener("change", (event) => {
    currentCustomization.hat = event.target.value;
    redrawCharacter();
});

// Reset button functionality
resetButton.addEventListener("click", () => {
    currentCustomization = {
        hair: "none",
        upperBody: "none",
        lowerBody: "none",
        shoes: "none",
        jacket: "none",
        hat: "none",
    };
    // Reset select dropdowns to 'None'
    hairSelect.value = "none";
    upperBodySelect.value = "none";
    lowerBodySelect.value = "none";
    shoesSelect.value = "none";
    jacketSelect.value = "none";
    hatSelect.value = "none";
    redrawCharacter();
});

// Handle canvas resizing for responsiveness
function resizeCanvas() {
    const container = canvas.parentElement;
    // Get the available width in the canvas's grid column
    const availableWidth =
        container.querySelector("#characterCanvas").offsetWidth;

    // Set a maximum width for the canvas to prevent it from becoming too large
    const maxWidth = 500;
    canvas.width = Math.min(availableWidth, maxWidth);

    // Calculate height to maintain aspect ratio (original aspect ratio is 500/600 = 5/6)
    canvas.height = (canvas.width / 5) * 6;

    // Redraw character after resize to scale it to the new canvas size
    redrawCharacter();
}

// Initial draw of the character when the page loads
window.onload = function () {
    resizeCanvas(); // Set initial canvas size and draw
};

// Call resizeCanvas on window resize
window.addEventListener("resize", resizeCanvas);