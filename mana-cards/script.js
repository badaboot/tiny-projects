const MAX_POWER = 8;
const powerCountElem = document.getElementById("powerCount");
powerCountElem.textContent = MAX_POWER;

const cardsElem = document.getElementById("holder");
// TODO: replace with particles
const powerUpElem = document.getElementById("power-up");
powerUpElem.addEventListener("click", () => {
  powerCountElem.textContent = parseInt(powerCountElem.textContent, 10) + 1;
});

function dragStart(ev) {
  ev.dataTransfer.effectAllowed = "move";
  ev.dataTransfer.setData("Text", ev.target.getAttribute("id"));
  ev.dataTransfer.setDragImage(ev.target, 50, 50);
  return true;
}

// these functions prevents default behavior of browser
function dragEnter(ev) {
  event.preventDefault();
  return true;
}
function dragOver(ev) {
  event.preventDefault();
}

// function defined for when drop element on target
function dragDrop(ev) {
  var data = ev.dataTransfer.getData("Text");
  const power = document.getElementById(data).textContent;
  const res = parseInt(powerCountElem.textContent - power, 10);
  console.log(power);
  if (res >= 0) {
    powerCountElem.textContent = res;
    cardsElem.removeChild(document.getElementById(data));
  }
  if (cardsElem.children.length === 0) {
    getCards();
  }
  ev.stopPropagation();
  return false;
}

// cards logic
// TODO: randomize cards
const getCards = () => {
  const cards = [
    { color: "blue", power: 1 },
    { color: "purple", power: 1 },
    { color: "purple", power: 2 },
    { color: "purple", power: 3 },
    { color: "green", power: 1 },
    { color: "red", power: 1 },
  ];

  // TODO: need the id
  cards.forEach(({ color, power }, index) => {
    /*
    <div
          class="drag"
          id="boxA"
          draggable="true"
          ondragstart="return dragStart(event)"
        ></div>
    */
    cardsElem.children[index].textContent = power;
    cardsElem.children[index].style.background = color;
  });
};

getCards();
