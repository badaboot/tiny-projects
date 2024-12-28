const gridElem = document.getElementsByClassName("grid")[0];
const fullElem = document.getElementsByClassName("full")[0];
const startElem = document.getElementsByClassName("start")[0];
const endElem = document.getElementsByClassName("end")[0];
const LIMIT = 5;
const GEM_KEY = "gem-best";
let hits = 0;
let misses = 0;
const grid = new Array(LIMIT).fill(0).map(() => new Array(LIMIT).fill(0));
const availableCells = new Array(LIMIT * LIMIT).fill(0).map((_, i) => i);
const toIndex = (rowIndex, colIndex) => {
  return rowIndex * LIMIT + colIndex;
};

// 20 seconds to end of game
const gameEndTimerId = window.setTimeout(function () {
  showEndElem();
}, 20000);

grid.forEach((row) => {
  const rowElem = document.createElement("div");
  row.forEach((cell) => {
    const cellElem = document.createElement("div");
    cellElem.classList.add("cell");
    rowElem.appendChild(cellElem);
    cellElem.addEventListener("click", () => {
      // remove selected from other cells
      for (let elem of document.getElementsByClassName("cell")) {
        elem.classList.remove("selected");
      }
      cellElem.classList.add("selected");
    });
  });
  gridElem.appendChild(rowElem);
});

// returns min inclusive, max exclusive
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};
// in-place
const shuffleArray = (array) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const colorNames = ["red", "yellow", "green", "blue"];
shuffleArray(availableCells);
const getCoordinates = (index) => {
  return [Math.floor(index / LIMIT), index % LIMIT];
};
let i = 0;
// start with 5 jewels, with time get more
while (i < LIMIT) {
  const [x, y] = getCoordinates(availableCells.pop());
  const colorName = colorNames[getRandomInt(0, 4)];
  grid[x][y] = colorName;
  gridElem.children[x].children[y].classList.add(colorName);
  i++;
}

let intervalID;

const amendPointsAccordingToColor = (selectedElem, color, cell, index) => {
  if (selectedElem.classList.contains(color) && cell === color) {
    hits += 1;
    console.log("hit");
  } else {
    misses += 1;
    console.log("miss");
  }
  selectedElem.classList.remove(color);
  availableCells.push(index);
};
document.addEventListener("keydown", (event) => {
  const selectedElems = document.getElementsByClassName("selected");
  // ignore if there are no selected cells, or no gems on selected cell
  //   TODO: refactor this to return early
  if (selectedElems.length === 0) return;
  if (
    selectedElems[0].classList.contains("yellow") ||
    selectedElems[0].classList.contains("red") ||
    selectedElems[0].classList.contains("blue") ||
    selectedElems[0].classList.contains("green")
  ) {
    // find x and y
    const x = Array.from(gridElem.children).findIndex((row) =>
      Array.from(row.children).find((cell) =>
        cell.classList.contains("selected")
      )
    );
    const y = Array.from(gridElem.children[x].children).findIndex((cell) =>
      cell.classList.contains("selected")
    );

    switch (event.key) {
      case "ArrowUp":
        amendPointsAccordingToColor(
          selectedElems[0],
          "red",
          grid[x][y],
          toIndex(x, y)
        );
        break;
      case "ArrowDown":
        amendPointsAccordingToColor(
          selectedElems[0],
          "blue",
          grid[x][y],
          toIndex(x, y)
        );
        break;
      case "ArrowLeft":
        amendPointsAccordingToColor(
          selectedElems[0],
          "yellow",
          grid[x][y],
          toIndex(x, y)
        );
        break;
      case "ArrowRight":
        amendPointsAccordingToColor(
          selectedElems[0],
          "green",
          grid[x][y],
          toIndex(x, y)
        );
        break;
    }
  }
});

// when time is up
const showEndElem = () => {
  const score = hits - misses;
  localStorage.setItem(GEM_KEY, Math.max(localStorage.getItem(GEM_KEY), score));
  document.getElementsByClassName("hit")[0].textContent += ` ${hits}`;
  document.getElementsByClassName("miss")[0].textContent += ` ${misses}`;
  document.getElementsByClassName("score")[0].textContent += ` ${score}`;
  document.getElementsByClassName(
    "best"
  )[0].textContent += ` ${localStorage.getItem(GEM_KEY)}`;
  endElem.classList.remove("hide");
  fullElem.classList.remove("hide");
  clearTimeout(gameEndTimerId);
  clearInterval(intervalID);
};

startElem.addEventListener("click", () => {
  fullElem.classList.add("hide");
  startElem.classList.add("hide");
  endElem.classList.add("hide");
  intervalID = setInterval(() => {
    if (availableCells.length) {
      const [x, y] = getCoordinates(availableCells.pop());
      const colorName = colorNames[getRandomInt(0, 4)];
      grid[x][y] = colorName;
      gridElem.children[x].children[y].classList.add(colorName);
    }
  }, 1000);
});

document.getElementsByClassName("restart")[0].addEventListener("click", () => {
  location.reload();
});
