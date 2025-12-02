// 사람의 이미지 3개를 카드로 표현하는 예시
// picture: https://picsum.photos/200/200?random=1

import './App.css'

function Card(props) {
  console.log(props);
  return (
    <div>
      <img src={props.image} alt={props.name} />
      <div>{props.name}</div>
    </div>
  )
}

function App() {
  // 이 데이터를 fetch해서 가져온 데이터라고 생각해주세요.
  const humanData = [
    { name: 'Alice', image: 'https://picsum.photos/200/200?random=1' },
    { name: 'Bob', image: 'https://picsum.photos/200/200?random=2' },
    { name: 'Charlie', image: 'https://picsum.photos/200/200?random=3' }
  ];
  console.log(humanData);
  return (
    <>
      <div className='cards'>
          {humanData.map((human) => (
            <Card name={human.name} image={human.image} />
          ))}
      </div>
    </>
  )
}

export default App
