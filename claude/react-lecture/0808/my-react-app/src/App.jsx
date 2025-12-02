import { useContext, useState, createContext } from 'react';

const AuthContext = createContext();

const users = [
    { id: 1, username: "user1", password: "1234", name: "김철수" },
    { id: 2, username: "user2", password: "5678", name: "이영희" },
    { id: 3, username: "admin", password: "admin", name: "관리자" }
];

// useContext를 사용하기 위해서 provider를 사용하여 상태를 관리합니다.
// 그런데 이 provider를 어느 컴포넌트에 넣어주는 것이 좋은지 고민해볼 필요가 있습니다.
// 가장 좋은 것은 랜더링이 자주 일어나지 않도록 데이터를 사용하는 가장 작은 부모 컴포넌트에 넣어주는 것이 좋습니다.

function Login() {
  const { currentUser, setCurrentUser } = useContext(AuthContext);

  return (
    <div>
      {currentUser ? (
        <>
          <p>{currentUser.name}님 환영합니다!</p>
          <button onClick={() => setCurrentUser(null)}>로그아웃</button>
        </>
      ) : (
        <p>로그인 해주세요.</p>
      )}
    </div>
  )
}

function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li>About</li>
          <li>Contact</li>
          <li><Login /></li>
          </ul>
      </nav>
    </header>
  )
}

function Main() {
  const { setCurrentUser, message, setMessage } = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function login(username, password) {
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
      setCurrentUser(user);
      setMessage(`환영합니다, ${user.name}님!`);
    } else {
      setMessage("아이디 또는 비밀번호가 틀렸습니다");
    }
  }

  return (
    <main>
      <p>아이디</p>
      <input type="text" onChange={e => setUsername(e.target.value)} />
      <p>비밀번호</p>
      <input type="text" onChange={e => setPassword(e.target.value)} />
      <button onClick={() => login(username, password)}>로그인</button>
      <p>{message}</p>
    </main>
  )
}

function Footer() {
  return (
    <footer>푸터</footer>
  )
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [message, setMessage] = useState('');

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, message, setMessage }}>
      <Header />
      <Main />
      <Footer />
    </AuthContext.Provider>
  )
}


export default App