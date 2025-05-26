import Script from 'next/script';
import { JSDOM } from 'jsdom';
import dynamic from 'next/dynamic';

import '@/styles/common.css';
import '@/styles/codemirror.css';

import ButtonGroup from '../common/button/ButtonGroup';

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

export default function JavaScriptContent({
  htmlContent,
  title,
  markdownContent,
}) {
  return (
    <>
      {htmlContent && (
        <>
          <ButtonGroup title={title} markdownContent={markdownContent} />
          <h3 className="title">{title}</h3>
          <div
            dangerouslySetInnerHTML={{
              __html: replaceCodeWithJsRepl(htmlContent),
            }}
          />
        </>
      )}
      <link rel="stylesheet" href="/codeblocks/codemirror.css" />
      <Script src="/codeblocks/codemirror.js" />
      <Script defer src="/codeblocks/javascript/js-repl.js" />
      <Script defer src="/codeblocks/codemirror.js" />
      <Script defer src="/codeblocks/javascript/javascript.js" />
      <Script defer src="/codeblocks/codemirror/active-line.js" />
    </>
  );
}
