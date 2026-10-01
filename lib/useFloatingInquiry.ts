'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { FLOATING_INQUIRY, type FiCopy, type FiPage } from '@/data/floatingInquiry';
import { computeVisible, findPage, pickCopy } from '@/lib/fi/state';

/**
 * 플로팅 문의 바 노출 신호 수집 (기술명세서 최종 v2.0 §4). 판정은 lib/fi/state.ts computeVisible 만 한다.
 * scroll 리스너 없이 IntersectionObserver · MutationObserver · matchMedia · focus 위임만 쓴다.
 * 서버와 첫 클라이언트 렌더는 항상 숨김(mounted=false) 이라 하이드레이션 불일치가 없다.
 *
 * 차단(blocked) 신호 (0단계 확인, 우선순위: 모달·메뉴 > lg-tray > 티저 > 플로팅 바):
 *   body.style.position === 'fixed' : useModal(확대 보기·개인정보·신고·과정 시트)과 모바일 메뉴 공통 스크롤 잠금
 *   header.nav.menu-open            : 모바일 메뉴
 *   body.legal-tray-on              : 법정 과정 담기 바 (PickTray)
 *   body.teaser-on                  : 인재키움 티저 스낵바
 */

const DISMISS_KEY = 'keess_fi_dismissed';
const FOOTER_SEL = '#site-footer';
const WAIT_MS = 3000;
const EDITABLE = 'input, textarea, select, [contenteditable]:not([contenteditable="false"])';

let dismissedMem = false;
function readDismissed() {
  try { return sessionStorage.getItem(DISMISS_KEY) === '1' || dismissedMem; } catch { return dismissedMem; }
}
function writeDismissed() {
  dismissedMem = true;
  try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch { /* 메모리 상태로 유지 */ }
}

/**
 * 셀렉터 요소를 찾으면 cb(el). 아직 없으면(늦게 렌더) body 변화를 최대 3초 지켜보다 포기한다.
 * 반환값은 대기 해제 함수 (cb 가 돌려준 해제 함수도 함께 부른다). 포기하면 onGiveUp.
 */
function whenFound(selector: string, cb: (el: Element) => (() => void) | void, onGiveUp?: () => void): () => void {
  let release: (() => void) | void;
  const hit = document.querySelector(selector);
  if (hit) { release = cb(hit); return () => release?.(); }
  const mo = new MutationObserver(() => {
    const el = document.querySelector(selector);
    if (!el) return;
    mo.disconnect(); window.clearTimeout(timer);
    release = cb(el);
  });
  mo.observe(document.body, { childList: true, subtree: true });
  const timer = window.setTimeout(() => {
    mo.disconnect();
    onGiveUp?.();
    if (process.env.NODE_ENV !== 'production') console.warn(`[FloatingInquiry] ${selector} 를 ${WAIT_MS}ms 안에 찾지 못해 관찰을 포기합니다`);
  }, WAIT_MS);
  return () => { mo.disconnect(); window.clearTimeout(timer); release?.(); };
}

function readBlocked() {
  const b = document.body;
  return b.style.position === 'fixed'
    || !!document.querySelector('header.nav.menu-open')
    || b.classList.contains('legal-tray-on')
    || b.classList.contains('teaser-on');
}

export type FloatingInquiryState = {
  page: FiPage | null;
  copy: FiCopy | null;
  activeZone: string | null;
  visible: boolean;
  dismiss: () => void;
};

export function useFloatingInquiry(): FloatingInquiryState {
  const pathname = usePathname();
  const page = useMemo(() => findPage(FLOATING_INQUIRY, pathname), [pathname]);

  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [reached, setReached] = useState(false);
  const [hideTargetSeen, setHideTargetSeen] = useState(false);
  const [footerSeen, setFooterSeen] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [shortViewport, setShortViewport] = useState(false);
  const [activeZone, setActiveZone] = useState<string | null>(null);
  // 경로 진입 직후 관찰자 첫 콜백이 모두 올 때까지 판정 보류 (도달 콜백이 숨김 콜백보다 먼저 와 바가 한 프레임 깜빡이는 것 방지,
  // 예: /?interest=ax-ai#inq 처럼 문의 섹션으로 바로 들어올 때). 경로 값으로 들고 있어서
  // 경로가 바뀐 첫 렌더(초기화 이펙트 전)에도 이전 페이지 상태로 노출되지 않는다
  const [armedFor, setArmedFor] = useState<string | null>(null);
  const kbOpen = useRef(false);
  const editing = useRef(false);

  // 전역 신호: 경로와 무관 (한 번 등록, 언마운트 시 해제)
  useEffect(() => {
    setMounted(true);
    setDismissed(readDismissed());

    // matchMedia
    const mqMobile = window.matchMedia('(max-width:760px)');
    const mqShort = window.matchMedia('(max-height:479px)');
    const syncMq = () => { setMobile(mqMobile.matches); setShortViewport(mqShort.matches); };
    syncMq();
    mqMobile.addEventListener('change', syncMq);
    mqShort.addEventListener('change', syncMq);

    // 차단 신호: body·html 의 class·style 변화. 콜백은 rAF 로 1프레임 1회 병합
    let raf = 0;
    const syncBlocked = () => { raf = 0; setBlocked(readBlocked()); };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(syncBlocked); };
    const mo = new MutationObserver(schedule);
    const opts = { attributes: true, attributeFilter: ['class', 'style'] };
    mo.observe(document.body, opts);
    mo.observe(document.documentElement, opts);
    syncBlocked();

    // 입력 감지: focus 위임. focusout 직후 다른 칸으로 옮겨 가는 경우가 있어 activeElement 로 다시 판정
    const syncInput = () => setInputFocused(editing.current || kbOpen.current);
    let fr = 0;
    const onFocus = () => {
      cancelAnimationFrame(fr);
      fr = requestAnimationFrame(() => {
        const a = document.activeElement;
        editing.current = !!(a && a !== document.body && a.matches(EDITABLE));
        syncInput();
      });
    };
    document.addEventListener('focusin', onFocus);
    document.addEventListener('focusout', onFocus);
    // iOS 보조: 760 이하에서 화면 키보드가 열리면 visualViewport 가 크게 줄어든다
    const vv = window.visualViewport;
    const onVv = () => {
      kbOpen.current = !!vv && mqMobile.matches && vv.height < window.innerHeight * 0.75;
      syncInput();
    };
    vv?.addEventListener('resize', onVv);

    return () => {
      mqMobile.removeEventListener('change', syncMq);
      mqShort.removeEventListener('change', syncMq);
      mo.disconnect();
      cancelAnimationFrame(raf);
      cancelAnimationFrame(fr);
      document.removeEventListener('focusin', onFocus);
      document.removeEventListener('focusout', onFocus);
      vv?.removeEventListener('resize', onVv);
    };
  }, []);

  // 경로별 관찰자: 경로가 바뀌면 전부 해제 후 다시 만들고 도달 상태를 초기화
  useEffect(() => {
    setReached(false);
    setHideTargetSeen(false);
    setFooterSeen(false);
    setActiveZone(null);
    setArmedFor(null);
    setBlocked(readBlocked()); // 이전 페이지에서 남은 잠금 해제 반영
    if (!page) return;
    const offs: (() => void)[] = [];
    const pending = new Set<string>();
    let alive = true;
    const settled = (key: string) => {
      if (!pending.delete(key) || pending.size || !alive) return;
      setArmedFor(page.path);
    };
    const wait = (key: string) => { pending.add(key); return () => settled(key); };

    // 해시로 들어오면(예: /?interest=ax-ai#inq) 부드러운 앵커 스크롤이 기준 섹션을 지나가는 동안 바가 켜졌다 꺼진다.
    // 스크롤이 멈출 때까지(scrollend, 미지원·스크롤 없음은 900ms) 판정을 보류한다
    if (location.hash) {
      const doneHash = wait('hash');
      const t = window.setTimeout(doneHash, 900);
      const onEnd = () => { window.clearTimeout(t); doneHash(); };
      if ('onscrollend' in window) window.addEventListener('scrollend', onEnd, { once: true });
      offs.push(() => { window.clearTimeout(t); window.removeEventListener('scrollend', onEnd); });
    }

    // reached: 기준 섹션 상단이 화면 세로 60% 선을 지났는지
    const doneReached = wait('reached');
    offs.push(whenFound(page.trigger, (el) => {
      const io = new IntersectionObserver(([e]) => {
        setReached(e.isIntersecting || e.boundingClientRect.top < 0);
        doneReached();
      }, { rootMargin: '0px 0px -40% 0px', threshold: 0 });
      io.observe(el);
      return () => io.disconnect();
    }, doneReached));

    // hideWhen: 요소별 가시 비율 Map, 하나라도 0.2 이상이면 숨김
    const ratios = new Map<Element, number>();
    // 폼 박스 가드: 문의 섹션이 화면보다 훨씬 길면(홈·/content 1.5~2.5배) 20% 에 닿기 전에 첫 입력칸이 화면 하단, 바 아래에 들어온다.
    // 수용 기준 '폼 가림 0' 을 지키려고 같은 페이지 폼 박스(.form·.iform)가 조금이라도 보이면 숨김에 더한다 (명세 4장 보완)
    const formSeen = new Set<Element>();
    const syncHide = () => setHideTargetSeen(formSeen.size > 0 || [...ratios.values()].some((r) => r >= 0.2));
    for (const sel of page.hideWhen) {
      const done = wait('hide ' + sel);
      offs.push(whenFound(sel, (el) => {
        const io = new IntersectionObserver((entries) => {
          for (const e of entries) ratios.set(e.target, e.isIntersecting ? e.intersectionRatio : 0);
          syncHide();
          done();
        }, { threshold: [0, 0.2] });
        io.observe(el);
        return () => { io.disconnect(); ratios.delete(el); };
      }, done));
    }
    if (!page.external) {
      const done = wait('form');
      offs.push(whenFound(`${page.target} .form, ${page.target} .iform`, (el) => {
        const io = new IntersectionObserver(([e]) => {
          if (e.isIntersecting) formSeen.add(el); else formSeen.delete(el);
          syncHide();
          done();
        }, { threshold: 0 });
        io.observe(el);
        return () => { io.disconnect(); formSeen.delete(el); };
      }, done));
    }

    // footer: 일부라도 보이면 숨김
    const doneFooter = wait('footer');
    offs.push(whenFound(FOOTER_SEL, (el) => {
      const io = new IntersectionObserver(([e]) => { setFooterSeen(e.isIntersecting); doneFooter(); }, { threshold: 0 });
      io.observe(el);
      return () => io.disconnect();
    }, doneFooter));

    // zones: 화면 가운데 띠(위아래 40% 제외)에 걸린 구간
    if (page.zones?.length) {
      const inZone = new Map<string, boolean>();
      for (const z of page.zones) {
        offs.push(whenFound(z.selector, (el) => {
          const io = new IntersectionObserver(([e]) => {
            inZone.set(z.selector, e.isIntersecting);
            setActiveZone(page.zones!.find((x) => inZone.get(x.selector))?.selector ?? null);
          }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
          io.observe(el);
          return () => { io.disconnect(); inZone.delete(z.selector); };
        }));
      }
    }

    return () => { alive = false; offs.forEach((off) => off()); };
  }, [page]);

  const dismiss = useCallback(() => { writeDismissed(); setDismissed(true); }, []);

  const visible = mounted && !!page && armedFor === page.path && computeVisible({
    configured: !!page, dismissed, reached, hideTargetSeen, footerSeen, blocked, mobile, inputFocused, shortViewport,
  });
  const copy = page ? pickCopy(page, activeZone) : null;

  return { page, copy, activeZone, visible, dismiss };
}
