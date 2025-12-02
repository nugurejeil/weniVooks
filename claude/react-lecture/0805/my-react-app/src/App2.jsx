// 잘 사용하는 이벤트 종류
// 3번까지만 외우셔도 충분합니다.
// 나머진 필요할 때 찾아보세요.

// 1. onClick: 클릭 이벤트
// 2. onChange: 입력값 변경 이벤트
// 3. onSubmit: 폼 제출 이벤트
// ---

// 나머지 이벤트
// 4. onMouseOver: 마우스 오버 이벤트
// 5. onMouseOut: 마우스 아웃 이벤트
// 6. onFocus: 입력 필드에 포커스가 맞춰졌을 때
// 7. onInput: 입력 필드의 값이 변경될 때

function log(event) {
  console.log('Input changed:', event.target.value)
}

function App() {
  return (
    <>
      <input type="text" onChange={log} />
    </>
  )
}

export default App
