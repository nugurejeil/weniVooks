// Error 컴포넌트: 에러가 발생했을 때 표시되는 에러 화면입니다
// props로 에러 메시지와 재시도 함수를 받을 수 있습니다
function Error({ message, onRetry }) {
  return (
    // 에러 컨테이너입니다
    <div className="error-container">
      {/* 에러 아이콘입니다 */}
      <div className="error-icon">
        {/* 간단한 X 표시를 SVG로 만듭니다 */}
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#ff6b6b" strokeWidth="2"/>
          <path d="M15 9L9 15M9 9L15 15" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      
      {/* 에러 제목입니다 */}
      <h2>오류가 발생했습니다</h2>
      
      {/* 에러 메시지입니다. props로 받은 메시지를 표시합니다 */}
      <p>{message || '상품을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.'}</p>
      
      {/* 재시도 버튼입니다. onRetry 함수가 전달되면 표시합니다 */}
      {onRetry && (
        <button className="retry-button" onClick={onRetry}>
          다시 시도
        </button>
      )}
    </div>
  );
}

// 다른 파일에서 이 컴포넌트를 사용할 수 있도록 내보냅니다
export default Error;