'use client';
import '@/styles/sub.scss';

import { useEffect, useState } from 'react';
import useWindowSize from '@/utils/useWindowSize';
// import { useHeadingCopyButton } from '@/utils/useHeadingCopyButton'; // 헤딩 복사 버튼
import { useHeadingBookmark } from '@/utils/useHeadingBookmark'; // 헤딩 북마크 기능
import { useHashScroll } from '@/utils/useHashScroll'; // 해시 링크 스크롤 기능
import BtnCopy from '@/components/common/button/BtnCopy';
import AsidePC from '@/components/layouts/aside/AsidePC';
import AsideMobile from '@/components/layouts/aside/AsideMobile';

export default function ContentLayout({ children }) {
  const { windowWidth } = useWindowSize();
  const [isHeading, setIsHeading] = useState(0);
  // useHeadingCopyButton(); // 헤딩 복사 버튼
  useHeadingBookmark(); // 헤딩 북마크 기능
  useHashScroll(); // 해시 링크 스크롤 기능

  useEffect(() => {
    const headingElements = Array.from(document.querySelectorAll('h4, h5, h6'));
    setIsHeading(headingElements.length);
  }, []);
  return (
    <>
      {windowWidth <= 1024 && isHeading ? <AsideMobile /> : null}

      <div className="content__wrap">
        <main className="main">
          <div className="main__inner">{children}</div>
        </main>
        {windowWidth > 1024 && isHeading ? <AsidePC /> : null}
      </div>
      <BtnCopy />
    </>
  );
}
