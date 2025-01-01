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
const oppoenntElem = document.getElementsByClassName("opponent")[0];
const playerElem = document.getElementsByClassName("player")[0];
const playerScoreElem = document.getElementsByClassName("player-score")[0];
const opponentScoreElem = document.getElementsByClassName("opponent-score")[0];
let playerScore = 0;
let opponentScore = 0;
opponentScoreElem.textContent = opponentScore;
playerScoreElem.textContent = playerScore;

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
const opponentDoesSomething = () => {
  console.log(`opponent's turn`);
  // can draw
  document.getElementsByClassName("cell")[4].click();
};
const nextTurn = () => {
  isPlayerTurn = !isPlayerTurn;
  if (!isPlayerTurn) {
    opponentDoesSomething();
  }
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
        appendCards(oppoenntElem, [newCard]);
      }
      nextTurn();
      return;
    }
    const selectedCard = document.querySelector(".from");
    // need to select a card before clicking cell
    if (!selectedCard) return;
    const cardNum = parseInt(selectedCard.textContent, 10);
    cellDiv.textContent = cardNum;
    cellDiv.classList.add("occupied");
    // add the score
    const cardColor = getCardColorFromClassList(selectedCard.classList);
    if (isPlayerTurn) {
      playerScore += color === cardColor ? 2 * cardNum : cardNum;
      playerScoreElem.textContent = playerScore;
    } else {
      opponentScore += cardColor ? 2 * cardNum : cardNum;
      opponentScoreElem.textContent = opponentScore;
    }
    // delete the card that's from
    selectedCard.parentElement.removeChild(selectedCard);
    // check if game is over
    if (checkIsGameOver()) {
      alert("GAME OVER");
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
      // cannot move opponent's cards, or move cards out of turn
      if (
        cardDiv.parentElement.classList.contains("opponent") ||
        !isPlayerTurn
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
appendCards(oppoenntElem, opponentCards);
appendCards(playerElem, playerCards);
