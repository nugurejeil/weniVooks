'use client';

import { useMemo } from 'react';
import BookItem from './BookItem';
import styles from './BookList.module.scss';
import bookFile from '@/data/bookList.json';

export default function BookList({ selectedFilter, searchQuery = '' }) {
  
  const filteredAndSortedBooks = useMemo(() => {
    
    // 1. 날짜순 정렬
    let sortedBooks = [...bookFile].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // 2. 검색어 필터링 (검색어가 있을 경우 우선 적용)
    if (searchQuery.trim()) {
      sortedBooks = sortedBooks.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // 3. 카테고리 필터링 적용
    if (selectedFilter === 'all') {
      return sortedBooks;
    }

    const categoryFiltered = sortedBooks.filter(book => {
      switch (selectedFilter) {
        case 'solid':
          return book.title.includes('견고한');
        case 'basecamp':
          return book.title.includes('베이스캠프');
        case 'essentials':
          return book.title.includes('에센셜');
        case 'etc':
          return !book.title.includes('견고한') && 
                 !book.title.includes('베이스캠프') && 
                 !book.title.includes('에센셜');
        default:
          return true;
      }
    });
    
    return categoryFiltered;
  }, [selectedFilter, searchQuery]);

  return (
    <div className={styles.bookListContainer}>
      {/* 검색 결과 표시 */}
      {searchQuery.trim() && (
        <div className={styles.searchInfo}>
          <span className={styles.searchTerm}>'{searchQuery}'</span>
          <span className={styles.resultCount}>검색 결과: {filteredAndSortedBooks.length}건</span>
        </div>
      )}
      
      {/* 검색 결과가 없을 때 */}
      {searchQuery.trim() && filteredAndSortedBooks.length === 0 && (
        <div className={styles.noResults}>
          <p>검색 결과가 없습니다.</p>
          <p>다른 검색어를 입력해 주세요.</p>
        </div>
      )}
      
      {/* 책 목록 */}
      <ul className={styles.bookList}>
        {filteredAndSortedBooks.map((book, index) => (
          <li key={index}>
            <BookItem 
              data={book} 
              searchQuery={searchQuery} // 검색어를 BookItem에 전달 (하이라이팅용)
            />
          </li>
        ))}
      </ul>
    </div>
  );
}