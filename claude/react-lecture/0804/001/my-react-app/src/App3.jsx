function Card(props) {
  console.log(props);
  return <div>Card {props.number}</div>;
}

function App() {

  const cards = [1, 2, 3] // 예시로 카드 3개를 생성

  return (
    <>
      {cards.map((card) => <Card key={card} number={card} />)}
    </>
  )
}

export default App
