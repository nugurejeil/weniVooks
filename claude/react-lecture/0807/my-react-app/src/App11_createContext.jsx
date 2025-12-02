// MyContext.Provider
// 값을 제공하는 컴포넌트입니다. 하위 컴포넌트에서 이 값을 사용할 수 있습니다. 자손이어도 사용할 수 있습니다. 최상위에서 제공하면 모든 하위 컴포넌트에서 접근할 수 있습니다.
// MyContext.Consumer
// 값을 소비하는 컴포넌트입니다. 하위 컴포넌트에서 이 값을 사용할 수 있습니다. 자손이어도 사용할 수 있습니다. 최상위에서 제공한 값을 사용할 수 있습니다.

import { createContext } from 'react';

const MyContext = createContext({
    count: 0,
});


function A() {
    return (
        <div>
            <h2>Component A</h2>
            <B />
        </div>
    )
}

function B() {
    return (
        <div>
            <h2>Component B</h2>
            <C />
        </div>
    )
}

function C(){
    return (
        <div>
            <h2>Component C</h2>
            <MyContext.Consumer>
                {/* 
                {({ count }) => (
                    <p>Count from context: {count}</p>
                )} 
                 */}
                {(value) => (
                    <p>Count from context: {value.count}</p>
                )}
            </MyContext.Consumer>
        </div>
    )

}

function App() {
    return (
        <>
            <div>
                <h1>Counter</h1>
                <MyContext.Provider value={{ count: 10 }}>
                    <A />
                </MyContext.Provider>
            </div>
        </>
    )
}

export default App
