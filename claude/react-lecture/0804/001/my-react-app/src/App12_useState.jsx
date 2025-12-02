// 눌러도 증가되지 않는 미스터리!!
// 일반 변수는 변경이 되어도 리렌더링 하지 않습니다.
// 리엑트에 성능을 높이기 위한 조치입니다.
// 만약 일반 변수가 변할 때마다 모두 리렌더링을 해버리면 성능이 현저히 떨어집니다. 

function App() {
  let count = 0;
  const increment = () => {
    count += 1;
    console.log("Count:", count);
  };

  return (
    <div>
      <div>{count}</div>
      <button onClick={increment}>Increment</button>
    </div>
  );
}

export default App;