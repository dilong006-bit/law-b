/**
 * [F42 · 261007] 인재키움 프리미엄 공개교육 과정 소개서 (HRD사업팀 요청).
 *
 * ★ 게시 스위치: ready
 *   false = 다운로드 버튼을 DOM에 만들지 않는다(홈 히어로 2차 버튼 · 과정안내 상단 링크 모두).
 *   true  = 두 위치에 노출. 반드시 public/downloads/ 에 아래 fileName 파일이 있어야 한다.
 *
 * 현재 false 사유: 수령본(과정개요서)에 폐강 8과정·단가가 포함돼 게시 불가.
 *   개정본(노출 11과정 · 단가 제외) 수령 시 ①파일 배치 ②sizeLabel 실측 기입 ③ready=true, 3가지만 바꾼다.
 * 방식: 폼 없는 직접 다운로드(게이트 없음). 다운로드 후 상담은 기존 [문의하기]·회차 카드 흐름이 받는다.
 */
export const KIUM_BROCHURE = {
  ready: false,
  label: '과정 소개서 받기',
  fileName: 'KG에듀원_인재키움프리미엄_공개교육_과정소개서.pdf',
  href: '/downloads/KG에듀원_인재키움프리미엄_공개교육_과정소개서.pdf',
  /** 버튼 보조 표기. 파일 배치 시 실측값으로 기입(예: 'PDF · 2.4MB') */
  sizeLabel: 'PDF',
} as const;
