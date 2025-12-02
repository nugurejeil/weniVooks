import { useMemo, useState } from "react"

function 부하() {
  console.log("부하 함수가 실행되었습니다.")
  return "부하 완료"
}

function App() {
  const [one, setOne] = useState(0)
  const [two, setTwo] = useState(0)

  // const result = useMemo(() => 부하(), [two])
  const result = useMemo(() => 부하(), [])

  return (
    <>
      <h1>Hello World</h1>
      <p>One: {one}</p>
      <p>Two: {two}</p>
      <p>result: {result}</p>
      <button onClick={() => setOne(one + 1)}>Increase One</button>
      <button onClick={() => setTwo(two + 1)}>Increase Two</button>
    </>
  )
}

export default App
