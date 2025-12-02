function App() {

  console.log(document.getElementById('title'));
  document.getElementById('title').innerHTML = "Hello, hojun!";

  return (
    <div>
      <h1 id="title">Hello, React!</h1>
    </div>
  );
}

export default App;