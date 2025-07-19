import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useHashScroll() {
  const router = useRouter();

  useEffect(() => {
    // 페이지 로드 시 해시가 있으면 해당 위치로 스크롤
    const handleInitialScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        // URL에서 해시 추출 (# 제거)
        const elementId = hash.substring(1);
        
        // 디코딩된 ID로 먼저 시도
        let targetElement = document.getElementById(decodeURIComponent(elementId));
        
        // 찾지 못했다면 원본 ID로 시도
        if (!targetElement) {
          targetElement = document.getElementById(elementId);
        }
        
        if (targetElement) {
          // 약간의 딜레이를 주어 페이지가 완전히 렌더링된 후 스크롤
          setTimeout(() => {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }, 100);
        }
      }
    };

    // 페이지가 완전히 로드된 후 실행
    if (document.readyState === 'complete') {
      handleInitialScroll();
    } else {
      window.addEventListener('load', handleInitialScroll);
    }

    // 해시 변경 시 스크롤 처리
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const elementId = hash.substring(1);
        
        // 디코딩된 ID로 먼저 시도
        let targetElement = document.getElementById(decodeURIComponent(elementId));
        
        // 찾지 못했다면 원본 ID로 시도
        if (!targetElement) {
          targetElement = document.getElementById(elementId);
        }
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    };

    // 해시 변경 이벤트 리스너 추가
    window.addEventListener('hashchange', handleHashChange);

    // 클린업
    return () => {
      window.removeEventListener('load', handleInitialScroll);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // 프로그래밍 방식으로 해시 스크롤 실행하는 함수
  const scrollToHash = (hash) => {
    const elementId = hash.startsWith('#') ? hash.substring(1) : hash;
    
    // 디코딩된 ID로 먼저 시도
    let targetElement = document.getElementById(decodeURIComponent(elementId));
    
    // 찾지 못했다면 원본 ID로 시도
    if (!targetElement) {
      targetElement = document.getElementById(elementId);
    }
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // URL 해시도 업데이트
      if (window.location.hash !== `#${elementId}`) {
        window.history.replaceState(null, null, `#${elementId}`);
      }
    }
  };

  return { scrollToHash };
}