// 해시 기반 스크롤 기능 비활성화
// 새로고침 시 해시로 이동하는 문제를 방지하기 위해
// 페이지 로드 시 해시 스크롤 및 해시 변경 이벤트 리스너 제거

export function useHashScroll() {
  // 프로그래밍 방식으로 특정 요소로 스크롤하는 함수 (해시 없이)
  const scrollToElement = (elementId) => {
    // 디코딩된 ID로 먼저 시도
    let targetElement = document.getElementById(decodeURIComponent(elementId));

    // 찾지 못했다면 원본 ID로 시도
    if (!targetElement) {
      targetElement = document.getElementById(elementId);
    }

    if (targetElement) {
      const yOffset = -80; // 네비게이션바 높이 + 여백
      const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return { scrollToElement };
}