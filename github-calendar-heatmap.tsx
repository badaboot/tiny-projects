import "./styles.css";
import { ActivityCalendar } from "react-activity-calendar";
// https://codesandbox.io/p/sandbox/sharp-nightingale-pvwq7t
const data = [
  {
    date: "2024-11-03",
    count: 2,
    level: 3,
  },
  {
    date: "2024-11-06",
    count: 1,
    level: 3,
  },
  {
    date: "2024-11-07",
    count: 1,
    level: 3,
  },
];

const explicitTheme = {
  dark: ["lightgray", "yellow", "lightgreen", "green"],
};

export default function App() {
  return (
    <div className="App">
      <ActivityCalendar data={data} maxLevel={3} theme={explicitTheme} />
    </div>
  );
}
