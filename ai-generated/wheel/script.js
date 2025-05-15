// TODO: combine segments, reactions, emoticons and add severity: 1, 2, 3, 4
const segments = ["Admire", "Joke", "Coerce", "Boast"];
const obj = {
    Love: { emoticon: "😍", severity: 1, segment: 'Admire' },
    Like: { emoticon: "😊", severity: 1, segment: 'Admire' },
    Dislike: { emoticon: "😐", severity: 1, segment: 'Admire' },
    Hate: { emoticon: "😠", severity: 1, segment: 'Admire' },
}
const reactions = Object.keys(obj)
const severity = [1, 2, 3, 4]
severity.sort(() => Math.random() - 0.5);
let i = 0;
for (let key of reactions) {
    obj[key].severity = severity[i]
    i++
}

const countContainer = document.getElementById('count')
let count = 50
countContainer.textContent = count
const intervalId = setInterval(() => {
    count--
    countContainer.textContent = count
    if (count <= 0) {
        clearInterval(intervalId)
    }
}, 1000);
const personality = {};
const shuffledReactions = reactions.sort(() => Math.random() - 0.5);
segments.forEach((seg, idx) => {
    personality[seg] = shuffledReactions[idx];
    console.log(shuffledReactions[idx])
    obj[shuffledReactions[idx]].segment = seg
});
console.log(obj)

const wheel = document.getElementById("wheel");
const face = document.getElementById("face");

segments.forEach((label, index) => {
    const seg = document.createElement("div");
    seg.className = "segment";
    seg.style.transform = `rotate(${index * 90}deg) translate(-100%, -100%)`;
    seg.textContent = label;

    seg.addEventListener("mouseenter", () => {
        face.textContent = obj[personality[label]].emoticon;
    });

    seg.addEventListener("mouseleave", () => {
        face.textContent = "🙂";
    });
    seg.addEventListener("click", () => {
        console.log('clicked', label, shuffledReactions[index], obj[shuffledReactions[index]].severity)
    });

    wheel.appendChild(seg);
});