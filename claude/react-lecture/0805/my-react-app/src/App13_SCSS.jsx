// 2. scss 파일을 import 합니다.
// 모듈이 설치가 안되어 있으면 읽어오지 못합니다.
// npm install -D sass-embedded
// 1번과 2번의 문제점: CSS를 전역으로 적용해서 컴포넌트 단위로 스타일을 관리하기 어렵습니다.
import './Test.scss'
import SectionTest from './SectionTest.jsx'

function App() {
  return (
    <>
      <section>
        <h2>안녕하세요</h2>
      </section>
      <SectionTest />
    </>
  )
}

export default App;