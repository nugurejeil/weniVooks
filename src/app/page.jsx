'use client';
import { useState } from 'react';

import Footer from '@/components/layouts/footer/Footer';
import Banner from '@/components/banner/Banner';
import BookList from '@/components/book/BookList';
import Header from '@/components/layouts/header/Header';
import BtnTop from '@/components/common/button/BtnTop';
import FilterNav from '@/components/common/nav/FilterNav';
import BookSearchForm from '@/components/search/BookSearchForm';

export default function Home() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  // 필터 옵션 정의
  const filterOptions = [
    { value: 'all', text: '전체' },
    { value: 'solid', text: '견고한 시리즈' },
    { value: 'basecamp', text: '베이스캠프 시리즈' },
    { value: 'essentials', text: '에센셜 시리즈' },
    { value: 'etc', text: '기타' },
  ];

  const handleFilterChange = (option) => {
    setSelectedFilter(option.value);
  };

  return (
    <>
      <Header type="intro" />
      <div className="layout-grow">
        <Banner />
        <div className="max-w-[1200px] mx-auto px-5">
          <BookSearchForm />
          <FilterNav
            options={filterOptions}
            selectedValue={selectedFilter}
            onSelect={handleFilterChange}
          />
        </div>
        <BookList selectedFilter={selectedFilter}/>
      </div>
      <Footer intro={true} />
      <BtnTop />
    </>
  );
}


