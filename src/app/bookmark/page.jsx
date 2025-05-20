'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import styles from './bookmark.module.scss';
import classNames from 'classnames';
import SVGAlertCircle from '@/components/svg/SVGAlertCircle';
import useWindowSize from '@/utils/useWindowSize';
import Loading from '../loading';
import BookmarkAsidePC from '@/components/layouts/aside/BookmarkAsidePC';
import BookmarkAsideMobile from '@/components/layouts/aside/BookmarkAsideMobile';

export default function Bookmark() {
  const [bookmarks, setBookmarks] = useState(null);
  const [sortedBookmarks, setSortedBookmarks] = useState([]);
  const [selectedBook, setSelectedBook] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const { windowWidth } = useWindowSize();

  // URL 해시 생성 함수 - 공백을 %20으로 대체
  const createUrlHash = useCallback((text) => {
    if (!text) return '';
    return encodeURIComponent(text.toLowerCase());
  }, []);

  // 북마크 데이터 가져오기 및 정렬
  const fetchAndSortBookmarks = useCallback(() => {
    try {
      const storedBookmarks = localStorage.getItem('bookmarks');
      if (storedBookmarks) {
        const parsedBookmarks = JSON.parse(storedBookmarks);
        setBookmarks(parsedBookmarks);

        const flattenedBookmarks = [];
        Object.entries(parsedBookmarks).forEach(([bookId, chapters]) => {
          Object.entries(chapters).forEach(([chapter, sections]) => {
            Object.entries(sections).forEach(([section, headings]) => {
              const chapterNum = chapter.match(/\d+/);
              const chapterDisplay = chapterNum
                ? `Chapter ${chapterNum[0]}`
                : chapter;

              headings.forEach((headingData) => {
                flattenedBookmarks.push({
                  id: `${bookId}/${chapter}/${headingData.title}`,
                  title: headingData.title,
                  bookId,
                  chapter: chapterDisplay,
                  section: section,
                  url: `/${bookId}/${chapter}#${createUrlHash(
                    headingData.title,
                  )}`,
                  timestamp: headingData.timestamp,
                });
              });
            });
          });
        });

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
  }, [createUrlHash]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAndSortBookmarks();
    }, 100);

    return () => clearTimeout(timer);
  }, [fetchAndSortBookmarks]);

  // 필터링된 북마크 메모이제이션
  const filteredBookmarks = useMemo(() => {
    if (selectedBook === 'all') {
      return sortedBookmarks;
    }
    return sortedBookmarks.filter(
      (bookmark) => bookmark.bookId === selectedBook,
    );
  }, [selectedBook, sortedBookmarks]);

  // 북마크 삭제 함수
  const removeBookmark = useCallback(
    (bookmarkId) => {
      try {
        const [bookTitle, chapter, ...sectionParts] = bookmarkId.split('/');
        const section = sectionParts.join('/');

        const updatedBookmarks = { ...bookmarks };
        if (
          updatedBookmarks[bookTitle] &&
          updatedBookmarks[bookTitle][chapter] &&
          section in updatedBookmarks[bookTitle][chapter]
        ) {
          delete updatedBookmarks[bookTitle][chapter][section];

          if (Object.keys(updatedBookmarks[bookTitle][chapter]).length === 0) {
            delete updatedBookmarks[bookTitle][chapter];
          }
          if (Object.keys(updatedBookmarks[bookTitle]).length === 0) {
            delete updatedBookmarks[bookTitle];
          }
        }

        localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
        fetchAndSortBookmarks(); // 북마크 목록 새로고침
      } catch (error) {
        console.error('Error removing bookmark:', error);
      }
    },
    [bookmarks, fetchAndSortBookmarks],
  );

  const handleFilterChange = useCallback((bookId) => {
    setSelectedBook(bookId);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {windowWidth <= 1024 ? (
        <BookmarkAsideMobile
          onFilterChange={handleFilterChange}
          selectedBook={selectedBook}
          bookList={Object.keys(bookmarks || {})}
        />
      ) : null}

      <div className="content__wrap">
        <main className="main">
          <div className="main__inner">
            <div className={classNames(styles.wrapper)}>
              <div className={classNames(styles.innerLayout)}>
                <div className={styles.content}>
                  <div className={classNames(styles.title)}>
                    <strong>북마크</strong>
                    <span>저장된 북마크: {filteredBookmarks.length}건</span>
                  </div>

                  {filteredBookmarks.length === 0 ? (
                    <div className={styles.notFound}>
                      <SVGAlertCircle size={windowWidth < 640 ? 80 : 100} />
                      <p>
                        <span>저장된 북마크가 없습니다.</span>
                        <span>콘텐츠를 읽는 동안 북마크를 추가해보세요.</span>
                      </p>
                    </div>
                  ) : (
                    <div className={styles.bookmarkList}>
                      {filteredBookmarks.map((bookmark, idx) => (
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
                                <Link
                                  href={`/${bookmark.bookId}/${bookmark.chapter}`}
                                >
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
                            <time
                              className={styles.timestamp}
                              dateTime={bookmark.timestamp}
                            >
                              {new Date(bookmark.timestamp).toLocaleString(
                                'ko-KR',
                                {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                },
                              )}
                            </time>
                          </Link>
                          <button
                            className={styles.btnDelete}
                            onClick={() => removeBookmark(bookmark.id)}
                          >
                            삭제
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
        {windowWidth > 1024 ? (
          <BookmarkAsidePC
            onFilterChange={handleFilterChange}
            selectedBook={selectedBook}
            bookList={Object.keys(bookmarks || {})}
          />
        ) : null}
      </div>
    </>
  );
}
