# 17. Hook - useCallback

# 1. useCallback 이란?

`useCallback`은 컴포넌트가 다시 랜더링 될 때 함수를 캐싱하여, 반복적으로 생성되지 않도록 하는 React Hook입니다.

```jsx
import { useCallback } from 'react';

const memoizedCallback = useCallback(
  () => {
    // 실행하고자 하는 로직
    someFunction(a, b);
  },
  [a, b], // 의존성 배열: a 또는 b가 변경될 때만 함수가 새로 생성됨
);
```

`useCallback`은 두 개의 인자를 받습니다:

1. **콜백 함수 (callback function)**: 메모이제이션할 함수입니다.
2. **의존 배열 (dependency array)**: 이 배열 안의 값이 변경될 때만 콜백 함수가 새로 생성됩니다. 배열 안의 값이 이전 렌더링과 동일하다면, `useCallback`은 이전에 생성했던 함수 인스턴스를 그대로 반환합니다.

<aside>
🤔

**반환값 (return)**

useCallBack 의 내부 함수에는 별도의 return 키워드는 존재하지 않지만, 전달한 함수를 반환합니다.

최초 렌더링에서는 `useCallback`은 전달한 함수를 그대로 생성하여 반환합니다.

이후 다시 렌더링 되었을 때는 의존 배열이 변하지 않았을 때 이전 렌더링에서 이미 저장해 두었던 함수를 반환합니다.

</aside>

**의존 배열의 상태별 특징**:

- **빈 배열 `[]`**: 컴포넌트가 처음 마운트될 때만 함수가 생성되고, 이후에는 항상 동일한 함수 인스턴스를 반환합니다. 이는 함수 내에서 어떠한 변화도 존재할 가능성이 없는 경우 사용합니다. (예를 들어 함수에 전달 인자가 없을 경우)
- **특정 값 `[a, b]`**: 배열 안에 명시된 `a`나 `b`의 값이 변경될 때마다 함수가 새로 생성됩니다. 함수 내부에서 사용하는 전달 인자는 의존 배열에 포함시켜야 최신 값을 참조하는 함수로 사용 할 수 있습니다.
- **배열 생략 (권장하지 않음)**: `useCallback`의 두 번째 인자를 생략하면 매 렌더링마다 함수가 새로 생성되어 `useCallback`을 사용하는 의미가 없어집니다.

**useCallback 예시**

```jsx
import React, { useState, useEffect, useCallback } from 'react';

// 자식 컴포넌트
function LoggerComponent({ title, logFunction, color = "blue" }) {
  console.log(`[${title}] LoggerComponent 리렌더링됨`);

  useEffect(() => {
    console.log(`[${title}] useEffect 실행: logFunction이 변경됨`);
    logFunction();
  }, [logFunction, title]);

  return (
    <div style={{
      border: `2px solid ${color}`,
      padding: '10px',
      margin: '10px 0',
      borderRadius: '5px',
      backgroundColor: `${color}11`
    }}>
      <h3 style={{ color: color, margin: '0 0 5px 0' }}>{title}</h3>
      <p style={{ margin: 0, fontSize: '14px' }}>
        이 컴포넌트는 logFunction이 변경될 때만 리렌더링되어야 합니다.
      </p>
    </div>
  );
}

// 부모 컴포넌트
function App() {
  const [text, setText] = useState("안녕하세요");
  const [unrelatedState, setUnrelatedState] = useState(0);

  // useCallback 미사용 - 매번 새로운 함수 생성
  const logWithoutCallback = () => {
    console.log(`[useCallback 미사용] 현재 텍스트: "${text}"`);
  };

  // useCallback 사용 - text가 변경될 때만 새로운 함수 생성
  const logWithCallback = useCallback(() => {
    console.log(`[useCallback 사용] 현재 텍스트: "${text}"`);
  }, [text]); // text가 변경될 때만 함수 재생성

  console.log(' App 컴포넌트 리렌더링됨');

  return (
    <div style={{ padding: '20px' }}>

      <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>

        <div style={{ marginBottom: '10px' }}>
          <label>텍스트: </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </div>

        <div>
          <label>관련없는 상태: {unrelatedState} </label>
          <button onClick={() => setUnrelatedState(s => s + 1)} style={{ marginLeft: '10px' }}>
            무관한 상태 변경
          </button>
        </div>
      </div>

      <div>
        <h2>useCallback 비교</h2>
        <LoggerComponent
          title="useCallback 미사용"
          logFunction={logWithoutCallback}
          color="red"
        />
        <LoggerComponent
          title="useCallback 사용"
          logFunction={logWithCallback}
          color="green"
        />
      </div>
    </div>
  );
}

export default App;
```

# 2. useMemo와 useCallback의 차이

### 1. 기본 비교

| 구분 | useMemo | useCallback |
| --- | --- | --- |
| **목적** | 계산된 값을 메모이제이션 | 함수 자체를 메모이제이션 |
| **반환값** | 계산 결과 (값) | 함수 |
| **사용 시기** | 비용이 큰 계산 최적화 | 함수 재생성 방지 |
| **메모이제이션 대상** | 함수의 실행 결과 | 함수 자체 |

### 2. 반환값의 차이

| useMemo | useCallback |
| --- | --- |
| `useMemo(() => a + b, [a, b])` → **숫자** | `useCallback(() => a + b, [a, b])` → **함수** |
| `useMemo(() => [1, 2, 3], [])` → **배열** | `useCallback(() => [1, 2, 3], [])` → **함수** |
| `useMemo(() => ({ x: 1 }), [])` → **객체** | `useCallback((x) => ({ x }), [])` → **함수** |

### 3. 언제 사용하지 말아야 할까?

- ❌ 의존성이 자주 변경되는 함수
- ❌ 계산 비용이 낮은 단순한 함수인 경우

### 4. 요약

> useMemo: "이 계산 결과를 기억해둬!"
> 
> 
> **useCallback**: "이 함수를 기억해둬!"
> 
- **useMemo**는 값을, **useCallback**은 함수를 메모이제이션
- 둘 다 불필요한 재계산/재생성을 방지하여 성능 최적화
- "모든 함수에 `useCallback`을 써야지"라는 생각은 지양해야 합니다. 오히려 약간의 성능 저하나 코드 복잡성 증가를 초래할 수 있습니다.

## 실습

아래 코드를 실행해보세요. 비 정상적인 로그가 찍히고 있습니다. 

1. 코드를 분석하고 실행해보세요
2. 비 정상적인 로그의 원인이 무엇인지 파악하세요
3. useCallback 을 이용해 아래 코드의 문제를 해결해 보세요

```jsx
import React, { useState, useCallback, useEffect } from 'react';

export default function SimpleApp() {
    const [count, setCount] = useState(0);
    const [name, setName] = useState('');
    const [logs, setLogs] = useState([]);

    console.log('SimpleApp 렌더링됨');

    // TODO: useCallback을 사용해서 아래 함수들을 최적화하세요

    // 카운트 증가 함수
    const increment = () => {
        setCount(count + 1);
    };

    // 카운트 감소 함수  
    const decrement = () => {
        setCount(count - 1);
    };

    // 로그 추가 함수
    const addLog = (message) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, `${timestamp}: ${message}`]);
    };

    // useEffect에서 함수들을 의존성으로 사용
    useEffect(() => {
        console.log('increment 함수가 변경됨 - useEffect 실행');
        addLog('increment 함수 변경됨');
    }, [increment, addLog]);

    useEffect(() => {
        console.log('decrement 함수가 변경됨 - useEffect 실행');
        addLog('decrement 함수 변경됨');
    }, [decrement, addLog]);

    return (
        <div style={{ padding: '20px' }}>
            <h1>useCallback 실습 (useEffect 버전)</h1>

            <div style={{ marginBottom: '20px' }}>
                <h2>카운트: {count}</h2>
                <button onClick={increment} style={{ margin: '5px', padding: '10px' }}>
                    증가
                </button>
                <button onClick={decrement} style={{ margin: '5px', padding: '10px' }}>
                    감소
                </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h2>이름: {name}</h2>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="이름을 입력하세요"
                    style={{ padding: '8px', fontSize: '16px' }}
                />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h3>로그 (최근 5개)</h3>
                <div style={{
                    border: '1px solid #ccc',
                    padding: '10px',
                    height: '100px',
                    overflowY: 'auto',
                    backgroundColor: '#f9f9f9'
                }}>
                    {logs.slice(-5).map((log, index) => (
                        <div key={index} style={{ fontSize: '12px', marginBottom: '2px' }}>
                            {log}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
```