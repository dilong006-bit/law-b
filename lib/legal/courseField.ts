/**
 * 희망과정 선택 필드 계약 (기술명세서 legal-A §9 LF8).
 * HomeInquiry 는 이 설정을 받았을 때만 필드를 렌더한다 — 미지정(홈·/kium)이면 기존 동작 그대로다.
 * 타입·직렬화 규칙을 공유 폼 바깥에 두어 HomeInquiry 가 /legal 데이터에 의존하지 않게 한다.
 */
export interface CourseFieldConfig {
  label: string;
  options: readonly string[];
  etcLabel: string;
  etcPlaceholder: string;
  etcMax: number;
  errRequired: string;
  errEtc: string;
}

/** 문의 내용 앞에 붙는 희망과정 토큰 — 신규 수집 필드를 만들지 않기 위한 표기 규칙 */
export const courseToken = (picked: string[], etc: string) =>
  `[희망과정: ${[...picked, ...(etc ? [`기타(${etc})`] : [])].join('·')}]`;

/** 프리필 제거 규칙 — 같은 토큰이 겹쳐 쌓이지 않게 한다 */
export const COURSE_TOKEN_RE = /\[희망과정: [^\]]*\]\n?/g;
