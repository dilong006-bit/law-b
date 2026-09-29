'use client';

import { useEffect, useRef, useState } from 'react';
import { INTEGRITY_COPY as C } from '@/data/integrity';

// 아이콘: 모달 기존 방식(인라인 SVG, stroke 1.8, .pvi-sm 16px)을 따른다. 형태는 Lucide ban / circle-check / arrow-right
const IcBan = () => (
  <svg className="pvi-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></svg>
);
const IcCheck = () => (
  <svg className="pvi-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10"/><path d="m16 9-5.5 5.5L8 12"/></svg>
);
const IcArrow = () => (
  <svg className="pvi-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
);

/**
 * 청렴훈련 캠페인 탭 (ref/integrity TECHSPEC §5, IC2·IC3·IC5). 부정훈련 모달 첫 탭.
 * 비주얼 카드(picture webp + png, 730×328 지정 → CLS 0, 확대 없음) → 태그·제목·핵심 문구·대비 칩·함께 문구 → 신고 연결.
 * 이미지 실패 시 이미지를 숨기고 같은 비율(730/328) --surface 면만 남긴다(캡션 유지).
 */
export default function IntegrityCampaignTab({ onReport }: { onReport: () => void }) {
  const V = C.visual;
  const [failed, setFailed] = useState(false);
  const img = useRef<HTMLImageElement | null>(null);
  // 하이드레이션 전에 실패한 이미지는 onError 가 오지 않는다 → 마운트 시 한 번 확인
  useEffect(() => {
    const el = img.current;
    if (el && el.complete && el.naturalWidth === 0 && el.currentSrc) setFailed(true);
  }, []);

  return (
    <>
      <figure className="ic-visual" data-failed={failed ? 'true' : undefined}>
        {failed ? (
          <span className="ic-ph" aria-hidden="true" />
        ) : (
          <picture>
            <source type="image/webp" srcSet={V.webp} />
            <img ref={img} src={V.png} width={V.width} height={V.height} alt={V.alt} loading="lazy" decoding="async" onError={() => setFailed(true)} />
          </picture>
        )}
        <figcaption className="ic-caption">{V.caption}</figcaption>
      </figure>
      <div className="ic-body">
        <p className="ic-tag">{C.tag}</p>
        <h4 className="ic-title">{C.title}</h4>
        <p className="ic-lead">{C.lead}</p>
        <ul className="ic-pair">
          <li className="ic-chip is-no"><IcBan />{C.pair.no}</li>
          <li className="ic-chip is-yes"><IcCheck />{C.pair.yes}</li>
        </ul>
        <p className="ic-credit">{C.credit}</p>
      </div>
      <div className="ic-report">
        <p>{C.report.q}</p>
        <button className="btn btn-line-dark" type="button" onClick={onReport}>{C.report.cta}<IcArrow /></button>
      </div>
    </>
  );
}
