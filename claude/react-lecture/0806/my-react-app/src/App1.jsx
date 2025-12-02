function App() {
  return (
    <>
      <h1>Hello, React!</h1>
      {/* 이것은 동작하지 않고 */}
      {/* 
        # 이 a 태그가 왜 동작하지 않을까요?
        
        * React는 기본적으로 SPA(Single Page Application)로 동작합니다.
        * 이 a 태그는 페이지를 새로고침합니다. 그래서 React의 SPA 특성과 충돌합니다.
        * SPA 특성과 충돌하지 않게 하려면 JavaScript에서 마치 preventDefault()를 호출한 것처럼 동작해야 합니다. 그래서 별도의 라우팅 라이브러리를 사용해야 합니다.
      */}
      <a href="/about">눌러</a>
      {/* 이것은 이동합니다 */}
      <a href="https://weniv.co.kr">Weniv</a>
    </>
  )
}

export default App
