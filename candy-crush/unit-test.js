const checkCell = require("../utils");

const getCell = () => {
  return {
    isVisited: false,
    num: 0,
  };
};
const rowCount = 4;
const colCount = 8;

const matrix = [];
for (let i = 0; i < rowCount; i++) {
  const arr = [];
  for (let i = 0; i < colCount; i++) {
    arr.push(getCell());
  }
  matrix.push(arr);
}
const res = [];
checkCell(0, 0, 0, res, matrix);
console.assert(res.length === rowCount * colCount);

// vertical
const vertical = [[0], [0], [1]];
const resArr = [];
checkCell(0, 0, 0, resArr, vertical);
console.assert(res.length === 2, resArr.length);
