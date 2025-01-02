const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};
const colorArr = ["red", "yellow", "blue", "green"];
const getColorFromInt = (integer) => {
  switch (integer) {
    case 0:
    case 1:
      return "white";
    case 2:
      return "yellow";
    case 3:
      return "red";
    case 4:
      return "blue";
    default: // or 5
      return "green";
  }
};
const hitSound = new Audio("audio/chime.mp3");
const drawCardSound = new Audio("audio/draw.mp3");
let isPlayerTurn = true; // alternate between true and false. if false is opponent's turn
const gridElem = document.getElementsByClassName("grid")[0];
const opponentElem = document.getElementsByClassName("opponent")[0];
const playerElem = document.getElementsByClassName("player")[0];
const playerScoreElems = document.getElementsByClassName("player-score");
const opponentScoreElems = document.getElementsByClassName("opponent-score");
const infoElem = document.getElementsByClassName("info")[0];
const creditElem = document.getElementsByClassName("credit")[0];
const finalElem = document.getElementsByClassName("final")[0];
const resultTextElem = document.getElementsByClassName("result")[0];
document.getElementsByClassName("showInfo")[0].addEventListener("click", () => {
  infoElem.classList.remove("hide");
});
document
  .getElementsByClassName("showCredits")[0]
  .addEventListener("click", () => {
    creditElem.classList.remove("hide");
  });
let playerScore = 0;
let opponentScore = 0;
updatePlayerScore = () => {
  for (let elem of playerScoreElems) {
    elem.textContent = playerScore;
  }
};
updateOpponentScore = () => {
  for (let elem of opponentScoreElems) {
    elem.textContent = opponentScore;
  }
};
updateOpponentScore();
updatePlayerScore();

const sleep = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};
// in-place
const shuffleArray = (array) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};
// MAX_NUM * 4 colors, from 1 to MAX_NUM
const MAX_NUM = 6;
const deck = new Array(4 * MAX_NUM).fill(0).map((_, index) => {
  return {
    color: getColorFromInt(Math.floor(index / MAX_NUM) + 2), // input: 2 to 5
    number: (index % MAX_NUM) + 1,
  };
});
shuffleArray(deck);
const getCardColorFromClassList = (classList) => {
  for (let color of colorArr) {
    if (classList.contains(color)) {
      return color;
    }
  }
};
// represent grid as 9 cells
let g2 = new Array(9).fill(0);
const timestamp = Date.now();
const setupBoard = () => {
  // ensure 3 different colors. Excludes 0, 1 which are white
  for (let i = 0; i < 3; i++) {
    g2[i] = timestamp % 2 ? i + 2 : i + 3; // 2 to 4 or 3 to 5
  }

  // + 3 random colors
  for (let i = 3; i < 6; i++) {
    g2[i] = getRandomInt(6); // 0 to 5
  }
  g2 = g2.map((num) => getColorFromInt(num));
};
setupBoard();
const isDrawCell = (cellElem) => {
  return cellElem.classList.contains("draw");
};
const checkIsGameOver = () => {
  // all cells other than DRAW are occupied
  return Array.from(document.getElementsByClassName("cell")).every(
    (cell) => cell.classList.contains("occupied") || isDrawCell(cell)
  );
};
const isUnoccupiedCell = (cellElem) => {
  return !cellElem.classList.contains("occupied") && !isDrawCell(cellElem);
};
const opponentDoesSomething = async () => {
  const drawCard = () => document.getElementsByClassName("cell")[4].click();
  if (opponentCards.length === 0) {
    drawCard();
    return;
  }
  const cellElems = Array.from(gridElem.children);
  const blankCellIndex = cellElems.findIndex(
    (cell) =>
      colorArr.every((color) => !cell.classList.contains(color)) &&
      isUnoccupiedCell(cell)
  );
  const unoccupiedCellIndex = cellElems.findIndex((cell) =>
    isUnoccupiedCell(cell)
  );

  const colorIndexesObj = {};
  colorArr.forEach((color) => {
    colorIndexesObj[color] = cellElems.findIndex(
      (cell) => cell.classList.contains(color) && isUnoccupiedCell(cell)
    );
  });
  let maxScore = 0;
  let maxCellIndex = -1;
  let maxCardIndex = -1;
  opponentCards.forEach(({ color, number }, cardIndex) => {
    const score = getScore(
      colorIndexesObj[color] === -1 ? "" : color,
      color,
      number
    );
    if (score >= maxScore) {
      maxScore = score;
      maxCardIndex = cardIndex;
      // if no matching colored cell exist, put in blank cell index
      maxCellIndex =
        colorIndexesObj[color] === -1 ? blankCellIndex : colorIndexesObj[color];
    }
  });
  opponentElem.children[maxCardIndex].click();
  opponentCards.splice(maxCardIndex, 1);

  if (maxCellIndex > -1) {
    // blank space or matching colored space to click
    gridElem.children[maxCellIndex].click();
  } else {
    gridElem.children[unoccupiedCellIndex].click();
  }
};
const playerContainerElement =
  document.getElementsByClassName("player-container")[0];
const opponentContainerElement =
  document.getElementsByClassName("opponent-container")[0];
const setPlayerTurn = () => {
  if (isPlayerTurn) {
    opponentContainerElement.classList.add("glare");
    playerContainerElement.classList.remove("glare");
    gridElem.classList.remove("glare");
    return;
  }
  playerContainerElement.classList.add("glare");
  opponentContainerElement.classList.remove("glare");
  gridElem.classList.add("glare");
};
const nextTurn = async () => {
  isPlayerTurn = !isPlayerTurn;
  setPlayerTurn();
  await sleep(1000);
  if (!isPlayerTurn) {
    await opponentDoesSomething();
  }
};
setPlayerTurn();
const getScore = (cellColor, cardColor, cardNum) => {
  if (cellColor === cardColor) {
    return 2 * cardNum;
  }
  // don't match
  if (cellColor === "white") {
    return cardNum;
  }
  return 0;
};
const gameContinues = async (cellDiv) => {
  await sleep(500);
  cellDiv.classList.remove("shake");
  await nextTurn();
};
for (let i = 0; i < 9; i++) {
  const color = g2[i];

  const cellDiv = document.createElement("div");
  cellDiv.classList.add("cell");
  cellDiv.classList.add(color);

  cellDiv.addEventListener("click", async () => {
    if (isDrawCell(cellDiv)) {
      drawCardSound.play();
      cellDiv.classList.add("shake");

      const newCard = deck.pop();
      if (isPlayerTurn) {
        playerCards.push(newCard);
        appendCards(playerElem, [newCard]);
      } else {
        opponentCards.push(newCard);
        appendCards(opponentElem, [newCard]);
      }
      await gameContinues(cellDiv);

      return;
    }
    // need to select a card before clicking cell
    const selectedCard = document.getElementsByClassName("from")[0];
    if (!selectedCard || cellDiv.classList.contains("occupied")) return;
    hitSound.play();
    cellDiv.classList.add("shake");

    const cardNum = parseInt(selectedCard.dataset.number, 10);
    cellDiv.classList.add("occupied");
    // add the score
    const cardColor = getCardColorFromClassList(selectedCard.classList);
    const score = getScore(color, cardColor, cardNum);
    // TODO: show 2x
    cellDiv.textContent = score === 0 ? 0 : cardNum;

    if (isPlayerTurn) {
      playerScore += score;
      updatePlayerScore();
    } else {
      opponentScore += score;
      updateOpponentScore();
    }
    // delete the card that's from
    selectedCard.parentElement.removeChild(selectedCard);
    if (checkIsGameOver()) {
      if (playerScore < opponentScore) {
        resultTextElem.textContent = "Ooops!";
      } else if (playerScore === opponentScore) {
        resultTextElem.textContent = "Tie!";
      }
      // TODO: make grid read-only
      finalElem.classList.remove("hide");
      cellDiv.classList.remove("shake");
      return;
    }
    await gameContinues(cellDiv);
  });
  gridElem.appendChild(cellDiv);
}
const centerCell = gridElem.children[4];
centerCell.classList.remove(getCardColorFromClassList(centerCell.classList));
centerCell.classList.add("draw");
centerCell.classList.remove("white");

const opponentCards = [deck.pop(), deck.pop()];
const playerCards = [deck.pop(), deck.pop()];
const appendCards = (parentElem, cardsArr) => {
  cardsArr.forEach(({ color, number }) => {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    cardDiv.classList.add("fade-in");
    cardDiv.classList.add(color);
    cardDiv.dataset.color = color;
    cardDiv.dataset.number = number;
    cardDiv.textContent = parentElem.classList.contains("player")
      ? number
      : "?";

    parentElem.appendChild(cardDiv);

    cardDiv.addEventListener("click", () => {
      // cannot move opponent's cards
      if (
        isPlayerTurn &&
        cardDiv.parentElement.classList.contains("opponent")
      ) {
        return false;
      }
      // remove class from other cards
      for (let c of document.getElementsByClassName("card")) {
        c.classList.remove("from");
      }
      cardDiv.classList.add("from");
    });
  });
};
appendCards(opponentElem, opponentCards);
appendCards(playerElem, playerCards);
document.getElementsByClassName("close")[0].addEventListener("click", (e) => {
  if (e.target.parentElement.classList.contains("info")) {
    infoElem.classList.add("hide");
  } else {
    creditElem.classList.add("hide");
  }
});
const startElem = document.getElementsByClassName("start")[0];
document.getElementsByClassName("restart")[0].addEventListener("click", () => {
  location.reload();
});
startElem.addEventListener("click", (e) => {
  const audio = document.getElementsByTagName("audio")[0];
  audio.play();
  e.target.parentElement.classList.add("hide");
});
