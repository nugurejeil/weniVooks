import React from 'react';
import styles from './BtnBookmark.module.scss';
import BtnIcon from './BtnIcon';
import SVGBookmark from '@/components/svg/SVGBookmark';

export default function BtnBookmark() {
  return (
    <div className={styles.standard}>
      <BtnIcon
        className={styles.bookmarkLink}
        href="/bookmark"
        bordernone="true"
        id="settingBtn"
      >
        <SVGBookmark />
        <span className="a11y-hidden">북마크 이동</span>
      </BtnIcon>
    </div>
  );
}
