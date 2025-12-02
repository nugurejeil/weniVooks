import { useState } from "react";

function App() {
  let [count, setCount] = useState(0);
  const increment = () => {
    count += 1;
    console.log("Count:", count);
  };

  const increment2 = () => {
    setCount(count + 1);
    console.log("Count:", count);
  };

  return (
    <div>
      <div>{count}</div>
      <button onClick={increment}>Increment</button>
      <button onClick={increment2}>Increment</button>
    </div>
  );
}

export default App;