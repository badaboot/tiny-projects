const maleNames = [
  "Noah",
  "Liam",
  "Oliver",
  "James",
  "Gideon",
  "Mateo",
  "Theodore",
  "Henry",
  "Lucas",
  "William",
];

const femaleNames = [
  "Olivia",
  "Emma",
  "Charlotte",
  "Amelia",
  "Sophia",
  "Mia",
  "Isabella",
  "Ava",
  "Evelyn",
  "Luna",
];
const creatureType = {
  dog: {
    terrier:
      "https://www.hartz.com/wp-content/uploads/2022/04/small-dog-owners-1.jpg",
    pom: "https://static.vecteezy.com/system/resources/thumbnails/008/951/892/small_2x/cute-puppy-pomeranian-mixed-breed-pekingese-dog-run-on-the-grass-with-happiness-photo.jpg",
    long: "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1opgX7.img?w=800&h=415&q=60&m=2&f=jpg",
  },
  snake: {
    cobra: "https://cdn.mos.cms.futurecdn.net/7grkegytV4qrcMb9zSQT8V.jpg",
    brown:
      "https://t4.ftcdn.net/jpg/09/34/07/73/360_F_934077333_7LmN9XAoAvYdmKT6CpAPc3gcgdmq0229.jpg",
    green:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQM7zaSCWXJNJUuD3x2x3YdCou0rQ0kXMqUxdodQjlNXmOdo-8gXp86nul6ctjotKfZp5o&usqp=CAU",
  },
  cat: {
    orange:
      "https://images.unsplash.com/photo-1638947693941-669835e07b4c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tabby:
      "https://media.istockphoto.com/id/510059912/photo/close-up-of-a-kittenin-front-of-a-white-background.jpg?s=612x612&w=0&k=20&c=_F5dEf6VAowWZ2Fa3lc0dcu7wG6IGLE9oiTsUnbH-hY=",
    black:
      "https://media.istockphoto.com/id/908714708/photo/black-and-white-cat-with-white-mustache.jpg?s=612x612&w=0&k=20&c=Z9Q4uZN54LewVhI8zL7y38ux844TcI8Vghq5EKNMgVk=",
  },
  bird: {
    humming:
      "https://i.pinimg.com/736x/81/96/f3/8196f30c672835c7f4d76099e1ea406f.jpg",
    secretary:
      "https://images.fineartamerica.com/images-medium-large-5/secretary-bird-close-up-iunona-croitor.jpg",
    parrot:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShUhXjIDKUaICLlGqr1m6_5OVkpzxfqwSgqg&s",
  },
};
const professions = [
  "Architect",
  "Engineer",
  "Accountant",
  "Designer",
  "Engineer",
  "Electrician",
  "Plumber",
  "Physician",
  "Lawyer",
  "Dentist",
  "Musician",
  "Artist",
];

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

const generateButton = document.getElementById("generate");
generateButton.addEventListener("click", () => {
  // 0 or 1
  const gender = getRandomInt(2);
  const name =
    gender === 0
      ? maleNames[getRandomInt(maleNames.length)]
      : femaleNames[getRandomInt(femaleNames.length)];
  const creatures = Object.keys(creatureType);
  const typeOfCreature = creatures[getRandomInt(creatures.length)];
  const image = Object.values(creatureType[typeOfCreature])[getRandomInt(3)];
  const profile = {
    gender: gender === 0 ? "male" : "female",
    typeOfCreature: typeOfCreature,
    name: name,
    image: image,
    profession: professions[getRandomInt(professions.length)],
  };

  document.getElementById("image").src = profile.image;
  document.getElementById("name").textContent = profile.name;
  document.getElementById("profession").textContent = profile.profession;
});
