import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

import classNames from 'classnames';

import styles from './BookmarkAsideMobile.module.scss';

import { handleAllowScroll, handlePreventScroll } from '@/utils/handleScroll';

import SubBanner from './SubBanner';
import SVGUpArrow from '@/components/svg/SVGUpArrow';
import SVGDownArrow from '@/components/svg/SVGDownArrow';

export default function BookmarkAsideMobile({
  onFilterChange,
  selectedBook: propSelectedBook,
  bookList = [],
}) {
  const [clicked, setClicked] = useState(false);
  const [isMenuShow, setIsMenuShow] = useState(false);
  const [bookmarks, setBookmarks] = useState(null);
  const [selectedBook, setSelectedBook] = useState(propSelectedBook || 'all');

  const menuRef = useRef(null);
  const lastBtn = useRef(null);

  useEffect(() => {
    // 북마크 데이터 가져오기
    const storedBookmarks = localStorage.getItem('bookmarks');
    if (storedBookmarks) {
      setBookmarks(JSON.parse(storedBookmarks));
    }
  }, []);

  useEffect(() => {
    setSelectedBook(propSelectedBook);
  }, [propSelectedBook]);

  const handleFocusFirst = (e) => {
    if (!e.shiftKey && e.key === 'Tab') {
      e.preventDefault();
      const firstItem = menuRef.current.querySelector('button');
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

  const handleBookSelect = useCallback(
    (bookId) => {
      setSelectedBook(bookId);
      onFilterChange(bookId);
      toggleMenu(); // 모바일에서는 필터 선택 후 메뉴 닫기
    },
    [onFilterChange],
  );

  // 북마크가 있는 책 목록 메모이제이션
  const filteredBookList = useMemo(() => {
    if (!bookmarks) return [];
    return Object.keys(bookmarks).filter((bookId) => {
      const book = bookmarks[bookId];
      return Object.values(book).some((chapter) =>
        Object.values(chapter).some((sections) => sections.length > 0),
      );
    });
  }, [bookmarks]);

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
        const firstItem = menuRef.current.querySelector('button');
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
            북마크 필터
            <SVGDownArrow alt="열기" color="grayLv3" />
          </button>
        ) : (
          <>
            <h3 className={styles.bookmarkToc__title}>북마크 필터</h3>
            <div className={styles.positionWrap}>
              <ul className={styles.bookList}>
                <li>
                  <button
                    className={classNames(styles.bookItem, {
                      [styles.active]: selectedBook === 'all',
                    })}
                    onClick={() => handleBookSelect('all')}
                  >
                    전체보기
                  </button>
                </li>
                {filteredBookList.map((book) => (
                  <li key={book}>
                    <button
                      className={classNames(styles.bookItem, {
                        [styles.active]: selectedBook === book,
                      })}
                      onClick={() => handleBookSelect(book)}
                    >
                      {book.replace(/-/g, ' ')}
                    </button>
                  </li>
                ))}
              </ul>
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
              <span className="a11y-hidden">북마크 필터 닫기</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
