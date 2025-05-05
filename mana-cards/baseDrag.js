// See https://gsap.com/community/forums/topic/17387-multiple-dropareas/

const droppables = document.querySelectorAll(".box");
const dropZones = document.querySelectorAll(".dropArea");
const overlapThreshold = "99%";

for (let droppable of droppables) {
  initDroppable(droppable);
}

function initDroppable(element) {
  let insideZone = false;

  const highlightAnimation = TweenLite.to(element, 0.3, {
    backgroundColor: "green",
    paused: true,
  });

  Draggable.create(element, {
    onDrag: function () {
      insideZone = false;

      for (let i = 0; i < dropZones.length; i++) {
        if (this.hitTest(dropZones[i], overlapThreshold)) {
          insideZone = true;
          break;
        }
      }

      if (insideZone) {
        highlightAnimation.play();
      } else {
        highlightAnimation.reverse();
      }
    },
    onDragEnd: function () {
      if (!insideZone) {
        TweenLite.to(this.target, 0.2, {
          x: 0,
          y: 0,
        });
      } else {
        console.log("ok");
      }
    },
  });
}
