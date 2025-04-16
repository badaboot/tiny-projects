const MAX_HEALTH = 6;
const baseHealthCountElem = document.getElementById("baseHealth");
baseHealthCountElem.textContent = MAX_HEALTH;
const pipeElems = document.getElementsByClassName("pipes")[0].children;
const cardsElem = document.getElementById("holder");
const COLORS = ["red", "green", "purple", "blue"];
const GAME_KEY = "mana-cards-best";
const backgroundMusic = new Audio("audio/celesta.mp3");
const hitSound = new Audio("audio/chime.mp3");
const drawCardSound = new Audio("audio/draw.mp3");

let timestampStart;
let startNextWave = false;
let isGameEnd = false;
// return [0, max)
const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};
const getColor = () => {
  return COLORS[getRandomInt(COLORS.length)];
};

const millisToMinutesAndSeconds = (millis) => {
  const date = new Date(millis);
  return `${date.getMinutes()} minutes ${date.getSeconds()} seconds`;
};

const gameLoopIntervalID = setInterval(() => {
  if (isGameEnd) endGame();
  if (startNextWave) {
    makeMonsterWave();
    startNextWave = false;
  }
}, 1000);

const endGame = () => {
  clearInterval(gameLoopIntervalID);
  // stop the monster wave
  for (let pipe of pipeElems) {
    for (let child of pipe.children) {
      child.parentElement.removeChild(child);
    }
  }
  const diff = Date.now() - timestampStart;
  const best = Math.max(localStorage.getItem(GAME_KEY), diff);
  localStorage.setItem(GAME_KEY, best);
  document.getElementById("duration").textContent +=
    " " + millisToMinutesAndSeconds(diff);
  document.getElementById("best").textContent +=
    " " + millisToMinutesAndSeconds(best);
  document.getElementById("end").parentElement.classList.remove("hide");
};

const getIntervalID = (newNode) => {
  const intervalID = setInterval(() => {
    const marginTop = newNode.style.marginTop || "0px";
    const newMarginTop =
      parseInt(marginTop.slice(0, marginTop.length - 2), 10) + 50;
    if (newMarginTop > 600) {
      clearInterval(intervalID);
      // inflict damage + remove monsters
      const newHealth =
        parseInt(baseHealthCountElem.textContent, 10) - newNode.textContent;
      baseHealthCountElem.textContent = Math.max(0, newHealth);
      if (newNode.parentElement) {
        newNode.parentElement.removeChild(newNode);
      }

      if (newHealth <= 0) {
        // END GAME
        isGameEnd = true;
        startNextWave = false;
      } else {
        startNextWave = true;
      }
    }
    newNode.style.marginTop = newMarginTop + "px";
  }, 1000);
  return intervalID;
};

const makeMonsterWave = () => {
  for (let pipe of pipeElems) {
    const newNode = document.createElement("div");
    newNode.classList.add("monster");
    const intervalID = getIntervalID(newNode);
    newNode.dataset.intervalID = intervalID;
    newNode.style.background = getColor();
    newNode.textContent = 1 + getRandomInt(5); // 1 to 5 inclusive
    pipe.appendChild(newNode);
  }
};

let selectedCardId;
function dragStart(ev) {
  ev.dataTransfer.effectAllowed = "move";
  ev.dataTransfer.setData("Text", ev.target.getAttribute("id"));
  ev.dataTransfer.setDragImage(ev.target, 50, 50);
  selectedCardId = ev.target.getAttribute("id");
  return true;
}

const removeClassFromAllElems = (className) => {
  for (let elem of document.getElementsByClassName(className)) {
    elem.classList.remove(className);
  }
};
const getSelectedCard = () => {
  if (selectedCardId !== undefined) {
    const card = document.getElementById(selectedCardId);
    return card.style.background;
  }
  return "";
};

document.addEventListener("dragenter", (ev) => {
  removeClassFromAllElems("active");
  if (ev.target.classList.contains("dropIt")) {
    ev.target.classList.add("active");
  }
  ev.stopPropagation();
  return false;
});

document.addEventListener("dragover", (ev) => {
  ev.preventDefault();
});

const removeMonsterCellAndClearTimer = (cell) => {
  clearInterval(cell.dataset.intervalID);
  cell.parentElement.removeChild(cell);
};

document.addEventListener("drop", (ev) => {
  if (ev.target.classList.contains("dropIt")) {
    ev.target.classList.remove("active");
    const monsterChild = ev.target.children.length
      ? ev.target.children[0]
      : undefined;

    if (monsterChild) {
      hitSound.play();
      const color = getSelectedCard();
      cardsElem.removeChild(document.getElementById(selectedCardId));
      // destroy it
      if (monsterChild.style.background === color) {
        removeMonsterCellAndClearTimer(monsterChild);
      } else {
        // half it
        const res = Math.floor(parseInt(monsterChild.textContent, 10) / 2);
        if (res === 0) removeMonsterCellAndClearTimer(monsterChild);
        else monsterChild.textContent = res;
      }
      // if that was the last card, look at the score
      // if score === 0 end game, else start another wave
      if (document.getElementsByClassName("monster").length === 0) {
        if (baseHealthCountElem === 0) {
          isGameEnd = true;
          endGame();
        } else {
          makeMonsterWave();
        }
      }
    }
  }
  if (cardsElem.children.length === 0) {
    getCards();
  }
  selectedCardId = undefined;
  ev.stopPropagation();
  return false;
});

// cards logic
const getCards = () => {
  drawCardSound.play();
  const cards = new Array(6).fill(0).map(() => getColor());

  cards.forEach((color, index) => {
    const newNode = document.createElement("div");
    newNode.classList.add("drag");
    newNode.id = "box" + index;
    newNode.draggable = true;
    newNode.ondragstart = dragStart;

    newNode.style.background = color;
    cardsElem.appendChild(newNode);
  });
};
for (let button of document.getElementsByClassName("close")) {
  button.addEventListener("click", () => {
    button.parentElement.classList.add("hide");
  });
}
document.getElementById("instruction").addEventListener("click", () => {
  document.querySelector(".info").classList.remove("hide");
});

document.getElementById("restart").addEventListener("click", () => {
  window.location.reload();
});
document.getElementById("start").addEventListener("click", (e) => {
  e.target.parentElement.classList.add("hide");
  getCards();
  makeMonsterWave();
  timestampStart = Date.now();
  backgroundMusic.play();
  backgroundMusic.loop = true;
});
