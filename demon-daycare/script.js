// includes min, max
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
const millisToMinutesAndSeconds = (millis) => {
  const date = new Date(millis);
  return `${date.getMinutes()} minutes ${date.getSeconds()} seconds`;
};
const audio = document.getElementsByTagName("audio")[0];
let timestampStart;
const GAME_KEY = "duration-best";
const holderElem = document.getElementById("holder");
const answerElem = document.getElementById("answer");
const faceElem = document.getElementsByClassName("face-container")[0];
const endElem = document.getElementsByClassName("end")[0];
const containerElem = document.getElementsByClassName("container")[0];
const infoElem = document.getElementsByClassName("info")[0];
const stopButton = document.getElementById("stop");
const startButtons = document.getElementsByClassName("start");
const resElem = document.getElementById("result");
let waitIntervalId = "";
let answerIntervalId = "";
let answer = 0;

document.getElementsByClassName("showInfo")[0].addEventListener("click", () => {
  infoElem.classList.remove("hide");
});
for (let button of document.getElementsByClassName("close")) {
  button.addEventListener("click", (e) => {
    if (e.target.parentElement.classList.contains("info")) {
      infoElem.classList.add("hide");
    }
    // else {
    //   creditElem.classList.add("hide");
    // }
  });
}

const endGame = () => {
  const diff = Date.now() - timestampStart;
  const best = Math.max(localStorage.getItem(GAME_KEY), diff);
  localStorage.setItem(GAME_KEY, best);
  document.getElementById("duration").textContent +=
    " " + millisToMinutesAndSeconds(diff);
  document.getElementById("best").textContent +=
    " " + millisToMinutesAndSeconds(best);
  document.getElementById;
  document.getElementsByTagName("audio")[0].pause();
  document.getElementById("explosion").play();
};

// either 'ANSWER' or 'WAIT
let MODE = "ANSWER";
const getIntervalId = (secondsRemaining, callback) => {
  const intervalId = setInterval(function () {
    numSeconds.textContent =
      MODE === "ANSWER" ? secondsRemaining + " seconds left" : "";
    secondsRemaining--;

    if (secondsRemaining < 0) {
      clearInterval(intervalId);
      if (MODE === "ANSWER") {
        answerIntervalId = "";
      } else {
        answerIntervalId = "";
      }
      if (callback) callback();
    }
  }, 1000); // Update every 1000ms (1 second)
  return intervalId;
};
const reset = () => {
  answerElem.textContent = "";
  resElem.textContent = "";
  MODE = "ANSWER";
  clearInterval(waitIntervalId);
  clearInterval(answerIntervalId);
  waitIntervalId = "";
  answerIntervalId = "";
  holderElem.classList.remove("disable");
};
const startGame = () => {
  reset();
  document.getElementsByTagName("audio")[0].play();
  faceElem.classList.add("angry");
  answer = getRandomInt(0, 4);
  answerIntervalId = getIntervalId(8, () => {
    numSeconds.textContent = "";
    endElem.classList.remove("hide");
    answerElem.textContent = "Answer was " + answer;
    endGame();
  });
};

const toys = holderElem.children;
for (let i = 0; i < toys.length; i++) {
  toys[i].addEventListener("click", () => {
    if (i === answer) {
      resElem.textContent = "Right";
      clearInterval(answerIntervalId);
      answerIntervalId = "";
      // backoff before start again
      document.getElementsByTagName("audio")[0].pause();
      document.getElementById("giggle").play();
      toys[i].parentElement.classList.add("disable");
      faceElem.classList.remove("angry");
      MODE = "WAIT";
      // wait between 2 to 4 seconds
      waitIntervalId = getIntervalId(getRandomInt(2, 4), () => {
        startGame();
      });
    } else {
      resElem.textContent = "Wrong";
    }
  });
}

for (let startButton of startButtons) {
  startButton.addEventListener("click", () => {
    timestampStart = Date.now();
    startGame();

    document.getElementsByClassName("game")[0].classList.remove("hide");
    endElem.classList.add("hide");
    startButton.classList.add("hide");
  });
}
