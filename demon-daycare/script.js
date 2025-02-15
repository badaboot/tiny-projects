// includes min, max
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const answerElem = document.getElementById("answer");
const resElem = document.getElementById("result");
let guessInput = document.querySelector('input[name="guess"]');
let waitIntervalId = "";
let guessIntervalId = "";
let answer = 0;

document.getElementById("stop").addEventListener("click", () => {
  clearInterval(waitIntervalId);
  clearInterval(guessIntervalId);
});
// TODO: change this to MODE so it's one of ['ANSWER', 'WAIT']
let MODE = "ANSWER";
const getIntervalId = (secondsRemaining, callback) => {
  const intervalId = setInterval(function () {
    numSeconds.textContent =
      MODE === "ANSWER"
        ? secondsRemaining + " seconds to guess"
        : secondsRemaining + " seconds wait";
    secondsRemaining--;

    if (secondsRemaining < 0) {
      clearInterval(intervalId);
      if (MODE === "ANSWER") {
        answerIntervalId = "";
      } else {
        guessIntervalId = "";
      }
      if (callback) callback();
    }
  }, 1000); // Update every 1000ms (1 second)
  return intervalId;
};
const reset = () => {
  answerElem.textContent = "";
  resElem.textContent = "";
  guessInput.value = "";
  guessInput.disabled = false;
  MODE = "ANSWER";
};
const startGame = () => {
  reset();
  answer = getRandomInt(0, 4);
  answerIntervalId = getIntervalId(8, () => {
    numSeconds.textContent = "";
    answerElem.textContent = "Answer was " + answer;
  });
};

guessInput.addEventListener("input", (e) => {
  const guess = e.target.value;
  if (parseInt(guess, 10) === answer) {
    resElem.textContent = "Right";
    clearInterval(answerIntervalId);
    answerIntervalId = "";
    // backoff before start again
    e.target.disabled = true;
    MODE = "WAIT";
    // wait between 2 to 4 seconds
    waitIntervalId = getIntervalId(getRandomInt(2, 4), () => {
      startGame();
    });
  } else {
    resElem.textContent = "Wrong";
  }
});

document.getElementById("start").addEventListener("click", () => {
  startGame();
});
