// 아니? 이렇게 만들면 되지,
// 왜 이렇게 복잡하게 합성 컴포넌트를 만든거에요? 이게 우리가 배운거잖아요? 이렇게 하면 이해하기 훨씬 쉬운데요?

function A(props){
  return (
    <>
      <B />
      <C />
    </>
  )
}

function B(props){
  return <div>hello</div>
}

function C(props){
  return <div>world</div>
}

function App() {
  return (
    <>
      <A />
    </>
  )
}

export default App;