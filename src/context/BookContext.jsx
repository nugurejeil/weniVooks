'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const BookContext = createContext({
  bookName: '',
  hasPdf: false,
});

export function BookProvider({ children, bookName }) {
  const [hasPdf, setHasPdf] = useState(false);

  useEffect(() => {
    // 서버 API를 통해 PDF 존재 여부 확인
    if (bookName) {
      fetch(`/api/pdf-exists/${bookName}`)
        .then((res) => res.json())
        .then((data) => {
          setHasPdf(data.exists);
        })
        .catch(() => {
          setHasPdf(false);
        });
    }
  }, [bookName]);

  return (
    <BookContext.Provider value={{ bookName, hasPdf }}>
      {children}
    </BookContext.Provider>
  );
}

export function useBook() {
  return useContext(BookContext);
}
