import "./styles.css";
import {useState} from 'react'
const SETTING = [
  "library",
  "thrift store",
  "grocery store",
  "book store",
  "hospital",
  "Zoom",
];
const SITUATION = [
  "date",
  "job interview",
  "lunch",
  "dinner",
  "outdoors",
  "visit family",
];
const GENRE = [
  "comedy",
  "science fiction",
  "fantasy", // includes magical realism
  "thriller",
  "horor",
  "romance",
];

const getNumber = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
}
export default function App() {
  const [genre, setGenre] = useState('')
  const [setting, setSetting] = useState('')
  const [situation, setSituation] = useState('')
  return (
    <div className="App">
      <h1>Story idea generator</h1>
        <div>Genre: {genre}</div>
  <div>Setting: {setting}</div>
  <div>Situation {situation}</div>
  <button style={{marginTop: 20}} onClick={() => {
    // 0 to 5
    setSetting(getNumber(SETTING))
    setSituation(getNumber(SITUATION))
    setGenre(getNumber(GENRE))
  }}>Generate</button>
    </div>
  );
}

