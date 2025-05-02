const shuffleArray = (array) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};
let LIMIT = 3;
const container = document.getElementById("container");
// can be increased
const classNames = ["zero", "one", "two"];
const checkWon = () => {
  for (let ri = 0; ri < LIMIT; ri++) {
    let set = new Set();
    for (let i = 0; i < LIMIT; i++) {
      set.add(container.children[i].children[ri].classList[0]);
      console.log(container.children[i].children[ri]);
    }
    if (set.size > 1) return false; // one value per column
  }
  return true;
};
const numberInput = document.getElementById("limitNum");

numberInput.addEventListener("input", () => {
  const newLimit = numberInput.value;
  setup(newLimit);
});
const getElemIndex = (el) => [...el.parentElement.children].indexOf(el);
const setup = (limit) => {
  LIMIT = parseInt(limit, 10);
  let arr = new Array(LIMIT * LIMIT).fill(0);
  let counter = 1;
  for (let j = LIMIT; j < LIMIT * LIMIT; j += LIMIT) {
    for (let i = j; i < (counter + 1) * LIMIT; i++) {
      arr[i] = counter;
    }
    counter++;
  }
  shuffleArray(arr);
  let grid = new Array(LIMIT).fill(0).map((r) => new Array(LIMIT).fill(0));
  // reset container
  container.innerHTML = "";
  grid.forEach((r) => {
    const row = document.createElement("div");
    row.classList.add("row");
    r.forEach(() => {
      res = arr.pop();

      const cellDiv = document.createElement("div");
      cellDiv.classList.add(classNames[res]);
      cellDiv.textContent = res;
      row.appendChild(cellDiv);
    });
    container.appendChild(row);
  });

  for (let rowDiv of document.getElementsByClassName("row")) {
    for (let cellDiv of rowDiv.children) {
      cellDiv.addEventListener("click", (event) => {
        // if already one
        const activeElems = document.getElementsByClassName("active");
        // if only one
        if (activeElems.length === 1) {
          // check: are they horizontal or vertical neighbors?
          const activeIndex = getElemIndex(activeElems[0]);
          const targetIndex = getElemIndex(event.target);
          if (activeElems[0].parentElement === event.target.parentElement) {
            // if they are the same row: check whether index of by 1
            if (Math.abs(activeIndex - targetIndex > 1)) {
              activeElems[0].classList.remove("active");
              event.target.classList.add("active");
              return false;
            }
          } else {
            // if they are different row, check rowIndex differ by 1 AND whether index match
            if (
              activeIndex !== targetIndex ||
              Math.abs(
                getElemIndex(activeElems[0].parentElement) -
                  getElemIndex(event.target.parentElement)
              ) > 1
            ) {
              activeElems[0].classList.remove("active");
              event.target.classList.add("active");
              return false;
            }
          }
          // swap with cell
          const fromCell = {
            textContent: activeElems[0].textContent,
            class: activeElems[0].classList[0],
          };
          const toCell = {
            textContent: event.target.textContent,
            class: event.target.classList[0],
          };
          // no swap cells with same values
          if (fromCell.textContent === toCell.textContent) return;
          console.log(fromCell, toCell);

          event.target.className = fromCell.class;
          event.target.textContent = fromCell.textContent;
          activeElems[0].classList.add(toCell.class);
          activeElems[0].classList.remove(fromCell.class);
          activeElems[0].textContent = toCell.textContent;
          activeElems[0].classList.remove("active");
          // wait for the UI to finish updating
          if (checkWon()) setTimeout(() => alert("YOU WON!"), 500);
        } else {
          cellDiv.classList.add("active");
        }
      });
    }
  }
};

setup(3);
