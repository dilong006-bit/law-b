'use client';

import { useEffect } from 'react';

/** 사용자가 직접 스크롤하는 키 */
const SCROLL_KEYS = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Spacebar']);

/**
 * K1: 첫 방문 해시 진입 보정 (UI/UX 품질검수 1차).
 * 부드러운 해시 스크롤이 대체 폰트로 계산한 목적지로 가는 도중 Pretendard 가 적용되면 위 문단 줄바꿈이 바뀌어 목적지가 어긋난다.
 * 진입 시 해시 대상이 있을 때만, 웹폰트 적용과 스크롤 정착을 기다린 뒤 한 번만 즉시(auto) 재보정한다.
 * 그 사이 사용자가 휠·터치·키보드로 직접 스크롤했으면 하지 않는다. scroll-margin·scroll-padding 은 scrollIntoView 가 그대로 반영한다.
 * 플로팅 바 이동(lib/fi/go.ts)은 클릭 뒤 동작이라 첫 진입 1회인 이 보정과 겹치지 않는다.
 */
export default function HashFontFix() {
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    const el = id ? document.getElementById(id) : null;
    if (!el) return;

    let cancelled = false;
    const stop = () => { cancelled = true; };
    const onKey = (e: KeyboardEvent) => { if (SCROLL_KEYS.has(e.key)) stop(); };
    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchstart', stop, { passive: true });
    window.addEventListener('keydown', onKey);
    const off = () => {
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchstart', stop);
      window.removeEventListener('keydown', onKey);
    };

    // 스크롤 정착: 연속 3프레임 scrollY 동일 (최대 3초)
    const settle = () => new Promise<void>((done) => {
      let last = -1, same = 0;
      const t0 = performance.now();
      const tick = () => {
        if (cancelled) return done();
        const y = Math.round(window.scrollY);
        same = y === last ? same + 1 : 0; last = y;
        if (same >= 3 || performance.now() - t0 > 3000) done(); else requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });

    document.fonts.ready.then(settle).then(() => {
      off();
      if (cancelled || decodeURIComponent(location.hash.slice(1)) !== id || !el.isConnected) return;
      el.scrollIntoView({ behavior: 'auto', block: 'start' });
    });
    return () => { stop(); off(); };
  }, []);
  return null;
}
