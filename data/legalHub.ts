// 법정필수교육 노출 B안 (홈 진입점 + /content#mandatory 허브) 전용 데이터·카피
// 기준: ref/legal/TECHSPEC_KEESS_26827_legal-B_v1.0.md §3-2 (확정본, 문구 수정 금지)
// 과정 데이터는 data/legal.ts(LEGAL_COURSES), 법령 근거·대상·주기는 lawOf(lawKey)(AX5.laws) 를 쓴다.

export const LEGAL_SEASON = { on: true } as const; // 홈 히어로 법정 슬라이드 표시 플래그 (off 면 홈이 B안 착수 전과 동일)

export const HUB_COPY = {
  // 홈 히어로 법정 슬라이드 (upgrade-01 LB18, TECHSPEC upgrade-01 §2-1). 이미지는 D6 결정: Unsplash 핫링크(ref/legal/IMAGE_SOURCES.md)
  heroSlide: {
    tag: '2026 법정필수교육',
    title: ['올해 법정교육,', '한 곳에서 준비하세요'],
    desc: '성희롱 예방부터 자금세탁방지까지 2026년 최신 7개 과정. 필요한 과정 확인부터 도입 상담까지 함께합니다.',
    primary: { label: '과정 보기', href: '/content#mandatory', gaId: 'home_hero_legal_courses' },
    secondary: { label: '빠른 상담', href: '/content#mandatory-inquiry', gaId: 'home_hero_legal_consult' },
    sub: { label: '과정소개서 받기', href: '/content#mandatory-resources', gaId: 'home_hero_legal_brochure' },
    trust: '7개 과정 · 매년 자체 제작 · 전담 운영자 배정',
    image: {
      src: 'https://images.unsplash.com/photo-1663524789611-2c8330848379?q=80&w=2000&auto=format&fit=crop',
      srcMobile: 'https://images.unsplash.com/photo-1663524789611-2c8330848379?q=80&w=1080&h=1350&auto=format&fit=crop',
      alt: '',
    },
  },
  head: {
    kicker: 'Compliance',
    title: ['필수 기준은 정확하게, 콘텐츠는 ', '매년 새롭게'],
    // upgrade-01 LB21: 리드 교체, season·tabs 제거 → 빠른 실행 3개
    lead: '2026년 법정필수교육 7개 과정을 확인하고 바로 상담을 신청하세요.',
    quick: [
      { label: '필요 과정 찾기', href: '#mandatory-diagnose', gaId: 'legal_quick_find' },
      { label: '과정 보기', href: '#mandatory-courses', gaId: 'legal_quick_courses' },
      { label: '빠른 상담', href: '#mandatory-inquiry', gaId: 'legal_quick_consult', consult: true },
    ],
  },
  diagnose: {
    // upgrade-01 LB22: kicker·sub·defaultNote 추가, empty 제거(결과 패널은 처음부터 공통 추천)
    kicker: '필요 과정 찾기',
    title: '우리 회사에 필요한 과정 찾기',
    sub: '3가지 질문에 답하면 추천 과정이 바로 바뀝니다.',
    defaultNote: '공통 추천입니다. 3가지 질문에 답하면 우리 회사 기준으로 바뀝니다.',
    q: [
      { key: 'size', label: '상시 근로자 수', options: [['lt10','10인 미만'],['10to49','10~49인'],['gte50','50인 이상']] },
      { key: 'pension', label: '퇴직연금 도입', options: [['yes','도입함'],['no','도입 안 함'],['unknown','잘 모름']] },
      { key: 'industry', label: '업종', options: [['finance','금융'],['public','공공기관'],['general','일반 기업']] },
    ],
    groups: { mandatory: '법정 의무', recommended: '권고', industry: '업종별 권장' },
    smallNote: '사업장 규모에 따라 교육 방식이 달라질 수 있습니다.',
    note: '참고용 결과입니다. 정확한 대상은 상담 시 확인해 드립니다.',
    addAll: '추천 과정 모두 담기',
    added: '담았습니다 · 선택 과정 보기',
  },
  lineup: {
    // upgrade-01 LB23: kicker·sub·customTile·detailConsult 추가, 제목 교체
    kicker: '과정 라인업',
    title: '2026 법정필수교육 7개 과정',
    sub: '과정을 담아 두면 상담 신청 시 그대로 전달됩니다.',
    customTile: {
      title: '찾는 과정이 없나요?',
      desc: '기업 상황에 맞춰 과정을 구성해 드립니다.',
      cta: '맞춤 구성 상담', gaId: 'legal_course_custom_consult',
    },
    detailConsult: '이 과정으로 상담',
    filters: [['all','전체'],['mandatory','법정 의무'],['recommended','권고'],['industry','업종별']],
    addMandatory: '법정 의무 과정 한 번에 담기',
    kindLabel: { mandatory: '법정 의무', recommended: '권고', industry: '업종별' },
    detail: '자세히 보기', preview: '맛보기', pick: '담기', picked: '담음',
    previewNote: '맛보기는 새 창에서 열립니다. 연결된 페이지의 \'맛보기 강의\' 버튼으로 재생됩니다.',
    sessionsUnit: '차시',
    // ── 단계 6 추가 (기술명세서 §3-2 에 없던 상세 패널 라벨. 문구는 PRD LB7·기술명세서 §6-5 표기 그대로)
    detailLabels: { audience: '이런 분께', goals: '학습 목표', outline: '주요 학습 내용', instructor: '강사', law: '법적 근거' },
    previewFull: '맛보기 보기',
    prev: '이전 과정', next: '다음 과정', close: '닫기',
  },
  law: {
    title: '법정 기준',
    cols: ['교육', '구분', '근거', '대상', '주기'],
    basis: '2026년 9월 기준 · 출처: 찾기쉬운 생활법령정보, 한국장애인고용공단',
    notes: ['실제 적용 대상은 사업장 여건에 따라 다를 수 있습니다.', '과태료 등 제재 기준은 상담 시 최신 법령으로 안내해 드립니다.'],
    // 단계 7 추가: 근거가 없는 과정의 근거·대상·주기 칸 (기술명세서 §6-6 표기)
    consult: '상담 시 안내',
  },
  ops: {
    title: '교육은 저희가 운영하고, 담당자는 결과만 확인하세요',
    items: [
      { t: '전담 운영자 정·부 2명 지정', d: '운영 공백 없이 상시 대응합니다.', show: true },
      { t: '월 1회 이상 방문 관리', d: '의견을 듣고 운영 품질을 점검합니다.', show: true },
      { t: '이수 현황·수료증 관리', d: '', show: false },  // 요청자 확인 전 비표시
      { t: '미이수자 학습 독려', d: '', show: false },    // 요청자 확인 전 비표시
    ],
  },
  // current: 단계 7 추가 (기존 ax5 타임라인의 현재 시리즈 표기 그대로)
  diff: { title: '매년 새로운 시리즈, 몰입하는 법정교육', current: '현재 시리즈' },
  resources: {
    id: 'mandatory-resources',
    title: '카드뉴스와 과정소개서',
    brochure: { title: '2026 법정필수교육 과정소개서', desc: '과정 구성, 학습 목표, 강사 정보를 PDF로 받아보세요.', cta: '과정소개서 받기', next: '담은 과정으로 도입 문의하기' },
    cardNewsLabel: '법정교육 카드뉴스', placeholder: '디자인 재제작 예정',
  },
  faq: { show: false, items: [] as { q: string; a: string }[] }, // 답변 확정 전 비표시
  inquiry: {
    panelTitle: ['매년 받는 법정교육,', 'KG에듀원에서 한 번에 관리하세요'],
    panelBody: '선택하신 과정을 기준으로 담당자가 영업일 1일 내 연락드립니다.',
    foldLabel: '추가 정보 (선택)',
  },
  tray: { count: (n: number) => `선택 과정 ${n}개`, more: (n: number) => `외 ${n}`, cta: '문의하기', listTitle: '선택한 과정', remove: '빼기' },
} as const;
