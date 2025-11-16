import { unified } from 'unified';
import fs from 'fs';

import remarkParse from 'remark-parse';
import remark2rehype from 'remark-rehype';
import remarkDirective from 'remark-directive';
import remarkGfm from 'remark-gfm';
import remarkBehead from 'remark-behead';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import rehypeTitleFigure from 'rehype-title-figure';
import { h } from 'hastscript';
import { visit } from 'unist-util-visit';
import rehypePrettyCode from 'rehype-pretty-code';

/**
 * 마크다운을 HTML로 변환
 * - HTML 태그(<br>)를 직접 사용하여 개행 처리 가능
 * - <color=#HEX>텍스트</color> 형식으로 텍스트 색상 지정 가능
 * - <highlight>텍스트</highlight> 또는 <highlight=#HEX>텍스트</highlight> 형식으로 텍스트 하이라이팅 가능
 * - <toggle>제목::내용</toggle> 형식으로 토글(접기/펼치기) 기능 사용 가능
 * - ```mermaid 코드 블록으로 다이어그램 렌더링 가능
 */

export const convertMarkdownToHtml = async (markdown) => {
  // Windows 줄바꿈을 표준화
  let normalizedMarkdown = markdown.replace(/\r\n/g, '\n');

  // <color=#HEX>텍스트</color> 태그를 <span style="color:#HEX">텍스트</span>으로 변환
  // [\s\S]*? 를 사용하여 줄바꿈을 포함한 모든 문자 매칭
  normalizedMarkdown = normalizedMarkdown.replace(
    /<color=(#[0-9A-Fa-f]{3,8})>([\s\S]*?)<\/color>/g,
    '<span style="color:$1">$2</span>',
  );

  // <highlight>텍스트</highlight> 태그를 기본 노란색 하이라이트로 변환
  // [\s\S]*? 를 사용하여 줄바꿈을 포함한 모든 문자 매칭
  normalizedMarkdown = normalizedMarkdown.replace(
    /<highlight>([\s\S]*?)<\/highlight>/g,
    '<span style="background-color:#ffff00; padding: 2px 4px; border-radius: 3px;">$1</span>',
  );

  // <highlight=#HEX>텍스트</highlight> 태그를 지정된 색상 하이라이트로 변환
  // [\s\S]*? 를 사용하여 줄바꿈을 포함한 모든 문자 매칭
  normalizedMarkdown = normalizedMarkdown.replace(
    /<highlight=(#[0-9A-Fa-f]{3,8})>([\s\S]*?)<\/highlight>/g,
    '<span style="background-color:$1; padding: 2px 4px; border-radius: 3px;">$2</span>',
  );

  // <toggle>제목::내용</toggle> 태그를 HTML details/summary 요소로 변환
  normalizedMarkdown = normalizedMarkdown.replace(
    /<toggle>(.*?)::([\s\S]*?)<\/toggle>/g,
    '<details class="custom-toggle"><summary class="toggle-summary">$1</summary><div class="toggle-content">$2</div></details>',
  );

  const file = await unified()
    .use(remarkParse) // 마크다운을 파싱
    .use(remarkDirective) // 확장구문 사용
    .use(myRemarkPlugin)
    .use(remarkMermaid) // Mermaid 다이어그램 지원
    .use(remarkGfm) // GFM 지원(자동링크 리터럴, 각주, 취소선, 표, 작업 목록)
    .use(remarkBehead, { minDepth: 4 })
    .use(remark2rehype, {
      allowDangerousHtml: true, // HTML 태그 허용
    }) // 파싱된 마크다운을 Rehype로 변환
    .use(rehypeRaw) // HTML 문자열을 실제 HTML 요소로 변환
    .use(rehypeTitleFigure)
    .use(rehypePrettyCode, {
      theme: {
        light: JSON.parse(fs.readFileSync(`public/theme/light.json`, 'utf-8')),
        dark: JSON.parse(fs.readFileSync(`public/theme/dark.json`, 'utf-8')),
      },
    })
    .use(rehypeStringify, {
      allowDangerousHtml: true, // HTML 태그 허용
    }) // HTML로 변환
    .process(normalizedMarkdown);

  // 최종 HTML에서 남아있을 수 있는 태그들 처리
  // [\s\S]*? 를 사용하여 줄바꿈을 포함한 모든 문자 매칭
  let htmlResult = String(file)
    .replace(
      /<color=(#[0-9A-Fa-f]{3,8})>([\s\S]*?)<\/color>/g,
      '<span style="color:$1">$2</span>',
    )
    .replace(
      /<highlight>([\s\S]*?)<\/highlight>/g,
      '<span style="background-color:#ffff00; padding: 2px 4px; border-radius: 3px;">$1</span>',
    )
    .replace(
      /<highlight=(#[0-9A-Fa-f]{3,8})>([\s\S]*?)<\/highlight>/g,
      '<span style="background-color:$1; padding: 2px 4px; border-radius: 3px;">$2</span>',
    )
    .replace(
      /<toggle>(.*?)::([\s\S]*?)<\/toggle>/g,
      '<details><summary>$1</summary>$2</details>',
    );

  return htmlResult;
};

function myRemarkPlugin() {
  return function (tree) {
    visit(tree, function (node) {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        const data = node.data || (node.data = {});
        const hast = h(node.name, node.attributes || {});

        data.hName = hast.tagName;
        data.hProperties = hast.properties;
      }
    });
  };
}

// Mermaid 코드 블록을 처리하는 플러그인
function remarkMermaid() {
  return function (tree) {
    visit(tree, 'code', function (node) {
      if (node.lang === 'mermaid') {
        const data = node.data || (node.data = {});

        // Mermaid 차트 데이터를 data attribute에 저장
        data.hName = 'div';
        data.hProperties = {
          className: ['mermaid-wrapper'],
          'data-mermaid': node.value,
        };

        // 노드 타입을 html로 변경
        node.type = 'html';
        node.value = `<div class="mermaid-wrapper" data-mermaid="${node.value.replace(
          /"/g,
          '&quot;',
        )}"></div>`;
      }
    });
  };
}
