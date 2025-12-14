'use client';

import React from 'react';
import Tooltip from '../common/tooltip/Tooltip';

export default function PdfDownloadButton({ bookName, variant = 'default' }) {
  const pdfUrl = `/pdf/${bookName}`;
  const filename = `${bookName}.pdf`;

  const icon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
      />
    </svg>
  );

  // 커버 페이지용 큰 버튼
  if (variant === 'cover') {
    return (
      <a href={pdfUrl} download={filename} className="pdf-download-button--cover">
        {icon}
        <span>PDF 다운로드</span>
      </a>
    );
  }

  // 사이드바용 작은 버튼 (기본)
  return (
    <Tooltip text="PDF 다운로드">
      <a href={pdfUrl} download={filename} className="pdf-download-button">
        {icon}
        <span className="sr-only">PDF 다운로드</span>
      </a>
    </Tooltip>
  );
}
