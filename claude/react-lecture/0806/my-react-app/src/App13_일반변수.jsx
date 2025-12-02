import { useState, useRef } from "react";

// 어떨때 사용하나요?
// useRef는 컴포넌트가 리렌더링 되어도 값을 유지하고 싶은 변수를 사용할 때 사용합니다.
// useRef는 중요한 점이 리렌더링을 발생시키지 않습니다.
// useState는 상태가 변경되면 해당 컴포넌트를 리렌더링합니다.

function App() {
  let [countOne, setCountOne] = useState(0);
  // useRef는 컴포넌트가 리렌더링되어도 값이 유지됨
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