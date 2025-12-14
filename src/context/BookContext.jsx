'use client';

import { createContext, useContext } from 'react';

const BookContext = createContext({
  bookName: '',
  hasPdf: false,
});

export function BookProvider({ children, bookName, hasPdf }) {
  return (
    <BookContext.Provider value={{ bookName, hasPdf }}>
      {children}
    </BookContext.Provider>
  );
}

export function useBook() {
  return useContext(BookContext);
}
