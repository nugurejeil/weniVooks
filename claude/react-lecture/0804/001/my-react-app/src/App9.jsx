function PropsTest(props){
  return (
    <div>
      <div>{props.name + props.name}</div>
      <div>{props.age + props.age}</div>
      <div>
        <button onClick={props.func}>클릭해</button>
      </div>
      <img src={props.image} alt="" />
      {props.image2}
      <div>{props.obj2['key']}</div>
    </div>
  )
}

function App() {
  return (
    <PropsTest
      name="PropsTest"
      age={10}
      func={() => console.log('클릭했음')}
      image="https://picsum.photos/200/300"
      image2={<img src="https://picsum.photos/200/300" alt="Random" />}
      obj1={[1, 2, 3]}
      obj2={{ key: 'value!!' }}
      obj3={true}
    />
  );
}

export default App;