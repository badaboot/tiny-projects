// {isVisited: false, num: 0, 1, or 2}
const getArr = () =>
  new Array(8).fill(0).map(() => {
    return {
      isVisted: false,
      num: getRandomInt(3),
    };
  });
const matrix = new Array(3).fill(0).map(() => getArr());

const intervalId = window.setInterval(function () {
  console.log("is this happening?");
  const row = getArr();
  matrix.push(row);
  drawRow(row, matrix.length - 1);
}, 5000);

document.getElementsByClassName("stop")[0].addEventListener("click", () => {
  clearInterval(intervalId);
});

const containerElem = document.getElementsByClassName("container")[0];
const drawRow = (row, rowIndex) => {
  const rowElem = document.createElement("div");
  row.forEach((cell, colIndex) => {
    const cellElem = document.createElement("span");
    cellElem.textContent = cell.num;
    cellElem.addEventListener("click", () => {
      // set all to false
      matrix.forEach((r) => {
        r.forEach((c) => {
          c.isVisted = false;
        });
      });
      console.log(cell.num, rowIndex, colIndex);
      // check left, right, up, and down
      const coordsArr = [];
      checkCell(rowIndex, colIndex, cell.num, coordsArr, matrix);
      console.log(coordsArr);
      if (coordsArr.length <= 2) return;
      // only for 3+
      coordsArr.forEach(([ri, ci]) => {
        // remove from matrix
        console.log(ri, ci);
        matrix[ri].splice(ci, 1);
        containerElem.children[ri].removeChild(
          containerElem.children[ri].children[ci]
        );
      });
    });
    rowElem.appendChild(cellElem);
  });
  containerElem.appendChild(rowElem);
};
matrix.forEach((row, rowIndex) => {
  drawRow(row, rowIndex);
});
