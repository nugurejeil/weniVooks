import { TITLE, COVER } from './bookInfo';
import CoverPage from '@/components/pages/CoverPage';

// 교안 표지
export default function Home() {
  return <CoverPage TITLE={TITLE} COVER={COVER} />;
}
