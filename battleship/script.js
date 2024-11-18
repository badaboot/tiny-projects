// draw grid
const container = document.getElementById("grid");
const grid = new Array(10).fill(0).map(() => new Array(10).fill(0));
grid.forEach((row) => {
  const colDiv = document.createElement("div");
  row.forEach(() => {
    const cellDiv = document.createElement("div");
    cellDiv.classList.add("cell");
    cellDiv.textContent = 0;
    colDiv.appendChild(cellDiv);
  });
  container.appendChild(colDiv);
});

const shipSizeMap = {
  Carrier: { size: 5, num: 1, coords: [] },
  Battleship: { size: 4, num: 2, coords: [] },
  Destroyer: { size: 3, num: 3, coords: [] },
  Submarine: { size: 3, num: 4, coords: [] },
  "Patrol Boat": { size: 2, num: 5, coords: [] },
};

const allShipCoords = new Set();

// utils function
function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// does allShipCoords have any of these coords?
// return [] for true, original parameters otherwise
const verifyGeneratedCoords = (generatedCoordinates, shipName) => {
  for (let coords of generatedCoordinates) {
    const str = JSON.stringify(coords);
    if (allShipCoords.has(str)) {
      // console.log("found", coords, shipName);
      return [];
    }
  }
  const sizeBefore = allShipCoords.size;

  generatedCoordinates.forEach((s) => {
    allShipCoords.add(JSON.stringify(s));
  });
  if (sizeBefore + generatedCoordinates.length !== allShipCoords.size)
    console.log("fishy", shipName);
  shipSizeMap[shipName].coords.push(generatedCoordinates);
  return generatedCoordinates;
};

// generate coordinates
// eg. Carrier: { size: 5, num: 1, coords: [[1, 1], [2, 1], [3, 1], [4, 1], [5, 1]]},
const cols = document.getElementById("grid").children;
Object.keys(shipSizeMap).forEach((shipName) => {
  const { size, num } = shipSizeMap[shipName];
  let count = num;
  let arr = [];

  while (count > 0) {
    const xInt = randomIntFromInterval(0, 9);
    const yInt = randomIntFromInterval(0, 9);
    if (xInt - size > 0) {
      arr = new Array(size).fill(0).map((_, i) => [xInt - i, yInt]);
      if (!!verifyGeneratedCoords(arr, shipName).length) {
        count--;
        continue;
      }
    }
    if (yInt - size > 0) {
      arr = new Array(size).fill(0).map((_, i) => [xInt, yInt - i]);
      if (!!verifyGeneratedCoords(arr, shipName).length) {
        count--;
        continue;
      }
    }
    if (yInt + size < 10) {
      arr = new Array(size).fill(0).map((_, i) => [xInt, yInt + i]);
      if (!!verifyGeneratedCoords(arr, shipName).length) {
        count--;
        continue;
      }
    }
    if (xInt + size < 10) {
      arr = new Array(size).fill(0).map((_, i) => [xInt + i, yInt]);
      if (!!verifyGeneratedCoords(arr, shipName).length) {
        count--;
        continue;
      }
    }
    if (arr.length === 0) console.log(`${shipName} did not get generated`);
  }
});

Array.from(document.querySelectorAll(".cell")).forEach((c) => {
  c.addEventListener("click", (e) => {
    const parents = Array.from(container.children);
    const siblings = Array.from(e.target.parentElement.children);
    const x = siblings.indexOf(e.target);
    const y = parents.indexOf(e.target.parentElement);

    const str = JSON.stringify([x, y]);
    if (allShipCoords.has(str)) {
      allShipCoords.delete(str);
      if (allShipCoords.size === 0)
        document.getElementById("finish").classList.remove("hide");
      else document.getElementById("hit").classList.remove("hide");
    } else {
      document.getElementById("hit").classList.add("hide");
    }
  });
});

// draw boats for testing purposes
Object.keys(shipSizeMap).forEach((shipName) => {
  shipSizeMap[shipName].coords.forEach((coords) => {
    coords.forEach(([x, y]) => {
      if (shipName === "Carrier") cols[y].children[x].style.background = "pink";
      if (shipName === "Battleship")
        cols[y].children[x].style.background = "yellow";
      if (shipName === "Destroyer")
        cols[y].children[x].style.background = "lightblue";
      if (shipName === "Submarine")
        cols[y].children[x].style.background = "lightgreen";
      if (shipName === "Patrol Boat")
        cols[y].children[x].style.background = "orange";
      cols[y].children[x].textContent = `${shipName}`;
    });
  });
});
