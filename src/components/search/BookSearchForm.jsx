'use client';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import BtnIcon from '@/components/common/button/BtnIcon';
import styles from './BookSearchForm.module.scss';
import SVGSearch from '@/components/svg/SVGSearch';

export default function BookSearchForm() {
  const inputRef = useRef(null);
  const router = useRouter();

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = inputRef.current.value.trim();
    if (value) {
      router.push(`/book-search?keyword=${encodeURIComponent(value)}`);
    }
  };

  return (
    <form
      className={styles.bookSearch}
      onSubmit={handleSubmit}
    >
      <label className="a11y-hidden" htmlFor="book-search">
        책 제목 검색
      </label>
      <input
        id="book-search"
        type="search"
        placeholder="어떤 책을 찾으시나요?"
        name="keyword"
        ref={inputRef}
      />

      <BtnIcon type="submit" className={styles.btnSearch} bordernone="true">
        <SVGSearch color="grayLv4" />
        <span className="a11y-hidden">검색</span>
      </BtnIcon>
    </form>
  );
} 