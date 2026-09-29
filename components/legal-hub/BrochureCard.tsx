'use client';

import { useContentModal } from '@/components/sections/content/ContentModals';
import { HUB_COPY } from '@/data/legalHub';
import { CONSULT_HASH, goConsult } from '@/lib/legal/goConsult';
import { usePick } from '@/lib/legal/pick';
import { LgIcon } from './icons';
import LgPhoto from './LgPhoto';

const B = HUB_COPY.resources.brochure;

/**
 * 과정소개서 컴팩트 카드 (legal-B upgrade-02 LB33, TECHSPEC §6). 자료 블록 유일 1차 버튼.
 * 게이트 모달·자동 채움·성공 화면 후속 링크는 기존 ContentModals 옵션(onLeadSubmitted, next) 재사용.
 * 표지는 소개서 PDF 1쪽 렌더(가로 16:9 원본 비율 그대로).
 */
export default function BrochureCard() {
  const { openDownload } = useContentModal();
  const { setPrefill } = usePick();
  const open = () =>
    openDownload('legalBrochure', {
      onLeadSubmitted: (lead) => setPrefill(lead),
      next: { label: B.next, href: CONSULT_HASH, go: goConsult },
    });
  return (
    <article className="lg-box lg-brochure">
      <LgPhoto className="lg-brochure-cover" src={B.cover.src} alt={B.cover.alt} ratio={[16, 9]} />
      <div className="lg-brochure-body">
        <p className="lg-brochure-title">{B.title}</p>
        <ul className="lg-brochure-inc">
          {B.includes.map((t) => <li key={t}><LgIcon name="check" size={16} /> {t}</li>)}
        </ul>
        <p className="lg-brochure-meta"><LgIcon name="file-text" size={16} /> {B.meta}</p>
        <div className="lg-box-foot">
          <button type="button" className="btn btn-ink lg-brochure-cta" onClick={open} data-ga-id="legal_brochure_open">
            <LgIcon name="download" size={18} /> {B.cta}
          </button>
        </div>
      </div>
    </article>
  );
}
