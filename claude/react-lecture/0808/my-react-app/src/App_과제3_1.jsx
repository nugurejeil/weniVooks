// ## 문제 2: 사용자 로그인 상태 관리

// ### 문제
// 간단한 로그인/로그아웃 기능을 구현해보세요.
// 실무에서는 이런식으로 데이터가 들어오지 않습니다.
// {username: 'user1', userimage: 'image_url', accessToken: '1234', refreshToken: 'abcd'}

// ```jsx
// const users = [
//     { id: 1, username: "user1", password: "1234", name: "김철수" },
//     { id: 2, username: "user2", password: "5678", name: "이영희" },
//     { id: 3, username: "admin", password: "admin", name: "관리자" }
// ];
// ```

// 요구사항
// - 사용자 정보와 로그인 상태는 context로 관리
// - 로그인 폼에서 username과 password 입력
// - 로그인 성공 시 환영 메시지와 로그아웃 버튼 표시
// - 로그인 실패 시 "아이디 또는 비밀번호가 틀렸습니다" 표시
// - 구조는 Header, Main, Footer 컴포넌트로 나누고, Header에만 로그인 상태 표시
// - Header는 header > nav > ul > li 구조로 작성

function Header() {
  return (
    <header>헤더</header>
  )
}

function Main() {
  return (
    <main>메인</main>
  )
}

function Footer() {
  return (
    <footer>푸터</footer>
  )
}

function App() {
  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  )
}

export default App