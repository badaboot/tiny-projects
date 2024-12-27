// 0 to max, excluding max
const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

const words = [
  "joy",
  "elf",
  "bell",
  "stocking",
  "carol",
  "holiday",
  "snow",
  "sleigh",
  "eggnog",
  "santa",
  "reindeer",
  "ornament",
  "tree",
  "present",
].map((w) => w.toUpperCase());
const wordElem = document.getElementsByClassName("word")[0];
const letterPadElem = document.getElementsByClassName("letterPad")[0];
const endElem = document.getElementsByClassName("end")[0];
const againElem = document.getElementsByClassName("again")[0];
const gallowsElems = "head, body, leg, leg right, arm, arm right".split(",");
const alphabet =
  "A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z"
    .split(",")
    .map((l) => l.trim());
const guessedLetters = [];

const chosenWord = words[getRandomInt(words.length)];
for (let c of chosenWord) {
  const divElem = document.createElement("div");
  divElem.textContent = "_";
  wordElem.appendChild(divElem);
}

// endText: string
const setEndElem = (endText) => {
  endElem.children[0].textContent = endText;
  endElem.classList.remove("hide");
  letterPadElem.classList.add("hide");
};
alphabet.forEach((l, letterIndex) => {
  const divElem = document.createElement("div");
  divElem.textContent = l;
  letterPadElem.appendChild(divElem);
  divElem.addEventListener("click", (e) => {
    if (e.target.classList.contains("disabled")) return;
    if (chosenWord.includes(l)) {
      // fill in the word
      const indexes = [];
      chosenWord.split("").forEach((letter, index) => {
        if (letter === l) indexes.push(index);
      });
      indexes.forEach((i) => {
        wordElem.children[i].textContent = l;
      });
    } else {
      // add 'show' class to a gallows element
      const className = gallowsElems.shift();
      const gallowsElem = document.getElementsByClassName(className)[0];
      gallowsElem.classList.add("show");
    }
    // if gallows is complete, display ended, play again?
    if (gallowsElems.length === 0) {
      setEndElem(`You lost. The word was: ${chosenWord}`);
    }
    // if word is complete, display You won, play again?
    if (Array.from(wordElem.children).every((c) => c.textContent !== "_")) {
      setEndElem("You won.");
    }
    guessedLetters.push(l);
    letterPadElem.children[letterIndex].classList.add("disabled");
  });
});

againElem.addEventListener("click", () => {
  window.location.reload();
});
