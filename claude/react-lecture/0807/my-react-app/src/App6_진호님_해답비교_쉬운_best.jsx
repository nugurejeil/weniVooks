import { useState } from "react";

export default function SimpleApp() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");
  const [logs, setLogs] = useState([]);

  console.log("SimpleApp 렌더링됨");

  // TODO: useCallback을 사용해서 아래 함수들을 최적화하세요

  // 카운트 증가 함수
  const increment = () => {
    setCount(count + 1);
    addLog("increment 함수 변경됨");
  };

  // 카운트 감소 함수
  const decrement = () => {
    setCount(count - 1);
    addLog("decrement 함수 변경됨");
  };

  // 로그 추가 함수
  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `${timestamp}: ${message}`]);
  };

  return (
    <div>
      <h1>useCallback 실습 (useEffect 버전)</h1>

      <div>
        <h2>카운트: {count}</h2>
        <button onClick={increment}>증가</button>
        <button onClick={decrement}>감소</button>
      </div>

      <div>
        <h2>이름: {name}</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름을 입력하세요"
        />
      </div>

      <div>
        <h3>로그 (최근 5개)</h3>
        <div>
          {logs.slice(-5).map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
}