/**
 * 플로팅 문의 바 같은 페이지 이동 (기술명세서 최종 v2.0 §7, FI-05). DOM 전용.
 * 1) 관심 영역 칩 추가 선택(스크롤과 동시)  2) GNB·SubNav 보정 스크롤(긴 거리 단축, lib/scrollMotion)  3) 도착 후 포커스  4) replaceState
 * 문의 폼(HomeInquiry 등)과 기존 scrollToId·goToInquiry 는 수정하지 않는다.
 */

import { CONSULT_HASH, consultFirstField } from '@/lib/legal/goConsult';
import { cueArrive, moveTo } from '@/lib/scrollMotion';

const DEV = process.env.NODE_ENV !== 'production';
const SCROLL_GAP = 16;
/** 칩 라벨 모듈(동적 import) 대기 상한: 청크 로드가 늦어도 포커스·replaceState 가 묶이지 않게 */
const CHIPS_WAIT_MS = 1200;

/**
 * 관심 영역 재적용: 폼 무변경 방식. 라벨은 data/home.ts INQ.interests 원본에서 찾는다 (하드코딩 없음).
 * #inq .chips .mchip 중 글자가 라벨과 같고 aria-pressed="false" 인 칩만 클릭 (이미 선택된 칩은 그대로, 추가만).
 * 라벨 데이터는 홈 폼이 있는 페이지에서만 필요해 동적 import 로 분리한다 (다른 페이지 첫 로드 번들에 넣지 않음).
 */
export async function applyInterest(key: string, root = '#inq'): Promise<void> {
  const { INQ } = await import('@/data/home');
  const label = INQ.interests.find((o) => o.value === key)?.label;
  const chip = label
    ? [...document.querySelectorAll<HTMLButtonElement>(`${root} .chips .mchip`)].find((b) => b.textContent?.trim() === label)
    : undefined;
  if (!chip) {
    if (DEV) console.warn(`[FloatingInquiry] 관심 영역 칩을 찾지 못했습니다: ${key}`);
    return;
  }
  if (chip.getAttribute('aria-pressed') === 'false') chip.click();
}

/** 화면 위를 덮는 고정 요소 높이: GNB(header.nav) + 보이는 SubNav */
export function topOcclusion(): number {
  const nav = document.querySelector<HTMLElement>('header.nav');
  const sub = document.querySelector<HTMLElement>('.subnav');
  const navH = nav ? nav.getBoundingClientRect().height : 0;
  const subH = sub && sub.offsetParent !== null ? sub.getBoundingClientRect().height : 0;
  return navH + subH;
}

/**
 * 폼 제목 (터치 기기 포커스 대상): 홈은 보이는 리드 문구, 리더십·HRD 는 h2.
 * /content 는 이동 대상이 #mandatory-inquiry(상담 블록)이고 .inq-side 가 display:none 이라,
 * 블록 제목(BlockHead 의 시각적으로 숨긴 h3)에 포커스한다.
 */
export function formTitle(root: Element): HTMLElement | null {
  const shown = (el: HTMLElement | null) => (el && el.getClientRects().length ? el : null);
  return shown(root.querySelector<HTMLElement>('.inq-side .lead'))
    ?? shown(root.querySelector<HTMLElement>('h2'))
    ?? shown(root.closest('.lg-inq')?.querySelector<HTMLElement>('h2, h3') ?? null);
}

/** 폼 첫 입력칸 (숨김·허니팟·체크박스 제외) */
export function firstField(root: Element): HTMLElement | null {
  return root.querySelector<HTMLElement>('input:not([type="hidden"]):not([type="checkbox"]):not(.hp), select, textarea');
}

export function goToForm(target: string, interest?: string): void {
  const root = document.querySelector(target);
  if (!root) { location.hash = target; return; }
  // 칩 선택은 라벨 모듈을 받는 동안 스크롤을 붙잡지 않도록 스크롤과 동시에 진행하고, 포커스 전에 끝을 기다린다
  const chips = interest ? applyInterest(interest).catch(() => undefined) : Promise.resolve();

  const top = root.getBoundingClientRect().top + window.scrollY - topOcclusion() - SCROLL_GAP;
  // N4: 긴 거리는 목표 직전까지 즉시 이동 후 남은 구간만 부드럽게 (lib/scrollMotion). 도착한 뒤 포커스
  moveTo(top).then(async () => {
    await Promise.race([chips, new Promise((r) => window.setTimeout(r, CHIPS_WAIT_MS))]);
    if (window.matchMedia('(pointer:fine)').matches) {
      // /content 상담 블록은 기존 빠른 상담 이동(goConsult)과 같은 첫 입력칸 규칙을 쓴다
      (target === CONSULT_HASH ? consultFirstField(root) : firstField(root))?.focus({ preventScroll: true });
    } else {
      const t = formTitle(root);
      if (t) {
        if (!t.hasAttribute('tabindex')) t.tabIndex = -1;
        t.focus({ preventScroll: true });
      }
    }
    // K9: 터치 기기에서 /content 상담 블록에 도착하면 상담 패널 테두리로 위치 단서
    if (target === CONSULT_HASH) cueArrive(root.querySelector('.lg-consult-panel'));
    history.replaceState(null, '', target);
  });
}
