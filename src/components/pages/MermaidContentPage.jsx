import Script from 'next/script';
import { JSDOM } from 'jsdom';

import { getMarkdown } from '@/sub/getMarkdown';
import ButtonGroup from '../common/button/ButtonGroup';
import MermaidClient from './MermaidClient';

const pyConfig = {
  packages: ['numpy', 'pandas', 'matplotlib', 'lxml'],
};

// python-exec 코드 블록을 py-repl로 변환
function replaceCodeWithPyRepl(htmlString) {
  const dom = new JSDOM(htmlString);

  const codeElements = dom.window.document.querySelectorAll(
    'pre.weniv-light[data-language="python-exec"]',
  );

  let deleteElements = dom.window.document.querySelectorAll(
    'pre.weniv-dark[data-language="python-exec"]',
  );

  deleteElements.forEach((el) => {
    el.remove();
  });

  codeElements.forEach((el) => {
    const content = el.textContent;
    const pyReplElement = dom.window.document.createElement('py-repl');
    pyReplElement.textContent = content;
    el.replaceWith(pyReplElement);
  });

  return dom.serialize();
}

// javascript-exec 코드 블록을 js-repl로 변환
function replaceCodeWithJsRepl(htmlString) {
  const dom = new JSDOM(htmlString);

  const codeElements = dom.window.document.querySelectorAll(
    'pre.weniv-light[data-language="javascript-exec"]',
  );

  let deleteElements = dom.window.document.querySelectorAll(
    'pre.weniv-dark[data-language="javascript-exec"]',
  );

  deleteElements.forEach((el) => {
    el.remove();
  });

  codeElements.forEach((el) => {
    const content = el.textContent;
    const jsReplElement = dom.window.document.createElement('js-repl');
    jsReplElement.textContent = content;
    el.replaceWith(jsReplElement);
  });

  return dom.serialize();
}

export default async function MermaidContentPage({
  chapter,
  page,
  DEFAULT_PATH,
  EDITOR,
}) {
  try {
    const { title, htmlContent, markdownContent } = await getMarkdown(
      `/${DEFAULT_PATH}/${chapter}/${page}.md`,
    );

    // EDITOR에 따라 HTML 변환
    let processedHtml = htmlContent;
    const hasPython = EDITOR?.includes('Python');
    const hasJavaScript = EDITOR?.includes('JavaScript');

    if (hasPython) {
      processedHtml = replaceCodeWithPyRepl(processedHtml);
    }
    if (hasJavaScript) {
      processedHtml = replaceCodeWithJsRepl(processedHtml);
    }

    return (
      <>
        <div className="title-container">
          <ButtonGroup title={title} markdownContent={markdownContent} />
          <h3 className="title">{title}</h3>
        </div>
        <div className="content-container">
          <MermaidClient htmlContent={processedHtml} />
        </div>

        {/* Python REPL 스크립트 */}
        {hasPython && (
          <>
            <link rel="stylesheet" href="/pyscript/pyscript.css" />
            <Script src="/pyscript/pyscript.js" />
            <py-config type="json">{JSON.stringify(pyConfig)}</py-config>
          </>
        )}

        {/* JavaScript REPL 스크립트 */}
        {hasJavaScript && (
          <>
            <link rel="stylesheet" href="/codeblocks/codemirror.css" />
            <Script src="/codeblocks/codemirror.js" />
            <Script defer src="/codeblocks/javascript/js-repl.js" />
            <Script defer src="/codeblocks/codemirror.js" />
            <Script defer src="/codeblocks/javascript/javascript.js" />
            <Script defer src="/codeblocks/codemirror/active-line.js" />
          </>
        )}
      </>
    );
  } catch (error) {
    console.error('Error fetching markdown:', error);
    return (
      <div>현재 콘텐츠를 불러올 수 없습니다. 잠시 후 다시 시도해 주세요.</div>
    );
  }
}