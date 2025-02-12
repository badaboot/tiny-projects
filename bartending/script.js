const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};
const playerObj = {
  lifePoints: 0,
  numNights: 0,
  tempDollars: 0, // disappears at end of evening
};
// TODO: handle tempDollars disappear at end of evening
// TOOD: handle penalty for screw up too many drinks
const checkDOne = () => {
  if (playerObj.lifePoints >= RETIREMENT_LIMIT) return true;
  return false;
};
const MAX_DIE_INT = 6;
const REGULAR_PRICE = 20;
const RETIREMENT_LIMIT = 10000;

// TODO: show tooltip? of game progress and outcome
const tripleOrThird = (guess) => {
  // guess which of 3 cups contains the food item
  if (guess === getRandomInt(3)) {
    playerObj.lifePoints = Math.floor(playerObj.lifePoints * 3);
  } else playerObj.lifePoints = Math.floor(playerObj.lifePoints / 3);
};
const tenOrTenth = (guess) => {
  // roll 2 6-sided die
  const sum = getRandomInt(MAX_DIE_INT) + getRandomInt(MAX_DIE_INT);
  if (sum === guess)
    playerObj.lifePoints = Math.floor(playerObj.lifePoints * 10);
  else playerObj.lifePoints = Math.floor(playerObj.lifePoints / 10);
};
const addTempDollar = () => {
  playerObj.tempDollars += REGULAR_PRICE;
};
const regularAdd = () => {
  playerObj.lifePoints += REGULAR_PRICE;
};
const TIP_ARRAY = [1, 3, 5];
const randomTip = () => {
  // random int is 0,  1, or 2
  playerObj.lifePoints += TIP_ARRAY[getRandomInt(3)];
  playerObj.lifePoints += REGULAR_PRICE;
};
const GUESTS = [
  {
    name: "Greed",
    game: tenOrTenth,
    faveDrink: "",
  },
  {
    name: "Gluttony",
    game: tripleOrThird,
    faveDrink: "",
  },
  {
    name: "Fairy",
    game: addTempDollar,
    faveDrink: "",
  },
  {
    name: "Sloth",
    game: regularAdd,
    faveDrink: "",
  },
  {
    name: "Nekomata",
    game: randomTip,
    faveDrink: "",
  },
];

const infoElem = document.getElementsByClassName("info")[0];
const pointsElem = document.getElementById("points");
const guestNameElem = document.getElementById("guest_name");
const drinkElem = document.getElementById("drink");
const getNextGuest = () => {
  return GUESTS[getRandomInt(GUESTS.length)];
};
const updateGuest = () => {
  guestNameElem.innerHTML = currentGuest.name;
};
let currentGuest = getNextGuest();
updateGuest();
drinkElem.innerHTML = currentGuest.faveDrink;

updatePoints = () => {
  pointsElem.textContent = playerObj.lifePoints + playerObj.tempDollars;
};

updatePoints();
// TODO: temp for testing
const makeDrinkButton = document.getElementById("makeDrink");
makeDrinkButton.addEventListener("click", () => {
  currentGuest.game();
  console.log(currentGuest.game);
  console.log(playerObj.lifePoints);
  updatePoints();
  currentGuest = getNextGuest();
  updateGuest();
});

document.getElementsByClassName("showInfo")[0].addEventListener("click", () => {
  infoElem.classList.remove("hide");
});
document.getElementsByClassName("close")[0].addEventListener("click", () => {
  infoElem.classList.add("hide");
});
