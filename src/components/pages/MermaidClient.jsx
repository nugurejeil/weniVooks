'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

export default function MermaidClient({ htmlContent }) {
  const containerRef = useRef(null);
  const [mermaidReady, setMermaidReady] = useState(false);
  const [contentReady, setContentReady] = useState(false);

  // 머메이드 초기화 함수
  const initializeMermaid = () => {
    if (window.mermaid) {
      window.mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        themeVariables: {
          primaryColor: '#ff6b6b',
          primaryTextColor: '#333',
          primaryBorderColor: '#ff4757',
          lineColor: '#5f5f5f',
          sectionBkgColor: '#f7f7f7',
          altSectionBkgColor: '#ffffff',
          gridColor: '#e0e0e0',
          secondaryColor: '#006100',
          tertiaryColor: '#fff'
        }
      });
      setMermaidReady(true);
    }
  };

  // 컨텐츠 로드 및 머메이드 상태 확인
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = htmlContent;
      setContentReady(true);
    }

    // 이미 머메이드가 로드되어 있는지 확인
    if (typeof window !== 'undefined' && window.mermaid) {
      initializeMermaid();
    }
  }, [htmlContent]);

  // 머메이드와 컨텐츠가 모두 준비되면 렌더링
  useEffect(() => {
    if (mermaidReady && contentReady) {
      // 안전한 렌더링을 위한 지연
      const timer = setTimeout(() => {
        renderMermaidDiagrams();
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [mermaidReady, contentReady]);

  const renderMermaidDiagrams = () => {
    if (!containerRef.current || !window.mermaid) return;
    
    const elements = containerRef.current.querySelectorAll('.mermaid-wrapper');
    
    elements.forEach(async (element, index) => {
      const mermaidCode = element.getAttribute('data-mermaid');
      if (mermaidCode) {
        try {
          // 이미 렌더링된 경우 건너뛰기
          if (element.querySelector('svg')) return;
          
          const id = `mermaid-diagram-${Date.now()}-${index}`;
          const { svg } = await window.mermaid.render(id, mermaidCode);
          element.innerHTML = svg;
          element.style.textAlign = 'center';
          element.style.margin = '1rem 0';
        } catch (error) {
          console.error('Mermaid rendering error:', error);
          element.innerHTML = `<div style="color: #ff6b6b; padding: 1rem; border: 1px solid #ff6b6b; border-radius: 4px; background: #fff5f5;">
            <strong>Mermaid 다이어그램 렌더링 오류</strong><br/>
            차트 문법을 확인해주세요.
          </div>`;
        }
      }
    });
  };

  return (
    <>
      <div ref={containerRef} />
      
      <Script 
        src="https://cdn.jsdelivr.net/npm/mermaid@11.9.0/dist/mermaid.min.js"
        strategy="beforeInteractive"
        onLoad={() => {
          initializeMermaid();
        }}
        onError={(error) => {
          console.error('Mermaid script loading failed:', error);
        }}
      />
    </>
  );
}