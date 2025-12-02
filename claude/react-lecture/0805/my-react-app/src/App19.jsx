// 합성 컴포넌트 예시

function Card ({ children }) {
  console.log('--- Card ---')
  console.log(children);
  console.log('--- //Card ---')
  return (
    <div className="card">
      {children}
    </div>
  );

}

function CardTitle({ children }) {
  console.log('--- CardTitle ---')
  console.log(children);
  console.log('--- //CardTitle ---')
  return (
    <h2 className="card-title">
      {children}
    </h2>
  );

}

function CardContent({ children }) {
  console.log('--- CardContent ---')
  console.log(children);
  console.log('--- //CardContent ---')
  return (
    <div className="card-content">
      {children}
    </div>
  );
}

// 합성 컴포넌트 만들기
Card.Title = CardTitle;
Card.Content = CardContent;

function App() {
  return (
    <>
      <Card>
        <Card.Title>제목</Card.Title>
        <Card.Content>내용</Card.Content>
      </Card>
    </>
  )
}

export default App;