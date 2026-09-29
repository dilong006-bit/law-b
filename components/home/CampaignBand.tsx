import Link from 'next/link';
import Img from '@/components/common/Img';
import { courseById, type LegalCourseId } from '@/data/legal';
import { HUB_COPY } from '@/data/legalHub';

/** 카드뉴스 재제작본 수령 전 대체 시각 요소 — 과정 썸네일 2×2 (legal-B §5-2) */
const MOSAIC: LegalCourseId[] = ['harassment', 'sexual', 'disability', 'privacy'];

/**
 * 홈 캠페인 밴드 (legal-B LB2). 히어로 바로 아래, 인트로 위.
 * 핵심 메시지(배지·제목·설명·CTA)는 시각 요소 밖 텍스트로 항상 노출한다.
 * 시즌 종료(LEGAL_SEASON.on=false)면 app/page.tsx 에서 밴드 자체를 렌더하지 않는다(기존 홈과 동일).
 */
export default function CampaignBand() {
  const L = HUB_COPY.campaign.legal;
  const K = HUB_COPY.campaign.kium;
  return (
    <section className="section hc-band" aria-label="캠페인">
      <div className="wrap">
        <div className="hc-grid">
          <article className="hc-card hc-legal r">
            <div className="hc-copy">
              <span className="hc-badge">{L.badge}</span>
              <h2 className="hc-title">{L.title}</h2>
              <p className="hc-desc">{L.desc}</p>
              <div className="hc-acts">
                <Link className="btn btn-ink" href={L.cta.href} data-ga-id="home-campaign-legal">
                  {L.cta.label}
                  <svg className="btn-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </Link>
                <Link className="hc-link" href={L.sub.href} data-ga-id="home-campaign-legal-brochure">{L.sub.label}</Link>
              </div>
            </div>
            <div className="hc-visual" aria-hidden="true">
              {MOSAIC.map((id) => (
                <div className="hc-tile" key={id}>
                  <Img src={courseById(id)!.thumb} />
                </div>
              ))}
            </div>
          </article>
          <article className="hc-card hc-kium r">
            <h2 className="hc-title">{K.title}</h2>
            <p className="hc-desc">{K.desc}</p>
            <div className="hc-acts">
              <Link className="btn btn-line-dark" href={K.cta.href} data-ga-id="home-campaign-kium">{K.cta.label}</Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
