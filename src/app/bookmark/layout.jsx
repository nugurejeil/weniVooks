'use client';
import Header from '@/components/layouts/header/Header';
import BtnTop from '@/components/common/button/BtnTop';

import styles from '../search/layout.module.scss';
import bookmarkStyles from './bookmark.module.scss';
import classNames from 'classnames';
import Footer from '@/components/layouts/footer/Footer';

export default function Layout({ children }) {
  return (
    <>
      <div className={classNames('layout-grow', styles.wrapper)}>
        <Header type="border" />
        <div className={styles.content}>
          <main className={bookmarkStyles.main}>{children}</main>
        </div>
        <Footer />
      </div>
      <BtnTop />
    </>
  );
}
