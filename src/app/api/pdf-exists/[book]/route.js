import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(_request, { params }) {
  const bookName = params.book;
  const filename = `${bookName}.pdf`;

  // 로컬: public/pdf/, 서버: /opt/bitnami/apache/htdocs/pdf/
  const localPath = path.join(process.cwd(), 'public', 'pdf', filename);
  const serverPath = `/opt/bitnami/apache/htdocs/pdf/${filename}`;

  const exists = fs.existsSync(localPath) || fs.existsSync(serverPath);

  return NextResponse.json({ exists });
}
