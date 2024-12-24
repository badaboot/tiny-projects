let numAllCount = 5;
let mafiaFolkCount = 2;
let townFolkCount = numAllCount - mafiaFolkCount;
// TODO: self can be townsfolk OR mafia
const allFolk = [0, 1, 2, 3, 4];
shuffleArray(allFolk);
mafiaFolk = [allFolk.pop(), allFolk.pop()].sort((a, b) => a - b);
const townsFolk = allFolk.sort((a, b) => a - b);

// TODO: self is a number, cannot pick self to be killed
let isEnded = false;
let isDaytime = true;
const totalElems = document.getElementsByClassName("total");
const dayTimeElems = document.getElementsByClassName("dayTime");
const killElems = document.getElementsByClassName("kill");
const nextElems = document.getElementsByClassName("next");
const killedElems = document.getElementsByClassName("killed");
const showEnd = () => {
  isEnded = true;
  const endElems = document.getElementsByClassName("end");
  endElems[0].classList.remove("hide");
  endElems[0].textContent =
    townsFolk.length === 0 ? "Mafia won" : "Townsfolk won";

  const playElems = document.getElementsByClassName("play");
  playElems[0].classList.add("hide");
};
nextElems[0].addEventListener("click", () => {
  if (
    mafiaFolkCount === numAllCount ||
    townFolkCount === numAllCount ||
    (mafiaFolkCount === 0 && townFolkCount === 0)
  ) {
    showEnd();
  }
  let killIntElems = document.getElementsByClassName("killInt");
  const int = parseInt(killIntElems[0].value, 10);
  console.log("parse", int, killIntElems[0].value);
  if (!isNaN(int)) {
    if (townsFolk.indexOf(int) > -1) {
      townsFolk.splice(townsFolk.indexOf(int), 1);
      townFolkCount = townsFolk.length;
    } else {
      mafiaFolk.splice(mafiaFolk.indexOf(int), 1);
      mafiaFolkCount = mafiaFolk.length;
    }
    numAllCount -= 1;

    killIntElems[0].value = "";
  }

  if (!isEnded) {
    isDaytime = !isDaytime;
    dayTimeElems[0].textContent = isDaytime ? "Day" : "Night";
  }
  if (isDaytime) {
    killedElems[0].classList.add("hide");
    // elect someone to kill from the overall pool
    killElems[0].classList.remove("hide");
  } else {
    // nighttime: randomly kill a townsperson
    killElems[0].classList.add("hide");
    if (!townsFolk.length) {
      // game over
      showEnd();
    }
    const killedInt = townsFolk.pop();
    console.log("killed", killedInt);
    townFolkCount = townsFolk.length;
    killedElems[0].textContent += killedInt + ",";
    killedElems[0].classList.remove("hide");
  }
  // decrement the numAllCount
  numAllCount = townFolkCount + mafiaFolkCount;

  totalElems[0].textContent = JSON.stringify([...townsFolk, ...mafiaFolk]);
});
