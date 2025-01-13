const MAX_POWER = 8;
const powerCountElem = document.getElementById("powerCount");
const MAX_HEALTH = 16;
const baseHelathCountElem = document.getElementById("baseHealth");
baseHelathCountElem.textContent = MAX_HEALTH;
powerCountElem.textContent = MAX_POWER;
const pipeElems = document.getElementsByClassName("pipes")[0].children;
const cardsElem = document.getElementById("holder");
const COLORS = ["red", "green", "purple", "blue"];

// return [0, max)
const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};
const getColor = () => {
  return COLORS[getRandomInt(COLORS.length)];
};

const makeMonsterWave = () => {
  for (let pipe of pipeElems) {
    const newNode = document.createElement("div");
    newNode.classList.add("monster");
    newNode.style.background = getColor();
    newNode.textContent = 1 + getRandomInt(5); // 1 to 5 inclusive
    pipe.appendChild(newNode);
  }
};
makeMonsterWave();
// TODO: replace with particles
const powerUpElem = document.getElementById("power-up");
powerUpElem.addEventListener("click", () => {
  powerCountElem.textContent = parseInt(powerCountElem.textContent, 10) + 1;
});

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
    return {
      power: parseInt(card.textContent, 10),
      color: card.style.background,
    };
  }
  return 0;
};
function dragEnter(ev) {
  removeClassFromAllElems("active");
  removeClassFromAllElems("disallow");
  const { power } = getSelectedCard();
  if (ev.target.classList.contains("dropIt")) {
    const remainingPower = parseInt(powerCountElem.textContent, 10);
    let isActive = remainingPower > 0;
    if (remainingPower < power) isActive = false;
    ev.target.classList.add(isActive ? "active" : "disallow");
  }
  ev.stopPropagation();
  return false;
}

function dragOver(ev) {
  ev.preventDefault();
}

// function defined for when drop element on target
function dragDrop(ev) {
  const { power, color } = getSelectedCard();
  if (ev.target.classList.contains("dropIt")) {
    ev.target.classList.remove("active");
    ev.target.classList.remove("disallow");
    const monsterChild = ev.target.children.length
      ? ev.target.children[0]
      : undefined;
    if (monsterChild) {
      const trueNum =
        color === monsterChild.style.background ? power : power / 2;
      if (monsterChild.textContent <= trueNum) {
        ev.target.removeChild(monsterChild);
      } else {
        monsterChild.textContent -= trueNum;
      }
    }
  }
  const res = parseInt(powerCountElem.textContent - power, 10);
  if (res >= 0) {
    powerCountElem.textContent = res;
    cardsElem.removeChild(document.getElementById(selectedCardId));
  }
  if (cardsElem.children.length === 0) {
    getCards();
  }
  selectedCardId = undefined;
  ev.stopPropagation();
  return false;
}

// cards logic
// TODO: randomize cards
const getCards = () => {
  const cards = [
    { color: "blue", power: 1 },
    { color: "purple", power: 1 },
    { color: "purple", power: 2 },
    { color: "purple", power: 3 },
    { color: "green", power: 1 },
    { color: "red", power: 1 },
  ];

  cards.forEach(({ color, power }, index) => {
    const newNode = document.createElement("div");
    newNode.classList.add("drag");
    newNode.id = "box" + index;
    newNode.draggable = true;
    newNode.ondragstart = dragStart;

    newNode.textContent = power;
    newNode.style.background = color;
    cardsElem.appendChild(newNode);
  });
};

getCards();
