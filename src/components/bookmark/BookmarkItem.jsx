import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './BookmarkItem.module.scss';

import BookmarkIcon from '../common/icons/BookmarkIcon';
import { createScrollUrl } from '@/utils/useHashScroll';

export default function BookmarkItem({
  bookmark,
  getBookTitle,
  createUrlHash,
  onToggle,
  isToggled,
}) {
  const { title, bookId, chapter, section, url, timestamp } = bookmark;
  const router = useRouter();

  const handleBookmarkToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle(bookmark);
  };

  const handleLinkClick = (e) => {
    e.preventDefault();

    // 현재 페이지와 같은 페이지인지 확인
    const currentPath = window.location.pathname;
    const targetPath = url.split('#')[0] || url;

    if (currentPath === targetPath) {
      // 같은 페이지라면 스크롤만 실행 (해시 없이)
      const elementId = title;
      let targetElement = document.getElementById(elementId);

      if (!targetElement) {
        targetElement = document.getElementById(encodeURIComponent(title));
      }

      if (targetElement) {
        const yOffset = -80; // 네비게이션바 높이 + 여백
        const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } else {
      // 다른 페이지라면 스크롤 대상이 포함된 URL로 이동
      router.push(createScrollUrl(targetPath, title));
    }
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

  // 해시 없는 URL 생성
  const targetPath = url.split('#')[0] || url;

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
        <a href={targetPath} onClick={handleLinkClick} className={styles.bookmarkLink}>
          <div className={styles.bookmarkTitle}>{title}</div>
        </a>
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
