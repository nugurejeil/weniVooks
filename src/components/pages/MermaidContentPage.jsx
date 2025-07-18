import { getMarkdown } from '@/sub/getMarkdown';
import ButtonGroup from '../common/button/ButtonGroup';
import MermaidClient from './MermaidClient';

export default async function MermaidContentPage({
  chapter,
  page,
  DEFAULT_PATH,
}) {
  try {
    const { title, htmlContent, markdownContent } = await getMarkdown(
      `/${DEFAULT_PATH}/${chapter}/${page}.md`,
    );

    return (
      <>
        <div className="title-container">
          <ButtonGroup title={title} markdownContent={markdownContent} />
          <h3 className="title">{title}</h3>
        </div>
        <div className="content-container">
          <MermaidClient htmlContent={htmlContent} />
        </div>
      </>
    );
  } catch (error) {
    console.error('Error fetching markdown:', error);
    return (
      <div>현재 콘텐츠를 불러올 수 없습니다. 잠시 후 다시 시도해 주세요.</div>
    );
  }
}