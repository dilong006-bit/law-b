'use client';

import Link from 'next/link';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Img from '@/components/common/Img';
import { HERO_ROTATE, HERO_SLIDES } from '@/data/home';
import { LgIcon } from '@/components/legal-hub/icons';
import { fmtDay, getUpcomingSession } from '@/lib/kium/sessions';

const DUR = 6000;

/* ── [F40 · 261007] C안 첫 장 교차 ───────────────────────────────────────
   SSG 마크업은 언제나 HERO_SLIDES 순서(법정 1 · 공개교육 2)다. 서버·첫 클라이언트 렌더가 같아야
   하이드레이션이 일치하므로, 첫 장 결정은 두 단계로 나눈다.
   ① 아래 인라인 스크립트: 첫 페인트 전에 <html data-hero-start="legal|kium">를 정한다.
      CSS(home.css F40)가 하이드레이션 전까지 그 값으로 첫 장을 그린다 → 깜빡임 0.
   ② 레이아웃 효과: 같은 값을 읽어 슬라이드 순서를 맞바꾸고 data-hero-ready를 켠다(페인트 전).
   교차 규칙: 직전 접속의 첫 장과 반대(localStorage). 첫 방문·저장 불가는 50:50. */
const START_KEY = 'keess_hero_start';
const START_SCRIPT = `(function(){try{var k='${START_KEY}',v;try{var p=localStorage.getItem(k);v=p==='legal'?'kium':p==='kium'?'legal':(Math.random()<.5?'legal':'kium');localStorage.setItem(k,v)}catch(e){v=Math.random()<.5?'legal':'kium'}window.__keessHeroStart=v;document.documentElement.setAttribute('data-hero-start',v)}catch(e){}})();`;

/** 클라이언트 전환(다른 페이지 → 홈)처럼 스크립트가 다시 돌지 않은 마운트에서 같은 규칙으로 고른다 */
function pickStart(): 'legal' | 'kium' {
  const w = window as unknown as { __keessHeroStart?: 'legal' | 'kium' };
  if (w.__keessHeroStart) {
    const v = w.__keessHeroStart;
    w.__keessHeroStart = undefined; // 이번 접속분은 소비: 다음 마운트는 새로 교차
    return v;
  }
  let v: 'legal' | 'kium';
  try {
    const p = localStorage.getItem(START_KEY);
    v = p === 'legal' ? 'kium' : p === 'kium' ? 'legal' : Math.random() < 0.5 ? 'legal' : 'kium';
    localStorage.setItem(START_KEY, v);
  } catch {
    v = Math.random() < 0.5 ? 'legal' : 'kium';
  }
  document.documentElement.setAttribute('data-hero-start', v);
  return v;
}

/** 서버에서는 useEffect(경고 방지), 브라우저에서는 페인트 전 실행 */
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/** [F40] 「다음 개강 11.2(월)」: SSG는 데이터 기준, 마운트 후 오늘 날짜로 다시 계산 */
function useNextOpenLabel(): string | null {
  const calc = (now: Date | null) => {
    const s = getUpcomingSession(now);
    return s ? fmtDay(s.start) : null;
  };
  const [label, setLabel] = useState<string | null>(() => calc(null));
  useEffect(() => setLabel(calc(new Date())), []);
  return label;
}

export default function HeroCarousel() {
  const [slides, setSlides] = useState(HERO_SLIDES);
  const [ready, setReady] = useState(!HERO_ROTATE);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  const rmRef = useRef(false);
  const hoverRef = useRef(false);
  /** [F40] 키보드 포커스가 캐러셀 안에 있는 동안 자동 넘김 정지(WCAG 2.2.2 보강) */
  const focusRef = useRef(false);
  const nextOpen = useNextOpenLabel();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progRef = useRef<HTMLSpanElement>(null);
  const n = slides.length;

  // [F40] C안: 페인트 전에 1·2번 순서를 확정(인라인 스크립트가 고른 값과 동일)
  useIsoLayoutEffect(() => {
    if (!HERO_ROTATE) return;
    if (pickStart() === 'kium') setSlides([HERO_SLIDES[1], HERO_SLIDES[0], ...HERO_SLIDES.slice(2)]);
    setReady(true);
  }, []);

  const pad = (x: number) => ('0' + x).slice(-2);

  const resetProg = useCallback(() => {
    const p = progRef.current;
    if (!p) return;
    p.style.transition = 'none';
    p.style.width = '0%';
    void p.offsetWidth;
  }, []);
  const runProg = useCallback(() => {
    const p = progRef.current;
    if (!p) return;
    p.style.transition = `width ${DUR}ms linear`;
    p.style.width = '100%';
  }, []);
  const freezeProg = useCallback(() => {
    const p = progRef.current;
    if (!p) return;
    const w = getComputedStyle(p).width;
    p.style.transition = 'none';
    p.style.width = w;
  }, []);

  const schedule = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    if (playing && !rmRef.current && !hoverRef.current && !focusRef.current) {
      resetProg();
      runProg();
      timer.current = setTimeout(() => setI((x) => (x + 1) % n), DUR);
    }
  }, [playing, n, resetProg, runProg]);

  // 초기: reduced-motion 감지
  useEffect(() => {
    rmRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (rmRef.current) setPlaying(false);
  }, []);

  // 슬라이드 변경/재생 상태에 따라 스케줄
  useEffect(() => {
    schedule();
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [i, playing, schedule]);

  const go = (x: number) => setI(((x % n) + n) % n);

  const onEnter = () => {
    hoverRef.current = true;
    if (timer.current) clearTimeout(timer.current);
    freezeProg();
  };
  const onLeave = () => {
    hoverRef.current = false;
    if (playing && !rmRef.current && !focusRef.current) schedule();
  };
  // [F40] 포커스 진입/이탈: 캐러셀 밖으로 나갈 때만 재개
  const onFocusIn = () => {
    if (focusRef.current) return;
    focusRef.current = true;
    if (timer.current) clearTimeout(timer.current);
    freezeProg();
  };
  const onFocusOut = (e: React.FocusEvent<HTMLElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
    focusRef.current = false;
    if (playing && !rmRef.current && !hoverRef.current) schedule();
  };

  const rm = () => rmRef.current;
  const scrollTo = (sel: string) => {
    const el = document.querySelector(sel);
    if (el) el.scrollIntoView({ behavior: rm() ? 'auto' : 'smooth' });
  };

  return (
    <>
    {/* [F40] 첫 페인트 전 첫 장 결정: 교차 대상일 때만 출력 */}
    {HERO_ROTATE && <script dangerouslySetInnerHTML={{ __html: START_SCRIPT }} />}
    <section
      className="hero"
      id="hero"
      aria-roledescription="carousel"
      aria-label="주요 소식"
      data-hero-ready={ready ? '' : undefined}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onFocusIn}
      onBlur={onFocusOut}
    >
      <div className="hero-track">
        {slides.map((s, k) => (
          <div
            key={s.id ?? s.theme}
            className={`hero-slide${k === i ? ' active' : ''}`}
            data-theme={s.theme}
            data-slide={s.id}
            aria-hidden={k === i ? 'false' : 'true'}
          >
            <div className="hs-bg" />
            {/* imgMobile(선택): 760 이하 별도 크롭. 미지정 슬라이드는 기존 마크업 그대로 */}
            {s.img && (s.imgMobile ? (
              <picture>
                <source media="(max-width:760px)" srcSet={s.imgMobile} />
                <Img className="hs-img" src={s.img} eager={s.eager} />
              </picture>
            ) : <Img className="hs-img" src={s.img} eager={s.eager} />)}
            <div className="hs-scrim" />
            <div className="wrap">
              <div className="hs-content">
                {s.tag && (
                  <div className="hs-tag">
                    {s.tag}
                    {/* [F40] 다음 개강: 회차 0건이면 출력하지 않는다 */}
                    {s.nextOpenBadge && nextOpen && (
                      <>
                        <span className="hs-tag-dot" aria-hidden="true" />
                        <span className="hs-tag-next">다음 개강 <b>{nextOpen}</b></span>
                      </>
                    )}
                  </div>
                )}
                {s.eyebrow && <p className="eyebrow">{s.eyebrow}</p>}
                <h1 dangerouslySetInnerHTML={{ __html: s.title }} />
                <p className="sub" dangerouslySetInnerHTML={{ __html: s.sub }} />
                {/* secondary(선택)가 있으면 버튼 2개 줄(actions-2). 없으면 기존 마크업 그대로 */}
                <div className={s.secondary ? 'actions actions-2' : 'actions'}>
                  {/* href = 다른 라우트 이동(캠페인 슬라이드) / scroll = 같은 페이지 앵커 */}
                  {s.cta.href ? (
                    <Link className="btn btn-ink" href={s.cta.href} data-ga-id={s.cta.gaId}>
                      {s.cta.label}
                    </Link>
                  ) : (
                    <button className="btn btn-ink" onClick={() => scrollTo(s.cta.scroll!)}>
                      {s.cta.label}
                    </button>
                  )}
                  {s.secondary && (s.secondary.download ? (
                    // [F42] 파일 다운로드: 라우팅 대상이 아니므로 Link가 아닌 <a download>
                    <a className="btn btn-glass" href={s.secondary.href} download={s.secondary.download} data-ga-id={s.secondary.gaId}>
                      {s.secondary.label}
                    </a>
                  ) : (
                    <Link className="btn btn-glass" href={s.secondary.href} data-ga-id={s.secondary.gaId}>
                      {s.secondary.label}
                    </Link>
                  ))}
                </div>
                {s.link && <Link className="hs-link" href={s.link.href} data-ga-id={s.link.gaId}>{s.link.label} <LgIcon name="arrow-right" size={16} /></Link>}
                {s.trust && <p className="hs-trust">{s.trust}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hero-indicator">
        <div className="wrap">
          <div className="hero-ind-inner">
            <button className="hero-arrow prev" type="button" aria-label="이전 슬라이드" onClick={() => go(i - 1)}>‹</button>
            <button className="hero-arrow next" type="button" aria-label="다음 슬라이드" onClick={() => go(i + 1)}>›</button>
            <div className="hero-count">
              <span className="cur">{pad(i + 1)}</span>
              <div className="hero-line"><span ref={progRef} /></div>
              <span className="tot">{pad(n)}</span>
            </div>
            <button
              className="hero-play"
              type="button"
              aria-label={playing ? '일시정지' : '재생'}
              onClick={() => setPlaying((p) => !p)}
            >
              {playing ? '❚❚' : '▶'}
            </button>
          </div>
        </div>
      </div>
      <div className="scrolldown">SCROLL<div className="bar" /></div>
    </section>
    </>
  );
}
