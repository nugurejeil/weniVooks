function Card() {
  return <div>Card</div>
}

function App() {

  return (
    <>
      <h1>Hello, React!</h1>
      {/* 중괄호는 JavaScript 일부 문법을 쓸 수 있습니다. */}
      {[1, 2, 3, 4, 5]}
      {[<Card/>, <Card />, <Card />]}
      {[<span>1</span>, <span>2</span>, <span>3</span>]}
    </>
  )
}

export default App
