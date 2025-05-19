import SVGBookmark from '@/components/svg/SVGBookmark';
import SVGBookmarkFill from '@/components/svg/SVGBookmarkFill';

export default function BookmarkIcon({ isFilled = false }) {
  return (
    <>
      {isFilled ? (
        <SVGBookmarkFill color="var(--primary)" />
      ) : (
        <SVGBookmark color="var(--grayLv3A11y)" />
      )}
    </>
  );
}
