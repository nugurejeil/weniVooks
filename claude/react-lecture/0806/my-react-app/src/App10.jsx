import { useState, useEffect, useRef } from 'react';

function Counter() {
  const [count, setCount] = useState(0)
  const [countTwo, setCountTwo] = useState(0)
  let countThree = useRef(0)
  let countFour = 0
  console.log(countThree)

  // 랜더링 됨
  const handleUseStateCountUp = (e) => {
    setCount(count + 1)
    console.log(count) // setCount는 비동기적으로 실행 -> useEffect로 변화의 동기적인 추적 가능
  }

  // 랜더링 됨
  const handleUseStateCountUpTwo = (e) => {
    setCountTwo(countTwo + 1)
    console.log(countTwo) // setCountTwo는 비동기적으로 실행 -> useEffect로 변화의 동기적인 추적 가능
  }

  // 클릭하면 변수의 값은 증가하지만 랜더링은 되지 않음
  const handleUseRefCountUpThree = (e) => {
    countThree.current = countThree.current + 1
    console.log(countThree.current)
  }

  // 랜더링 안되고 다른 state가 변해서 재렌더링 되어도 0으로 초기화
  const handleCountUpFour = (e) => {
    countFour = countFour + 1
    console.log(countFour)
  }

  useEffect(() => {
    console.log('count가 감시되고 있습니다.')
    console.log(`감시된 변수 : ${count}`)
  }, [count]) // count가 변경되는 것을 감시
  
  
  return(
    <>
      <div>{count}</div>
      <button onClick={handleUseStateCountUp}>Use State Up!</button>
      <div>{countTwo}</div>
      <button onClick={handleUseStateCountUpTwo}>Use State Up!</button>
      <div>{countThree.current}</div>
      <button onClick={handleUseRefCountUpThree}>Use Ref Up!</button>
      <div>{countFour}</div>
      <button onClick={handleCountUpFour}>value up!</button>
    </>
  )
}

function App() {
  return (
    <div>
      <Counter/>
    </div>
  );
}

export default App;