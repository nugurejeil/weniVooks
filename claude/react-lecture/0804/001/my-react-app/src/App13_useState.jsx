import { useState } from "react";
// 그래서 감시합니다. 필요한 변수를요.
// 그리고 감시하는 변수가 변경이 되면
// 그 부분을 다시 렌더링합니다.

function App() {
  let [count, setCount] = useState(0);
  // let count = useState(0);
  // count[0] 값이 0이라는 특수 값
  // count[1] 값이 0을 변경하는 함수입니다.
  // 이렇게 사용하는 것이 불편하니 위와 같이 구조분해할당을 합니다.
  const increment = () => {
    // count += 1;
    setCount(count + 1);
    console.log("Count:", count);
  };

  return (
    <div>
      <div>{count}</div>
      <button onClick={increment}>Increment</button>
    </div>
  );
}

export default App;