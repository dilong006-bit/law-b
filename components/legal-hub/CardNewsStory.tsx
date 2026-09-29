'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { LEGAL_CARDNEWS } from '@/data/legal';
import { HUB_COPY } from '@/data/legalHub';
import BlockHead from './BlockHead';
import BrochureCard from './BrochureCard';
import CardNewsLightbox from './CardNewsLightbox';
import { LgIcon } from './icons';
import LgPhoto from './LgPhoto';

const R = HUB_COPY.resources;
const N = LEGAL_CARDNEWS.length;

/**
 * 자료 블록: 카드뉴스 스토리 (legal-B upgrade-02 LB32·LB33, TECHSPEC §5).
 * 짝 관계 media-nav: 좌 뷰어(4:5, 높이 결정자) ↔ 우 장별 목차 + 소개서 카드.
 * index 1개로 뷰어·목차·캡션·라이트박스를 동기화. 모든 폭에서 같은 scroll-snap 트랙(881 이상 피크 없음, 880 이하 86% 피크).
 * 자동 넘김 없음, 끝에서 이전·다음 비활성. 사진 실패 장은 확대 비활성(목차는 그대로 동작).
 */
export default function CardNewsStory() {
  const [index, setIndex] = useState(0);
  const [lb, setLb] = useState(false);
  const closeLb = useCallback(() => setLb(false), []); // useModal 이펙트가 렌더마다 재실행되지 않게 참조 고정
  const [failed, setFailed] = useState<boolean[]>(() => LEGAL_CARDNEWS.map(() => false));
  const track = useRef<HTMLUListElement | null>(null);
  const lockUntil = useRef(0);
  const raf = useRef(0);

  const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /** 트랙을 i 번째 슬라이드로 — 프로그램 스크롤 동안은 스크롤 이벤트로 index 를 덮어쓰지 않는다 */
  const scrollToIdx = useCallback((i: number) => {
    const t = track.current; if (!t) return;
    const slides = t.children as HTMLCollectionOf<HTMLElement>;
    const left = slides[i].offsetLeft - slides[0].offsetLeft;
    if (Math.abs(t.scrollLeft - left) < 2) return;
    const rm = reduce();
    lockUntil.current = Date.now() + (rm ? 60 : 650);
    t.scrollTo({ left, behavior: rm ? 'auto' : 'smooth' });
  }, []);

  const go = useCallback((i: number) => {
    const next = Math.max(0, Math.min(N - 1, i));
    setIndex(next);
    scrollToIdx(next);
  }, [scrollToIdx]);

  // 사용자 스와이프·스크롤 → 가장 가까운 슬라이드로 index 동기화
  const onScroll = () => {
    if (Date.now() < lockUntil.current) return;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const t = track.current; if (!t) return;
      const slides = [...t.children] as HTMLElement[];
      const base = slides[0].offsetLeft;
      let best = 0, dist = Infinity;
      slides.forEach((s, k) => { const d = Math.abs(s.offsetLeft - base - t.scrollLeft); if (d < dist) { dist = d; best = k; } });
      setIndex(best);
    });
  };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  // 폭이 바뀌어도(880 경계 등) 현재 장 위치 유지
  useEffect(() => {
    const onResize = () => { const t = track.current; if (!t) return; const s = t.children[index] as HTMLElement; t.scrollLeft = s.offsetLeft - (t.children[0] as HTMLElement).offsetLeft; };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [index]);

  // 목차: 위아래 방향키로 항목 간 포커스 이동 (Should)
  const onTocKey = (e: React.KeyboardEvent<HTMLOListElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const items = [...e.currentTarget.querySelectorAll<HTMLButtonElement>('.lg-toc-item')];
    const at = items.indexOf(document.activeElement as HTMLButtonElement);
    if (at < 0) return;
    e.preventDefault();
    items[(at + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus();
  };

  const cur = LEGAL_CARDNEWS[index];

  return (
    <div className="lg-block lg-anchor" id={R.id}>
      <BlockHead kicker={R.kicker} title={R.title} lead={R.lead} />
      <div className="lg-row lg-story" data-balance-row data-pair="media-nav">
        <div className="lg-c4 lg-story-media" data-height-owner>
          <div className="lg-cn" role="region" aria-roledescription="carousel" aria-label={R.cardNewsLabel}>
            <ul className="lg-cn-track" ref={track} onScroll={onScroll} data-hscroll>
              {LEGAL_CARDNEWS.map((c, k) => (
                <li className="lg-cn-slide" key={c.photo} role="group" aria-roledescription="slide" aria-label={R.counter(k + 1, N)}>
                  <button
                    type="button"
                    className="lg-cn-open"
                    onClick={() => { setIndex(k); setLb(true); }}
                    disabled={failed[k]}
                    tabIndex={k === index ? 0 : -1}
                    aria-label={R.open(k + 1)}
                    data-ga-id="legal_cardnews_open"
                  >
                    <LgPhoto
                      src={c.photo}
                      alt={c.alt}
                      ratio={[4, 5]}
                      sizes="(max-width:880px) 86vw, 367px"
                      onFail={() => setFailed((f) => f.map((v, j) => (j === k ? true : v)))}
                    />
                    {!failed[k] && <span className="lg-cn-zoom" aria-hidden="true"><LgIcon name="maximize-2" size={16} /></span>}
                  </button>
                </li>
              ))}
            </ul>
            <div className="lg-cn-ctrl">
              <button type="button" className="lg-cn-btn" onClick={() => go(index - 1)} disabled={index === 0} aria-label={R.prev} data-ga-id="legal_cardnews_nav"><LgIcon name="chevron-left" size={18} /></button>
              <span className="lg-cn-count">{R.counter(index + 1, N)}</span>
              <button type="button" className="lg-cn-btn" onClick={() => go(index + 1)} disabled={index === N - 1} aria-label={R.next} data-ga-id="legal_cardnews_nav"><LgIcon name="chevron-right" size={18} /></button>
            </div>
          </div>
          {/* 880 이하 캡션: 현재 장 제목 (목차 대신) */}
          <p className="lg-cn-cap" aria-live="polite">{cur.title}</p>
        </div>

        <div className="lg-c8 lg-story-side">
          <h4 className="lg-sub-title lg-toc-h">{R.storyTitle}</h4>
          <ol className="lg-toc" onKeyDown={onTocKey}>
            {LEGAL_CARDNEWS.map((c, k) => (
              <li key={c.photo}>
                <button type="button" className="lg-toc-item" aria-current={k === index ? 'true' : undefined} onClick={() => go(k)} data-ga-id="legal_cardnews_toc">
                  <span className="t">{c.title}</span>
                  <span className="s">{c.summary}</span>
                </button>
              </li>
            ))}
          </ol>
          <BrochureCard />
        </div>
      </div>
      {lb && <CardNewsLightbox index={index} onIndex={go} onClose={closeLb} />}
    </div>
  );
}
