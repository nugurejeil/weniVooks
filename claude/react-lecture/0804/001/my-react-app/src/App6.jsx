// App > A > B > C > loginComponent가 있다고 했을 때!
// 컴포넌트끼리는 간섭을 안합니다!
// 그렇기 때문에 아래와 같은 props drilling이 발생합니다.
// 이것을 해결할 수 있는 방법은 여러가지가 있으니 뒤에 수업에서 진행을 할겁니다.
// 리엑트 초창기에는 이것을 원활하게 해결할 수 있는 방법이 없었습니다.
function A({ login }) {
  return (
    <B login={login} />
  )
}

function B({ login }) {
  return (
    <C login={login} />
  )
}

function C({ login }) {
  return (
    <LoginComponent login={login} />
  )
}

function LoginComponent({ login }) {
  console.log(login);
  return (
    <div>{login ? "Logged out" : "Logged in"}</div>
  );
}

function App() {
  const login  = false;
  return (
    <A login={login} />
  )
}

export default App
