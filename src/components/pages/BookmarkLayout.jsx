'use client';
import '@/styles/sub.scss';

import useWindowSize from '@/utils/useWindowSize';
import BookmarkAsidePC from '../layouts/aside/BookmarkAsidePC';
import BookmarkAsideMobile from '../layouts/aside/BookmarkAsideMobile';

export default function BookmarkLayout({ children }) {
  const { windowWidth } = useWindowSize();

  return (
    <>
      {windowWidth <= 1024 ? <BookmarkAsideMobile /> : null}

      <div className="content__wrap">
        <main className="main">
          <div className="main__inner">{children}</div>
        </main>
        {windowWidth > 1024 ? <BookmarkAsidePC /> : null}
      </div>
    </>
  );
}
