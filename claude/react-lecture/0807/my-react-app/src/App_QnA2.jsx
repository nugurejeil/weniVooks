import { useState, useCallback, useEffect } from "react";

// useState가 변할 때 React의 업데이트는 하나로 묶여 처리 됩니다.
// React 내에 성능 최적화와 관련이 있는 기능입니다.

function App() {
  const [countOne, setCountOne] = useState(0);
  const [countTwo, setCountTwo] = useState(0);

  console.log("App 렌더링됨");

  function handleCountChange() {
    setCountOne(countOne + 1);
    setCountTwo(countTwo + 1);
    console.log("카운트 변경됨");
  }

  return (
    <>
        <h1>useState 실습</h1>
        <div>
            <h2>카운트 1: {countOne}</h2>
            <h2>카운트 2: {countTwo}</h2>
            <button onClick={handleCountChange}>눌러!</button>
        </div>
    </>
  );
}

export default App;