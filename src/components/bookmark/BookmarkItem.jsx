import Link from 'next/link';
import styles from './BookmarkItem.module.scss';
import classNames from 'classnames';
import SVGBookmarkFill from '@/components/svg/SVGBookmarkFill';
import BookmarkIcon from '../common/icons/BookmarkIcon';
import { useState } from 'react';

export default function BookmarkItem({
  bookmark,
  getBookTitle,
  createUrlHash,
  onDelete,
}) {
  const { title, bookId, chapter, section, url } = bookmark;
  const [isBookmarked, setIsBookmarked] = useState(true);

  const handleDelete = (e) => {
    e.preventDefault();
    onDelete(`${bookId}/${chapter}/${title}`);
    setIsBookmarked(false);
  };

  return (
    <div className={styles.bookmarkItem}>
      <div className={styles.bookmarkInfo}>
        <Link href={`/${bookId}`} className={styles.bookName}>
          {getBookTitle(bookId)}
        </Link>
        <Link href={url} className={styles.bookmarkLink}>
          <div className={styles.bookmarkTitle}>
            <strong>{title}</strong>
          </div>
        </Link>
      </div>
      <button
        className={styles.deleteButton}
        onClick={handleDelete}
        aria-label="북마크 삭제"
      >
        <BookmarkIcon isFilled={true} />
      </button>
    </div>
  );
}
