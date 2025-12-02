// Loading 컴포넌트: 데이터를 불러오는 중일 때 표시되는 로딩 화면입니다
function Loading() {
  return (
    // 로딩 컨테이너입니다
    <div className="loading-container">
      {/* 로딩 스피너입니다 */}
      <div className="loading-spinner">
        {/* CSS로 회전 애니메이션을 만들 수 있습니다 */}
        <div className="spinner"></div>
      </div>
      {/* 로딩 메시지입니다 */}
      <h2>상품을 불러오는 중입니다...</h2>
      <p>잠시만 기다려주세요</p>
    </div>
  );
}

// 다른 파일에서 이 컴포넌트를 사용할 수 있도록 내보냅니다
export default Loading;