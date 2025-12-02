import { useCallback, useMemo, useState } from "react"

// useMemo와 useCallback의 차이점
// useMemo는 값의 메모이제이션을 위해 사용됩니다. 앞에서 해본 것처럼 부하가 걸리는 계산 결과를 저장하기 위해서 사용되죠.
// useCallback은 함수를 메모이제이션하기 위해 사용된다. 함수를 재생성하지 않고 이전에 생성된 함수를 재사용하기 위해서 사용합니다.

// useMemo와 useCallback의 차이점 정리
// - useMemo: 값의 메모이제이션
// - useCallback: 함수의 메모이제이션

function App() {
  const [one, setOne] = useState(0);
  const [two, setTwo] = useState(0);

  // 매번 app이 렌더링될 때마다 새로운 함수를 생성합니다.
  const handleClick = () => {
    console.log('클릭1');
  }

  const handleClick2 = useCallback(() => {
    console.log('클릭2');
  }, [one]); // one이 변경될 때만 새로운 함수를 생성합니다.


  const handleClick3 = useCallback(() => {
    console.log('클릭3');
  }, []); // 빈 배열을 전달하면 컴포넌트가 처음 렌더링될 때만 함수를 생성합니다.
  return (
    <>
      <p>{one}</p>
      <button onClick={handleClick}>클릭</button>
      <p>{two}</p>
      <button onClick={handleClick2}>클릭2</button>
    </>
  )
}

export default App
