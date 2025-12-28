# useLayoutEffect와 useEffect의 차이

# 1. 비슷하게 생겼는데요..?

```jsx
useLayoutEffect(() => {
    console.log("⏱마운트/업데이트 될때마다 브라우저에 그려주기 전에 실행!");
    return ()=>{
      console.log("⏱🧹업데이트가 될때, 언마운트될때 실행됩니다!")
    }
  });

useEffect(() => {
    console.log("🎈마운트/업데이트 될때마다 브라우저에 그려진 후 실행!");
    return ()=>{
      console.log("🎈🧹업데이트가 될때, 언마운트될때 실행됩니다!")
    }
  }); 

```

`useLayoutEffect`라는 것이 있는데요. `useEffect`와 똑같이 생겼습니다! 어떻게 다르며 왜 있는 것일까요?! 🧐

# 2. 저는 이 깜빡거림이 싫습니다.

React DOM Tree를 구성하기 위한 과정인 **Render**와 실제 브라우저에 그려주는 과정(**Paint**)이 있습니다. 

![함수형 컴포넌트의 흐름 : React Hook Flow](Untitled%2046.png)

함수형 컴포넌트의 흐름 : React Hook Flow

Effect는 브라우저에 **그려진 후**에 진행됩니다. 이로 인해 가끔 `useState`를 통해 초기화된 값이 보일 때가 있습니다.

초기화한 후 초기화 값을 이용해 `setState`를 하는 상황이 있다고 가정해 보겠습니다.

```jsx
const [num, setNum] = useState(0);

useEffect(() => {
  setNum((prev) => prev + 1); //사실은 엄청 오래걸리고 어려운 로직
},[num]);
```

최초에 num이 0으로 초기화 되고 최초 렌더링에서 `num+1`하는 과정이 실행이 됩니다. 가끔 **0**이라는 초기화 값을 보이지 않게 할 때 사용하는 것이 `useLayoutEffect`입니다.

```jsx
const [num, setNum] = useState(0);

useLayoutEffect(() => {
  setNum((prev) => prev + 1); //사실은 엄청 오래걸리고 어려운 로직
},[num]);
```

**Render 과정과** **Paint 과정 사이**에서 `useLayoutEffect`가 동작하게 됩니다. 해당 `LayoutEffect`가 **실행이 끝나면 Paint가 진행됩니다.**

즉, **useLayoutEffect 과정이 마쳐진 후**에 브라우져에 그려지게 됩니다. `useEffect`는 작업이 모두 끝나지 않아도 화면이 잘 그려지던데 동작 방식이 다른 것 같네요. 

이는 `useEffect`는 **비동기적**으로 동작하지만, `useLayoutEffect`는 **동기적으로** 동작하기 때문입니다. 따라서 `useLayoutEffect`가 오래걸리는 작업이라면 화면도 늦게 렌더링됩니다.

> 🔥 **결론 : 필요에 따라 잘 사용하자! 🔥**
> 

---

- 깜빡이고 있는 예제

```jsx
import { useState, useEffect, useLayoutEffect } from 'react'

function App() {
  const [value, setValue] = useState(100);
  
  useEffect(() => {
    if (value >= 1000) {
      setValue(300);
    }
  }, [value]);
  
  return (
    <div>
      {/* <div style={{ width: value, height: value, backgroundColor: 'blue', transition: '1s all' }}></div> */}
      <div style={{ width: value, height: value, backgroundColor: 'blue' }}></div>
      <button onClick={() => {setValue(1000)}}>커져랏!</button>
      <button onClick={() => {setValue(200)}}>작아져랏!</button>
    </div>
  )
}

export default App;
```

```
1. useLayoutEffect는 useEffect보다 먼저 실행됩니다. 따라서 useEffect보다 먼저 실행하고 싶은 무언가가 있다면 useLayoutEffect를 사용해야 한다라는 것을 알 수 있습니다.

2. 
2.1 렌더링 되었을 때 useLayoutEffect return의 콜백함수가 실행됩니다. 그리고 useLayoutEffect 가 실행됩니다.
2.2 useEffect return의 콜백함수가 실행됩니다. useEffect 가 실행됩니다.

3. 깜빡임을 해결하고 싶다? useEffect -> useLayoutEffect
```