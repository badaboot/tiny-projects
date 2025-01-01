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
let isPlayerTurn = true; // alternate between true and false. if false is opponent's turn
const gridElem = document.getElementsByClassName("grid")[0];
const opponentElem = document.getElementsByClassName("opponent")[0];
const playerElem = document.getElementsByClassName("player")[0];
const playerScoreElems = document.getElementsByClassName("player-score");
const opponentScoreElems = document.getElementsByClassName("opponent-score");
const infoElem = document.getElementsByClassName("info")[0];
const finalElem = document.getElementsByClassName("final")[0];
const resultTextElem = document.getElementsByClassName("result")[0];
document.getElementsByClassName("showInfo")[0].addEventListener("click", () => {
  infoElem.classList.remove("hide");
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

// in-place
const shuffleArray = (array) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};
// 12 * 4 colors, from 1 to 12
const deck = new Array(48).fill(0).map((_, index) => {
  return {
    color: getColorFromInt(Math.floor(index / 12) + 2), // input: 2 to 5
    number: (index % 12) + 1,
  };
});
shuffleArray(deck);
// alternatively represent grid as 9 cells
let g2 = new Array(9).fill(0);

// 0 to 5
g2 = g2.map(() => getColorFromInt(getRandomInt(6)));
const getCardColorFromClassList = (classList) => {
  for (let color of colorArr) {
    if (classList.contains(color)) {
      return color;
    }
  }
};
const checkIsGameOver = () => {
  // all cells other than DRAW are occupied
  return Array.from(document.getElementsByClassName("cell")).every(
    (cell) => cell.classList.contains("occupied") || cell.textContent === "DRAW"
  );
};
// TODO: hide these cards
const opponentDoesSomething = () => {
  const drawCard = () => document.getElementsByClassName("cell")[4].click();
  // can draw if no cards or card number is low
  const maxNumber = Math.max(...opponentCards.map((c) => c.number));
  if (opponentCards.length === 0 || maxNumber <= 6) {
    drawCard();
    return;
  }
  // put the card with highest number on the board, ideally on same colored cell
  //   TODO: turn this into a loop
  const indexOfHighestCard = opponentCards.findIndex(
    (c) => c.number === maxNumber
  );
  const selectCard = opponentCards[indexOfHighestCard];
  opponentElem.children[indexOfHighestCard].click();
  const cellElems = Array.from(gridElem.children);
  const indexOfSameColoredCell = cellElems.findIndex(
    (cell) =>
      cell.classList.contains(selectCard.color) &&
      !cell.classList.contains("occupied")
  );

  if (indexOfSameColoredCell > -1) {
    gridElem.children[indexOfSameColoredCell].click();
    opponentCards.splice(indexOfHighestCard, 1);
    return;
  } else {
    const blankCellIndex = cellElems.findIndex((cell) =>
      colorArr.every((color) => !cell.classList.contains(color))
    );
    // find a blank one to click on
    if (blankCellIndex > -1) {
      gridElem.children[blankCellIndex].click();
      opponentCards.splice(indexOfHighestCard, 1);
      return;
    }
  }
  drawCard();
};
const nextTurn = () => {
  isPlayerTurn = !isPlayerTurn;
  if (!isPlayerTurn) {
    opponentDoesSomething();
  }
};
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
for (let i = 0; i < 9; i++) {
  const color = g2[i];

  const cellDiv = document.createElement("div");
  cellDiv.classList.add("cell");
  cellDiv.classList.add(color);

  cellDiv.addEventListener("click", () => {
    // TODO: add animation for draw so it's not immediate
    if (cellDiv.textContent === "DRAW") {
      const newCard = deck.pop();
      if (isPlayerTurn) {
        playerCards.push(newCard);
        appendCards(playerElem, [newCard]);
      } else {
        opponentCards.push(newCard);
        appendCards(opponentElem, [newCard]);
      }
      nextTurn();
      return;
    }
    const selectedCard = document.querySelector(".from");
    // need to select a card before clicking cell
    if (!selectedCard || cellDiv.classList.contains("occupied")) return;
    const cardNum = parseInt(selectedCard.textContent, 10);
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
    // check if game is over
    if (checkIsGameOver()) {
      if (playerScore < opponentScore) {
        resultTextElem.textContent = "Ooops!";
      } else if (playerScore === opponentScore) {
        resultTextElem.textContent = "Tie!";
      }
      finalElem.classList.remove("hide");
    } else {
      nextTurn();
    }
  });
  gridElem.appendChild(cellDiv);
}
const centerCell = gridElem.children[4];
centerCell.textContent = "DRAW";
centerCell.classList.remove(getCardColorFromClassList(centerCell.classList));
centerCell.classList.remove("white");

const opponentCards = [deck.pop(), deck.pop()];
const playerCards = [deck.pop(), deck.pop()];
const appendCards = (parentElem, cardsArr) => {
  cardsArr.forEach(({ color, number }) => {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    cardDiv.classList.add(color);
    cardDiv.textContent = number;
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
document.getElementsByClassName("close")[0].addEventListener("click", () => {
  infoElem.classList.add("hide");
});
document.getElementsByClassName("restart")[0].addEventListener("click", () => {
  location.reload();
});
