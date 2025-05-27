let beingShownId = null;
const selectedOptions = {
    hat: null,
    top: null,
}
for (let button of document.getElementsByClassName("showButton")) {
    console.log(button.id)
    button.addEventListener("click", function () {
        if (beingShownId) {
            // hide the previous selected div
            document.getElementById(beingShownId).classList.add('hide')
        }
        beingShownId = `${button.id}Options`
        document.getElementById(beingShownId).classList.remove('hide')

    })
}
const parentOfGhost = document.getElementById('characterImage').parentElement
const checkAncestorId = (element, id) => {
    return element && (element.id === id || checkAncestorId(element.parentElement, id));
}
document.querySelectorAll('.option-group img').forEach(img => {
    img.addEventListener('click', function () {
        console.log(img.id, img.parentElement.parentElement);
        if (checkAncestorId(img, 'hatOptions')) {
            if (selectedOptions.hat) {
                // change the src
                const chosenHatNode = document.getElementById('chosenHat');
                chosenHatNode.src = img.src;
                chosenHatNode.classList.add('hatShow');
            } else {
                const clonedNode = img.cloneNode(true);
                clonedNode.id = 'chosenHat'; // Clear the id to avoid duplicates
                clonedNode.classList.add('hatShow');
                parentOfGhost.appendChild(clonedNode);
            }
            selectedOptions.hat = img.id;
        } else if (checkAncestorId(img, 'topOptions')) {
            if (selectedOptions.top) {
                // change the src
                const chosenTopNode = document.getElementById('chosenTop');
                chosenTopNode.src = img.src;
                chosenTopNode.classList.add('topShow');
            } else {
                const clonedNode = img.cloneNode(true);
                clonedNode.id = 'chosenTop'; // Clear the id to avoid duplicates
                clonedNode.classList.add('topShow');
                parentOfGhost.appendChild(clonedNode);
            }
            selectedOptions.top = img.id;
            console.log(selectedOptions);
        }
    });
});