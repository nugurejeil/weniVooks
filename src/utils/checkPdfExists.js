import fs from 'fs';
import path from 'path';

// PDF 파일 존재 여부 확인 (서버 컴포넌트에서만 사용)
export function checkPdfExists(bookName) {
  const pdfPath = path.join(process.cwd(), 'public', 'pdf', `${bookName}.pdf`);
  return fs.existsSync(pdfPath);
}
