import { useState } from "react";

function A() {
  const [valueA, setValueA] = useState(0);
  let valueAA = 0;
  return (
    <>
      <div>valueA: {valueA}</div>
      <button onClick={() => setValueA(valueA + 1)}>Increment A</button>
      <div>valueAA: {valueAA}</div>
      <button onClick={() => {
        valueAA += 1;
        console.log("ValueAA:", valueAA);
      }}>Increment AA</button>
      <B />
    </>
  )
}

function B() {
  const [valueB, setValueB] = useState(0);
  let valueBB = 0;
  return (
    <>
      <div>valueB: {valueB}</div>
      <button onClick={() => setValueB(valueB + 1)}>Increment B</button>
      <div>valueBB: {valueBB}</div>
      <button onClick={() => {
        valueBB += 1;
        console.log("ValueBB:", valueBB);
      }}>Increment BB</button>
      <C/>
    </>
  )
}

function C() {
  const [valueC, setValueC] = useState(0);
  let valueCC = 0;
  return (
    <div>
      <div>valueC: {valueC}</div>
      <button onClick={() => setValueC(valueC + 1)}>Increment C</button>
      <div>valueCC: {valueCC}</div>
      <button onClick={() => {
        valueCC += 1;
        console.log("ValueCC:", valueCC);
      }}>Increment CC</button>
    </div>
  );
}

function App() {
  return (
    <A />
  );
}

export default App;