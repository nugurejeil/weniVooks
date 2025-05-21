import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import BookmarkIcon from '@/components/common/icons/BookmarkIcon';

export function useHeadingBookmark() {
  useEffect(() => {
    const headings = document.querySelectorAll('h4, h5, h6');

    // Get current page information
    const pathname = window.location.pathname;
    const pathParts = pathname.split('/');
    const book = pathParts[1] || '';
    const chapter = pathParts[2] || '';
    const section = pathParts[3] || '';

    // URL 해시 생성 함수 - 공백을 %20으로 대체
    const createUrlHash = (text) => {
      if (!text) return '';
      // 공백을 %20으로 변환, 특수문자 제거
      return encodeURIComponent(text.toLowerCase());
    };

    // Load bookmarks from localStorage
    const getBookmarks = () => {
      const bookmarks = localStorage.getItem('bookmarks');
      return bookmarks ? JSON.parse(bookmarks) : {};
    };

    // Save bookmark to localStorage
    const saveBookmark = (book, chapter, heading, isBookmarked) => {
      const bookmarks = getBookmarks();

      if (!bookmarks[book]) {
        bookmarks[book] = {};
      }

      if (!bookmarks[book][chapter]) {
        bookmarks[book][chapter] = {};
      }

      if (!bookmarks[book][chapter][section]) {
        bookmarks[book][chapter][section] = [];
      }

      if (isBookmarked) {
        // 해당 섹션의 소제목 리스트에 추가
        const existingBookmark = bookmarks[book][chapter][section].find(
          (item) => item.title === heading,
        );

        if (!existingBookmark) {
          bookmarks[book][chapter][section].push({
            title: heading,
            timestamp: new Date().toISOString(),
          });
        }
      } else {
        // 해당 섹션의 소제목 리스트에서 제거
        const headingIndex = bookmarks[book][chapter][section].findIndex(
          (item) => item.title === heading,
        );

        if (headingIndex !== -1) {
          bookmarks[book][chapter][section].splice(headingIndex, 1);
        }

        // Clean up empty arrays and objects
        if (bookmarks[book][chapter][section].length === 0) {
          delete bookmarks[book][chapter][section];
        }
        if (Object.keys(bookmarks[book][chapter]).length === 0) {
          delete bookmarks[book][chapter];
        }
        if (Object.keys(bookmarks[book]).length === 0) {
          delete bookmarks[book];
        }
      }

      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    };

    // Check if a heading is bookmarked
    const isBookmarked = (book, chapter, heading) => {
      const bookmarks = getBookmarks();
      return (
        bookmarks[book]?.[chapter]?.[section]?.some(
          (item) => item.title === heading,
        ) || false
      );
    };

    headings.forEach((heading) => {
      if (!heading.id) {
        // ID 생성 방식을 encodeURIComponent로 변경
        heading.id = createUrlHash(heading.textContent);
      }

      const headingText = heading.textContent;

      // Insert wrapper for position
      heading.style.position = 'relative';
      heading.style.display = 'flex';
      heading.style.alignItems = 'center';

      // Create bookmark button
      const bookmark = document.createElement('button');
      bookmark.style.cssText = `
        position:absolute;
        top: calc(8rem + 0.8ex); 
        left: -24px;
        cursor: pointer;
        width: 20px;
        height: 20px;
        background: transparent;
        border: none;
        padding: 0;
        outline: none;
        opacity: ${isBookmarked(book, chapter, headingText) ? '1' : '0'};
        transition: opacity 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      bookmark.setAttribute('aria-label', 'Toggle bookmark');
      bookmark.type = 'button';

      // Set initial bookmark state
      const bookmarked = isBookmarked(book, chapter, headingText);

      // Create container for React component
      const iconContainer = document.createElement('div');
      iconContainer.style.cssText = `
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;

        & svg {
          width: 24px;
          height: 24px;
        }
      `;

      // Create React root and render BookmarkIcon
      const root = createRoot(iconContainer);
      root.render(<BookmarkIcon isFilled={bookmarked} />);

      bookmark.appendChild(iconContainer);
      heading.appendChild(bookmark);

      // Toggle bookmark on click
      bookmark.addEventListener('click', () => {
        const newBookmarked = !isBookmarked(book, chapter, headingText);
        saveBookmark(book, chapter, headingText, newBookmarked);
        root.render(<BookmarkIcon isFilled={newBookmarked} />);
        bookmark.style.opacity = newBookmarked ? '1' : '0';
      });

      // Show bookmark button on hover
      heading.addEventListener('mouseenter', () => {
        bookmark.style.opacity = '1';
      });

      heading.addEventListener('mouseleave', () => {
        if (!isBookmarked(book, chapter, headingText)) {
          bookmark.style.opacity = '0';
        }
      });
    });

    return () => {
      // Cleanup React roots
      headings.forEach((heading) => {
        const iconContainer = heading.querySelector('div');
        if (iconContainer) {
          const root = iconContainer._reactRootContainer;
          if (root) {
            root.unmount();
          }
        }
      });
    };
  }, []);
}
