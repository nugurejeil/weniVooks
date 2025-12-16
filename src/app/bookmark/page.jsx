'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';

import styles from './bookmark.module.scss';
import classNames from 'classnames';

import SVGAlertCircle from '@/components/svg/SVGAlertCircle';
import useWindowSize from '@/utils/useWindowSize';
import Loading from '../loading';

import BookmarkAsidePC from '@/components/bookmark/BookmarkAsidePC';
import BookmarkAsideMobile from '@/components/bookmark/BookmarkAsideMobile';
import bookList from '@/data/bookList.json';
import BookmarkItem from '@/components/bookmark/BookmarkItem';

export default function Bookmark() {
  const [bookmarks, setBookmarks] = useState(null);
  const [sortedBookmarks, setSortedBookmarks] = useState([]);
  const [selectedBook, setSelectedBook] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('timestamp'); // 'timestamp' 또는 'chapter'
  const [toggledBookmarks, setToggledBookmarks] = useState(new Set()); // 토글된 북마크 추적
  const { windowWidth } = useWindowSize();

  // URL 생성 시 해시를 사용하지 않음
  // 북마크 클릭 시 JavaScript로 스크롤 이동 처리
  const createUrlHash = useCallback((text) => {
    // 해시 없이 빈 문자열 반환 (기존 호환성 유지)
    return '';
  }, []);

  // 책 ID로 책 제목 찾기
  const getBookTitle = useCallback((bookId) => {
    const book = bookList.find((book) => book.booklink === `/${bookId}`);
    return book ? book.title : bookId.replace(/-/g, ' ');
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
              const chapterDisplay = chapter; // 원본 챕터 형식 유지

              headings.forEach((headingData) => {
                flattenedBookmarks.push({
                  id: `${bookId}/${chapter}/${headingData.title}`,
                  title: headingData.title,
                  bookId,
                  chapter: chapterDisplay,
                  chapterNum: chapterNum ? parseInt(chapterNum[0]) : 0,
                  section: section,
                  url: `/${bookId}/${chapter}/${section}`,
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

  // 북마크 존재 여부 체크
  const hasBookmark = useMemo(() => {
    return bookmarks && Object.keys(bookmarks).length > 0;
  }, [bookmarks]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAndSortBookmarks();
    }, 100);

    return () => clearTimeout(timer);
  }, [fetchAndSortBookmarks]);

  // 필터링 및 정렬된 북마크 메모이제이션
  const filteredBookmarks = useMemo(() => {
    let filtered =
      selectedBook === 'all'
        ? sortedBookmarks
        : sortedBookmarks.filter(
            (bookmark) => bookmark.bookId === selectedBook,
          );

    // 정렬 적용
    return filtered.sort((a, b) => {
      if (sortBy === 'timestamp') {
        return new Date(b.timestamp) - new Date(a.timestamp);
      } else {
        // 챕터 순 정렬
        // 책 제목으로 먼저 정렬 (가나다순)
        const bookTitleA = getBookTitle(a.bookId);
        const bookTitleB = getBookTitle(b.bookId);
        const bookCompare = bookTitleA.localeCompare(bookTitleB, 'ko');
        if (bookCompare !== 0) return bookCompare;

        // 같은 책 내에서는 챕터 번호로 정렬
        const chapterCompare = a.chapterNum - b.chapterNum;
        if (chapterCompare !== 0) return chapterCompare;

        // 같은 챕터 내에서는 section으로 정렬
        const sectionCompare = a.section.localeCompare(b.section, 'ko');
        if (sectionCompare !== 0) return sectionCompare;

        // 같은 section 내에서는 title로 정렬
        return a.title.localeCompare(b.title, 'ko');
      }
    });
  }, [selectedBook, sortedBookmarks, sortBy, getBookTitle]);

  // 북마크 토글 함수 (추가/삭제)
  const toggleBookmark = useCallback(
    (bookmark) => {
      try {
        const { bookId, chapter, section, title, timestamp } = bookmark;
        const bookmarkId = `${bookId}/${chapter}/${title}`;
        const storedBookmarks = localStorage.getItem('bookmarks');
        const bookmarks = storedBookmarks ? JSON.parse(storedBookmarks) : {};

        // 현재 토글 상태 확인
        const isCurrentlyToggled = toggledBookmarks.has(bookmarkId);

        if (!isCurrentlyToggled) {
          // 북마크 삭제 (로컬스토리지에서)
          if (bookmarks[bookId]?.[chapter]?.[section]) {
            bookmarks[bookId][chapter][section] = bookmarks[bookId][chapter][
              section
            ].filter((item) => item.title !== title);

            // 빈 배열이면 해당 섹션 삭제
            if (bookmarks[bookId][chapter][section].length === 0) {
              delete bookmarks[bookId][chapter][section];
            }

            // 빈 객체면 해당 챕터 삭제
            if (Object.keys(bookmarks[bookId][chapter]).length === 0) {
              delete bookmarks[bookId][chapter];
            }

            // 빈 객체면 해당 책 삭제
            if (Object.keys(bookmarks[bookId]).length === 0) {
              delete bookmarks[bookId];
            }
          }

          // 토글 상태 추가
          setToggledBookmarks((prev) => new Set([...prev, bookmarkId]));
        } else {
          // 북마크 다시 추가 (로컬스토리지에)
          if (!bookmarks[bookId]) {
            bookmarks[bookId] = {};
          }
          if (!bookmarks[bookId][chapter]) {
            bookmarks[bookId][chapter] = {};
          }
          if (!bookmarks[bookId][chapter][section]) {
            bookmarks[bookId][chapter][section] = [];
          }

          // 중복 체크
          const existingBookmark = bookmarks[bookId][chapter][section].find(
            (item) => item.title === title,
          );

          if (!existingBookmark) {
            bookmarks[bookId][chapter][section].push({
              title,
              timestamp: new Date().toISOString(), // 새로운 timestamp 생성
            });
          }

          // 토글 상태 제거
          setToggledBookmarks((prev) => {
            const newSet = new Set(prev);
            newSet.delete(bookmarkId);
            return newSet;
          });
        }

        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      } catch (error) {
        console.error('북마크 처리 중 오류가 발생했습니다:', error);
      }
    },
    [toggledBookmarks],
  );

  // 북마크 삭제 함수 (기존 함수 - 새로고침용)
  const removeBookmark = useCallback(
    (bookmarkId) => {
      fetchAndSortBookmarks(); // 북마크 목록 새로고침
    },
    [fetchAndSortBookmarks],
  );

  // 북마크 추가 함수 (기존 함수)
  const addBookmark = useCallback(
    (bookmarkData) => {
      try {
        const { bookId, chapter, section, title, timestamp } = bookmarkData;
        const updatedBookmarks = { ...bookmarks };

        // 북마크 데이터 구조 초기화
        if (!updatedBookmarks[bookId]) {
          updatedBookmarks[bookId] = {};
        }
        if (!updatedBookmarks[bookId][chapter]) {
          updatedBookmarks[bookId][chapter] = {};
        }
        if (!updatedBookmarks[bookId][chapter][section]) {
          updatedBookmarks[bookId][chapter][section] = [];
        }

        // 중복 체크
        const existingBookmark = updatedBookmarks[bookId][chapter][
          section
        ].find((bookmark) => bookmark.title === title);

        if (existingBookmark) {
          throw new Error('이미 추가된 북마크입니다.');
        }

        // 북마크 추가
        updatedBookmarks[bookId][chapter][section].push({
          title,
          timestamp,
        });

        localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
        fetchAndSortBookmarks(); // 북마크 목록 새로고침
      } catch (error) {
        console.error('Error adding bookmark:', error);
        throw error;
      }
    },
    [bookmarks, fetchAndSortBookmarks],
  );

  const handleFilterChange = useCallback((bookId) => {
    setSelectedBook(bookId);
  }, []);

  const handleSortChange = useCallback((newSortBy) => {
    setSortBy(newSortBy);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {windowWidth <= 1024 && hasBookmark ? (
        <BookmarkAsideMobile
          onFilterChange={handleFilterChange}
          selectedBook={selectedBook}
          bookList={Object.keys(bookmarks || {})}
        />
      ) : null}
      <main className={styles.main}>
        <div className={styles.main__inner}>
          <div className={styles.inner__content}>
            <div className={classNames(styles.title)}>
              <strong>
                {selectedBook === 'all'
                  ? '전체 북마크'
                  : getBookTitle(selectedBook)}
              </strong>
              <span
                className={styles.length}
              >{`${filteredBookmarks.length}건`}</span>
            </div>
            <div className={styles.sortButtons}>
              <button
                className={classNames(styles.sortButton, {
                  [styles.active]: sortBy === 'timestamp',
                })}
                onClick={() => handleSortChange('timestamp')}
              >
                등록순
              </button>
              <button
                className={classNames(styles.sortButton, {
                  [styles.active]: sortBy === 'chapter',
                })}
                onClick={() => handleSortChange('chapter')}
              >
                챕터순
              </button>
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
                  <BookmarkItem
                    key={idx}
                    bookmark={bookmark}
                    getBookTitle={getBookTitle}
                    createUrlHash={createUrlHash}
                    onToggle={toggleBookmark}
                    isToggled={toggledBookmarks.has(
                      `${bookmark.bookId}/${bookmark.chapter}/${bookmark.title}`,
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {windowWidth > 1024 && hasBookmark ? (
          <BookmarkAsidePC
            onFilterChange={handleFilterChange}
            selectedBook={selectedBook}
            bookList={Object.keys(bookmarks || {})}
          />
        ) : null}
      </main>
    </>
  );
}
