import { useState, useRef } from "react";


function App() {
  let [countOne, setCountOne] = useState(0);
  let countTwo = useRef(0);

  return (
    <div>

      <div>{countOne}</div>
      <button onClick={() => setCountOne(countOne + 1)}>Increment</button>

      <div>{countTwo.current}</div>
      <button onClick={() => {
        countTwo.current += 1;
        console.log("CountTwo:", countTwo.current);
      }}>Increment</button>
      
    </div>
  );
}

export default App;