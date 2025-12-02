# 23. useState - Lazy initialize

`Lazy initialize`는 `useState`를 사용하여 state를 초기화하는 과정을 **lazy(게으르게)**하게 실행하는 것입니다.

다음 예시를 살펴봅시다.

```jsx
import React, { useEffect, useState } from "react";

function getName(){
	console.log("사실은 겁나 오래기다리는중...");
	return "개리";
}

function App() {
  const [name, setName] = useState(getName());
  const [num, setNum] = useState(0);
  return(
    <>
      <div>안녕하세요 {name}! 현재 숫자는{num}입니다</div>
      <button onClick={()=>setNum((prevNum)=>prevNum+1)}>{num}</button>
    </>
  )
}

export default App;
```

위 예시를 실행하면 왼쪽 이미지의 실행 화면과 오른쪽 이미지처럼 로그가 출력됩니다. 오래 기다리고 있다는 것을 확인하기 위해 로그(사실은 겁나 오래기다리는중…)를 남겨두었습니다.

![실행 화면](Untitled%2054.png)

실행 화면

![콘솔 로그](Untitled%2055.png)

콘솔 로그

우리는 버튼을 눌러 숫자를 변경할 수 있도록 만들어 두었습니다. 버튼을 눌러 값을 변경해 봅시다!

음.. 12번 정도 클릭해볼까요? 의도한대로 버튼을 클릭할 때마다 숫자가 1씩 증가하고 있습니다.

![Untitled](Untitled%2056.png)

그런데 이럴수가..! 로그가 클릭한 횟수만큼 찍히고 있습니다. 🧐

![Untitled](Untitled%2057.png)

그 이유는 컴포넌트가 매번 렌더링될 때마다 `getName` 함수를 실행하기 때문입니다. 만약 안에서 실행하는 함수가 오래 걸린다면 매번 렌더링 때마다 오랜시간을 기다려야 하겠죠?

`useState` 또한 매번 실행되지만 **실제로 값을 초기화 하는 것은 최초 1번만** 일어납니다.

현재 우리가 작성한 `useState(getName())` 의 흐름을 보면, 아래와 같은 과정이 실행됩니다.

1. `getName()`의 결과값을 얻는다.
2. 얻은 결과값을 `useState()`안에 인수로 넣어준다.
3. state가 초기화된다.(리렌더링 과정에서는 state가 바뀌진않는다)

매번 `useState`를 실행하는 과정이 일어나도 리액트가 잘 관리해주지만 우리가 만든 `getName` 함수를 실행하는 과정에서 비효율적인 동작이 일어나고 있습니다.

이러한 비효율을 어떻게 최적화시킬 수 있을까요?

바로 함수 자체를 값으로 넘기고 리액트가 그 함수를 실행하도록 만드는 것입니다. 아래와 같이 함수를 실행한 결과를 값으로 넘기지 않고 `getName`함수 자체를 값으로 넘기는 방식으로 바꿔보겠습니다.

```jsx
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
// import App from "./App";
function getName(){
	console.log("사실은 겁나 오래기다리는중...");
	return "개리";
}

function App() {
  const [name, setName] = useState(getName);
  const [num, setNum] = useState(0);
  return(
    <>
      <div>안녕하세요 {name}! 현재 숫자는{num}입니다</div>
      <button onClick={()=>setNum((prevNum)=>prevNum+1)}>{num}</button>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById("root"));
```

위 예시와 같이 코드를 수정 후 다시 실행해 봅시다. 이번에는 버튼을 9번 정도만 클릭해 볼까요?

![실행 화면](Untitled%2058.png)

실행 화면

그리고 로그를 살펴보겠습니다.

![콘솔 로그](Untitled%2059.png)

콘솔 로그

어떤 부분이 다른지 살펴봅시다.

1. `useState()`에 인수로 `getName` 함수를 값으로 넘겨준다.
2. `useState(getName)`이 진행되면 최초 초기화 진행 과정에서 `getName`을 실행하게 된다.
3. 이후 업데이트(리렌더링 과정)에서 초기화가 진행되지 않기 때문에 `getName`을 실행하는 부분이 생략된다.

이와 같이 `lazy initialize`는 초기값 계산에 많은 비용(연산 시간, 메모리 등)이 소요될 때 비효율적인 부분을 최적화하는데 사용할 수 있습니다.

<aside>
🤔 **왜 게으른(lazy) 일까?**
게으른 초기화라고 불리는 이유는 딱 컴포넌트 초기화 시에만 state 함수의 인자를 평가하고, 그 이후에는 무시하기 때문입니다. 
컴포넌트가 업데이트 되면 기본적으로는 컴포넌트 내부의 코드가 다시 실행되야 하는데, state 함수의 인자로 전달된 함수는 실행을 하지 않고 미뤄버리기 때문에 게으르다고 표현합니다.

```jsx
// 컴포넌트가 전달받는 props 를 통해 상태값의 초기화를 진행하는 경우.
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});
```

</aside>

<aside>
🤔 **Lazy initialize VS useMemo**

- 게으른 초기화 (Lazy Initialization):
    - 초기 상태를 계산하는 비용이 높을 때 사용합니다.
    - 컴포넌트의 **첫 렌더링 시**에만 실행됩니다.
    - 이후 리렌더링에서는 이 함수의 결과를 재사용합니다.
- useMemo:
    - 계산 비용이 높은 값을 메모이제이션하는 데 사용됩니다.
    - 컴포넌트가 처음 랜더링 될 때, 의존성 배열의 값이 변경될 때마다 재 계산됩니다.

 결론 : 게으른 초기화는 초기 상태 설정을 최적화하는 데 사용되고, useMemo는 렌더링 중 반복되는 고비용 계산을 최적화하는 데 사용됩니다.

</aside>

---

[Hooks API Reference - React](https://reactjs.org/docs/hooks-reference.html#usestate)

[react/ReactHooks.js at 75f3ddebfa0d9885ce8df42571cf0c09ad6c0a3b · facebook/react](https://github.com/facebook/react/blob/75f3ddebfa0d9885ce8df42571cf0c09ad6c0a3b/packages/react/src/ReactHooks.js#L79)