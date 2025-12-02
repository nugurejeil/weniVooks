import { useState, useContext, createContext } from 'react';


function A() {
  return (
    <B/>
  )
}

function B() {
  const [count, setCount] = useState(0);
  
  return (
    <>
      <C/>
      <div>Count: {count}</div>
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
    </>    
  )
}

function C() {
  return (
    <D/>
  )
} 

function D() {
  return (
    <div>hello world D</div>
  )
}

function App() {
  
  let countA = 0;
  function handleClickA() {
    countA++;
    console.log('A clicked', countA);
  }

  return (
    <>
      <div>{countA}</div>
      <button onClick={handleClickA}>Click A</button>
      <A />
    </>
  )
}


export default App