// Header 컴포넌트: 쇼핑몰의 상단 제목을 표시하는 컴포넌트입니다
function Header() {
  return (
    // header 클래스를 가진 header 태그로 상단 영역을 만듭니다
    <header className="header">
      {/* 쇼핑몰 이름을 h1 태그로 표시합니다 */}
      <h1>VIBE SHOP</h1>
    </header>
  );
}

// 다른 파일에서 이 컴포넌트를 사용할 수 있도록 내보냅니다
export default Header;