'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { LEGAL_CARDNEWS } from '@/data/legal';
import { HUB_COPY } from '@/data/legalHub';
import { useModal } from '@/lib/useModal';
import { LgIcon } from './icons';
import CardNewsFace from './CardNewsFace';

const R = HUB_COPY.resources;

/**
 * 카드뉴스 확대 보기 (legal-B upgrade-02 LB32, TECHSPEC §5-4).
 * useModal 재사용: 포커스 트랩·ESC·배경 스크롤 잠금·닫힘 후 연 버튼으로 포커스 복귀.
 * index 는 부모(CardNewsStory) 것을 그대로 쓴다 — 여기서 넘긴 장이 닫은 뒤 뷰어에도 반영된다. 좌우 방향키로 이동.
 */
export default function CardNewsLightbox({ index, onIndex, onClose }: { index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const ref = useModal(true, onClose);
  const n = LEGAL_CARDNEWS.length;
  const c = LEGAL_CARDNEWS[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && index > 0) { e.preventDefault(); onIndex(index - 1); }
      if (e.key === 'ArrowRight' && index < n - 1) { e.preventDefault(); onIndex(index + 1); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [index, n, onIndex]);

  return createPortal(
    <>
      <div className="lg-lb-dim" onClick={onClose} aria-hidden="true" />
      <div className="lg-lb" ref={ref} role="dialog" aria-modal="true" aria-label={R.cardNewsLabel}>
        <button type="button" className="lg-lb-close" onClick={onClose} aria-label={R.close} data-autofocus><LgIcon name="x" size={18} /></button>
        <figure className="lg-lb-fig">
          <span key={index} className="lg-lb-img"><CardNewsFace item={c} eager sizes="min(100vw - 32px, 528px)" /></span>
          <figcaption className="lg-lb-cap">{c.title.join(' ')}</figcaption>
        </figure>
        <div className="lg-cn-ctrl lg-lb-ctrl">
          <button type="button" className="lg-cn-btn" onClick={() => onIndex(index - 1)} disabled={index === 0} aria-label={R.prev} data-ga-id="legal_cardnews_nav"><LgIcon name="chevron-left" size={18} /></button>
          <span className="lg-cn-count" aria-live="polite">{R.counter(index + 1, n)}</span>
          <button type="button" className="lg-cn-btn" onClick={() => onIndex(index + 1)} disabled={index === n - 1} aria-label={R.next} data-ga-id="legal_cardnews_nav"><LgIcon name="chevron-right" size={18} /></button>
        </div>
      </div>
    </>,
    document.body,
  );
}
