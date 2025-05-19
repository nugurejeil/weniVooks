import { useEffect, useState } from 'react';

import styles from './AsidePC.module.scss';

// component
import BtnIcon from '@/components/common/button/BtnIcon';
import Toc from './Toc';
import SVGListClose from '@/components/svg/SVGListClose';
import SubBanner from './SubBanner';
import useWindowSize from '@/utils/useWindowSize';
import SVGList from '@/components/svg/SVGList';

export default function BookmarkAsidePC() {
  const { windowHeight } = useWindowSize();
  const [isMenuShow, setIsMenuShow] = useState(true);

  useEffect(() => {
    const savedTocOpen = localStorage.getItem('toc') === 'false' ? false : true;
    setIsMenuShow(savedTocOpen);
  }, []);

  const toggleMenu = () => {
    if (isMenuShow) {
      // 닫힘
      setIsMenuShow(false);
      localStorage.setItem('toc', false);
    } else {
      // 열림
      setIsMenuShow(true);
      localStorage.removeItem('toc', false);
    }
  };

  if (windowHeight > 640) {
    return isMenuShow ? (
      <aside className={`${styles.aside} ${styles.show}`}>
        <div className={styles.sublist}>
          <h3>책 목록</h3>
          <Toc />

          <BtnIcon
            className={`${styles.btnClose}`}
            onClick={toggleMenu}
            bordernone="true"
          >
            <SVGListClose color="grayLv3" />
            <span className="a11y-hidden">책 목록 메뉴 접기</span>
          </BtnIcon>
        </div>
        <SubBanner />
      </aside>
    ) : (
      <aside className={`${styles.aside} ${styles.hide}`}>
        <BtnIcon className={`${styles.btnOpen}`} onClick={toggleMenu}>
          <SVGList color="grayLv4" />
          <span className="a11y-hidden">책 목록 메뉴 열기</span>
        </BtnIcon>
      </aside>
    );
  }
}
