import Link from 'next/link';
import styles from './BookmarkItem.module.scss';

import BookmarkIcon from '../common/icons/BookmarkIcon';

export default function BookmarkItem({
  bookmark,
  getBookTitle,
  createUrlHash,
  onToggle,
  isToggled,
}) {
  const { title, bookId, chapter, section, url, timestamp } = bookmark;

  const handleBookmarkToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle(bookmark);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 토글된 상태에 따라 북마크 아이콘 상태 결정
  const isBookmarked = !isToggled;

  return (
    <div className={styles.bookmarkItem}>
      <div className={styles.bookmarkInfo}>
        <div className={styles.breadcrumb}>
          <Link href={`/${bookId}`} className={styles.breadcrumbLink}>
            {getBookTitle(bookId)}
          </Link>
          <span className={styles.separator}>/</span>
          <Link
            href={`/${bookId}/${chapter}`}
            className={styles.breadcrumbLink}
          >
            {chapter}
          </Link>
          <span className={styles.separator}>/</span>
          <Link
            href={`/${bookId}/${chapter}/${section}`}
            className={styles.breadcrumbLink}
          >
            {section}
          </Link>
        </div>
        <Link href={url} className={styles.bookmarkLink}>
          <div className={styles.bookmarkTitle}>{title}</div>
        </Link>
      </div>
      <div className={styles.bookmarkActions}>
        <span className={styles.date}>{formatDate(timestamp)}</span>

        <button
          className={styles.deleteButton}
          onClick={handleBookmarkToggle}
          aria-label={isBookmarked ? '북마크 삭제' : '북마크 추가'}
        >
          <BookmarkIcon isFilled={isBookmarked} />
        </button>
      </div>
    </div>
  );
}
