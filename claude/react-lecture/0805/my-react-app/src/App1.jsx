function log() {
  console.log('Hello, World!')
}

function App() {
  return (
    <>
      <h1>Hello, World!</h1>
      {/* 
        1. onclick이 아니라 onClick으로 순수한 javascript가 아님을 알수 있습니다.
        2. onClick 안에 함수를 실행시키는 것이 아니라 함수를 전달합니다. 누구에게요? onClick에게 전달하는 것이고, React가 이 함수를 실행시킵니다. 
      */}
      <button onClick={log}>클릭햇!</button>
    </>
  )
}

export default App
