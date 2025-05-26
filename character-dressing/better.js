let beingShownId = null;
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