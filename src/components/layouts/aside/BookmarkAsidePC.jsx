import { useEffect, useState, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import styles from './AsidePC.module.scss';

// component
import BtnIcon from '@/components/common/button/BtnIcon';
import SVGListClose from '@/components/svg/SVGListClose';
import SubBanner from './SubBanner';
import useWindowSize from '@/utils/useWindowSize';
import SVGList from '@/components/svg/SVGList';

export default function BookmarkAsidePC({
  onFilterChange,
  selectedBook: propSelectedBook,
  bookList = [],
}) {
  const { windowHeight } = useWindowSize();
  const [isMenuShow, setIsMenuShow] = useState(true);
  const [bookmarks, setBookmarks] = useState(null);
  const [selectedBook, setSelectedBook] = useState(propSelectedBook || 'all');

  useEffect(() => {
    const savedTocOpen = localStorage.getItem('toc') === 'false' ? false : true;
    setIsMenuShow(savedTocOpen);

    // 북마크 데이터 가져오기
    const storedBookmarks = localStorage.getItem('bookmarks');
    if (storedBookmarks) {
      setBookmarks(JSON.parse(storedBookmarks));
    }
  }, []);

  useEffect(() => {
    setSelectedBook(propSelectedBook);
  }, [propSelectedBook]);

  const toggleMenu = () => {
    if (isMenuShow) {
      setIsMenuShow(false);
      localStorage.setItem('toc', false);
    } else {
      setIsMenuShow(true);
      localStorage.removeItem('toc', false);
    }
  };

  const handleBookSelect = useCallback(
    (bookId) => {
      setSelectedBook(bookId);
      onFilterChange(bookId);
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

  if (windowHeight > 640) {
    return isMenuShow ? (
      <aside className={`${styles.aside} ${styles.show}`}>
        <div className={styles.sublist}>
          <h3>북마크 필터</h3>
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

          <BtnIcon
            className={`${styles.btnClose}`}
            onClick={toggleMenu}
            bordernone="true"
          >
            <SVGListClose color="grayLv3" />
            <span className="a11y-hidden">북마크 필터 메뉴 접기</span>
          </BtnIcon>
        </div>
        <SubBanner />
      </aside>
    ) : (
      <aside className={`${styles.aside} ${styles.hide}`}>
        <BtnIcon className={`${styles.btnOpen}`} onClick={toggleMenu}>
          <SVGList color="grayLv4" />
          <span className="a11y-hidden">북마크 필터 메뉴 열기</span>
        </BtnIcon>
      </aside>
    );
  }
}
