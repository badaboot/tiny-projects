const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};
const answerElem = document.getElementById("answer");
const resElem = document.getElementById("result");
const guessInput = document.querySelector('input[name="guess"]');
let waitIntervalId = "";
let guessIntervalId = "";
document.getElementById("stop").addEventListener("click", () => {
  clearInterval(waitIntervalId);
  clearInterval(guessIntervalId);
});
let isAnswering = true;
const getIntervalId = (secondsRemaining, callback) => {
  const intervalId = setInterval(function () {
    numSeconds.textContent = isAnswering
      ? secondsRemaining + " seconds to guess"
      : secondsRemaining + " wait time";
    secondsRemaining--;

    if (secondsRemaining < 0) {
      clearInterval(intervalId);
      if (callback) callback();
    }
  }, 1000); // Update every 1000ms (1 second)
  return intervalId;
};

const startGame = () => {
  isAnswering = true;
  answerIntervalId = getIntervalId(10, () => {
    answerElem.textContent = "Answer was " + answer;
  });

  // 0 to 4
  let answer = getRandomInt(5);
  guessInput.value = "";
  answerElem.textContent = "";
  resElem.textContent = "";
  guessInput.addEventListener("input", (e) => {
    const guess = e.target.value;
    console.log(guess, answer);
    if (parseInt(guess, 10) === answer) {
      resElem.textContent = "Right";
      clearInterval(answerIntervalId);
      // backoff for 5 seconds before start again
      isAnswering = false;
      waitIntervalId = getIntervalId(4, () => {
        startGame();
      });
    } else {
      resElem.textContent = "Wrong";
    }
  });
};

document.getElementById("start").addEventListener("click", () => {
  startGame();
});
