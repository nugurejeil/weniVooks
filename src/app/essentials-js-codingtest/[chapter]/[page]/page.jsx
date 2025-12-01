import { DEFAULT_PATH, EDITOR } from '../../bookInfo';
import { getPages } from '@/sub/getPages';
import ContentPage from '@/components/pages/ContentPage';

// 컨텐츠 페이지
export default function Page({ params }) {
  const chapter = params.chapter;
  const page = params.page;

  return (
    <ContentPage
      chapter={chapter}
      page={page}
      DEFAULT_PATH={DEFAULT_PATH}
      EDITOR={EDITOR}
    />
  );
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getPages(DEFAULT_PATH);
}
