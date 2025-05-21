import { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import styles from './BookmarkToc.module.scss';
import bookList from '@/data/bookList.json';

export default function BookmarkToc({
  selectedBook,
  onFilterChange,
  bookmarks,
}) {
  const handleBookSelect = useCallback(
    (bookId) => {
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

  // bookList에서 책 제목 가져오기
  const getBookTitle = (bookId) => {
    const book = bookList.find((book) => book.booklink === `/${bookId}`);
    return book ? book.title : bookId.replace(/-/g, ' ');
  };

  return (
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
            {getBookTitle(book)}
          </button>
        </li>
      ))}
    </ul>
  );
}
