import { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import styles from './BookmarkToc.module.scss';

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
            {book.replace(/-/g, ' ')}
          </button>
        </li>
      ))}
    </ul>
  );
}
