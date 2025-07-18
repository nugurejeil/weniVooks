'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

export default function MermaidDiagram({ chart, className }) {
  const mermaidRef = useRef(null);

  useEffect(() => {
    if (!chart || !mermaidRef.current) return;

    const renderMermaid = async () => {
      try {
        // Mermaid 초기화
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          themeVariables: {
            primaryColor: '#ff6b6b',
            primaryTextColor: '#fff',
            primaryBorderColor: '#ff4757',
            lineColor: '#5f5f5f',
            sectionBkgColor: '#f7f7f7',
            altSectionBkgColor: '#ffffff',
            gridColor: '#e0e0e0',
            secondaryColor: '#006100',
            tertiaryColor: '#fff'
          }
        });

        // 고유 ID 생성
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // SVG 생성
        const { svg } = await mermaid.render(id, chart);
        
        // 컨테이너에 SVG 삽입
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = svg;
        }
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = `<div style="color: #ff6b6b; padding: 1rem; border: 1px solid #ff6b6b; border-radius: 4px; background: #fff5f5;">
            <strong>Mermaid 다이어그램 렌더링 오류</strong><br/>
            차트 문법을 확인해주세요.
          </div>`;
        }
      }
    };

    renderMermaid();
  }, [chart]);

  return (
    <div 
      ref={mermaidRef} 
      className={`mermaid-diagram ${className || ''}`}
      style={{ 
        textAlign: 'center', 
        margin: '1rem 0',
        overflow: 'auto'
      }}
    />
  );
}