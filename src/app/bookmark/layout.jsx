'use client';
import '@/styles/sub.scss';

import { useEffect, useState } from 'react';
import useWindowSize from '@/utils/useWindowSize';
import { useHeadingBookmark } from '@/utils/useHeadingBookmark';
import BtnCopy from '@/components/common/button/BtnCopy';
import BookmarkAsidePC from '@/components/layouts/aside/BookmarkAsidePC';
import BookmarkAsideMobile from '@/components/layouts/aside/BookmarkAsideMobile';
import Header from '@/components/layouts/header/Header';
import Footer from '@/components/layouts/footer/Footer';
import BtnTop from '@/components/common/button/BtnTop';
import BookmarkLayout from '@/components/pages/BookmarkLayout';
import PageControl from '@/components/layouts/pagecontrol/PageControl';

export default function Layout({ children }) {
  const menuData = [];
  return (
    <>
      <Header type="border" />
      <div className="sub">
        <h2 className="a11y-hidden">북마크 모아보기</h2>
        <div className="sub__content">
          <BookmarkLayout>{children}</BookmarkLayout>
        </div>
      </div>
      <Footer />
      <BtnTop />
    </>
  );
}
