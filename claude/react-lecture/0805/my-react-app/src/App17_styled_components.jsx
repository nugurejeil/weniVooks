// styled-components
// npm install styled-components

import styled from 'styled-components';

const TitleSection = styled.h1`
  color: blue;
`;

const StyledHeader = styled.header`
  background-color: lightgray;
  padding: 10px;
`;

function App() {
  return (
    <>
      <TitleSection>안녕하세요</TitleSection>
      {/* header > nav > ul > li > a */}
      <StyledHeader>
        <nav>
          <ul>
            <li><a href="/">홈</a></li>
            <li><a href="/about">소개</a></li>
            <li><a href="/contact">연락처</a></li>
          </ul>
        </nav>
      </StyledHeader>
    </>
  )
}

export default App;