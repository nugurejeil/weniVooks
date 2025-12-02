import './App.css'

function App() {
  // class 키워드는 이미 javaScript에서 사용되고 있어요.
  // 따라서 className을 사용해야 해요.
  return (
    <>
      <p className="hello">hello world</p>
      <p>hello world</p>
      <p id="helloworld">hello world</p>
      <div style={{backgroundColor:"black", color:"white"}}>hello world</div>
    </>
  )
}

export default App
