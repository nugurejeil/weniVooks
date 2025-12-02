# 16. Hook - useMemo

# 1. useMemo 가볍게 사용해보기

`useMemo`도 `useEffect`와 비슷한 부분이 많습니다. state가 있는 컴포넌트에 state 변화가 생기면 재평가 후 새로 랜더링을 하기 때문이죠. 어떤 부분이 다른지 왜 이 두 가지로 분리되었는지는 뒤에서 차근차근 살펴보겠습니다.

useMemo는 컴포넌트 성능 최적화에 사용됩니다. Memo는 memoization이라는 기법을 의미합니다.

메모이제이션 기법을 사용하는 대표적인 예로 재귀함수의 피보나치 순열이 있는데요. 피보나치 수열을 재귀로 호출하게 되면 똑같은 결과의 함수 호출이 반복됩니다. 그런데 반복되는 동일한 결과값을 어딘가 저장하고, 원할 때 꺼낼 수 있다면 반복할 필요가 없겠죠? 이렇게 어떤 부하가 생기는 함수를 반복해서 작업할 때 기억해두었다가 사용하는 기법을 메모이제이션이라고 합니다.

```jsx
const 저장할변수 = useMemo(()=> {
  return 계산하는_무거운함수()
}, [감시하고_있는_변수]);
```

그렇다면 실제로 부하가 발생되는 코드를 만들어 보도록 하겠습니다. 아래 컴포넌트는 랜더링이 될 때마다 부하함수를 호출하여 부하가 발생되고 있습니다. 중요한 점은 저 부하의 결과값이 항상 같다는 거죠! useMemo 는 값을 저장해둡니다. 이를 렌더링 될 때마다 계산해주는 것이 아니라 단 한번만 계산되게 하고 싶습니다. 

```jsx
import { useState } from 'react'

function payLoad(){
  let s = 0
  for (let i = 0; i < 1000000000; i++) {
    s += i
  }
  return s
}

function App() {
  const [count, setCount] = useState(0)
  let result = payLoad()

  const handleCountUp = (e) => {
    setCount(count + 1)
    console.log(count)
  }
  
  return (
    <div>
      <h1>계산 결과 : {result}</h1>
      <div>{count}</div>
      <button onClick={handleCountUp}>UP!</button>
    </div>
  );
}
export default App;
```

여기서 사용할 수 있는 것이 useMemo입니다.

```jsx
import { useState, useMemo } from 'react'

function 부하(){
  let s = 0
  for (let i = 0; i < 1000000000; i++) {
    s += i
  }
  return s
}

function App() {
  const [count, setCount] = useState(0)
  const result = useMemo(()=>{
    return 부하()
  }, []);  //만약 의존배열이 없다면 콜백함수를 무조건 실행합니다.

  const handleCountUp = (e) => {
    setCount(count + 1);
    console.log(count);
  }

  return (
    <div>
      <h1>계산 결과 : {result}</h1>
      <div>{count}</div>
      <button onClick={handleCountUp}>UP!</button>
    </div>
  );
}
export default App;
```

또는 특정 변수가 변할 때에만 복잡한 연산을 수행하도록 지정할 수 있습니다. 이것은 특정 변수로 인하여 복잡한 연산에 변화가 있을것으로 판단될 경우 사용할 수 있습니다.

```jsx
import React, { useState, useMemo } from 'react';

~~~~function 부하(){
  let s = 0
  for (let i = 0; i < 1000000000; i++) {
    s += i
  }
  return s
}

function App() {
  const [count, setCount] = useState(0)
  const [countTwo, setCountTwo] = useState(0)

  const handleCountUp = (e) => {
    setCount(count + 1)
    console.log(count)
  }
  const handleCountUpTwo = (e) => {
    setCountTwo(countTwo + 1)
    console.log(countTwo)
  }

  console.log('랜더링!!')

  const result = useMemo(()=>{
    return 부하()
  }, [countTwo])

  return (
    <div className="App">
      <h1>계산 결과 : {result}</h1>
      <div>{count}</div>
      <button onClick={handleCountUp}>up!</button>
      <div>{countTwo}</div>
      <button onClick={handleCountUpTwo}>up!</button>
    </div>
  );
}

export default App;
```

그렇지만 모든 결과를 다 저장하면 메모리 낭비가 되기 때문에 꼭 필요한 곳에만 사용하시길 바랍니다.

# 2. useMemo 실전 예제

아래 코드를 살펴봅시다. 현재 값이 변하는 곳은 총 3군데입니다.

1. 이름을 입력할 때 → `setName`
2. 아이디를 입력할 때 → `setId`
3. 버튼을 눌렀을 때 → `setUserInfo` + `getNum`

리액트는 상태값이 바뀔 때마다 컴포넌트를 새로 렌더링하기 때문에 3가지 경우 모두 렌더링됩니다. 렌더링이 되는 곳마다 `console.log()`를 실행해 볼까요? 

<aside>
💡 코드의 복잡도가 올라갔기 때문에 조금 길더라도 직접 타이핑을 해보는 것을 권해드립니다.

</aside>

```jsx
import React, { useState } from 'react'

export default function App() {
    const [userInfo, setUserInfo] = useState([]);
    const [name, setName] = useState('');
    const [id, setId] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        const newInfo = [...userInfo, { name, id }];
        setUserInfo(newInfo);
        console.log('렌더링 - 3');
    }
    const handleInput1 = (event) => {
        console.log('렌더링 - 1');
        setName(event.target.value);
    }

    const handleInput2 = (event) => {
        console.log('렌더링 - 2');
        setId(event.target.value);
    }

    // 모든 렌더링에 함께 렌더링되는 이슈가 있습니다.
    function getNum(li) {
        console.log('렌더링!');
        return li.length;
    }

    
    return (
        <>
            <form onSubmit={handleSubmit}>
                <input
                    type='text'
                    placeholder='이름을 입력하세요'
                    onChange={handleInput1}
                    value={name}
                />
                <input
                    type='text'
                    placeholder='아이디를 입력하세요'
                    onChange={handleInput2}
                    value={id}
                />
                <button type='submit'>회원 명부 작성</button>
            </form>
            <ul>
                {
                    userInfo.map((value, index) => (
                        <li key={index}>
                            <h3>이름 : {value.name}</h3>
                            <strong>아이디 : {value.id}</strong>
                        </li>
                    ))
                }
            </ul>
            <span>현재 회원 수 : {getNum(userInfo)}</span>
        </>
    )
}
```

처음 컴포넌트가 실행됐을 때 전체 렌더링이 일어난 후에, 이름을 입력하는 input창에 3번 입력을 했을 때 렌더링-1, 렌더링이 출력되었습니다.

![Untitled](Untitled%2037.png)

![Untitled](Untitled%2038.png)

다시 새로고침하고 확인해 봅시다. 처음 컴포넌트가 실행됐을 때 전체 렌더링이 일어난 후에, 아이디를 입력하는 input창에 3번 입력을 했을 때 렌더링-2, 렌더링이 출력되었습니다.

![Untitled](Untitled%2039.png)

![Untitled](Untitled%2040.png)

입력할 때는 입력 렌더링이, 버튼을 누를 때는 버튼 렌더링과 getNum 렌더링이, 아이디를 입력할 때는 아이디 렌더링이 출력되어야 합니다.

하지만 실행해보면 다르게 출력되는 것을 확인할 수 있습니다! 아이디를 입력하는데도, getNum에 있는 렌더링이 함께 출력되고 있습니다.

현재 바뀌는 부분은 input 창입니다. 그렇다면 React는 바뀌는 부분만 렌더링을 해야하는데 코드 전체도 렌더링되고 있습니다.

<aside>
💡 리액트에서는 가상 돔이라는것을 사용합니다. 이것은 기존 돔과는 다르게 가벼운 정보만 가지고 있어서 빠르게 비교가 가능합니다. 챕터 1에서 언급한 바 있습니다.

비교에 필요없는 부분들은 빼버린 가상 돔을 이용해 실제 비교에 필요한 부분들만 비교합니다.
`최초 렌더링` → `이전 렌더링부분의 가상 돔 저장` → `상태 업데이트` → `상태 업데이트로 인한 가상 돔 렌더링` → `업데이트로 인해 렌더링된 가상 돔과 이전에 만들어진 가상 돔을 비교` → `바뀐 부분 브라우저에 렌더링`
위와 같은 과정으로 이루어집니다.

아래에서 `getNum`이 실행되는 이유 아래와 같은 과정으로 실행되기 때문입니다.

1. `return`에서 결과를 내보낸다. 브라우저에 렌더링 전에 가상 돔으로 렌더링(생성) << 이때 `getNum`이 실행됨.
2. 이전에 렌더링했던 가상 돔과 업데이트 될 예정인 가상 돔을 비교
3. (2)를 통해 브라우저에 새롭게 렌더링 할 부분 확인
4. 브라우저에 렌더링

</aside>

## 2.1 useMemo 사용해보기

`useMemo`를 사용해서 컴포넌트 내부 연산을 최적화해 봅시다.

최적화할 함수와 함수가 의존하게 될 값을 `useMemo`에게 전달하면 됩니다. `useMemo`는 렌더링 중에 실행되어서 의존하는 값이 변경되었는지를 체크하고, 의존성 값이 변경되었을 때에만 값을 다시 계산합니다.

<aside>
💡 메모이제이션(memoization) : 이전의 값을 기억합니다.

</aside>

우리는 input에 값을 입력할 때 `userInfo`는 아직 바뀌지 않기 때문에 `userInfo`의 값을 기억해줄게요. `useMemo`를 사용할 때는 `useMemo` 함수의 콜백 함수로 기억할 함수를 넣어줍니다. 

두번째 인자로는 기억할 함수가 의존하는 값을 배열 형태로 넣어주면 됩니다. 이렇게 되면 `useInfo` 값에 의존하는 `getNum()`함수가 `useInfo`의 값이 바뀔 때만 실행됩니다.

```jsx
  const n = useMemo(() => getNum(userInfo), [userInfo]);
```

다시 값을 입력해 보세요.

![Untitled](Untitled%2041.png)

![Untitled](Untitled%2042.png)

```jsx
import React, { useState, useMemo } from 'react'

export default function App() {
    const [userInfo, setUserInfo] = useState([]);
    const [name, setName] = useState('');
    const [id, setId] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        const newInfo = [...userInfo, { name, id }];
        setUserInfo(newInfo);
        console.log('렌더링 - 3');
    }
    
    const handleInput1 = (event) => {
        console.log('렌더링 - 1');
        setName(event.target.value);
    }

    const handleInput2 = (event) => {
        console.log('렌더링 - 2');
        setId(event.target.value);
    }

    // 모든 렌더링에 함께 렌더링되는 이슈가 있습니다.
    function getNum(li) {
        console.log('렌더링!');
        return li.length;
    }

    const n = useMemo(() => getNum(userInfo), [userInfo]);

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input
                    type='text'
                    placeholder='이름을 입력하세요'
                    onChange={handleInput1}
                    value={name}
                />
                <input
                    type='text'
                    placeholder='아이디를 입력하세요'
                    onChange={handleInput2}
                    value={id}
                />
                <button type='submit'>회원 명부 작성</button>
            </form>
            <ul>
                {
                    userInfo.map((value, index) => (
                        <li key={index}>
                            <h3>이름 : {value.name}</h3>
                            <strong>아이디 : {value.id}</strong>
                        </li>
                    ))
                }
            </ul>
            <span>현재 회원 수 : {n}</span>
        </>
    )
}
```

# 4. useMemo와 useEffect의 차이

<aside>
💡 `useMemo`와 `useEffect` 모두 설정된 값의 변동에 따라 동작하는 것이라 어떤 점이 다른지 이해하기 어려울 것 같아 정리해보았습니다.

</aside>

### 4.1 useMemo

`useMemo(실행될 것, [값])`라고 할 때 `useMemo`는 렌더링 전에 실행되어 메모이제이션한 것을 반환해줍니다. 값이 바뀌었는지 확인하고 **렌더링 전**에 저장된 것을 보내주는 것이죠.

### 4.2 useEffect

반면 `useEffect`는 **렌더링 후**에 일어납니다. 렌더링 후에 **상태가 업데이트 되었을 때를 감지**하여 동작합니다.

### 4.3 차이점

`useMemo`는 렌더링에 직접적인 영향을 미칠 수 있습니다. 위의 예시처럼, 콜백함수에서 컴포넌트 등을 반환하게 했을 때, 렌더링하기 이전에 저장된 값을 확인하여 변화가 없으면 리렌더링을 하지 않도록 할 수 있기 때문이죠.

반면 `useEffect`는 렌더링한 이후에 동작되기 때문에 리렌더링을 방지하지 못합니다. 

즉, `useMemo`는 리렌더링이나 불필요한 재실행 과정을 막는 방법(최적화)에 사용하기 적합하고, `useEffect`는 상태를 이용한 관리에 사용됩니다.

또한 useEffect 는 별도의 clean-up 함수를 가지고 있습니다만 useMemo 는 없습니다.

### 4.4 요약

- 렌더링 전 : `useMemo` / 렌더링 후 : `useEffect`
- 상태 변화를 감지하여 경우에 따라 콜백함수를 호출하고 싶다면 `useEffect`
- 값을 저장하여 불필요한 동작 또는 렌더링을 막아 최적화하고 싶다면 `useMemo`

## 실습

1. 주어진 JSON 데이터를 통해 아래와 같은 UI를 랜더링해보세요.

```json
{
    "products": [
        {
            "id": 1,
            "name": "스마트폰 X",
            "price": 899000,
            "category": "전자기기",
            "rating": 4.5
        },
        {
            "id": 2,
            "name": "블루투스 이어폰",
            "price": 159000,
            "category": "전자기기",
            "rating": 4.3
        },
        {
            "id": 3,
            "name": "면 티셔츠",
            "price": 29900,
            "category": "의류",
            "rating": 4.0
        },
        {
            "id": 4,
            "name": "청바지",
            "price": 55000,
            "category": "의류",
            "rating": 4.2
        },
        {
            "id": 5,
            "name": "유기농 사과",
            "price": 12900,
            "category": "식품",
            "rating": 4.7
        },
        {
            "id": 6,
            "name": "통밀빵",
            "price": 4800,
            "category": "식품",
            "rating": 4.4
        },
        {
            "id": 7,
            "name": "자바스크립트 완벽 가이드",
            "price": 45000,
            "category": "도서",
            "rating": 4.9
        },
        {
            "id": 8,
            "name": "리액트 프로그래밍",
            "price": 38000,
            "category": "도서",
            "rating": 4.8
        }
    ]
}
```

![스크린샷 2025-05-23 오전 5.19.37.png](%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2025-05-23_%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB_5.19.37.png)

1. 카테고리와 평점순에 따른 정렬 기능을 구현해보고 useMemo 를 이용해 최적화해봅니다.