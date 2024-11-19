// draw grid
const container = document.getElementById("grid");
const LIMIT = 10;
const grid = new Array(LIMIT).fill(0).map(() => new Array(LIMIT).fill(0));
// left column is disabled, show numbers only
const colDiv = document.createElement("div");
for (let i = 0; i < LIMIT; i++) {
  const cellDiv = document.createElement("div");
  cellDiv.textContent = i;
  cellDiv.classList.add("disabled-cell");
  colDiv.appendChild(cellDiv);
}
document.getElementById("left-menu").appendChild(colDiv);
document.getElementById("top-menu").innerHTML =
  document.getElementById("left-menu").innerHTML;
// left menu is A, B, ...
for (let child of colDiv.children) {
  child.textContent = String.fromCharCode(65 + Number(child.textContent));
}

grid.forEach((row) => {
  const colDiv = document.createElement("div");
  row.forEach(() => {
    const cellDiv = document.createElement("div");
    cellDiv.classList.add("cell");
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
const remainingElem = document.getElementById("remaining");
const shipKeys = Object.keys(shipSizeMap);
const updateRemaining = () => {
  remainingElem.innerHTML = "";
  shipKeys.forEach((k) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${shipSizeMap[k].coords.length} x ${k}: size ${shipSizeMap[k].size}`;
    if (!!shipSizeMap[k].coords.length) remainingElem.appendChild(listItem);
  });
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
shipKeys.forEach((shipName) => {
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

updateRemaining();
const hitCoords = new Set();
Array.from(document.querySelectorAll(".cell")).forEach((c) => {
  c.addEventListener("click", (e) => {
    // ignore already clicked cells
    if (e.target.classList.contains("hit")) return;
    const parents = Array.from(container.children);
    const siblings = Array.from(e.target.parentElement.children);
    const x = siblings.indexOf(e.target);
    const y = parents.indexOf(e.target.parentElement);
    const str = JSON.stringify([x, y]);
    const isHit = allShipCoords.has(str);
    e.target.classList.add(isHit ? "isHit" : "hit");

    if (isHit) {
      hitCoords.add(str);
      // find which ship has sunk
      for (let k of shipKeys) {
        const index = shipSizeMap[k].coords.findIndex((arr) => {
          return arr.every((elem) => hitCoords.has(JSON.stringify(elem)));
        });
        if (index > -1) {
          shipSizeMap[k].coords[index].forEach((s) => {
            hitCoords.delete(JSON.stringify(s));
          });
          shipSizeMap[k].coords.splice(index, 1);
          const numSunk =
            Number(document.getElementById("sunk").textContent.split(".")[0]) +
            1;
          document.getElementById(
            "sunk"
          ).textContent = `${numSunk}. Latest: ${k}`;
          updateRemaining();
          break; // only looking for 1 ship
        }
      }
      allShipCoords.delete(str);
      if (allShipCoords.size === 0) {
        const children = document.getElementById("stats").children;
        // remove remaining list div
        document.getElementById("stats").removeChild(children[0]);
        // the paragraph element
        children[0].textContent = "YOU WON :)";
        document.getElementById("again").classList.remove("hide");
        container.classList.add("disable");
      }
    }
  });
});

document.getElementById("again").addEventListener("click", () => {
  location.reload();
});
// draw boats for testing purposes
// shipKeys.forEach((shipName) => {
//   shipSizeMap[shipName].coords.forEach((coords) => {
//     coords.forEach(([x, y]) => {
//       // if (shipName === "Carrier") cols[y].children[x].style.background = "pink";
//       // if (shipName === "Battleship")
//       //   cols[y].children[x].style.background = "yellow";
//       // if (shipName === "Destroyer")
//       //   cols[y].children[x].style.background = "lightblue";
//       // if (shipName === "Submarine")
//       //   cols[y].children[x].style.background = "lightgreen";
//       // if (shipName === "Patrol Boat")
//       //   cols[y].children[x].style.background = "orange";
//       cols[y].children[x].textContent = `${shipName}`;
//     });
//   });
// });
