const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};
const objects = [
  ["household tool", "kitchenware"],
  ["light", "shadow", "illumination"],
  ["book", "letter", "diary"],
  ["local", "worker"],
  ["gadget", "electronics", "contraption"],
  ["pet", "fauna", "companion"],
  ["clothing", "fabric", "bag"],
  ["plant", "flora", "nature"],
  ["money", "gold", "jewelry"],
  ["toy", "board game", "sporting goods"],
  ["music", "song", "nursery rhyme"],
  ["furniture", "door", "window"],
  ["building", "structure", "formation"],
];
const mysteries = [
  ["disappearance", "lost", "forgotten"],
  ["presence", "sudden", "found"],
  ["unusual", "contradictory", "reversal"],
  ["altered", "morphed", "transformed"],
];
const pecularities = [
  ["appearance", "shape"],
  ["sound", "smell", "texture"],
  ["timing", "pattern"],
  ["location", "environment"],
];
const hypotheses = [
  "conspiracy",
  "historical event",
  "cultural belief",
  "supernatural event",
  "local myth",
  "family story",
  "unknown phenomenon",
  "prank",
  "hidden treasure",
];
const suspects = [
  "resident",
  "pet",
  "wild animal",
  "spirit",
  "alien",
  "tourist",
  "government",
  "historical figure",
  "monster",
  "accident",
];
const cluePositions = { suitPositions: new Set(), objectPositions: new Set() };
const getClue = () => {
  const suitPosition = getRandomInt(0, 4);
  const suit = pecularities[suitPosition];
  cluePositions.suitPositions.add(suitPosition);
  const objectPosition = getRandomInt(0, objects.length);
  cluePositions.objectPositions.add(objectPosition);
  const object = objects[objectPosition];
  const str = `The ${suit[getRandomInt(0, suit.length)]} of ${
    object[getRandomInt(object.length)]
  }`;
  return str;
};
const getHypothesis = () => {
  return `${document.getElementById("case").textContent} is a ${
    hypotheses[getRandomInt(hypotheses.length)]
  } by ${suspects[getRandomInt(0, suspects.length)]}`;
};
const getConfrontationResult = () => {
  const res = getRandomInt(0, 4);
  switch (res) {
    case 0:
      return "A clue is a red herring";
    case 1:
      return "Flawed hypothesis";
    case 2:
      return "Flawed suspect";
    default:
      return "A new clue is discovered";
  }
};
document.getElementById("showdown").addEventListener("click", () => {
  const getResultStr = () => {
    const suitIndex = getRandomInt(0, 4);
    const objectIndex = getRandomInt(0, 13);
    let resultStr = "Remains unresolved";

    if (cluePositions.suitPositions.has(suitIndex)) {
      if (cluePositions.objectPositions.has(objectIndex)) {
        return "Solved with definitive and shareable proof";
      }
      return "Solved but unable to prove to others";
    }
    return resultStr;
  };

  document.getElementById("result").textContent = getResultStr();
});
// TODO: limit to 4
const clues = [];
document.getElementById("getClue").addEventListener("click", () => {
  clues.push(getClue());
  document.getElementById("clues").textContent = JSON.stringify(clues);
});
document.getElementById("getHypothesis").addEventListener("click", () => {
  document.getElementById("hypothesis").textContent = getHypothesis();
});
document.getElementById("confront").addEventListener("click", () => {
  document.getElementById("confrontationResult").textContent =
    getConfrontationResult();
});

const getCase = () => {
  const suit = mysteries[getRandomInt(0, 4)];
  const object = objects[getRandomInt(0, objects.length)];
  const str = `The ${suit[getRandomInt(0, suit.length)]} of ${
    object[getRandomInt(object.length)]
  }`;
  return str;
};
document.getElementById("getCase").addEventListener("click", () => {
  document.getElementById("case").textContent = getCase();
});
document.getElementById("replay").addEventListener("click", () => {
  window.location.reload();
});
