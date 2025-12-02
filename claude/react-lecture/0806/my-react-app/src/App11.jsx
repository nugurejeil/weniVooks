import { useState, useRef } from "react";

function App() {
  let [countOne, setCountOne] = useState(0);
  let [countTwo, setCountTwo] = useState(0);
  // useRef는 컴포넌트가 리렌더링되어도 값이 유지됨
  let countThree = useRef(0);
  // 일반 변수는 리렌더링 시 초기화됨
  let countFour = 0;

  const increment1 = () => {
    setCountOne(countOne + 1);
    console.log("CountOne:", countOne);
  };

  const increment1_1 = () => {
    countOne = countOne + 1;
    console.log("CountOne:", countOne);
  };

  const increment2 = () => {
    countTwo += 1;
    console.log("CountTwo:", countTwo);
  };

  const increment3 = () => {
    countThree.current += 1;
    console.log("CountThree:", countThree.current);
  };

  const increment4 = () => {
    countFour += 1;
    console.log("CountFour:", countFour);
  };

  return (
    <div>
      <div>{countOne}</div>
      <button onClick={increment1}>Increment</button>
      <div>{countOne}</div>
      <button onClick={increment1_1}>Increment</button>
      <div>{countTwo}</div>
      <button onClick={increment2}>Increment</button>
      <div>{countThree.current}</div>
      <button onClick={increment3}>Increment</button>
      <div>{countFour}</div>
      <button onClick={increment4}>Increment</button>
    </div>
  );
}

export default App;