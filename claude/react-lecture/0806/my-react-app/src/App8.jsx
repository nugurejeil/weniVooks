import { useState, useEffect } from "react";


function App() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log('카운트가 변경되었어요!');
  }, [count]);
  return (
    <>
      <h1>Counter: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </>
  )
}

export default App;