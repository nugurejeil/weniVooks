import { useState } from 'react';

// 애러: Invalid hook call. Hooks can only be called inside of the body of a function component.
// useState를 App 컴포넌트 안에서 선언해야 합니다! 안그럼 애러 납니다!
// const [count, setCount] = useState(0);

// 그런데 말이죠. 만약 그냥 변수로 선언을 하면 어떻게 될까요?
let count = 0;
let setCount = (newCount) => {
    count = newCount;
    console.log(`Count updated to: ${count}`);
};

function A() {
    return (
        <div>
            <h2>Component A</h2>
            <p>Value1: {count}</p>
            <B />
        </div>
    )
}

function B() {
    return (
        <div>
            <h2>Component B</h2>
            <p>Value2: {count}</p>
            <C />
        </div>
    )
}

function C(){
    return (
        <div>
            <h2>Component C</h2>
            <p>value3: {count}</p>
        </div>
    )

}

function App() {
    return (
        <>
            <div>
                <h1>Counter</h1>
                <p>Count: {count}</p>
                <button onClick={() => setCount(count + 1)}>Increase</button>
                <A/>
            </div>
        </>
    )
}

export default App
