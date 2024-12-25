// inspired by https://gamedistribution.com/games/kitchen-sorting/
const tubes = [[], [], []];
const LIMIT = 4;
// 0, 1, 2, 3 each appear 4 times, shuffle
const arr = Array(16)
  .fill(0)
  .map((_, index) => Math.floor(index / LIMIT));
shuffleArray(arr);
tubes[0] = arr.slice(0, 4);
tubes[1] = arr.slice(4, 8);
tubes[2] = arr.slice(8, 12);
tubes[3] = arr.slice(12);
// 2 empty ones
tubes.push([]);
tubes.push([]);
const containerElem = document.getElementsByClassName("container")[0];
let fromIndex = -1;
let toIndex = -1;
const getRepresentation = (arr) => {
  return arr.map((n) => {
    if (n === 0) return "&#127856;"; // cake
    if (n === 1) return "&#127849;"; // donut
    if (n === 2) return "&#127789;"; // hot dog
    if (n === 3) return "&#129384;"; // pretzel
  });
};
const updateRepresentationByIndex = (index) => {
  containerElem.childNodes[index].innerHTML = getRepresentation(
    tubes[index]
  ).join("");
};
tubes.forEach((tube, index) => {
  const elem = document.createElement("div");
  elem.innerHTML = getRepresentation(tube).join("");
  elem.addEventListener("click", () => {
    const toElems = document.getElementsByClassName("to");
    const fromElems = document.getElementsByClassName("from");
    if (toElems.length > 0) {
      for (let e of toElems) {
        e.classList.remove("to");
      }
      for (let e of fromElems) {
        e.classList.remove("from");
      }
    }
    if (fromElems.length > 0) {
      // clicking on self cancels the select
      if (fromIndex === index) {
        return;
      }
      elem.classList.add("to");
      toIndex = index;
      // if toElem is full, can't to anything
      if (elem.length === LIMIT) {
        return;
      }
      while (
        tubes[index].length === 0 ||
        (tubes[index][0] === tubes[fromIndex][0] && tubes[index].length < LIMIT)
      ) {
        tubes[index].unshift(tubes[fromIndex].shift());
        updateRepresentationByIndex(index);
        updateRepresentationByIndex(fromIndex);
      }
    } else {
      elem.classList.add("from");
      fromIndex = index;
    }
    // hide full tubes of same number
    const set = new Set(tubes[index]);
    if (tubes[index].length === LIMIT && set.size === 1) {
      elem.classList.add("hide");
    }
    // check if you won
    if (
      tubes.every((a) => {
        const _set = new Set(a);
        return a.length === 0 || (_set.size === 1 && a.length === LIMIT);
      })
    ) {
      containerElem.classList.add("hide");
      document.getElementsByClassName("won")[0].classList.remove("hide");
    }
  });
  containerElem.appendChild(elem);
});

document.getElementsByClassName("again")[0].addEventListener("click", () => {
  window.location.reload();
});
