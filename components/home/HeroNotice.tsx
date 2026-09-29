import Link from 'next/link';

/** 히어로 공지 알약 (legal-B LB1) 계약 — HeroCarousel 의 선택 prop notice 로 받는다 */
export interface HeroNoticeData { label: string; cta: string; href: string; gaId: string }

/**
 * 슬라이드 밖 단일 요소. 6개 슬라이드 전환과 무관하게 같은 자리에 고정된다.
 * 기존 btn-glass 알약 재사용 + P4 점. 560 이하에서는 라벨과 화살표만 남는다(home-campaign.css).
 */
export default function HeroNotice({ notice }: { notice: HeroNoticeData }) {
  return (
    <div className="hc-notice-layer">
      <div className="wrap">
        <Link className="btn btn-glass hc-notice" href={notice.href} data-ga-id={notice.gaId}>
          <span className="hc-dot" aria-hidden="true" />
          <span className="hc-notice-label">{notice.label}</span>
          <span className="hc-notice-sep" aria-hidden="true">·</span>
          <span className="hc-notice-cta">{notice.cta}</span>
          <svg className="hc-notice-arr" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </Link>
      </div>
    </div>
  );
}
