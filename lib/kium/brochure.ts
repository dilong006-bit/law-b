/**
 * [F42 · 261007 → F44 · 261013] 인재키움 프리미엄 과정개요서 다운로드 (업무 27338 · 10/8 댓글).
 *
 * ★ 게시 스위치
 *   ready      = 전체 스위치. false면 모든 위치에서 DOM 0
 *   showInHero = 홈 히어로 공개교육 슬라이드 2차 버튼. F44 false
 *                (10/8 확정 범위 밖 · 1차 CTA [공개교육 신청] 경쟁 · 자동 전환 캐러셀 노출 불안정)
 *   과정안내 세그먼트 행 링크는 ready만 따른다(두 보기 공통)
 *
 * ★ 파일 규칙
 *   서버 파일명 SERVER_FILE 고정. 개정본도 같은 이름으로 덮어쓴다
 *   교체 시 VERSION(수령일 YYMMDD) · sizeLabel(실측) 2개만 갱신 → ?v= 로 캐시 무효화
 *   다운로드 표시명은 fileName(<a download>)
 * 방식: 폼 없는 직접 다운로드(게이트 없음). 상담 전환은 [문의하기] · 회차 카드가 받는다.
 */
const SERVER_FILE = 'kgeduone_kium_premium_course_overview_2026.pdf';
const VERSION = '261008';

export const KIUM_BROCHURE = {
  ready: true,
  showInHero: false,
  label: '과정개요서 받기',
  fileName: 'KG에듀원_2026_인재키움프리미엄_과정개요서.pdf',
  href: `/downloads/${SERVER_FILE}?v=${VERSION}`,
  /** 실측: Math.round(bytes / 1024) → 'PDF · NNNKB' (1MB 이상은 'PDF · N.NMB') */
  sizeLabel: 'PDF · 552KB',
} as const;
