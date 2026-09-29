'use client';

/**
 * Unsplash 슬롯 이미지 — 원본 onerror='this.style.display=none' 폴백.
 * 선택 prop(legal-B upgrade-02 D11): srcSet·sizes(폭별 해상도), onFail(실패 알림). 미지정이면 기존 렌더·동작과 같다.
 */
export default function Img({
  className,
  src,
  alt = '',
  eager = false,
  srcSet,
  sizes,
  onFail,
}: {
  className?: string;
  src: string;
  alt?: string;
  eager?: boolean;
  srcSet?: string;
  sizes?: string;
  onFail?: () => void;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).style.display = 'none';
        onFail?.();
      }}
    />
  );
}
