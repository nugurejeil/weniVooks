function One(){
  return <p>one</p>
}

function Two(){
  return <p>two</p>
}

function App() {
  return (
    <>
      {true}
      {/* 이게 조건부 렌더링 입니다. */}
      {true ? <One /> : <Two />}
    </>
  );
}

export default App;