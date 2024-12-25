// TODO: move to utils
const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

// {isVisited: false, num: 0, 1, or 2}
const getArr = () =>
  new Array(8).fill(0).map(() => {
    return {
      isVisted: false,
      num: getRandomInt(3),
    };
  });
const matrix = new Array(3).fill(0).map(() => getArr());

const checkCell = (rowIndex, colIndex, val, arr) => {
  if (
    rowIndex < 0 ||
    colIndex < 0 ||
    rowIndex >= matrix.length ||
    colIndex >= 8
  )
    return;
  console.log(rowIndex, colIndex);

  if (matrix[rowIndex][colIndex].isVisted) return;

  if (matrix[rowIndex][colIndex].num === val) {
    matrix[rowIndex][colIndex].isVisted = true;
    arr.push([rowIndex, colIndex]);
    checkCell(rowIndex - 1, colIndex, val, arr);
    checkCell(rowIndex + 1, colIndex, val, arr);
    checkCell(rowIndex, colIndex - 1, val, arr);
    checkCell(rowIndex, colIndex + 1, val, arr);
  }
};
const containerElem = document.getElementsByClassName("container")[0];
matrix.forEach((row, rowIndex) => {
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
      console.log(cell.num);
      // check left, right, up, and down
      const coordsArr = [];
      checkCell(rowIndex, colIndex, cell.num, coordsArr);
      console.log(coordsArr);
    });
    rowElem.appendChild(cellElem);
  });
  containerElem.appendChild(rowElem);
});
