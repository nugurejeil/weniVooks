import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { NextResponse } from 'next/server';

const MD_BASE_PATH = path.join(process.cwd(), '_md');

/**
 * GET /api/content
 * 
 * Query parameters:
 * - book: 책 이름 (예: basecamp-python, essentials-java)
 * - chapter: 챕터 번호 (예: chapter01, chapter02)
 * - page: 페이지 번호 (예: 01-1, 02-3)
 * - list: true인 경우 전체 책 목록 반환
 * 
 * Examples:
 * - /api/content?list=true (모든 책 목록)
 * - /api/content?book=basecamp-python (특정 책의 챕터 목록)
 * - /api/content?book=basecamp-python&chapter=chapter01 (특정 챕터의 페이지 목록)
 * - /api/content?book=basecamp-python&chapter=chapter01&page=01-1 (특정 페이지 내용)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const book = searchParams.get('book');
    const chapter = searchParams.get('chapter');
    const page = searchParams.get('page');
    const list = searchParams.get('list');

    // 전체 책 목록 반환
    if (list === 'true') {
      const books = await getBookList();
      return NextResponse.json({ books });
    }

    // 책이 지정되지 않은 경우
    if (!book) {
      return NextResponse.json(
        { error: 'Book parameter is required' },
        { status: 400 }
      );
    }

    // 특정 책의 챕터 목록 반환
    if (!chapter) {
      const chapters = await getChapterList(book);
      return NextResponse.json({ book, chapters });
    }

    // 특정 챕터의 페이지 목록 반환
    if (!page) {
      const pages = await getPageList(book, chapter);
      return NextResponse.json({ book, chapter, pages });
    }

    // 특정 페이지의 내용 반환
    const content = await getPageContent(book, chapter, page);
    return NextResponse.json({ book, chapter, page, content });

  } catch (error) {
    console.error('Error in content API:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// 책 목록 가져오기
async function getBookList() {
  const entries = await fs.readdir(MD_BASE_PATH, { withFileTypes: true });
  const books = entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort();
  return books;
}

// 챕터 목록 가져오기
async function getChapterList(book) {
  const bookPath = path.join(MD_BASE_PATH, book);
  
  try {
    const entries = await fs.readdir(bookPath, { withFileTypes: true });
    const chapters = entries
      .filter(entry => entry.isDirectory() && entry.name.startsWith('chapter'))
      .map(entry => entry.name)
      .sort((a, b) => {
        const numA = parseInt(a.replace('chapter', ''));
        const numB = parseInt(b.replace('chapter', ''));
        return numA - numB;
      });
    return chapters;
  } catch (error) {
    throw new Error(`Book '${book}' not found`);
  }
}

// 페이지 목록 가져오기
async function getPageList(book, chapter) {
  const chapterPath = path.join(MD_BASE_PATH, book, chapter);
  
  try {
    const entries = await fs.readdir(chapterPath);
    const pages = entries
      .filter(entry => entry.endsWith('.md'))
      .map(entry => entry.replace('.md', ''))
      .sort();
    return pages;
  } catch (error) {
    throw new Error(`Chapter '${chapter}' not found in book '${book}'`);
  }
}

// 페이지 내용 가져오기
async function getPageContent(book, chapter, page) {
  const pagePath = path.join(MD_BASE_PATH, book, chapter, `${page}.md`);
  
  try {
    const fileContent = await fs.readFile(pagePath, 'utf-8');
    const { data, content } = matter(fileContent);
    
    return {
      frontmatter: data,
      content: content,
      metadata: {
        path: `${book}/${chapter}/${page}`,
        file: `${page}.md`
      }
    };
  } catch (error) {
    throw new Error(`Page '${page}' not found in chapter '${chapter}' of book '${book}'`);
  }
}