import { useState, useRef } from "react";


function App() {
  let [countOne, setCountOne] = useState(0);
  let countTwo = 0;

  return (
    <div>

      <div>{countOne}</div>
      <button onClick={() => setCountOne(countOne + 1)}>Increment</button>
      
      <div>{countTwo}</div>
      <button onClick={() => {
        countTwo += 1;
        console.log("CountTwo:", countTwo);
      }}>Increment</button>
      
    </div>
  );
}

export default App;