import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

// URL 쿼리 파라미터를 사용하여 북마크 이동 시 스크롤 처리
// 스크롤 후 URL에서 파라미터 제거하여 새로고침 시 다시 스크롤하지 않음

const SCROLL_PARAM_KEY = 'scrollTo';

// 스크롤 대상이 포함된 URL 생성 (훅 외부에서 사용 가능)
export const createScrollUrl = (basePath, elementId) => {
  return `${basePath}?${SCROLL_PARAM_KEY}=${encodeURIComponent(elementId)}`;
};

export function useHashScroll() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // URL 쿼리 파라미터에서 스크롤 대상 확인
    const scrollTarget = searchParams.get(SCROLL_PARAM_KEY);
    if (scrollTarget) {
      // DOM이 완전히 로드된 후 스크롤
      setTimeout(() => {
        const decodedTarget = decodeURIComponent(scrollTarget);
        let targetElement = document.getElementById(decodedTarget);

        // 찾지 못했다면 원본 ID로 시도
        if (!targetElement) {
          targetElement = document.getElementById(scrollTarget);
        }

        if (targetElement) {
          const yOffset = -80; // 네비게이션바 높이 + 여백
          const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });

          // 스크롤 후 URL에서 쿼리 파라미터 제거 (새로고침 시 다시 스크롤하지 않도록)
          const url = new URL(window.location.href);
          url.searchParams.delete(SCROLL_PARAM_KEY);
          window.history.replaceState({}, '', url.pathname);
        }
      }, 300);
    }
  }, [searchParams]);

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