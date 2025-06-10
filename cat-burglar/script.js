document.addEventListener('click', (e) => {
    // if outside of the character modal, close the modal
    console.log(e.target)
    if (!doesAncestorContainId(e.target)) {
        console.log('close the container')
    }
})
const doesAncestorContainId = (elem, id) => {
    if (!elem) return
    if (elem.id && elem.id === id) return true
    return doesAncestorContainId(elem.parentElement, id)
}
document.addEventListener('DOMContentLoaded', () => {
    const scenarios = [
        {
            id: 1,
            description: "The Metropolitan Museum of Art housed the world's most comprehensive collection of ancient artifacts, housed in a fortress-like building. Within a glass box sat a Roman signet ring dating to 49 BCE, supposedly worn by Julius Caesar himself. The gold band, no larger than a quarter, bore Caesar's personal seal and represented one of the most significant archaeological discoveries of the century.",
            image: 'img/roman.jpg',
        }
    ]
    // Define character data including names, details, image paths, and answers to specific questions.
    const characters = {
        quaker: {
            name: 'Quaker',
            details: 'Veteran cat burglar known for elaborate heists',
            image: 'img/white.png',
            answers: [
                { question: "Where were you last night?", answer: "Oh, I was just dreaming of chasing laser pointers, right here on my favorite blanket." },
                { question: "What do you know about this place's security system?", answer: "Security? The only thing I know about is the softest spot on the couch, which is very secure for napping." },
                { question: "Of the suspects, who do you think is guilty?", answer: "Guilty? Meow-be Missy, she always looks like she's plotting something. Or Set, he's a bit shifty." }
            ]
        },
        missy: {
            name: 'Missy',
            details: 'Acrobatic specialist who loves challenging heists',
            image: 'img/brown.png',
            answers: [
                { question: "Where were you last night?", answer: "Darling, I was maintaining my impeccable appearance. One must always be camera-ready, you know." },
                { question: "What do you know about this place's security system?", answer: "The security system is adequate for keeping out riff-raff. My only concern is ensuring there are no drafts by the window." },
                { question: "Of the suspects, who do you think is guilty?", answer: "Quaker is far too innocent. Gigi is too fluffy to be discreet. Set, however... he has that look in his eye sometimes." }
            ]
        },
        set: {
            name: 'Set',
            details: 'Silent infiltration expert',
            image: 'img/gray.png',
            answers: [
                { question: "Where were you last night?", answer: "I was... observing. From the shadows. Very important observations." },
                { question: "What do you know about this place's security system?", answer: "It has its vulnerabilities. Especially if you know how to leverage a loose screen or a slightly ajar door." },
                { question: "Of the suspects, who do you think is guilty?", answer: "It certainly wasn't me. Perhaps Gigi. She looks innocent, but that's what makes her dangerous." }
            ]
        },
        gigi: {
            name: 'Gigi',
            details: 'Young, ambitious burglar',
            image: 'img/orange.png',
            answers: [
                { question: "Where were you last night?", answer: "I was buried under a pile of cushions, having the most delightful dream about a giant ball of yarn!" },
                { question: "What do you know about this place's security system?", answer: "Oh, it's very solid! Except for that one creaky floorboard near the kitchen. It makes a funny sound." },
                { question: "Of the suspects, who do you think is guilty?", answer: "Set always looks like he's hiding something in his short fur. And Missy is very cunning. Definitely not Quaker, he's too sweet!" }
            ]
        }
    };
    for (let img of document.querySelector('.character-selection').children) {
        img.src = characters[img.id].image
    }
    // Get references to DOM elements for character selection and side menu
    const characterImages = document.querySelectorAll('.character-img');
    const sideMenu = document.getElementById('sideMenu');
    const closeBtn = document.querySelector('.close-btn');
    const menuCharacterName = document.getElementById('menuCharacterName');
    const menuCharacterImage = document.getElementById('menuCharacterImage');
    const menuCharacterDetails = document.getElementById('menuCharacterDetails');
    const menuCharacterQuestions = document.getElementById('menuCharacterQuestions'); // New element for questions

    // Get references to DOM elements for the new Reveal feature
    const revealButton = document.getElementById('revealButton');
    const revealModal = document.getElementById('revealModal');
    const revealModalCloseBtn = document.querySelector('.reveal-modal-close');
    const revealCatButtons = document.querySelectorAll('.reveal-cat-btn');
    const revealResult = document.getElementById('revealResult');

    // Get references to DOM elements for the Clues feature
    const cluesButton = document.getElementById('cluesButton');
    const cluesModal = document.getElementById('cluesModal');
    const cluesModalCloseBtn = document.querySelector('.clues-modal-close');

    // Get references for the new Question button and main container
    const questionButton = document.getElementById('questionButton');
    const mainContainer = document.getElementById('mainContainer'); // The container holding H1 and character images

    let burglarCat = null; // Variable to store the randomly chosen burglar cat

    /**
     * Handles displaying character details and their answers in the side menu.
     * @param {Object} character - The character object containing name, details, image, and answers.
     */
    function displayCharacterInfo(character) {
        menuCharacterName.textContent = character.name;
        menuCharacterImage.src = character.image;
        menuCharacterImage.alt = character.name; // Set alt text for accessibility
        menuCharacterDetails.textContent = character.details;

        // Clear previous questions and answers
        menuCharacterQuestions.innerHTML = '';

        // Populate with questions and answers
        character.answers.forEach(item => {
            const questionElement = document.createElement('h3');
            questionElement.textContent = item.question;
            menuCharacterQuestions.appendChild(questionElement);

            const answerElement = document.createElement('p');
            answerElement.textContent = item.answer;
            menuCharacterQuestions.appendChild(answerElement);
        });

        sideMenu.classList.add('open');
    }


    // Add click event listeners to each character image for the side menu
    characterImages.forEach(img => {
        img.addEventListener('click', (event) => {
            const characterId = event.target.id; // Get the ID of the clicked image (e.g., 'quaker')
            const character = characters[characterId]; // Retrieve character data from the 'characters' object

            if (character) {
                displayCharacterInfo(character);
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

    // --- Reveal Feature Logic ---

    // Event listener to open the reveal modal when the "Reveal" button is clicked
    revealButton.addEventListener('click', () => {
        revealModal.classList.add('active');
        revealResult.innerHTML = '';

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
    revealModalCloseBtn.addEventListener('click', () => {
        revealModal.classList.remove('active');
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
                revealResult.innerHTML = '<span style="color: #28a745;">Found the cat burglar!</span>'; // Green text for correct guess
            } else {
                // Display message for incorrect guess, showing the correct burglar's name and image
                revealResult.innerHTML = `
                            <span style="color: #dc3545;">Wrong one. Here's whodunit:</span>
                            <br>
                            ${burglarCat.name}
                            <br>
                            <img src="${burglarCat.image}" alt="${burglarCat.name}" style="max-width: 120px; border-radius: 10px; margin-top: 10px;">
                        `; // Red text for incorrect guess
            }
        });
    });

    // --- Clues Feature Logic ---

    // Event listener to open the clues modal when the "Clues" button is clicked
    cluesButton.addEventListener('click', () => {
        cluesModal.classList.add('active'); // Show the modal
    });

    // Event listener to close the clues modal when its close button is clicked
    cluesModalCloseBtn.addEventListener('click', () => {
        cluesModal.classList.remove('active'); // Hide the modal
    });

    // --- Question Button Logic ---
    questionButton.addEventListener('click', () => {
        mainContainer.classList.toggle('visible'); // Toggle visibility of the main content
    });

    // Global click listener to close modals if clicking outside their content
    window.addEventListener('click', (event) => {
        if (event.target === revealModal) {
            revealModal.classList.remove('active');
        }
        if (event.target === cluesModal) {
            cluesModal.classList.remove('active');
        }
    });
});