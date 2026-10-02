/**
 * 상담 이동 공용 스크롤 (UI/UX 품질검수 N4·K9). 플로팅 바(lib/fi/go.ts)와 법정 허브 상담 이동(goConsult)이 같이 쓴다.
 * 기존 scrollToId·goToInquiry(lib/utils.ts)는 그대로 둔다.
 */

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** 이동 완료 판정: 목표 도달(±1.5px) 2프레임 또는 위치 정지 3프레임, 최대 1.5초 */
function arrived(target: number): Promise<void> {
  return new Promise((done) => {
    let last = -1, still = 0, hit = 0;
    const t0 = performance.now();
    const tick = () => {
      const y = window.scrollY;
      hit = Math.abs(y - target) < 1.5 ? hit + 1 : 0;
      still = Math.round(y) === last ? still + 1 : 0;
      last = Math.round(y);
      if (hit >= 2 || still >= 3 || performance.now() - t0 > 1500) done(); else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

/** 이동 중 사용자가 직접 스크롤했는지 (휠·터치·스크롤 키). 그랬으면 도착 후 재보정하지 않는다 (R2) */
const SCROLL_KEYS = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']);
function watchUser() {
  let touched = false;
  const mark = () => { touched = true; };
  const key = (e: KeyboardEvent) => { if (SCROLL_KEYS.has(e.key)) touched = true; };
  window.addEventListener('wheel', mark, { passive: true });
  window.addEventListener('touchstart', mark, { passive: true });
  window.addEventListener('keydown', key);
  return {
    get touched() { return touched; },
    off() { window.removeEventListener('wheel', mark); window.removeEventListener('touchstart', mark); window.removeEventListener('keydown', key); },
  };
}

/**
 * N4: 모션 1초 이내. 거리가 화면 높이 2배를 넘으면 목표 직전(목표 - 화면 높이 0.5)까지 즉시 옮긴 뒤 남은 구간만 부드럽게.
 * 움직임 줄이기는 즉시 이동. 도착하면 resolve.
 * html{scroll-behavior:smooth} 가 있어 즉시 이동은 'auto' 가 아니라 'instant' 로 지정한다.
 * R2: recompute 를 주면 도착 후 목적지를 다시 계산해, 이동 중 위쪽 높이 변화(지연 로드 이미지·폰트)로 4px 넘게 어긋났을 때
 * 즉시 1회만 보정한다. 이동 중 사용자가 직접 스크롤했으면 보정하지 않는다.
 */
export function moveTo(top: number, recompute?: () => number): Promise<void> {
  const clamp = (v: number) => Math.max(0, Math.min(Math.round(v), document.documentElement.scrollHeight - window.innerHeight));
  const target = clamp(top);
  if (reduced()) {
    window.scrollTo({ top: target, behavior: 'instant' });
    return Promise.resolve();
  }
  const user = watchUser();
  const vh = window.innerHeight;
  const d = target - window.scrollY;
  if (Math.abs(d) > vh * 2) window.scrollTo({ top: target - Math.sign(d) * vh * 0.5, behavior: 'instant' });
  window.scrollTo({ top: target, behavior: 'smooth' });
  return arrived(target).then(() => {
    user.off();
    if (!recompute || user.touched) return;
    const again = clamp(recompute());
    if (Math.abs(again - window.scrollY) > 4) window.scrollTo({ top: again, behavior: 'instant' });
  });
}

/** 요소의 앵커 이동 목적지: scroll-margin-top 과 전역 scroll-padding-top 을 반영 (scrollIntoView block:start 와 같은 위치) */
export function elementTop(el: Element): number {
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  return el.getBoundingClientRect().top + window.scrollY - margin - padding;
}

/**
 * K9: 터치 기기에서 상담 블록에 도착했을 때 상담 패널에 테두리를 1.2초 보여 위치 단서를 준다 (포커스는 화면에 안 보이는 제목에 있음).
 * 포인터 기기는 포커스 링이 있어 제외. 사라질 때 0.3초 페이드(CSS), 움직임 줄이기면 페이드 없이 제거(전역 규칙).
 */
const cueTimers = new WeakMap<Element, number>();
export function cueArrive(panel: Element | null) {
  if (!panel || window.matchMedia('(pointer:fine)').matches) return;
  // R3: 1.2초 안에 다시 도착하면 앞 타이머를 지우고 새로 1.2초 (앞 타이머가 새 표시를 일찍 지우지 않게)
  const prev = cueTimers.get(panel);
  if (prev) window.clearTimeout(prev);
  panel.classList.add('is-arrive');
  cueTimers.set(panel, window.setTimeout(() => { panel.classList.remove('is-arrive'); cueTimers.delete(panel); }, 1200));
}
