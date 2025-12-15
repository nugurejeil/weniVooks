import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// GET 요청 - PDF 다운로드
export async function GET(request, { params }) {
  const book = params.book;
  const filename = book.endsWith('.pdf') ? book : `${book}.pdf`;

  // 로컬: public/pdf/, 서버: /opt/bitnami/apache/htdocs/pdf/
  const localPath = path.join(process.cwd(), 'public', 'pdf', filename);
  const serverPath = `/opt/bitnami/apache/htdocs/pdf/${filename}`;

  const pdfPath = fs.existsSync(localPath) ? localPath : serverPath;

  if (!fs.existsSync(pdfPath)) {
    return NextResponse.json(
      { error: 'PDF not found', book: filename },
      { status: 404 }
    );
  }

  const file = fs.readFileSync(pdfPath);

  return new NextResponse(file, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
