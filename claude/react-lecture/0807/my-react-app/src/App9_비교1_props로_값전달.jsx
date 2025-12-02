import { useState } from 'react';

function A({ value1 }) {
    return (
        <div>
            <h2>Component A</h2>
            <p>Value1: {value1}</p>
            <B value2={value1} />
        </div>
    )
}

function B({ value2 }) {
    return (
        <div>
            <h2>Component B</h2>
            <p>Value2: {value2}</p>
            <C value3={value2} />
        </div>
    )
}

function C({ value3 }){
    return (
        <div>
            <h2>Component C</h2>
            <p>value3: {value3}</p>
        </div>
    )

}

function App() {
    const [count, setCount] = useState(0);
    return (
        <>
            <div>
                <h1>Counter</h1>
                <p>Count: {count}</p>
                <button onClick={() => setCount(count + 1)}>Increase</button>
                <A value1={count} />
            </div>
        </>
    )
}

export default App
