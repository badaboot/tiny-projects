const characters = [
  {
    name: "T-Wrecks",
    speed: 1,
    attack: 1,
    image: "🦖",
  },
  //   {
  //     name: "Tankylosaurus",
  //     speed: 0,
  //     attack: 2,
  //   },
  //                     {
  //     name: "Velocityraptor",
  // speed: 2,
  //   attack: 0
  // }
];
// TODO: implement more enemies
const MAX_LENGTH = 16;
const arr = new Array(MAX_LENGTH).fill("");
const BACK_TO_START_POS = 12;
arr[BACK_TO_START_POS] = "Tar pit. Back to start!";
arr[0] = "Start";
arr[15] = "Finish";

let isOver = false;
let isYourTurn = true;
const rollElem = document.getElementById("roll");
const loopElements = document.getElementsByClassName("flex-item");
const gameStatusElem = document.getElementById("gameStatus");
const endElem = document.getElementById("end");

rollElem.addEventListener("click", () => {
  const numPos = getRandomInt(6) + 1; // from 1 to 6
  document.getElementById("result").textContent = numPos;
  //   const currentCharacter = isYourTurn ? characters[0] : characters[1];
  const currentCharacter = characters[0];
  const childToRemove = document.getElementById(currentCharacter.name);
  childToRemove.parentElement.removeChild(childToRemove);

  currentCharacter.position += numPos;

  if (currentCharacter.position >= MAX_LENGTH) {
    endElem.classList.remove("hide");
    document.getElementById("gameStatus").classList.add("hide");
    endElem.children[0].textContent = `${currentCharacter.name} won`;
    return;
  }
  if (currentCharacter.position === BACK_TO_START_POS) {
    currentCharacter.position = 0;
  }
  //   TODO: add animation here
  loopElements[currentCharacter.position].appendChild(childToRemove);
  isYourTurn = !isYourTurn;
  doTurn();
});

const doTurn = () => {
  gameStatusElem.children[2].classList.remove("active");
  gameStatusElem.children[1].classList.add("active");
  rollElem.disabled = false;
};
doTurn();
const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};
arr.forEach((str, index) => {
  loopElements[index].textContent = str;
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
