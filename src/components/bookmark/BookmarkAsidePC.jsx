import { useEffect, useState } from 'react';
import styles from './BookmarkAsidePC.module.scss';

// component
import BtnIcon from '@/components/common/button/BtnIcon';
import SVGListClose from '@/components/svg/SVGListClose';
import SubBanner from '../layouts/aside/SubBanner';
import useWindowSize from '@/utils/useWindowSize';
import SVGList from '@/components/svg/SVGList';
import BookmarkToc from './BookmarkToc';

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

  const handleBookSelect = (bookId) => {
    setSelectedBook(bookId);
    onFilterChange(bookId);
  };

  return isMenuShow ? (
    <aside className={`${styles.aside} ${styles.show}`}>
      <div className={styles.sublist}>
        <h3> 책 목록</h3>
        <BookmarkToc
          selectedBook={selectedBook}
          onFilterChange={handleBookSelect}
          bookmarks={bookmarks}
        />

        <BtnIcon
          className={`${styles.btnClose}`}
          onClick={toggleMenu}
          bordernone="true"
        >
          <SVGListClose color="grayLv3" />
          <span className="a11y-hidden">책 목록 메뉴 접기</span>
        </BtnIcon>
      </div>
      <SubBanner />
    </aside>
  ) : (
    <aside className={`${styles.aside} ${styles.hide}`}>
      <BtnIcon className={`${styles.btnOpen}`} onClick={toggleMenu}>
        <SVGList color="grayLv4" />
        <span className="a11y-hidden">책 목록 메뉴 열기</span>
      </BtnIcon>
    </aside>
  );
}
