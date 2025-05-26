'use client';

import Link from 'next/link';

import Logo from '@/components/svg/Logo';

import styles from './Header.module.scss';

import useWindowSize from '@/utils/useWindowSize';
import classNames from 'classnames';
import SettingBtn from '@/components/setting/SettingBtn';
import BtnIcon from '@/components/common/button/BtnIcon';
import SVGSearch from '@/components/svg/SVGSearch';
import SearchForm from '@/components/search/SearchForm';
import ScrollBar from './ScrollBar';
import BtnBookmark from '@/components/common/button/BtnBookmark';

export default function Header({ type = 'subpage' }) {
  const { windowWidth } = useWindowSize();

  return (
    <>
      <header className={classNames(styles.header, styles[`header__${type}`])}>
        <h1 className={styles.header__logo}>
          <Link href="/" scroll={false}>
            <Logo />
            <span className="a11y-hidden">WeniVooks</span>
          </Link>
        </h1>

        {/* 설정 및 검색 */}
        {type !== 'notfound' && (
          <div className={styles.header__right}>
            {windowWidth > 640 ? (
              <SearchForm />
            ) : (
              <BtnIcon
                href="/search"
                bordernone="true"
                className={styles.searchBtn}
              >
                <SVGSearch color="grayLv4" />
                <span className="a11y-hidden">검색</span>
              </BtnIcon>
            )}
            <div className={styles.header__right__btns}>
              <SettingBtn />
              <BtnBookmark />
            </div>
          </div>
        )}
      </header>

      {type === 'subpage' && <ScrollBar />}
    </>
  );
}
