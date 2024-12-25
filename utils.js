// in-place
const shuffleArray = (array) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

// TODO: unit test this
const checkCell = (rowIndex, colIndex, val, arr, matrix) => {
  if (
    rowIndex < 0 ||
    colIndex < 0 ||
    rowIndex >= matrix.length ||
    colIndex >= 8
  )
    return;

  if (
    matrix[rowIndex][colIndex] === undefined ||
    matrix[rowIndex][colIndex].isVisted
  )
    return;

  if (matrix[rowIndex][colIndex].num === val) {
    arr.push([rowIndex, colIndex]);
    matrix[rowIndex][colIndex].isVisted = true;
    checkCell(rowIndex - 1, colIndex, val, arr, matrix);
    checkCell(rowIndex + 1, colIndex, val, arr, matrix);
    checkCell(rowIndex, colIndex - 1, val, arr, matrix);
    checkCell(rowIndex, colIndex + 1, val, arr, matrix);
  }
};

// uncomment for unit test
module.exports = checkCell;
