document.addEventListener('DOMContentLoaded', () => {
    // Define character data including names, details, image paths, and quotes.
    const characters = {
        quaker: {
            name: 'Quaker',
            details: 'White cat with green eyes',
            image: 'https://placehold.co/180x180/007bff/ffffff?text=Quaker', // Placeholder image URL
            quotes: [
                "Meow, and have a purr-fect day!",
                "Every nap is a new adventure.",
                "Sunbeams are my favorite art.",
                "A gentle purr soothes the soul.",
                "Life is better with a cozy blanket."
            ]
        },
        missy: {
            name: 'Missy',
            details: 'Siamese cat with blue eyes',
            image: 'https://placehold.co/180x180/ff6b6b/ffffff?text=Missy', // Placeholder image URL
            quotes: [
                "Elegant, always.",
                "My voice is my charm.",
                "Seek knowledge, and a warm lap.",
                "The world is my catwalk.",
                "A true queen always knows her worth."
            ]
        },
        set: {
            name: 'Set',
            details: 'Black cat with yellow eyes, short-fur',
            image: 'https://placehold.co/180x180/28a745/ffffff?text=Set', // Placeholder image URL
            quotes: [
                "The night is my domain.",
                "Shadows hold secrets.",
                "Swift, silent, and always on the prowl.",
                "My eyes see all.",
                "Mystery is my middle name."
            ]
        },
        gigi: {
            name: 'Gigi',
            details: 'Orange cat with long fur',
            image: 'https://placehold.co/180x180/fd7e14/ffffff?text=Gigi', // Placeholder image URL
            quotes: [
                "Fluffiness is next to godliness.",
                "A good brush is pure bliss.",
                "I bring the sunshine wherever I go.",
                "Tangly situations require purrsistence.",
                "My fur is my crown."
            ]
        }
    };

    // Get references to DOM elements for character selection and side menu
    const characterImages = document.querySelectorAll('.character-img');
    const sideMenu = document.getElementById('sideMenu');
    const closeBtn = document.querySelector('.close-btn');
    const menuCharacterName = document.getElementById('menuCharacterName');
    const menuCharacterImage = document.getElementById('menuCharacterImage');
    const menuCharacterDetails = document.getElementById('menuCharacterDetails');
    const menuCharacterQuote = document.getElementById('menuCharacterQuote');

    // Get references to DOM elements for the new reveal feature
    const revealButton = document.getElementById('revealButton');
    const revealModal = document.getElementById('revealModal');
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    const revealCatButtons = document.querySelectorAll('.reveal-cat-btn');
    const revealResult = document.getElementById('revealResult');

    let burglarCat = null; // Variable to store the randomly chosen burglar cat

    /**
     * Returns a random quote from an array of quotes.
     * @param {string[]} quotes - An array of strings representing quotes.
     * @returns {string} A randomly selected quote.
     */
    function getRandomQuote(quotes) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex];
    }

    // Add click event listeners to each character image for the side menu
    characterImages.forEach(img => {
        img.addEventListener('click', (event) => {
            const characterId = event.target.id; // Get the ID of the clicked image (e.g., 'quaker')
            const character = characters[characterId]; // Retrieve character data from the 'characters' object

            if (character) {
                // Populate the side menu with the selected character's data
                menuCharacterName.textContent = character.name;
                menuCharacterImage.src = character.image;
                menuCharacterImage.alt = character.name; // Set alt text for accessibility
                menuCharacterDetails.textContent = character.details;
                menuCharacterQuote.textContent = getRandomQuote(character.quotes); // Get a random quote

                // Open the side menu by adding the 'open' class
                sideMenu.classList.add('open');
            }
        });
    });

    // Add click event listener to the close button of the side menu
    closeBtn.addEventListener('click', () => {
        // Close the side menu by removing the 'open' class
        sideMenu.classList.remove('open');
    });

    // Add a global click event listener to close the side menu if clicked outside
    document.addEventListener('click', (event) => {
        // Check if the click was outside the side menu AND not on a character image
        // and if the side menu is currently open.
        if (!sideMenu.contains(event.target) && // Click is not inside the side menu
            !Array.from(characterImages).includes(event.target) && // Click is not on a character image
            sideMenu.classList.contains('open')) { // Side menu is currently open
            sideMenu.classList.remove('open');
        }
    });

    // --- reveal Feature Logic ---

    // Event listener to open the reveal modal when the "reveal" button is clicked
    revealButton.addEventListener('click', () => {
        revealModal.classList.add('active'); // Show the modal
        revealResult.innerHTML = ''; // Clear any previous results in the modal

        // Randomly choose the burglar cat from the available characters
        const catKeys = Object.keys(characters);
        const randomKey = catKeys[Math.floor(Math.random() * catKeys.length)];
        burglarCat = characters[randomKey];

        // Re-enable all reveal buttons and reset their opacity
        revealCatButtons.forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = '1';
        });
    });

    // Event listener to close the reveal modal when its close button is clicked
    modalCloseBtn.addEventListener('click', () => {
        revealModal.classList.remove('active'); // Hide the modal
    });

    // Event listener to close the reveal modal if clicked outside its content area
    window.addEventListener('click', (event) => {
        if (event.target === revealModal) { // Check if the click was directly on the modal overlay
            revealModal.classList.remove('active'); // Hide the modal
        }
    });

    // Add event listeners to the cat selection buttons within the reveal modal
    revealCatButtons.forEach(btn => {
        btn.addEventListener('click', (event) => {
            // Disable all cat buttons in the modal after a choice is made
            revealCatButtons.forEach(disableBtn => {
                disableBtn.disabled = true;
                disableBtn.style.opacity = '0.6'; // Visually indicate disabled state
            });

            // Extract the chosen cat's ID from the button's ID (e.g., "reveal-quaker" -> "quaker")
            const chosenCatId = event.target.id.replace('reveal-', '');
            const chosenCat = characters[chosenCatId]; // Get the data for the chosen cat

            // Check if the chosen cat is the actual burglar
            if (chosenCat.name === burglarCat.name) {
                revealResult.innerHTML = `<span style="color: #28a745;">Right. The culprit is</span>
                <img src="${burglarCat.image}" alt="${burglarCat.name}" style="max-width: 120px; border-radius: 10px; margin-top: 10px;">`
            } else {
                // Display message for incorrect guess, showing the correct burglar's name and image
                revealResult.innerHTML = `
                    <span style="color: #dc3545;">Wrong. The culprit is</span>
                    <img src="${burglarCat.image}" alt="${burglarCat.name}" style="max-width: 120px; border-radius: 10px; margin-top: 10px;">
                `; // Red text for incorrect guess
            }
        });
    });
});