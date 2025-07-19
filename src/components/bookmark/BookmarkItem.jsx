import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  const handleBookmarkToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle(bookmark);
  };

  const handleLinkClick = (e) => {
    e.preventDefault();
    const targetUrl = url.includes('#') ? url : `${url}#${encodeURIComponent(title)}`;
    
    // 현재 페이지와 같은 페이지인지 확인
    const currentPath = window.location.pathname;
    const targetPath = targetUrl.split('#')[0];
    
    if (currentPath === targetPath) {
      // 같은 페이지라면 스크롤만 실행
      const hash = targetUrl.split('#')[1];
      if (hash) {
        const elementId = decodeURIComponent(hash);
        let targetElement = document.getElementById(elementId);
        
        if (!targetElement) {
          targetElement = document.getElementById(hash);
        }
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          window.history.replaceState(null, null, `#${hash}`);
        }
      }
    } else {
      // 다른 페이지라면 페이지 이동
      router.push(targetUrl);
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

  // 헤딩 ID를 포함한 URL 생성
  const headingUrl = url.includes('#') ? url : `${url}#${title}`;

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
        <a href={headingUrl} onClick={handleLinkClick} className={styles.bookmarkLink}>
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
