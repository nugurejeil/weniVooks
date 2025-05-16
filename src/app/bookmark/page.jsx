'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './bookmark.module.scss';
import classNames from 'classnames';
import SVGAlertCircle from '@/components/svg/SVGAlertCircle';
import useWindowSize from '@/utils/useWindowSize';
import Loading from '../loading';

export default function Bookmark() {
  const [bookmarks, setBookmarks] = useState(null);
  const [sortedBookmarks, setSortedBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { windowWidth } = useWindowSize();

  // URL 해시 생성 함수 - 공백을 %20으로 대체
  const createUrlHash = (text) => {
    if (!text) return '';
    // 공백을 %20으로 변환, 특수문자 제거
    return encodeURIComponent(text.toLowerCase());
  };

  useEffect(() => {
    // Retrieve bookmarks from localStorage
    const fetchBookmarks = () => {
      try {
        const storedBookmarks = localStorage.getItem('bookmarks');
        if (storedBookmarks) {
          const parsedBookmarks = JSON.parse(storedBookmarks);
          setBookmarks(parsedBookmarks);

          // 북마크를 평탄화하고 시간순으로 정렬
          const flattenedBookmarks = [];

          Object.entries(parsedBookmarks).forEach(([bookId, chapters]) => {
            Object.entries(chapters).forEach(([chapter, sections]) => {
              Object.entries(sections).forEach(([section, headings]) => {
                const chapterNum = chapter.match(/\d+/);
                const chapterDisplay = chapterNum
                  ? `Chapter ${chapterNum[0]}`
                  : chapter;

                headings.forEach((heading) => {
                  flattenedBookmarks.push({
                    id: `${bookId}/${chapter}/${heading}`,
                    title: heading,
                    bookId,
                    chapter: chapterDisplay,
                    section: section,
                    url: `/${bookId}/${chapter}#${createUrlHash(heading)}`,
                  });
                });
              });
            });
          });

          // 북마크를 추가된 순서대로 정렬 (localStorage에 저장된 순서)
          setSortedBookmarks(flattenedBookmarks);
        } else {
          setBookmarks({});
          setSortedBookmarks([]);
        }
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
        setBookmarks({});
        setSortedBookmarks([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay to prevent hydration errors
    const timer = setTimeout(() => {
      fetchBookmarks();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Function to remove a bookmark
  const removeBookmark = (bookmarkId) => {
    try {
      // 북마크 ID에서 경로 정보 추출
      const [bookTitle, chapter, ...sectionParts] = bookmarkId.split('/');
      const section = sectionParts.join('/'); // 섹션 이름에 /가 포함된 경우 처리

      // 북마크 객체에서 해당 항목 삭제
      const updatedBookmarks = { ...bookmarks };
      if (
        updatedBookmarks[bookTitle] &&
        updatedBookmarks[bookTitle][chapter] &&
        section in updatedBookmarks[bookTitle][chapter]
      ) {
        delete updatedBookmarks[bookTitle][chapter][section];

        // 빈 객체 정리
        if (Object.keys(updatedBookmarks[bookTitle][chapter]).length === 0) {
          delete updatedBookmarks[bookTitle][chapter];
        }
        if (Object.keys(updatedBookmarks[bookTitle]).length === 0) {
          delete updatedBookmarks[bookTitle];
        }
      }

      // 정렬된 북마크에서도 해당 항목 삭제
      const updatedSortedBookmarks = sortedBookmarks.filter(
        (item) => item.id !== bookmarkId,
      );

      localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
      setBookmarks(updatedBookmarks);
      setSortedBookmarks(updatedSortedBookmarks);
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={classNames(styles.wrapper)}>
      <div className={classNames(styles.innerLayout)}>
        <div className={classNames(styles.title)}>
          <strong>북마크</strong>
          <span>저장된 북마크: {sortedBookmarks.length}건</span>
        </div>

        {sortedBookmarks.length === 0 ? (
          <div className={styles.notFound}>
            <SVGAlertCircle size={windowWidth < 640 ? 80 : 100} />
            <p>
              <span>저장된 북마크가 없습니다.</span>
              <span>콘텐츠를 읽는 동안 북마크를 추가해보세요.</span>
            </p>
          </div>
        ) : (
          <div className={styles.bookmarkList}>
            {sortedBookmarks.map((bookmark, idx) => (
              <div key={idx} className={styles.resultSection}>
                <Link href={bookmark.url}>
                  <p className={classNames(styles.subTitle)}>
                    {bookmark.title}
                  </p>
                  <ol className={styles.breadcrumb}>
                    <li>
                      <Link href={`/${bookmark.bookId}`}>
                        {bookmark.bookId.replace(/-/g, ' ')}
                      </Link>
                    </li>
                    <li>
                      <Link href={`/${bookmark.bookId}/${bookmark.chapter}`}>
                        {bookmark.chapter}
                      </Link>
                    </li>
                    {bookmark.section && (
                      <li>
                        <Link
                          href={`/${bookmark.bookId}/${
                            bookmark.chapter
                          }#${createUrlHash(bookmark.title)}`}
                        >
                          {bookmark.section}
                        </Link>
                      </li>
                    )}
                  </ol>
                </Link>
                <button
                  className={styles.removeButton}
                  onClick={(e) => {
                    e.preventDefault();
                    removeBookmark(bookmark.id);
                  }}
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
