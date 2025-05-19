'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../search/search.module.scss';
import classNames from 'classnames';
import SVGAlertCircle from '@/components/svg/SVGAlertCircle';
import useWindowSize from '@/utils/useWindowSize';
import BookSearchForm from '@/components/search/BookSearchForm';
import Loading from '../loading';
import bookData from '@/data/bookList.json';

// 검색키워드와 일치하는 문자열 하이라이팅
function highlightKeyword(text, keyword) {
  if (!text || !keyword) return text;

  const regExp = new RegExp(`(${keyword})`, 'i');
  return text.split(regExp).map((part, idx) => {
    if (part.toLowerCase() === keyword.toLowerCase()) {
      return (
        <span className={classNames(styles.keyword)} key={idx}>
          {part}
        </span>
      );
    }
    return part;
  });
}

export default function BookSearch() {
  const params = useSearchParams();
  const searchQuery = params.get('keyword')?.trim();
  const [searchResults, setSearchResults] = useState(null);
  const { windowWidth } = useWindowSize();

  useEffect(() => {
    if (searchQuery) {
      // 책 제목 검색 로직
      const results = bookData.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setTimeout(() => {
        setSearchResults(results);
      }, 300);
    } else {
      setTimeout(() => {
        setSearchResults([]);
      }, 300);
    }
  }, [searchQuery]);

  return (
    <>
      {searchResults ? (
        <>
          <div className={classNames(styles.wrapper)}>
            <div className={classNames(styles.innerLayout)}>
              {windowWidth < 640 ? (
                <div className={styles.searchForm}>
                  <BookSearchForm />
                </div>
              ) : null}
              <div className={classNames(styles.title)}>
                <strong>{searchQuery ? searchQuery : '검색어 없음'}</strong>
                <span>검색 결과: {searchResults.length}건</span>
              </div>
              {searchResults.length === 0 ? (
                <div className={styles.notFound}>
                  <SVGAlertCircle size={windowWidth < 640 ? 80 : 100} />
                  <p>
                    <span>검색 결과가 없습니다.</span>
                    <span>다른 검색어를 입력해 주세요.</span>
                  </p>
                </div>
              ) : (
                <ul>
                  {searchResults.map((book, idx) => (
                    <li key={idx} className={classNames(styles.resultSection)}>
                      <Link href={book.booklink || '#'}>
                        <p className={classNames(styles.subTitle)}>
                          {highlightKeyword(book.title, searchQuery)}
                        </p>
                        {book.description && (
                          <div className={classNames(styles.contents)}>
                            <span className={styles.contentLine}>
                              {book.description}
                            </span>
                          </div>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
} 