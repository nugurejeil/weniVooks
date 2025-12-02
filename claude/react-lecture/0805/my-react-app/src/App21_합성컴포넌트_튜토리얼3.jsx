function A(props){
  console.log(props);
  return (
    <>
      <div>
        {props.children}
      </div>
      <div>hello world</div>
    </>
  )
}


function App() {
  return (
    <>
      <A>
        <div>hello</div>
        <div>world</div>
      </A>
    </>
  )
}

export default App;