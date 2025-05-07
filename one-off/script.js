fetch("data.txt")
  .then((res) => res.text())
  .then((text) => {
    // TODO: break up multiple lines and only mind the words on the left
    console.log(text + "ha");
  })
  .catch((e) => console.error(e));
