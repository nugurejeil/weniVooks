import { useState, useContext, createContext } from 'react';

const TestContext = createContext();

function A() {
  let countA = 0;
  function handleClickA() {
    countA++;
    console.log('A clicked', countA);
  }
  return (
    <>
      <button onClick={handleClickA}>Click A</button>
      <B/>
    </>
  )
}

function B() {
  let countB = 0;
  function handleClickB() {
    countB++;
    console.log('B clicked', countB);
  }
  
  return (
    <TestContext.Provider value={{ countB }}>
      <button onClick={handleClickB}>Click B</button>
      <C/>
    </TestContext.Provider>
  )
}

function C() {
  const [count, setCount] = useState(0);
  let countC = 0;
  function handleClickC() {
    countC++;
    console.log('C clicked', countC);
  }
  return (
    <>
      <button onClick={handleClickC}>Click C</button>
      <D/>
    </>
  )
} 

function D() {
  let { countB } = useContext(TestContext);
  function handleClickD() {
    countB++;
    console.log('D clicked, countB:', countB);
  }
  return (
    <>
      <div>나는 실제 D야! B의 Count는 {countB} 이야!</div>
      <button onClick={handleClickD}>Click D</button>
    </>
  )
}

function App() {
  
  let countApp = 0;
  function handleClickApp() {
    countApp++;
    console.log('App clicked', countApp);
  }

  return (
    <>
      <button onClick={handleClickApp}>Click App</button>
      <A />
    </>
  )
}


export default App