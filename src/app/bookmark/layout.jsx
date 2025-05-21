'use client';
import styles from './layout.module.scss';

import Header from '@/components/layouts/header/Header';
import Footer from '@/components/layouts/footer/Footer';
import BtnTop from '@/components/common/button/BtnTop';

export default function Layout({ children }) {
  return (
    <>
      <Header type="border" />
      <div className={styles.wrapper}>
        <h2 className="a11y-hidden">북마크 모아보기</h2>
        <div className={styles.content}>{children}</div>
      </div>
      <Footer />
      <BtnTop />
    </>
  );
}
