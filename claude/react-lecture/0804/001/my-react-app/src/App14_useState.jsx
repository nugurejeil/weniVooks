import { useState } from "react";

function App() {
  let [count, setCount] = useState({
    name: "hojun",
    age: 20,
  });
  const increment = () => {
    setCount({ ...count, age: count.age + 1 });
  };

  return (
    <div>
      <div>{JSON.stringify(count)}</div>
      <button onClick={increment}>Increment</button>
    </div>
  );
}

export default App;