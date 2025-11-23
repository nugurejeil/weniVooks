import { DEFAULT_PATH, DESCRIPTION, TITLE, OG_IMG } from './bookInfo';
import { getMenu } from '@/sub/getMenu';
import BookLayout from '@/components/pages/BookLayout';
import getMetaObject from '@/components/pages/getMetaObject';

// meta
export async function generateMetadata(parent) {
  const IMG = OG_IMG || (await parent).openGraph?.images;
  return getMetaObject(TITLE, DESCRIPTION, DEFAULT_PATH, IMG);
}

export default function Layout({ children }) {
  const menuData = getMenu(DEFAULT_PATH, TITLE || '');

  return (
    <BookLayout DEFAULT_PATH={DEFAULT_PATH} TITLE={TITLE} menuData={menuData}>
      {children}
    </BookLayout>
  );
}
