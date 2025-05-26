'use client';

import React from 'react';
import Tooltip from '../common/tooltip/Tooltip';

const convertCustomMarkdown = (customMarkdown) => {
  let convertedMarkdown = customMarkdown;

  // 배경 박스 -> 인용문으로 변환
  convertedMarkdown = convertedMarkdown.replace(
    /:::div\{\.box\}([\s\S]*?):::/g,
    (match, content) => {
      return '\n> ' + content.trim().split('\n').join('\n> ') + '\n';
    },
  );

  // 콜아웃 -> 인용문으로 변환
  convertedMarkdown = convertedMarkdown.replace(
    /:::div\{\.callout\}([\s\S]*?):::/g,
    (match, content) => {
      return '\n> 💡  ' + content.trim().split('\n').join('\n> ') + '\n';
    },
  );

  // Before-After (2단 테이블) 변환 - 일반 테이블로 변경
  convertedMarkdown = convertedMarkdown.replace(
    /:::div\{\.beforeAfter\}([\s\S]*?):::/g,
    (match, content) => {
      return content.trim();
    },
  );

  // 링크 변환
  convertedMarkdown = convertedMarkdown.replace(
    /::a\[(.*?)\]\{.*?href="(.*?)".*?\}/g,
    (match, text, url) => {
      // URL에서 <와 > 기호 제거
      const cleanUrl = url.replace(/[<>]/g, '');
      return `[${text}](${cleanUrl})`;
    },
  );

  // 실행코드 변환
  convertedMarkdown = convertedMarkdown.replace(
    /```python-exec([\s\S]*?)```/g,
    (match, content) => {
      return '```python' + content + '```';
    },
  );

  convertedMarkdown = convertedMarkdown.replace(
    /```javascript-exec([\s\S]*?)```/g,
    (match, content) => {
      return '```javascript' + content + '```';
    },
  );

  // HTML/CSS
  convertedMarkdown = convertedMarkdown.replace(
    /:::div\{\.htmlPlay\}([\s\S]*?):::/g,
    (match, content) => {
      // 코드 블록 내용에서 각 줄의 시작 부분 공백 제거
      const trimmedContent = content
        .split('\n')
        .map((line) => line.trimStart())
        .join('\n')
        .trim();

      return trimmedContent;
    },
  );

  // 이미지 변환
  convertedMarkdown = convertedMarkdown.replace(
    /:::figure\s*::img\{.*?src="(.*?)".*?\}\s*::figcaption\[(.*?)\]\s*:::/g,
    (match, src, caption) => {
      // 이미지 경로가 /images로 시작하는 경우에만 도메인 추가
      const fullSrc = src.startsWith('/images')
        ? `https://books.weniv.co.kr${src}`
        : src;
      return `![${caption}](${fullSrc})`;
    },
  );

  // ::img 태그 변환 (사이즈 설정)
  convertedMarkdown = convertedMarkdown.replace(
    /::img\{[^}]*?src="([^"]*?)"[^}]*?\}/g,
    (match, src) => {
      // 이미지 경로가 /images로 시작하는 경우에만 도메인 추가
      const fullSrc = src.startsWith('/images')
        ? `https://books.weniv.co.kr${src}`
        : src;
      return `![](${fullSrc})`;
    },
  );

  // 이미지 캡션 삽입
  convertedMarkdown = convertedMarkdown.replace(
    /!\[\]\((.*?) '(.*?)'\)/g,
    (match, src, caption) => {
      // 이미지 경로가 /images로 시작하는 경우에만 도메인 추가
      const fullSrc = src.startsWith('/images')
        ? `https://books.weniv.co.kr${src}`
        : src;
      return `![${caption}](${fullSrc})`;
    },
  );

  // 테이블 내 이미지 경로 변환
  convertedMarkdown = convertedMarkdown.replace(
    /!\[\]\((\/images\/.*?)\)/g,
    (match, src) => {
      return `![](https://books.weniv.co.kr${src})`;
    },
  );

  // 기타 이미지들도 처리
  convertedMarkdown = convertedMarkdown.replace(
    /!\[(.*?)\]\((\/images\/.*?)\)/g,
    (match, alt, src) => {
      return `![${alt}](https://books.weniv.co.kr${src})`;
    },
  );

  // 개행 처리
  convertedMarkdown = convertedMarkdown.replace(/<br>/g, '\n\n');

  // 텍스트 색상 -> 강조로 변환
  convertedMarkdown = convertedMarkdown.replace(
    /<color=#[0-9A-Fa-f]{6}>(.*?)<\/color>/g,
    (match, text) => {
      return `**${text}**`;
    },
  );

  // 토글 -> 인용문으로 변환
  convertedMarkdown = convertedMarkdown.replace(
    /<toggle>(.*?)::([\s\S]*?)<\/toggle>/g,
    (match, title, content) => {
      return `\n> **${title.trim()}**  \n>\n> ${content
        .trim()
        .split('\n')
        .join('\n> ')}\n`;
    },
  );

  // 볼드 텍스트 표시 수정 (** 처리)
  convertedMarkdown = convertedMarkdown.replace(/\*\*```/g, '```');
  convertedMarkdown = convertedMarkdown.replace(/```\*\*/g, '```');

  return convertedMarkdown;
};

export default function CopyButton({ title, markdownContent }) {
  const handleCopy = async () => {
    try {
      const convertedMarkdown = convertCustomMarkdown({
        title,
        markdownContent,
      });
      await navigator.clipboard.writeText(convertedMarkdown);
      alert('마크다운이 클립보드에 복사되었습니다.');
    } catch (err) {
      console.error('마크다운 복사 실패:', err);
      alert('복사에 실패했습니다.');
    }
  };

  const handleDownload = () => {
    try {
      const convertedMarkdown = convertCustomMarkdown(markdownContent);
      const blob = new Blob([convertedMarkdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const pathname = window.location.pathname;
      const chapterName = pathname.split('/').pop();
      link.download = `${chapterName}.${title}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      alert('마크다운 파일이 다운로드되었습니다.');
    } catch (err) {
      console.error('마크다운 다운로드 실패:', err);
      alert('다운로드에 실패했습니다.');
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Tooltip text="마크다운 복사하기">
        <button onClick={handleCopy} className="copy-button">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.83333 4C5.07853 4 4 5.56178 4 7.03333V24.9667C4 26.4382 5.07853 28 6.83333 28H11.5V25H7.00193C7.00073 24.9901 7 24.979 7 24.9667V7.03333C7 7.02104 7.00073 7.00994 7.00193 7H23.9981C23.9993 7.00994 24 7.02104 24 7.03333V10.5H27V7.03333C27 5.56178 25.9215 4 24.1667 4H6.83333ZM16.8333 13C15.2004 13 14 14.3682 14 15.9V34.1C14 35.6318 15.2004 37 16.8333 37H34.1667C35.7996 37 37 35.6318 37 34.1V15.9C37 14.3682 35.7996 13 34.1667 13H16.8333ZM34 34H17V16H34V34ZM31 21.5C31 22.3284 30.3284 23 29.5 23H21.5C20.6716 23 20 22.3284 20 21.5C20 20.6716 20.6716 20 21.5 20H29.5C30.3284 20 31 20.6716 31 21.5ZM29.5 30C30.3284 30 31 29.3284 31 28.5C31 27.6716 30.3284 27 29.5 27H21.5C20.6716 27 20 27.6716 20 28.5C20 29.3284 20.6716 30 21.5 30H29.5Z"
            />
          </svg>
          <span className="sr-only">마크다운 복사하기</span>
        </button>
      </Tooltip>

      <Tooltip text="마크다운 다운로드">
        <button onClick={handleDownload} className="copy-button">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M20 4C20.8284 4 21.5 4.67157 21.5 5.5V23.0858L27.2929 17.2929C27.6834 16.9024 28.3166 16.9024 28.7071 17.2929C29.0976 17.6834 29.0976 18.3166 28.7071 18.7071L20.7071 26.7071C20.3166 27.0976 19.6834 27.0976 19.2929 26.7071L11.2929 18.7071C10.9024 18.3166 10.9024 17.6834 11.2929 17.2929C11.6834 16.9024 12.3166 16.9024 12.7071 17.2929L18.5 23.0858V5.5C18.5 4.67157 19.1716 4 20 4ZM5 28C5.55228 28 6 28.4477 6 29V33C6 33.5523 6.44772 34 7 34H33C33.5523 34 34 33.5523 34 33V29C34 28.4477 34.4477 28 35 28C35.5523 28 36 28.4477 36 29V33C36 34.6569 34.6569 36 33 36H7C5.34315 36 4 34.6569 4 33V29C4 28.4477 4.44772 28 5 28Z"
            />
          </svg>
          <span className="sr-only">마크다운 다운로드</span>
        </button>
      </Tooltip>
    </div>
  );
}
