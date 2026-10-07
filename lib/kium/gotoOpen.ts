/**
 * [F43 · 261007] 공개교육 바로가기 신호.
 *
 * /kium 히어로 [공개교육 신청하기]가 같은 페이지 안에서 「과정안내 탭 + 공개교육 보기」로 옮길 때 쓴다.
 * - KiumTabs: 과정안내 탭으로 전환(이미 활성이면 탭바 위치로 스크롤만)
 * - KiumCoursesTab: 공개교육 보기로 전환
 * 의존 모듈이 없는 독립 파일이다(브리지끼리 순환 import 방지).
 */
export const KIUM_GOTO_OPEN_EVENT = 'kium:goto-open';

/** 공개교육 딥링크(무JS 폴백 · 홈 히어로 CTA 공용) */
export const KIUM_OPEN_HREF = '/kium?tab=courses&mode=open';

export function gotoOpenCourses() {
  window.dispatchEvent(new Event(KIUM_GOTO_OPEN_EVENT));
}
