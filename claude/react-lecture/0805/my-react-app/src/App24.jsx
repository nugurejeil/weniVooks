// 아래와 같은 형태를 생각해봅시다. 우리가 프로젝트가 조금만 더 커지면 아래처럼 깊이가 깊어지는 컴포넌트 구조를 갖게 될 것입니다.

function A(props){
  return (
    <>
      <B />
    </>
  )
}

function B(props){
  return (
    <>
      <C />
    </>
  )
}

function C(props){
  return (
    <>
      <D />
    </>
  )
}

function D(props){
  return <div>hello world</div>
}

function App() {
  return (
    <>
      <A>
        <B>
          <C>
            <D />
          </C>
        </B>
      </A>
    </>
  )
}

export default App;