/**
 * 빠른 상담 이동 (legal-B upgrade-01 §6-8, LB27).
 * 허브 안: #mandatory-inquiry 로 스크롤한 뒤 폼 첫 입력 칸에 포커스(preventScroll).
 * 허브 밖(블록이 없을 때): /content#mandatory-inquiry 로 이동 — 도착 후 포커스는 HubInquiry 해시 진입 처리.
 */
export const CONSULT_ID = 'mandatory-inquiry';
export const CONSULT_HASH = `#${CONSULT_ID}`;

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** 빠른 상담 폼의 첫 입력 칸 (숨김 필드·체크박스 제외) */
export function consultFirstField(root: ParentNode | null = document.getElementById(CONSULT_ID)) {
  return root?.querySelector<HTMLElement>('input:not([type=hidden]):not([type=checkbox]):not(.hp),textarea') ?? null;
}

export function goConsult() {
  const el = document.getElementById(CONSULT_ID);
  if (!el) { location.href = `/content${CONSULT_HASH}`; return; }
  const rm = prefersReduced();
  el.scrollIntoView({ behavior: rm ? 'auto' : 'smooth', block: 'start' });
  window.setTimeout(() => consultFirstField(el)?.focus({ preventScroll: true }), rm ? 0 : 450);
}

/** 앵커 클릭 핸들러 — 새 탭·수정 키 클릭은 브라우저 기본 동작에 맡긴다 */
export function onConsultClick(e: React.MouseEvent) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  goConsult();
}
