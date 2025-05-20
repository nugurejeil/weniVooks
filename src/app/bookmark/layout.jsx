'use client';
import '@/styles/sub.scss';

import Header from '@/components/layouts/header/Header';
import Footer from '@/components/layouts/footer/Footer';
import BtnTop from '@/components/common/button/BtnTop';
import PageControl from '@/components/layouts/pagecontrol/PageControl';

export default function Layout({ children }) {
  return (
    <>
      <Header type="border" />
      <div className="sub">
        <h2 className="a11y-hidden">북마크 모아보기</h2>
        <div className="sub__content">{children}</div>
      </div>
      <Footer />
      <BtnTop />
    </>
  );
}
