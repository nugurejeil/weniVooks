'use client';

import React from 'react';
import CopyButton from '../../pages/CopyButton';
import PrintButton from '../../pages/PrintButton';
import RepoButton from '../../pages/RepoButton';

export default function ButtonGroup({ title, markdownContent }) {
  return (
    <div className="button-group">
      <PrintButton />
      <CopyButton title={title} markdownContent={markdownContent} />
      <RepoButton />
    </div>
  );
}
