function A(){
  return <h1>Hello, World!</h1>;
}

function B(){
  return <h2>Welcome to my React app!</h2>;
}

function C(){
  return <h3>Enjoy exploring the features!</h3>;
}

function App() {
  return (
    <div>
      <A />
      <B />
      <C />
    </div>
  );
}

export default App;