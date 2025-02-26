const characters = [
  {
    name: "T-Wrecks",
    image: "🦖",
  },
  {
    name: "Sauropod",
    image: "🦕",
  },
];
const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};
// 1 to 6
const getRollResult = () => getRandomInt(6) + 1;
let result;
let currentCharacter;
const YOUR_GAME_KEY = "dino-run-your-wins";
const ENEMY_GAME_KEY = "dino-run-enemy-wins";

const MAX_LENGTH = 20;
const arr = new Array(MAX_LENGTH).fill("");
const BACK_TO_START_POS = [5, 12, 18];
BACK_TO_START_POS.forEach((pos) => {
  arr[pos] = "Tar pit: return to Start!";
});
arr[0] = "Start";
arr[MAX_LENGTH - 1] = "Finish";

const audio = document.getElementsByTagName("audio")[0];
const ohNoSound = new Audio("audio/oh-no.mp3");
const stompSound = new Audio("audio/stomp.mp3");
const yaySound = new Audio("audio/yay.mp3");
const lossSound = new Audio("audio/loss-trombone.mp3");
const crunchSound = new Audio("audio/crunch.mp3");
const roarSound = new Audio("audio/roar.mp3");

let isOver = false;
let isYourTurn = true;
const rollElem = document.getElementById("roll");
const loopElements = document.getElementsByClassName("flex-item");
const gameStatusElem = document.getElementById("gameStatus");
const endElem = document.getElementById("end");

const showOneHideOther = (showId, hideId) => {
  document.getElementById(hideId).classList.add("hide");
  document.getElementById(showId).classList.remove("hide");
};
document.getElementById("doBattle").addEventListener("click", () => {
  showOneHideOther("battleDetails", "doBattle");
  roarSound.play();
  const roll1 = getRollResult();
  const roll2 = getRollResult();
  document.getElementById("rexScore").textContent += ` Die roll ${roll1}`;
  document.getElementById("sauroScore").textContent += ` Die roll ${roll2}`;
  const losingChar = roll1 > roll2 ? characters[1] : characters[0];

  losingChar.position = 0;
  document.getElementById(
    "battleResult"
  ).textContent = `${losingChar.name} lost`;
  setTimeout(() => {
    goToSquare(0, document.getElementById(losingChar.name));
  }, 1000);
});

const doMove = () => {
  rollDice();
  setTimeout(() => {
    currentCharacter = isYourTurn ? characters[0] : characters[1];
    currentCharacter.position += result;
    goToSquare(
      currentCharacter.position,
      document.getElementById(currentCharacter.name)
    );
    if (
      characters[0].position === characters[1].position &&
      characters[1].position > 0
    ) {
      showOneHideOther("battle", "normal");
      return;
    }

    if (currentCharacter.position >= MAX_LENGTH - 1) {
      endGame();
      return;
    }
    if (BACK_TO_START_POS.includes(currentCharacter.position)) {
      // play sad sound
      ohNoSound.play();

      setTimeout(() => {
        currentCharacter.position = 0;
        goToSquare(0, document.getElementById(currentCharacter.name));
        isYourTurn = !isYourTurn;
        doTurn();
      }, 2000);

      return;
    }
    isYourTurn = !isYourTurn;
    doTurn();
  }, 1500);
};

const endGame = () => {
  const didYouWin = currentCharacter.name === characters[0].name;
  let yourWinCount = parseInt(localStorage.getItem(YOUR_GAME_KEY), 10) || 0;
  let enemyWinCount = parseInt(localStorage.getItem(ENEMY_GAME_KEY), 10) || 0;
  audio.pause();

  if (didYouWin) {
    yourWinCount += 1;
    localStorage.setItem(YOUR_GAME_KEY, yourWinCount);
    yaySound.play();
  } else {
    enemyWinCount += 1;
    localStorage.setItem(ENEMY_GAME_KEY, enemyWinCount);
    lossSound.play();
  }
  endElem.classList.remove("hide");
  document.getElementById("gameStatus").classList.add("hide");
  endElem.children[0].textContent = didYouWin
    ? `You won!`
    : `${currentCharacter.name} won!`;
  endElem.children[1].textContent = `You won ${yourWinCount} and lost ${enemyWinCount} times.`;
};

const goToSquare = (position, node) => {
  console.log(position, node);

  //   console.trace();
  if (node.id === characters[0].name) {
    crunchSound.play();
  } else {
    stompSound.play();
  }
  node.parentElement.removeChild(node);
  loopElements[Math.min(position, MAX_LENGTH - 1)].appendChild(node);
};

document.getElementById("continue").addEventListener("click", () => {
  isYourTurn = !isYourTurn;
  doTurn();
});

const doTurn = () => {
  showOneHideOther("normal", "battle");

  if (isYourTurn) {
    gameStatusElem.children[3].classList.remove("active");
    gameStatusElem.children[2].classList.add("active");
    rollElem.classList.remove("hide");
    rollElem.disabled = false;
  } else {
    gameStatusElem.children[2].classList.remove("active");
    gameStatusElem.children[3].classList.add("active");
    rollElem.classList.add("hide");
    rollElem.disabled = true;

    setTimeout(() => {
      doMove();
    }, 2000);
  }
};
doTurn();

arr.forEach((str, index) => {
  if (str) {
    loopElements[index].textContent = str;
    if (BACK_TO_START_POS.includes(index)) {
      loopElements[index].style.background = "black";
    }
  }
});
characters.forEach((obj) => {
  obj.position = 0;
  const newNode = document.createElement("div");
  newNode.id = obj.name;
  newNode.textContent = obj.image;
  loopElements[0].appendChild(newNode);
});
document.getElementById("restart").addEventListener("click", () => {
  window.location.reload();
});

const dice = document.getElementById("dice");
const rollDice = () => {
  result = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
  dice.dataset.side = result;
  dice.classList.toggle("reRoll");
};

rollElem.onclick = function () {
  rollElem.disabled = true;
  if (audio.paused) {
    audio.play();
  }
  console.log("roll button clicked");
  doMove();
};
