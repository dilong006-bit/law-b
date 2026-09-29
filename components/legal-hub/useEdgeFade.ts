'use client';

import { useEffect, useRef } from 'react';

const EDGE_EPS = 2;

/**
 * 가로 스크롤 칩 행의 엣지 페이드 — 기존 .subnav-in[data-fade] mask 규칙과 짝.
 * 스크롤 가능한 방향만 data-fade 로 표시한다(SubNav.tsx 와 같은 판정).
 */
export function useEdgeFade<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const sync = () => {
      const canLeft = el.scrollLeft > EDGE_EPS;
      const canRight = el.scrollLeft < el.scrollWidth - el.clientWidth - EDGE_EPS;
      el.dataset.fade = canLeft ? (canRight ? 'both' : 'left') : canRight ? 'right' : 'none';
    };
    sync();
    el.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      el.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, []);
  return ref;
}
