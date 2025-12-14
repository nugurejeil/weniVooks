'use client';
import Link from 'next/link';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import styles from './Nav.module.scss';
import SVGNavArrow from '@/components/svg/SVGNavArrow';
import ScrollWrap from './ScrollWrap';
import PdfDownloadButton from '@/components/pages/PdfDownloadButton';
import { useBook } from '@/context/BookContext';

const MenuItem = (props) => {
  const { title, link, sections } = props;
  const [fold, setFold] = useState(false);
  const path = usePathname();

  // scroll 이동
  useEffect(() => {
    const sideMenu = document.querySelector('#naviWrap');
    const currentSidebarItem = document.querySelector('#active');
    const scrollToTop = () => {
      sideMenu.scrollTo({
        top:
          currentSidebarItem &&
          currentSidebarItem.offsetTop - window.innerHeight / 4,
        behavior: 'smooth',
      });
    };
    scrollToTop();
  }, [path]);

  const toggleList = () => {
    setFold(!fold);
  };

  if (sections && sections.length > 0) {
    return (
      <li className={styles.fold} id={link === path ? 'active' : ''}>
        <div className={link === path ? styles.active : null}>
          <Link href={link ? link : ''}>{title}</Link>
          <button
            className={`${styles.chapterBtn} ${fold ? styles.close : null}`}
            onClick={toggleList}
          >
            <SVGNavArrow alt="접기" color="grayLv4" />
          </button>
        </div>
        <ol className={fold ? styles.hide : null}>
          {sections.map((data, index) => (
            <MenuItem key={index} {...data} />
          ))}
        </ol>
      </li>
    );
  } else {
    return (
      <li
        className={`${styles.notFold} ${link === path ? styles.active : null}`}
        id={link === path ? 'active' : ''}
      >
        <Link href={link ? link : ''}>{title}</Link>
      </li>
    );
  }
};

export default function Nav({ data }) {
  const { title, link, sections } = data;
  const { bookName, hasPdf } = useBook();

  return (
    <>
      <div className={styles.titleWrap}>
        <h3 className={styles.title}>
          <span className="a11y-hidden">목차:</span>
          <Link href={link}>{title}</Link>
        </h3>
        {hasPdf && <PdfDownloadButton bookName={bookName} />}
      </div>

      <ScrollWrap id="naviWrap">
        <nav className={styles.nav}>
          <ol className={styles.menu}>
            {sections.map((data, index) => (
              <MenuItem key={index} {...data} />
            ))}
          </ol>
        </nav>
      </ScrollWrap>
    </>
  );
}
