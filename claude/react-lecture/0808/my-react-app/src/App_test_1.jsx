import { useState, useContext, createContext } from 'react';


function A() {
  return (
    <B/>
  )
}

function B() {
  return (    
    <C/>
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
  const [count, setCount] = useState(0);
  let countA = 0;
  function handleClickA() {
    countA++;
    console.log('A clicked', countA);
  }

  return (
    <>
      <A />
      <button onClick={handleClickA}>Click A</button>
      <div>Count: {count}</div>
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
    </>
  )
}


export default App