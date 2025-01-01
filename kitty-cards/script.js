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

for (let i = 0; i < 9; i++) {
  const color = g2[i];

  const cellDiv = document.createElement("div");
  cellDiv.classList.add("cell");
  cellDiv.classList.add(color);

  cellDiv.addEventListener("click", () => {
    // TODO: need better way of seeing if it's player's turn because selectedCard might be null
    if (cellDiv.textContent === "DRAW") {
      const newCard = { color: "blue", number: 2 };
      if (isPlayerTurn) {
        playerCards.push(newCard);
        appendCards(playerElem, [newCard]);
      } else {
        opponentCards.push(newCard);
        appendCards(oppoenntElem, [newCard]);
      }
      return;
    }
    const selectedCard = document.querySelector(".from");
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
  });
  gridElem.appendChild(cellDiv);
}
const centerCell = gridElem.children[4];
centerCell.textContent = "DRAW";
centerCell.classList.remove(getCardColorFromClassList(centerCell.classList));
centerCell.classList.remove("white");

// TODO: implement turns
const opponentCards = [
  {
    color: "red",
    number: 1,
  },
  {
    color: "blue",
    number: 10,
  },
];
const playerCards = [
  {
    color: "green",
    number: 1,
  },
  {
    color: "yellow",
    number: 10,
  },
];
const appendCards = (parentElem, cardsArr) => {
  cardsArr.forEach(({ color, number }) => {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    cardDiv.classList.add(color);
    cardDiv.textContent = number;
    parentElem.appendChild(cardDiv);

    cardDiv.addEventListener("click", () => {
      // remove class from other cards
      for (let c of document.getElementsByClassName("card")) {
        c.classList.remove("from");
      }
      cardDiv.classList.add("from");
      console.log(`${cardDiv.textContent} is from`);
    });
  });
};
appendCards(oppoenntElem, opponentCards);
appendCards(playerElem, playerCards);
