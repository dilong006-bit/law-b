'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { LEGAL_COPY } from '@/data/legal';

interface LegalCardNewsProps {
  slides: { src: string | null; alt: string }[];
  /** 자동 전환 간격 (기본 5초) */
  intervalMs?: number;
}

/** 스와이프로 인정하는 최소 가로 이동 */
const SWIPE_PX = 40;

const IcPrev = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18 9 12l6-6" /></svg>
);
const IcNext = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
);

/**
 * LF5 카드뉴스 슬라이더.
 * 자동 전환은 '화면에 보이고, 탭이 활성이고, 사용자가 손을 대지 않은' 동안에만 돈다.
 * 이미지 재제작본이 오면 slides 의 src 만 채우면 되고 이 컴포넌트는 바뀌지 않는다.
 */
export default function LegalCardNews({ slides, intervalMs = 5000 }: LegalCardNewsProps) {
  const [i, setI] = useState(0);
  const [visible, setVisible] = useState(false);
  const [held, setHeld] = useState(false);
  const [reduce, setReduce] = useState(false);
  /** 사용자 조작 안내는 조작했을 때만 읽힌다 — 자동 전환까지 읽으면 소음이 된다 */
  const [announce, setAnnounce] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const dragX = useRef<number | null>(null);
  const n = slides.length;

  const go = useCallback((next: number, byUser = true) => {
    if (byUser) setAnnounce(true);
    setI(((next % n) + n) % n);
  }, [n]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // 화면 밖에서는 돌지 않는다 (가시 30% 이상일 때만)
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => setVisible(es[0]?.intersectionRatio >= 0.3), { threshold: [0, 0.3, 0.6, 1] });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // 자동 전환 — 모션 저감·비가시·조작 중·탭 비활성에서는 타이머 자체를 걸지 않는다
  useEffect(() => {
    if (reduce || !visible || held || n < 2) return;
    if (typeof document !== 'undefined' && document.hidden) return;
    const t = window.setInterval(() => setI((p) => (p + 1) % n), intervalMs);
    const onVis = () => { if (document.hidden) window.clearInterval(t); };
    document.addEventListener('visibilitychange', onVis);
    return () => { window.clearInterval(t); document.removeEventListener('visibilitychange', onVis); };
  }, [reduce, visible, held, n, intervalMs]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); }
  };

  return (
    <div
      className="lg-news"
      ref={rootRef}
      role="group"
      aria-roledescription="carousel"
      aria-label={LEGAL_COPY.resources.cardNewsLabel}
    >
      <div
        className="lg-news-view"
        /* 트랙이 좌우로 밀리는 구조라 화면 밖 슬라이드가 계측에 잡힌다 — 의도된 클리핑 표식(C2 예외) */
        data-hscroll
        tabIndex={0}
        onKeyDown={onKey}
        onFocus={() => setHeld(true)}
        onBlur={() => setHeld(false)}
        onPointerEnter={(e) => { if (e.pointerType === 'mouse') setHeld(true); }}
        onPointerLeave={(e) => { if (e.pointerType === 'mouse') setHeld(false); }}
        onPointerDown={(e) => { dragX.current = e.clientX; setHeld(true); }}
        onPointerUp={(e) => {
          const from = dragX.current;
          dragX.current = null;
          setHeld(false);
          if (from === null) return;
          const dx = e.clientX - from;
          if (Math.abs(dx) >= SWIPE_PX) go(dx < 0 ? i + 1 : i - 1);
        }}
        onPointerCancel={() => { dragX.current = null; setHeld(false); }}
      >
        <div className="lg-news-track" style={{ transform: `translateX(-${i * 100}%)` }}>
          {slides.map((s, idx) => (
            <div
              className="lg-news-slide"
              key={idx}
              role="group"
              aria-roledescription="slide"
              aria-label={`${idx + 1} / ${n}`}
              aria-hidden={idx === i ? undefined : true}
            >
              {s.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.src} alt={s.alt} loading={idx === 0 ? 'eager' : 'lazy'} decoding="async" />
              ) : (
                <div className="lg-news-ph">
                  <span className="n">{`카드뉴스 ${String(idx + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}`}</span>
                  <span className="t">{LEGAL_COPY.resources.placeholder}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="lg-news-ctrl">
        <button type="button" className="lg-news-arrow" onClick={() => go(i - 1)} aria-label="이전 카드뉴스"><IcPrev /></button>
        <div className="lg-news-dots" role="group" aria-label="카드뉴스 선택">
          {slides.map((_, idx) => (
            <button
              type="button"
              key={idx}
              className={`lg-news-dot${idx === i ? ' on' : ''}`}
              aria-label={`${idx + 1} / ${n}`}
              aria-current={idx === i ? 'true' : undefined}
              onClick={() => go(idx)}
            />
          ))}
        </div>
        <button type="button" className="lg-news-arrow" onClick={() => go(i + 1)} aria-label="다음 카드뉴스"><IcNext /></button>
      </div>

      <div className="lg-sr" aria-live={announce ? 'polite' : 'off'}>{`${i + 1} / ${n}`}</div>
    </div>
  );
}
