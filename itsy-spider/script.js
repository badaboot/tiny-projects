const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};
let height = 1;
const hitSound = new Audio("audio/chime.mp3");
const missSound = new Audio("audio/stone-water.mp3");
const winSound = new Audio("audio/yay.mp3");

const audio = document.getElementsByTagName("audio")[0];
const spiderElem = document.getElementById("spider");
const sunOrRainElem = document.getElementById("sunOrRain");
const rollButton = document.getElementById("rollDice");
const replayButton = document.getElementById("replay");
const imageElem = document.getElementsByTagName("img")[0];

// the replay button will be hidden, which affects the last coordinate
const topPos = [580, 530, 440, 380, 300, 210];
rollButton.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
  }
  const res = getRandomInt(5) + 1;
  if (res >= height) {
    height += 1;
    imageElem.classList.remove("rain");
    hitSound.play();
  } else {
    // rain washes you down
    height = Math.max(1, height - 2);
    imageElem.classList.add("rain");
    missSound.play();
  }
  spiderElem.style.top = `${topPos[height - 1]}px`;

  if (height === 6) {
    replayButton.classList.remove("hide");
    rollButton.classList.add("hide");
    spiderElem.style.left = `56%`;
    winSound.play();
    audio.pause();
  }
});

replayButton.addEventListener("click", () => {
  window.location.reload();
});
