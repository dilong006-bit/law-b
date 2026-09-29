'use client';

import LegalCardNews from '@/components/legal/LegalCardNews';
import { useContentModal } from '@/components/sections/content/ContentModals';
import { LEGAL_CARDNEWS } from '@/data/legal';
import { HUB_COPY } from '@/data/legalHub';
import { usePick } from '@/lib/legal/pick';

const R = HUB_COPY.resources;

/**
 * 자료 (legal-B LB11). 좌 카드뉴스(자동 넘김 없음, 재제작본 전 자리 표시) / 우 과정소개서.
 * 소개서는 기존 라이트 게이트(ContentModals) 재사용 — 제출 성공 시 입력값을 선택 상태의 prefill 로 저장하고,
 * 성공 화면의 '담은 과정으로 도입 문의하기' 는 #mandatory-inquiry 로 보낸다.
 */
export default function Resources() {
  const { openDownload } = useContentModal();
  const { setPrefill } = usePick();

  const openBrochure = () =>
    openDownload('legalBrochure', {
      onLeadSubmitted: (lead) => setPrefill(lead),
      next: { label: R.brochure.next, href: '#mandatory-inquiry' },
    });

  return (
    <div className="lg-block lg-anchor" id={R.id}>
      <h3 className="substep">{R.title}</h3>
      <div className="lg-res">
        <LegalCardNews slides={LEGAL_CARDNEWS} autoplay={false} />
        <div className="lg-bro">
          <h4>{R.brochure.title}</h4>
          <p>{R.brochure.desc}</p>
          <button type="button" className="btn btn-ink lg-bro-cta" onClick={openBrochure}>
            {R.brochure.cta}
            <svg className="btn-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v12M7 11l5 5 5-5M4 20h16" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
