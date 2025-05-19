import { useEffect, useRef, useState } from 'react';

import classNames from 'classnames';

import styles from './BookmarkAsideMobile.module.scss';

import { handleAllowScroll, handlePreventScroll } from '@/utils/handleScroll';

import Toc from './Toc';
import SubBanner from './SubBanner';
import SVGUpArrow from '@/components/svg/SVGUpArrow';
import SVGDownArrow from '@/components/svg/SVGDownArrow';

export default function BookmarkAsideMobile() {
  const [clicked, setClicked] = useState(false);
  const [isMenuShow, setIsMenuShow] = useState(false);

  const menuRef = useRef(null);
  const lastBtn = useRef(null);

  const handleFocusFirst = (e) => {
    if (!e.shiftKey && e.key === 'Tab') {
      e.preventDefault();

      const firstItem = menuRef.current.querySelector('a');
      firstItem.focus();
    }
  };

  const handleFocusLast = (e) => {
    if (e.shiftKey && e.key === 'Tab') {
      e.preventDefault();

      lastBtn.current.focus();
    }
  };

  const toggleMenu = () => {
    !clicked && setClicked(true);
    setIsMenuShow((prev) => !prev);
    if (!isMenuShow) {
      handlePreventScroll();
      setTimeout(() => {
        lastBtn.current.focus();
      }, 100);
    } else {
      handleAllowScroll();
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      const isToc = e.target.closest('.toc');

      if (isMenuShow && !isToc) {
        toggleMenu(false);
      }
    };
    const handleESC = (e) => {
      if (isMenuShow && e.key === 'Escape') {
        toggleMenu(false);
      }
    };

    if (isMenuShow) {
      setTimeout(() => {
        window.addEventListener('click', handleOutsideClick);
        window.addEventListener('keydown', handleESC);

        const firstItem = menuRef.current.querySelector('a');
        firstItem.addEventListener('keydown', handleFocusLast);
      }, 100);
    }
    return () => {
      window.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('keydown', handleESC);
    };
  }, [isMenuShow]);

  return (
    <div
      className={classNames(
        isMenuShow ? styles.active : '',
        styles.bookmarkToc,
      )}
      ref={menuRef}
    >
      <div className={`toc ${styles.bookmarkToc__wrap}`}>
        {!isMenuShow ? (
          <button
            className={classNames(
              clicked && styles.clicked,
              styles.bookmarkToc__open,
            )}
            type="button"
            onClick={toggleMenu}
          >
            목차
            <SVGDownArrow alt="열기" color="grayLv3" />
          </button>
        ) : (
          <>
            <h3 className={styles.bookmarkToc__title}>목차</h3>
            <div className={styles.positionWrap}>
              <Toc toggleMenu={toggleMenu} />
              <SubBanner />
            </div>
            <button
              type="button"
              className={styles.bookmarkToc__close}
              onClick={toggleMenu}
              onKeyDown={handleFocusFirst}
              ref={lastBtn}
            >
              <SVGUpArrow color="grayLv3" />
              <span className="a11y-hidden">목차 닫기</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
