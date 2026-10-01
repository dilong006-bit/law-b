'use client';

import { useEffect, useRef, useState } from 'react';
import Img from '@/components/common/Img';
import { isUnsplash, unsplashSrcSet, unsplashUrl, type FocalPoint } from '@/lib/legal/unsplash';

/**
 * 허브 사진 공용 (legal-B upgrade-02 LB39, TECHSPEC §4-2). 기존 Img 에 선택 prop(srcSet·sizes·onFail) 으로 재사용.
 * - Unsplash 면 1080 폭 기본 + srcset(640/1080/1600/2000), 로컬이면 그대로
 * - 컨테이너 aspect-ratio 로 공간 선점(CLS 0). ratio 가 없으면 부모 크기를 채운다(cover)
 * - 로드 실패: 이미지를 숨기고 컨테이너 --surface 면만 남김, data-failed, onFail 콜백
 */
export default function LgPhoto({ src, alt = '', ratio, sizes, eager = false, className, onFail, fp, widths }: {
  src: string; alt?: string; ratio?: readonly [number, number]; sizes?: string; eager?: boolean; className?: string; onFail?: () => void;
  /** 초점 크롭 (카드뉴스). 없으면 기존 가운데 크롭 */
  fp?: FocalPoint;
  /** srcset 폭 목록. 없으면 640/1080/1600/2000 */
  widths?: readonly number[];
}) {
  const [failed, setFailed] = useState(false);
  const box = useRef<HTMLDivElement | null>(null);
  const un = isUnsplash(src);
  const fail = () => { setFailed(true); onFail?.(); };
  // 서버 렌더 이미지가 하이드레이션 전에 실패하면 React onError 가 오지 않는다 → 마운트 시 한 번 확인
  useEffect(() => {
    const img = box.current?.querySelector('img');
    if (img && img.complete && img.naturalWidth === 0) { img.style.display = 'none'; fail(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div
      ref={box}
      className={`lg-photo${className ? ' ' + className : ''}`}
      style={ratio ? { aspectRatio: `${ratio[0]} / ${ratio[1]}` } : undefined}
      data-failed={failed ? 'true' : undefined}
    >
      <Img
        src={un ? unsplashUrl(src, 1080, ratio, fp) : src}
        srcSet={un ? unsplashSrcSet(src, ratio, widths, fp) : undefined}
        sizes={un ? sizes : undefined}
        alt={alt}
        eager={eager}
        onFail={fail}
      />
    </div>
  );
}
