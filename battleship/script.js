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
  Carrier: { size: 5, num: 1 },
  Battleship: { size: 4, num: 2 },
  Destroyer: { size: 3, num: 3 },
  Submarine: { size: 3, num: 4 },
  "Patrol Boat": { size: 2, num: 5 },
};

// TODO: check coordinates don't overlap with existing boats on map
const allShipCoords = [];

// utils function
function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// does allShipCoords have any of these coords?
// return [] for true, original parameters otherwise
const verifyGeneratedCoords = (generatedCoordinates) => {
  for (let coords of generatedCoordinates) {
    if (
      allShipCoords.some(([xc, yc]) => xc === coords[0] && yc === coords[1])
    ) {
      return [];
    }
    return generatedCoordinates;
  }
};

// generate coordinates
// eg. Carrier: { size: 5, num: 1, coords: [[1, 1], [2, 1], [3, 1], [4, 1], [5, 1]]},
const cols = document.getElementById("grid").children;
Object.keys(shipSizeMap).forEach((shipName) => {
  const { size, num } = shipSizeMap[shipName];
  shipSizeMap[shipName].coords = [];
  let count = num;
  let arr = [];

  while (count > 0) {
    const xInt = randomIntFromInterval(0, 9);
    const yInt = randomIntFromInterval(0, 9);
    if (xInt - size > 0) {
      arr = new Array(size).fill(0).map((_, i) => [xInt - i, yInt]);
      if (verifyGeneratedCoords(arr).length) {
        allShipCoords.push(...arr);
        shipSizeMap[shipName].coords.push(arr);
        break;
      }
    }
    if (yInt - size > 0) {
      arr = new Array(size).fill(0).map((_, i) => [xInt, yInt - i]);
      if (verifyGeneratedCoords(arr).length) {
        allShipCoords.push(...arr);
        shipSizeMap[shipName].coords.push(arr);
        break;
      }
    }
    if (yInt + size < 10) {
      arr = new Array(size).fill(0).map((_, i) => [xInt, yInt + i]);
      if (verifyGeneratedCoords(arr).length) {
        allShipCoords.push(...arr);
        shipSizeMap[shipName].coords.push(arr);
        break;
      }
    }
    if (xInt + size < 10) {
      arr = new Array(size).fill(0).map((_, i) => [xInt + i, yInt]);
      if (verifyGeneratedCoords(arr).length) {
        allShipCoords.push(...arr);
        shipSizeMap[shipName].coords.push(arr);
        break;
      }
    }
    if (arr.length === 0) console.log(`${shipName} did not get generated`);
    count--;
  }
});

Array.from(document.querySelectorAll(".cell")).forEach((c) => {
  c.addEventListener("click", (e) => {
    const parents = Array.from(container.children);
    const siblings = Array.from(e.target.parentElement.children);
    // [x, y]
    const xc = siblings.indexOf(e.target);
    const yc = parents.indexOf(e.target.parentElement);

    const index = allShipCoords.findIndex(([x, y]) => x === xc && y === yc);
    // remove
    if (index > -1) {
      allShipCoords.splice(index, 1);
      console.log("hit");
    }
    if (allShipCoords.length === 0)
      document.getElementById("finish").classList.remove("hide");
  });
});

// draw them out on container for testing purposes
Object.keys(shipSizeMap).forEach((k) => {
  shipSizeMap[k].coords.forEach((coords) => {
    coords.forEach(([x, y]) => {
      if (k === "Carrier") cols[y].children[x].style.background = "red";
      if (k === "Battleship") cols[y].children[x].style.background = "yellow";
      if (k === "Destroyer") cols[y].children[x].style.background = "blue";
      if (k === "Submarine") cols[y].children[x].style.background = "green";
      if (k === "Patrol Boat") cols[y].children[x].style.background = "purple";
    });
  });
});
