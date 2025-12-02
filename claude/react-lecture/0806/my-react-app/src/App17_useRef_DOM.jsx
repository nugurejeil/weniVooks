import { useState, useRef } from "react";

// 왜 이렇게 하죠? document.getElementById() 같은 방식으로 DOM 요소에 접근하면 안되나요?
// React에 가상 DOM의 생애주기, 리렌더링 이런 철학과 맞지 않기 때문입니다.
// useRef를 사용하면 React가 관리하는 DOM 요소에 안전하게 접근할 수 있습니다
// 더 쉽게, React 방식으로 DOM을 조작한다!

function App() {

  // DOM 요소 참조용 useRef
  const inputRef = useRef(null);

  function handleClick() {
    // input 요소의 현재 값 가져오기
    const inputValue = inputRef.current.value;
    console.log(inputValue);
    console.log(inputRef.current);
    // input 요소의 값을 변경하기
    // inputRef.current.value = "새로운 값";
    // input 요소에 포커스 주기
    // inputRef.current.focus();
  }

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={handleClick}>눌러!!</button>
    </div>
  );
}

export default App;