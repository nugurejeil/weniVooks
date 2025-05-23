'use client';
import { useState, useEffect } from 'react';
import BtnIcon from '@/components/common/button/BtnIcon';
import styles from './BookSearchForm.module.scss';
import SVGSearch from '@/components/svg/SVGSearch';

export default function BookSearchForm({ onSearchChange }) {
  const [searchValue, setSearchValue] = useState('');

  // 디바운스를 위한 useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, onSearchChange]);

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 폼 제출 시에도 즉시 검색 실행
    onSearchChange(searchValue);
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
        value={searchValue}
        onChange={handleInputChange}
        autoComplete="off"
      />

      <BtnIcon type="submit" className={styles.btnSearch} bordernone="true">
        <SVGSearch color="grayLv4" />
        <span className="a11y-hidden">검색</span>
      </BtnIcon>
    </form>
  );
}