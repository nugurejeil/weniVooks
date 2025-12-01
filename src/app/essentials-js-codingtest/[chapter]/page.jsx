import { DEFAULT_PATH, TITLE } from '../bookInfo';
import { getChapters } from '@/sub/getChapters';
import ChapterPage from '@/components/pages/ChapterPage';

// 챕터 페이지
export default function page({ params }) {
  const chapter = params.chapter;

  return (
    <ChapterPage DEFAULT_PATH={DEFAULT_PATH} TITLE={TITLE} chapter={chapter} />
  );
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getChapters(DEFAULT_PATH);
}
