import axios from 'axios';
import bookData from '@/data/bookList.json';
const PAGE = 1;

// 개행문자 통일, 각 줄을 배열의 요소로 변환
const normalize = (markdown) => {
  return markdown
    .replace(/\r\n?/g, '\n')
    .replace(/\n{2,}/g, '\n\n')
    .split('\n');
};

const parse = (token, { regex, tagName, replace }) => {
  return token.replace(regex, replace ?? `<${tagName}>$1</${tagName}>`);
};

// 코드블럭 시작(```)
const codeBlockStart = {
  regex: /^\s*`{3}(.+)/,
  replace: '<pre><code>$1',
};

// 코드블럭 끝(```)
const codeBlockEnd = {
  regex: /(.*)`{3}\s*$/,
  replace: '$1</code></pre>',
};

// "-"로 시작하는 리스트
const unorderedListItem = {
  regex: /^\s*(-\s.+)$/,
  replace: '<p>$1</p>',
};

// "숫자. "으로 시작하는 리스트
const orderedListItem = {
  regex: /^\s*(\d+\.\s.+)$/,
  replace: '<p>$1</p>',
};

// 제목태그
const heading = {
  regex: /^\s*(#+)\s(.+)/,
  replace: (_, mark, group) => {
    const tagName = `h${mark.length + 1}`;
    return `<${tagName}>${group}</${tagName}>`;
  },
};

// 이미지 제거
const figure = {
  regex: /^\s*!\[(.*)\]\((.+)\)/,
  replace: '',
};

// br태그
const lineBreak = {
  regex: /^<br\s*\/>$/,
  replace: '<br />',
};

// 콜아웃
const callout = {
  regex: /^\s*>+\s?(.+)/,
  tagName: 'p',
};

// 텍스트 p태그로 감싸기
const paragraph = {
  regex: /(?:^|\n)(.+)$/,
  tagName: 'p',
  replace: (matched, group) =>
    /\<(\/)?(h\d|ul|ol|li|blockquote|pre|img|code)/.test(matched)
      ? matched
      : '<p>' + group + '</p>',
};

// 링크 제거
const link = {
  regex: /\[(.+?)\]\(.+?\)/g,
  replace: '$1',
};

// 볼드체
const strong = {
  regex: /\*{2}(.+?)\*{2}/g,
  replace: '$1',
};

// 인라인 코드(벡틱)
const code = {
  regex: /`(.+?)`/g,
  replace: '$1',
};

// 블럭 컨텐츠 규칙
const blockRules = [
  codeBlockStart,
  unorderedListItem,
  orderedListItem,
  heading,
  figure,
  lineBreak,
  callout,
];

// 인라인 컨텐츠 규칙
const inlineRules = [link, strong, code];

export const parseMarkdown = (markdown) => {
  const tokens = normalize(markdown);
  let isEditor = false;
  let codeBlockStartIndex = -1;
  const listStack = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    // 코드블럭 내부가 아닌 경우
    if (codeBlockStartIndex === -1) {
      // 위에서 정의한 블럭 컨텐츠 규칙 적용
      const rule =
        blockRules.find(({ regex }) => regex.test(token)) ?? paragraph;
      tokens[i] = parse(token, rule);

      switch (rule) {
        case codeBlockStart:
          codeBlockStartIndex = i;
          const codeType = tokens[i].match(/<code>(.+)$/)?.[1];
          if (codeType === 'editor') {
            isEditor = true;
            tokens[i] = '';
          } else {
            tokens[i] = tokens[i].replace(codeType, '');
          }
          break;

        case unorderedListItem:
        case orderedListItem:
          tokens[i] = parse(token, rule);
          break;

        default:
          if (token.trim() === '') {
            if (listStack.length) {
              while (listStack.length) {
                tokens[i - 1] += listStack.pop();
              }
            }
            isEditor = false;
          }
      }
      // 코드블럭 내부인 경우
    } else {
      // 현재 줄이 빈줄일 경우 개행
      if (token.trim() === '') {
        tokens[i] = '\n\n';
      }
      // editor모드가 아닌 경우 "<>" 기호, 공백 유지
      if (!isEditor) {
        tokens[i] = token
          .replaceAll('<', '&#60;')
          .replaceAll('>', '&#62;')
          .replaceAll(' ', '&nbsp;');
      }
      // 코드블럭 종료될 때
      if (codeBlockEnd.regex.test(token)) {
        tokens[i] = parse(token, codeBlockEnd);
        codeBlockStartIndex = -1;
        isEditor = false;
      } else {
        tokens[i] += '\n';
      }
    }
  }

  // 위에서 정의한 인라인 컨텐츠 규칙 적용
  tokens.forEach((_, index) => {
    inlineRules.forEach((rule) => {
      if (rule.regex.test(tokens[index])) {
        tokens[index] = parse(tokens[index], rule);
      }
    });
  });

  // 빈 요소 일 경우 제거
  return tokens.filter(Boolean);
};

// 로컬 md파일 가져오기
const fetchMarkdown = async (query, page) => {
  const url = `/api/search?keyword=${encodeURIComponent(query)}&page=${page}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.error(err);
    return { result: Array(0), resultLength: 0, totalPages: 0 };
  }
};

export const searchInMd = async (query, setSearchResults, page) => {
  try {
    const markdown = await fetchMarkdown(query, page);

    if (Array.isArray(markdown.result)) {
      const val = {
        result: markdown.result,
        length: markdown.resultLength,
        page: markdown.totalPages,
      };
      await setSearchResults(val);
    }
  } catch (error) {
    console.log('md에서 에러났다!');
    console.error(error);
  }
};

// Alt 텍스트 삭제
const removeImageAltTexts = (text) => {
  const altTextPattern = /\[.*\]\(.*\)|!\[.*\]\(.*\)/g;
  const result = text.replace(altTextPattern, '');
  return result;
};

// aside 태그 삭제
const removeAsideContent = (text) => {
  const data = removeImageAltTexts(text);
  const asidePattern = /<aside>(.*?)<\/aside>|💡/gs;
  const result = data.replace(asidePattern, '').trim();
  return result;
};

// 텍스트 정규화
export const textNormalize = (text) => {
  const data = removeAsideContent(text);
  const result = data
    .replace(/```[^]+?```/gs, '') // 코드블럭 삭제
    .replace(/::a\[[^\]]+\]{[^}]+}/g, ''); // ::a로 시작하는 링크 요소들 삭제
  return result;
};

// 특정 문자열을 기준으로 배열을 분할하는 함수
export const splitArray = (array, delimiter) => {
  const result = [];
  let currentArray = [];

  array.forEach((item) => {
    if (item.includes(delimiter)) {
      if (currentArray.length > 0) {
        result.push(currentArray);
        currentArray = [];
      }
    }
    currentArray.push(item);
  });

  if (currentArray.length > 0) {
    result.push(currentArray);
  }

  return result;
};

// 책 종류 선택
export const choiceBookKind = (bookKind) => {
  const result = bookData.reduce((acc, item) => {
    if (item.booklink) {
      acc[item.booklink.replace('/', '')] = item.title;
    }
    return acc;
  }, {});

  return result[bookKind];
};

// 파일의 상대경로를 반환하는 함수
export const getRelativePath = (baseUrl, url) => {
  const result = url
    .replace(baseUrl, '')
    .replace(/\\/g, '/')
    .replace('.md', '');
  return result;
};

/**
 * 파일 제목과 챕터 제목 가져오는 함수
 * @param {string} html 파일 내부 문자열
 *
 * @returns {string} 파일의 제목
 */
export const getMetaData = (html) => {
  let title;
  let chapterTitle;

  for (const el of html) {
    const target = el.replace(/<[^>]*>/g, '').trim();

    if (el.includes('title:')) {
      const result = target.replace(/title:\s*([\d.]+\s*)?/g, '');
      title = result ? result : undefined;
    } else if (el.includes('chapter:')) {
      const result = target.replace(/chapter:\s*/g, '');
      chapterTitle = result ? result : undefined;
    }
  }
  const val = {
    title,
    chapterTitle,
  };

  return val;
};

/**
 * 키워드가 포함된 챕터만 출력하는 함수
 * @param {string} html 파일 내부 문자열
 * @param {string} keyword 검색 키워드
 *
 * @returns {string} 파일의 제목
 */
export const filteredChapter = (html, keyword) => {
  const nomalizedHtml = html.filter(
    (item) =>
      !item.includes('<p>---</p>') &&
      !item.includes('title:') &&
      !item.includes('date:'),
  );

  const outputArray = splitArray(nomalizedHtml, '<h2>');
  const result = outputArray.filter((subArray) =>
    subArray.some((item) => item.includes(keyword)),
  );

  return result;
};

/**
 * 키워드가 포함된 챕터의 제목을 출력하는 함수
 * @param {string[]} chapter 키워드가 포함된 챕터 배열
 *
 * @returns {string|null} 챕터 제목
 */
export const getSubTitle = (chapter) => {
  for (const el of chapter) {
    if (el.includes('<h2>')) {
      return el
        .replace(/<[^>]*>/g, '')
        .replace(/[0-9.]/g, '')
        .trim();
    }
  }

  return null;
};

/**
 * 키워드가 포함된 챕터의 문장 리스트, 최대 3개
 * @param {string[]} chapter 키워드가 포함된 챕터 배열
 *
 * @returns {string[]} 키워드가 포함된 문장, 최대 3줄 이내
 */
export const getChapterContent = (chapter, keyword) => {
  const result = [];
  for (const el of chapter) {
    const condition = el.includes(keyword) && result.length < 3;
    while (condition) {
      result.push(el.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' '));
      break;
    }
  }

  return result;
};

// import jsonData from '../../../public/menu/python.json';
/**
 * 브레드크럼 출력 - public/menu 폴더에 의존
 * @deprecated
 * @param {string[]} chapter 키워드가 포함된 챕터 배열
 *
 * @returns {string[]} 키워드가 포함된 문장, 최대 3줄 이내
 */
// export const getBreadcrumb = (link) => {
//   let result = {};
//   for (const section of jsonData.sections) {
//     for (const el of section.sections) {
//       if (el.link === link) {
//         result = {
//           booktitle: jsonData.title,
//           bookChapter: section.title,
//         };
//       }
//     }
//   }

//   return result;
// };

/**
 * md 파일 책 이름 출력하는 함수
 * @param {string} link - .md 파일 링크
 * @returns {string} 책 이름
 */
export const getBookTitle = (link) => {
  const result = link.split(/[\/\\]/).filter((part) => part)[0];
  return choiceBookKind(result);
};

export const getChapterTitle = (link) => {
  // console.log('====link====');
  // console.log(link.split('/').filter((part) => part !== ''));
};
