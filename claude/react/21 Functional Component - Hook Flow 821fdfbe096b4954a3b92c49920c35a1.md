# 21. Functional Component - Hook Flow

# 1. 함수형 컴포넌트의 라이프사이클

함수형 컴포넌트에서의 라이프 사이클을 알아보도록 하겠습니다. 함수형 컴포넌트에서는 **라이프 사이클 메서드를 직접적으로 사용하진 않습니다.**

이전의 리액트에서는 Hook을 지원하지 않았기 때문에 함수형 컴포넌트에서 라이프 사이클 메서드를 사용하기 힘들었습니다. 

16.8버전에서 발표된 Hook을 통해 class를 작성하지 않고 state와 같은 React의 기능들을 사용할 수 있게 되면서 함수형 컴포넌트를 훨씬 편하게 사용할 수 있게 해주었습니다.

# 2. Hook이 발생되는 시점

아래 이미지는 앞서 배운 클래스 컴포넌트에서의 라이프 사이클입니다.

![클래스 컴포넌트에서의 대략적인 라이프 사이클](Frame_79%201.png)

클래스 컴포넌트에서의 대략적인 라이프 사이클

 
함수형 컴포넌트 또한 페이지에 렌더링하기 위한 과정이 있을텐데요. 함수형 컴포넌트에서 훅이 동작하며 렌더링되는 과정을 **React Hook Flow**라고 부르겠습니다.(공식 명칭이 아닙니다.)

## 2.1 Hook Flow

함수형 컴포넌트에서의 Hook 흐름(flow)에 대해서 살펴봅시다. 

![함수형 컴포넌트의 흐름 : React Hook Flow](Untitled%2046.png)

함수형 컴포넌트의 흐름 : React Hook Flow

### 2.1.1 마운트(Mount)

1. `Run lazy initializers`
2. `render`
3. `React updates DOM`
4. `Run LayoutEffects`
5. `Browser paints screen`
6. `Run Effects`

### 2.1.2 업데이트(Update)

1. `render`
2. `React updates DOM`
3. `Cleanup LayoutEffects`
4. `Run LayoutEffects`
5. `Browser paints screen`
6. `Cleanup Effects`
7. `Run Effects`

### 2.1.3 언마운트(Unmount)

1. `Cleanup LayoutEffects`
2. `Cleanup Effects`

## 2.2. 상세 내용

### 2.2.1 Run lazy initializers

컴포넌트가 만들어 질 때 props, state 등의 값을 초기화합니다. 최초 마운트가 될 때 단 1번 실행됩니다.

### 2.2.2 Render

리액트 DOM을 렌더합니다.

### 2.2.3 React updates DOM

랜더링된 DOM과 기존 DOM을 기반으로 업데이트합니다.

### 2.2.4 Cleanup LayoutEffects

업데이트/언마운트 과정에서 실행됩니다. 업데이트 과정에서는 `Run LayoutEffects` 이전, 언마운트 과정에서는 컴포넌트가 제거되기 전에 진행됩니다.

### 2.2.5 Run LayoutEffects

마운트/업데이트 과정에서 컴포넌트가 브라우저에 그려지기 전에 동작됩니다.

[useLayoutEffect와 useEffect의 차이](https://www.notion.so/useLayoutEffect-useEffect-c9b318940d0345f58c507da027950be9?pvs=21)

### 2.2.6 Browser paints screen

만들어진 React DOM들을 브라우저에 그려줍니다.

### 2.2.7 Cleanup Effects

업데이트/언마운트 과정에서 실행됩니다. `Run Effects` 이전, 언마운트 과정에서는 컴포넌트가 제거되기 전에 진행됩니다.

### 2.2.8 Run Effects

마운트/업데이트 과정에서 컴포넌트가 브라우저에 그려진 후에 동작됩니다.

# 3. Hook Flow 확인하기

아래는 버튼을 클릭했을 때 버튼의 숫자를 업데이트 되게 하는 예제입니다.

<aside>
💡 다음 이모지를 통해 console.log를 확인해보며

⏱ :  `LayoutEffect`

🧹 : 클린업 함수

🎈 : `Effect`

</aside>

```jsx
import React, { useEffect, useLayoutEffect, useState } from "react";

function App() {
  const [num, setNum] = useState(0);

  const onClick = () => {
    setNum(num + 1);
  };
  
  useLayoutEffect(() => { 
    console.log("⏱마운트 될때 브라우저에 그려주기 전에 딱 한번실행!");
    return ()=>{
      console.log("⏱🧹언마운트될때 단 한번 실행됩니다!")
    }
  }, []); 

	useLayoutEffect(() => {
    console.log("⏱마운트/업데이트 될때마다 브라우저에 그려주기 전에 실행!");
    return ()=>{
      console.log("⏱🧹업데이트가 될때, 언마운트될때 실행됩니다!")
    }
  }); 

  useLayoutEffect(() => {
    console.log("⏱마운트 될때, num state변경으로 인해 업데이트 될때 브라우저에 그려주기 전에 실행!");
    return ()=>{
      console.log("⏱🧹업데이트가 될때, 언마운트될때 실행됩니다!")
    }
  }, [num]);

  //useLayoutEffect가 모두 끝난 후에야 브라우저에 그려주기 시작합니다.

  useEffect(() => {
    console.log("🎈마운트 될때 브라우저에 그려진 후 딱 한번실행!");
    return ()=>{
      console.log("🎈🧹언마운트될때 단 한번 실행됩니다!")
    }
  }, []);

	useEffect(() => {
    console.log("🎈마운트/업데이트 될때마다 브라우저에 그려진 후 실행!");
    return ()=>{
      console.log("🎈🧹업데이트가 될때, 언마운트될때 실행됩니다!")
    }
  }); 

  useEffect(() => {
    console.log("🎈마운트 될 때, num state변경으로 인해 업데이트 될때 브라우저에 그려진 후 실행!");
    return ()=>{
      console.log("🎈🧹업데이트가 될때, 언마운트될때 실행됩니다!")
    }
  }, [num]);

  return (
      <button onClick={onClick}>{num}</button>
  );
}
const Wrap = ()=>{
  const [isVisible,setIsVisible] = useState(true)
  const handleClick = ()=> setIsVisible(!isVisible)
  return (
    <>
      <button onClick={handleClick}>{isVisible? "언마운트시키기" : "마운트시키기"}</button>
      <br></br>
      {isVisible&& <App />}
    </>
  )
}

export default Wrap
```

console.log를 다른 방식으로 표현하여 좀 더 보기 쉽게 바꾼 예제입니다.

```jsx
import React, { useEffect, useLayoutEffect, useState } from "react";

function App() {

  const [num, setNum] = useState(0)

  const handleonClick = () => {
    setNum(num + 1)
  }

  useLayoutEffect(()=>{
    console.log('useLayoutEffect 1')
    return () => {
      console.log('useLayoutEffect return_1')
    }
  }, [])

  useLayoutEffect(()=>{
    console.log('useLayoutEffect 2')
    return () => {
      console.log('useLayoutEffect return_2')
    }
  })

  useLayoutEffect(()=>{
    console.log('useLayoutEffect 3')
    return () => {
      console.log('useLayoutEffect return_3')
    }
  }, [num])

  useEffect(()=>{
    console.log('useEffect 1')
    return () => {
      console.log('useEffect return_1')
    }
  }, [])

  useEffect(()=>{
    console.log('useEffect 2')
    return () => {
      console.log('useEffect return_2')
    }
  })

  useEffect(()=>{
    console.log('useEffect 3')
    return () => {
      console.log('useEffect return_3')
    }
  }, [num])

  return (
    <button onClick={handleonClick}>{num}</button>
  );
}

const Wrap = ()=>{
  const [isVisible,setIsVisible] = useState(true)
  const handleClick = ()=> setIsVisible(!isVisible)
  return (
    <>
      <button onClick={handleClick}>{isVisible? "언마운트시키기" : "마운트시키기"}</button>
      <br></br>
      {isVisible&& <App />}
    </>
  )
}

export default Wrap;
```

## 3.1 최초 마운트가 되었을 때

App 컴포넌트를 마운트 시키고, 언마운트 시키기 위한 Wrap 컴포넌트를 만들어 주었습니다.
또한 업데이트를 테스트하기 위한 버튼 컴포넌트를 만들었습니다.

![Untitled](Untitled%2047.png)

이렇게 만들어진 페이지가 브라우저에 그려졌을 때 콘솔 로그를 확인해 보겠습니다. `useLayoutEffect`와 `useEffect`가 모두 실행된 것을 확인할 수 있습니다.

![Untitled](Untitled%2048.png)

## 3.2 업데이트가 되었을 때

업데이트를 시켜보도록하겠습니다. 숫자 버튼을 누르면 카운트가 올라갑니다.

![Untitled](Untitled%2047.png)

![Untitled](Untitled%2049.png)

이때 state가 바뀌며 업데이트가 일어납니다. 로그를 확인해 보겠습니다.

![Untitled](Untitled%2050.png)

최초 마운트 되었을 때 클린업을 제외한 로그가 6개였는데 2개가 사라졌음을 확인할 수 있습니다. 또한 `layoutEffect`와 `Effect`가 진행되기 전 클린업이 동작하는 것을 확인할 수 있습니다.

## 3.3 언마운트가 되었을 때

`언마운트 시키기` 버튼을 눌러 App 컴포넌트를 언마운트 시키겠습니다.

![Untitled](Untitled%2051.png)

그리고 이때 진행된 로그를 확인하겠습니다.

![Untitled](Untitled%2052.png)

# 4. (참고) React hook ≠ 라이프 사이클 메서드

<aside>
📌 React hook은 라이프 사이클 메서드가 아닙니다!!

</aside>

> **Hook을 통해 서로 비슷한 것을 하는 작은 함수의 묶음으로 컴포넌트를 나누는 방법을 사용할 수 있습니다. (구독 설정 및 데이터를 불러오는 것과 같은 로직)**
또한 이러한 로직의 추적을 쉽게 할 수 있도록 리듀서를 활용해 컴포넌트의 지역 상태 값을 관리하도록 할 수 있습니다.

lifecycle와 같은 React 개념에 좀 더 직관적인 API를 제공합니다. 또한 Hook은 이 개념들을 엮기 위해 새로운 강력한 방법을 제공합니다.

- 출처 : [React 공식 문서 : HOOK > Hook 소개](https://ko.reactjs.org/docs/hooks-intro.html)
> 

리액트 공식문서에서도 lifecycle과 hook을 별개로 취급하고 있습니다. 

<aside>
🤔 리듀서(reducer)

- 리듀서는 현재 상태와 액션을 입력으로 받아 새로운 상태를 반환하는 함수입니다.
- 리듀서는 (state, action) => newState 형태로 작성하며 복잡한 상태 로직을 한 곳에서 관리할 수 있습니다.
- 왜 이름이 리듀서(reducer) 일까요? 여러가지 정보를 받고 하나의 결과물로 반환하는 특징 때문입니다.

```jsx
function reducer(state, action) {
	// action 의 타입에 따라 분기 처리합니다.
  switch (action.type) {
    case '증가':
      return { ...state, count: state.count + 1 };
    case '감소':
      return { ...state, count: state.count - 1 };
    case '데이터추가':
      return { ...state, todos: [...state.todos, action.payload] };
    case '데이터제거':
      return { 
        ...state, 
        todos: state.todos.filter((_, index) => index !== action.payload) 
      };
    default:
      return state;
  }
```

</aside>