const board = document.querySelector('.board');
const clone = document.querySelector('.clone');
const playAgainBtn = document.querySelector('.play-again');
const gameOverElement = document.querySelector('.gameover');
const optionElems = document.querySelectorAll(`option`)
let currentThemeId = 'fish'
const tileOptionsMap = {
    'fish': ['fish1', 'fish2', 'fish3', 'fish4', 'fish5', 'fish6'],
    'eggs': ['blue', 'green', 'purple', 'red', 'white', 'yellow'],
    'rpg': ['coin', 'crystal', 'mineral', 'paper', 'skull', 'wood'],
    'flower': ['anthurium', 'daffodil', 'heather', 'pansies', 'protea', 'scarlet']
}
let tileOptions = tileOptionsMap['fish'];
const seaMusic = new Audio("audio/sea.mp3");
const flowerMusic = new Audio("audio/flower.mp3");
const rpgMusic = new Audio("audio/rpg.mp3");
const dragonMusic = new Audio("audio/dragon.mp3");
const musicMap = {
    'fish': seaMusic,
    'eggs': dragonMusic,
    'rpg': rpgMusic,
    'flower': flowerMusic
}
const matchSound = new Audio("audio/winSound.wav");
const menuClickSound = new Audio("audio/menuClick.wav");
const winSound = new Audio("audio/yay.mp3");
const clickSound = new Audio("audio/woodClick.wav");

const state = {
    selections: [],
    boardLocked: false,
    matches: 0
};

const showBoard = () => {
    document.querySelector(`.some-page-wrapper`).classList.add('hide');
}

playAgainBtn.addEventListener('click', () => {
    menuClickSound.play();
    musicMap[currentThemeId].pause();
    currentThemeId = document.querySelector(`select`).value
    tileOptions = tileOptionsMap[currentThemeId]
    resetGame();
})

function resetGame() {
    showBoard();
    musicMap[currentThemeId].play();
    gameOverElement.classList.add('hide');
    state.boardLocked = true;
    state.selections = [];
    state.matches = 0;

    document.querySelectorAll('.cube').forEach(tile => {
        tile.removeEventListener('click', () => selectTile(tile));
        tile.remove();
    });

    createBoard();
}

function createBoard() {
    const tiles = shuffleArray([...tileOptions, ...tileOptions]);
    const length = tiles.length;

    for (let i = 0; i < length; i++) {
        window.setTimeout(() => {
            board.appendChild(buildTile(tiles.pop(), i));
        }, i * 100);
    }

    window.setTimeout(() => {
        document.querySelectorAll('.cube').forEach(tile => {
            tile.addEventListener('click', () => selectTile(tile));
        });

        state.boardLocked = false;
    }, tiles.length * 100);
}

function buildTile(option, id) {
    const tile = clone.cloneNode(true);
    tile.classList.remove('clone');
    tile.classList.add('cube');
    tile.setAttribute('data-tile', option);
    tile.setAttribute('data-id', id);
    return tile;
}
// generates a random number between 0 and max exclusive
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function selectTile(selectedTile) {
    clickSound.play()
    if (state.boardLocked || selectedTile.classList.contains('flipped')) return;

    state.boardLocked = true;

    if (state.selections.length <= 1) {
        selectedTile.classList.add('flipped');
        state.selections.push({
            id: selectedTile.dataset.id,
            tile: selectedTile.dataset.tile,
            el: selectedTile
        });
    }
    if (state.selections.length === 2) {
        if (state.selections[0].tile === state.selections[1].tile) {
            window.setTimeout(() => {
                state.selections[0].el.classList.add('matched', 'blink');
                state.selections[1].el.classList.add('matched', 'blink');

                state.boardLocked = false;
                state.matches = state.matches + 1;

                if (state.matches === tileOptions.length) {
                    window.setTimeout(() => {
                        gameOverElement.classList.remove('hide');
                        const index = getRandomInt(optionElems.length)
                        optionElems[index].selected = true;
                        winSound.play();
                    }, 600);
                }
                state.selections = [];
                matchSound.play();
            }, 600);
        } else {
            setTimeout(() => {
                document.querySelectorAll('.cube').forEach(tile => {
                    tile.classList.remove('flipped');
                });
                state.boardLocked = false;
            }, 800);
            state.selections = [];
        }
    } else {
        state.boardLocked = false;
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

for (let buttonParent of document.querySelectorAll('.column')) {
    const buttonElem = buttonParent.querySelector('button');
    buttonElem.addEventListener('click', () => {
        menuClickSound.play();
        currentThemeId = buttonElem.dataset.id;
        musicMap[currentThemeId].play();
        musicMap[currentThemeId].loop = true;
        tileOptions = tileOptionsMap[currentThemeId]
        createBoard();
        showBoard()
    });
}