import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const bookName = params.book;
  const pdfPath = path.join(process.cwd(), 'public', 'pdf', `${bookName}.pdf`);
  const exists = fs.existsSync(pdfPath);

  return NextResponse.json({ exists });
}
