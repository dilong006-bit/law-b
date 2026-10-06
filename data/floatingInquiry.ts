// 플로팅 문의 바 페이지·구간 설정 (B안 플로팅 문의 바 기술명세서 최종 v2.0 §3, FI-06·FI-11)
// 문구는 사업팀 확인 전 초안. 설정 없는 경로(/kium, /privacy, 404 등)는 바를 렌더하지 않는다.
// interest 는 홈 문의 폼 관심 영역 value (data/home.ts INQ.interests). 명세의 'legal' 은 실제 키 'compliance'.
// accent 는 필러 틴트와 같은 매핑: 홈 p1(중립 페이지 기본) / AX·AI p1 / 리더십 p2 / HRD p3 / 콘텐츠 p4

export type FiAccent = 'p1' | 'p2' | 'p3' | 'p4';

export type FiCopy = {
  accent: FiAccent;
  title: string;     // PC·태블릿 1줄
  sub: string;       // PC 보조 1줄
  short: string;     // 휴대폰, 공백 포함 10자 이내
  cta: string;       // PC·태블릿 버튼, 8자 이내 (휴대폰은 '상담 신청' 고정)
  interest?: string; // 관심 영역 키 (?interest= 값과 동일 규격)
};

export type FiPath = '/' | '/ax-ai' | '/leadership' | '/hrd' | '/content';

export type FiPage = {
  path: FiPath;
  trigger: string;          // 노출 시작 기준 섹션 셀렉터
  target: string;           // 같은 페이지 폼 앵커 또는 다른 페이지 URL
  external?: boolean;       // true: 페이지 이동 (AX·AI)
  hideWhen: string[];       // 보이면 숨길 요소 (문의 섹션 등)
  copy: FiCopy;
  zones?: { selector: string; copy: FiCopy }[]; // 구간별 문구 전환
};

export const FI_SHORT_MAX = 10;
export const FI_CTA_MAX = 8;
export const FI_ACCENTS: readonly FiAccent[] = ['p1', 'p2', 'p3', 'p4'];
/** 휴대폰 버튼 문구 (전 페이지 고정, 360px 폭 수용 계산 기준) */
export const FI_CTA_MOBILE = '상담 신청';

export const FLOATING_INQUIRY: readonly FiPage[] = [
  { path: '/', trigger: 'main section:nth-of-type(2)', target: '#inq', hideWhen: ['#inq'],
    copy: { accent: 'p1', title: '우리 회사에 맞는 교육, 진단부터 함께 설계합니다',
      sub: '관심 영역을 고르면 담당 컨설턴트가 맞춤 과정을 제안합니다', short: '맞춤 교육 상담', cta: '교육 상담 신청' } },
  { path: '/ax-ai', trigger: '#offer', target: '/?interest=ax-ai#inq', external: true, hideWhen: ['#inq'],
    copy: { accent: 'p1', title: 'AX 전환, 우리 조직 진단부터 시작하세요',
      sub: 'AI 활용 수준에 맞춘 전환 여정을 설계해 드립니다', short: 'AX 진단 상담', cta: '진단 상담받기', interest: 'ax-ai' } },
  { path: '/leadership', trigger: '#pain', target: '#inq', hideWhen: ['#inq'],
    copy: { accent: 'p2', title: '우리 조직에 맞는 리더십 과정을 설계해 드립니다',
      sub: '성장 단계별 리더 진단부터 운영까지', short: '리더십 과정 상담', cta: '도입 문의' } },
  { path: '/hrd', trigger: '#arch', target: '#inq', hideWhen: ['#inq'],
    copy: { accent: 'p3', title: 'HRD 운영, 지금 상황부터 진단해 드립니다',
      sub: '연수원 운영부터 학습 플랫폼까지 한 흐름으로', short: 'HRD 운영 상담', cta: '도입 문의' } },
  // /content 이동 대상은 상담 패널부터 보이도록 #mandatory-inquiry (#inq 폼을 감싼 법정 허브 빠른 상담 블록). 칩 선택은 #inq 기준 그대로
  { path: '/content', trigger: '#ax1', target: '#mandatory-inquiry', hideWhen: ['#inq', '#mandatory-inquiry'],
    copy: { accent: 'p4', title: '필요한 교육 콘텐츠, 맞춤 구성으로 제안해 드립니다',
      sub: '직무부터 법정필수까지 한 번에 상담하세요', short: '콘텐츠 도입 상담', cta: '상담 신청', interest: 'content' },
    zones: [{ selector: '#mandatory', copy: { accent: 'p4', title: '올해 법정교육, 필요한 과정부터 확인해 드립니다',
      sub: '담은 과정으로 바로 문의할 수 있습니다', short: '법정교육 상담', cta: '상담 신청', interest: 'compliance' } }] },
];

/** 설정 검증: 문제 목록 반환 (빈 배열이면 통과). 단위 테스트와 개발 모드 로드 시 함께 쓴다 */
export function validateFiData(pages: readonly FiPage[] = FLOATING_INQUIRY, validInterests?: readonly string[]): string[] {
  const errs: string[] = [];
  const copies = pages.flatMap((p) => [{ at: p.path, c: p.copy }, ...(p.zones ?? []).map((z) => ({ at: `${p.path} ${z.selector}`, c: z.copy }))]);
  for (const { at, c } of copies) {
    if ([...c.short].length > FI_SHORT_MAX) errs.push(`${at}: short "${c.short}" ${[...c.short].length}자 (최대 ${FI_SHORT_MAX})`);
    if ([...c.cta].length > FI_CTA_MAX) errs.push(`${at}: cta "${c.cta}" ${[...c.cta].length}자 (최대 ${FI_CTA_MAX})`);
    if (!FI_ACCENTS.includes(c.accent)) errs.push(`${at}: accent "${c.accent}" 유효하지 않음`);
    if (c.interest && validInterests && !validInterests.includes(c.interest)) errs.push(`${at}: interest "${c.interest}" 가 문의 폼 관심 영역 키에 없음`);
  }
  const paths = pages.map((p) => p.path);
  if (new Set(paths).size !== paths.length) errs.push('path 중복');
  return errs;
}

if (process.env.NODE_ENV === 'development') {
  const errs = validateFiData();
  if (errs.length) console.error('[floatingInquiry] 데이터 검증 실패\n' + errs.join('\n'));
}
