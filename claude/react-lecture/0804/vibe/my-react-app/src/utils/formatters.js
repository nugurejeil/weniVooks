// formatters.js: 데이터 포맷팅을 위한 유틸리티 함수들입니다
// 여러 컴포넌트에서 재사용할 수 있도록 분리했습니다

// 가격에 콤마를 추가하는 함수입니다
// 예: 12500 -> "12,500"
export const formatPrice = (price) => {
  // price가 숫자가 아니거나 null/undefined인 경우를 처리합니다
  if (price === null || price === undefined || isNaN(price)) {
    return '0';
  }
  
  // toLocaleString을 사용해서 한국 형식으로 포맷팅합니다
  return Number(price).toLocaleString('ko-KR');
};

// 날짜 포맷팅 함수 (나중에 사용할 수 있습니다)
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR');
};

// 긴 텍스트를 자르는 함수 (나중에 사용할 수 있습니다)
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};