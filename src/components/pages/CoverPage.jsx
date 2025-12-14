'use client';

import Image from 'next/image';
import PdfDownloadButton from './PdfDownloadButton';
import { useBook } from '@/context/BookContext';

export default function CoverPage({ TITLE, COVER }) {
  const { bookName, hasPdf } = useBook();

  return (
    <div className="content__wrap">
      <main className="main">
        <h3 className="title">{TITLE}</h3>
        <Image
          src={COVER}
          alt=""
          className="cover"
          width={658}
          height={800}
          priority={true}
        />
        {hasPdf && (
          <div style={{ textAlign: 'center' }}>
            <PdfDownloadButton bookName={bookName} variant="cover" />
          </div>
        )}
      </main>
    </div>
  );
}
