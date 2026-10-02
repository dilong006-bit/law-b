/**
 * 빠른 상담 이동 (legal-B upgrade-01 §6-8, LB27).
 * 허브 안: #mandatory-inquiry 로 스크롤한 뒤 폼 첫 입력 칸에 포커스(preventScroll).
 * 허브 밖(블록이 없을 때): /content#mandatory-inquiry 로 이동 — 도착 후 포커스는 HubInquiry 해시 진입 처리.
 */

export const CONSULT_ID = 'mandatory-inquiry';
export const CONSULT_HASH = `#${CONSULT_ID}`;

/** 빠른 상담 폼의 첫 입력 칸 (숨김 필드·체크박스 제외) */
export function consultFirstField(root: ParentNode | null = document.getElementById(CONSULT_ID)) {
  return root?.querySelector<HTMLElement>('input:not([type=hidden]):not([type=checkbox]):not(.hp),textarea') ?? null;
}

/**
 * 상담 블록으로 이동 후 첫 입력 칸 포커스. 이동은 플로팅 바와 같은 공용 규칙(N4: 긴 거리 단축, 움직임 줄이기 즉시).
 * cue: 카드뉴스 상담 CTA 처럼 터치 기기에서 도착 위치 단서(상담 패널 테두리 1.2초, K9)를 보여 줄 때
 */
function moveToConsult(cue: boolean) {
  const el = document.getElementById(CONSULT_ID);
  if (!el) { location.href = `/content${CONSULT_HASH}`; return; }
  // F1: 이동 모듈은 클릭 때 불러온다 (/content 첫 로드 JS 를 줄이려고). 링크 기본 이동은 onConsultClick 이 동기로 막는다
  import('@/lib/scrollMotion').then(({ cueArrive, elementTop, moveTo }) =>
    moveTo(elementTop(el), () => elementTop(el)).then(() => {
      consultFirstField(el)?.focus({ preventScroll: true });
      if (cue) cueArrive(el.querySelector('.lg-consult-panel'));
    }));
}

/** 클릭 핸들러로 직접 넘겨도 되도록 인자 없음 (PickTray 등) */
export function goConsult() {
  moveToConsult(false);
}

/** 앵커 클릭 핸들러 — 새 탭·수정 키 클릭은 브라우저 기본 동작에 맡긴다 */
export function onConsultClick(e: React.MouseEvent, opts?: { cue?: boolean }) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  moveToConsult(!!opts?.cue);
}
