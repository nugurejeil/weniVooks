import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  const book = params.book;

  // .pdf 확장자가 없으면 추가
  const filename = book.endsWith('.pdf') ? book : `${book}.pdf`;
  const pdfPath = path.join(process.cwd(), 'public', 'pdf', filename);

  // 파일 존재 확인
  if (!fs.existsSync(pdfPath)) {
    return NextResponse.json(
      { error: 'PDF not found', book: filename },
      { status: 404 }
    );
  }

  // 파일 읽기
  const file = fs.readFileSync(pdfPath);

  // PDF 응답
  return new NextResponse(file, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename}"`,
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
