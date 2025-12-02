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

function App() {
  return (
    <>
      <Card>
        <CardTitle>제목</CardTitle>
        <CardContent>내용</CardContent>
      </Card>
    </>
  )
}

export default App;