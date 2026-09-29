// 법정필수교육 노출 B안 (홈 진입점 + /content#mandatory 허브) 전용 데이터·카피
// 기준: ref/legal/TECHSPEC_KEESS_26827_legal-B_v1.0.md §3-2 (확정본, 문구 수정 금지)
// 과정 데이터는 data/legal.ts(LEGAL_COURSES), 법령 근거·대상·주기는 lawOf(lawKey)(AX5.laws) 를 쓴다.

import type { LgIconName } from '@/lib/legal/iconData';

export const LEGAL_SEASON = { on: true } as const; // 홈 히어로 법정 슬라이드 표시 플래그 (off 면 홈이 B안 착수 전과 동일)

export const HUB_COPY = {
  // 홈 히어로 법정 슬라이드 (upgrade-01 LB18, TECHSPEC upgrade-01 §2-1). 이미지는 D6 결정: Unsplash 핫링크(ref/legal/ASSET_SOURCES.md)
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
    // upgrade-03 LB46: 리드 다이어트(TECHSPEC §5-3 초안), '7개 과정'은 수치 스트립이 대신
    lead: '과정 확인부터 상담까지 한 곳에서',
    // upgrade-03 LB45 수치 스트립 (사실 확인 값만: 과정 7 · 진단 3문항 · 도입 4단계 · 영업일 1일 내 연락 = 빠른 상담 약속과 같은 근거)
    stats: [
      { num: '7', label: '과정' },
      { num: '3', label: '문항 진단' },
      { num: '4', label: '단계 도입' },
      { num: '1일', label: '내 연락' },
    ],
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
    // upgrade-03 LB46: 리드 §5-3 초안, 기본 안내는 리드와 같은 뜻이라 한 문장으로
    sub: '답하는 즉시 추천 과정이 바뀝니다',
    defaultNote: '공통 추천입니다.',
    q: [
      { key: 'size', label: '상시 근로자 수', options: [['lt10','10인 미만'],['10to49','10~49인'],['gte50','50인 이상']] },
      { key: 'pension', label: '퇴직연금 도입', options: [['yes','도입함'],['no','도입 안 함'],['unknown','잘 모름']] },
      { key: 'industry', label: '업종', options: [['finance','금융'],['public','공공기관'],['general','일반 기업']] },
    ],
    groups: { mandatory: '법정 의무', recommended: '권고', industry: '업종별 권장' },
    // upgrade-03 LB41: 문항 라벨 아이콘 · 결과 요약 (추천 N 과정 + 구분 막대, 범례는 그룹 제목 배지가 겸함 D26)
    qIcons: { size: 'users', pension: 'piggy-bank', industry: 'building-2' } as Record<string, LgIconName>,
    summary: { pre: '추천', post: '과정', bar: (parts: string[]) => parts.join(', ') },
    smallNote: '사업장 규모에 따라 교육 방식이 달라질 수 있습니다.',
    note: '참고용 결과입니다. 정확한 대상은 상담 시 확인해 드립니다.',
    addAll: '추천 과정 모두 담기',
    added: '담았습니다 · 선택 과정 보기',
  },
  lineup: {
    // upgrade-01 LB23: kicker·sub·customTile·detailConsult 추가, 제목 교체
    kicker: '과정 라인업',
    title: '2026 법정필수교육 7개 과정',
    sub: '담은 과정은 상담에 그대로 전달됩니다', // upgrade-03 LB46 §5-3 초안
    customTile: {
      title: '찾는 과정이 없나요?',
      desc: '기업 상황에 맞춰 과정을 구성해 드립니다.',
      cta: '맞춤 구성 상담', gaId: 'legal_course_custom_consult',
      icon: 'puzzle' as LgIconName, // upgrade-03 LB42 아이콘 타일
    },
    detailConsult: '이 과정으로 상담',
    filters: [['all','전체'],['mandatory','법정 의무'],['recommended','권고'],['industry','업종별']],
    addMandatory: '법정 의무 과정 한 번에 담기',
    kindLabel: { mandatory: '법정 의무', recommended: '권고', industry: '업종별' },
    // upgrade-03 D22: 구분 배지 아이콘 (의무 shield-check / 권고 lightbulb / 업종별 briefcase)
    kindIcons: { mandatory: 'shield-check', recommended: 'lightbulb', industry: 'briefcase' } as Record<'mandatory' | 'recommended' | 'industry', LgIconName>,
    sessionsIcon: 'circle-play' as LgIconName,
    detail: '자세히 보기', preview: '맛보기', pick: '담기', picked: '담음',
    // upgrade-03 LB46: previewNote 삭제 (맛보기 링크의 새 창 아이콘·aria-label 과 중복)
    sessionsUnit: '차시',
    // ── 단계 6 추가 (기술명세서 §3-2 에 없던 상세 패널 라벨. 문구는 PRD LB7·기술명세서 §6-5 표기 그대로)
    detailLabels: { audience: '이런 분께', goals: '학습 목표', outline: '주요 학습 내용', instructor: '강사', law: '법적 근거' },
    // upgrade-03 LB42: 상세 소제목 아이콘
    detailIcons: { audience: 'users', goals: 'target', outline: 'list-checks', instructor: 'user-round', law: 'scale' } as Record<'audience' | 'goals' | 'outline' | 'instructor' | 'law', LgIconName>,
    previewFull: '맛보기 보기',
    prev: '이전 과정', next: '다음 과정', close: '닫기',
  },
  law: {
    // upgrade-01 LB24: BlockHead kicker·제목 (표 데이터·기준일·출처·안내 문구는 v1.0 그대로)
    kicker: '법정 기준',
    title: '교육별 법적 근거와 대상',
    cols: ['교육', '구분', '근거', '대상', '주기'],
    basis: '2026년 9월 기준 · 출처: 찾기쉬운 생활법령정보, 한국장애인고용공단',
    notes: ['실제 적용 대상은 사업장 여건에 따라 다를 수 있습니다.', '과태료 등 제재 기준은 상담 시 최신 법령으로 안내해 드립니다.'],
    // 단계 7 추가: 근거가 없는 과정의 근거·대상·주기 칸 (기술명세서 §6-6 표기)
    consult: '상담 시 안내',
  },
  // upgrade-01 LB24: 운영 지원·차별점 독립 블록을 차이 카드 3장으로 흡수. 운영 항목은 확인된 2개만
  // current: 기존 ax5 타임라인의 현재 시리즈 표기 그대로
  diff: {
    title: 'KG에듀원 법정교육이 다른 점',
    current: '현재 시리즈',
    // upgrade-03 LB43: 비교표 행 라벨 아이콘(AX5.diff 행 순서) · KG 열 표시
    rowIcons: ['clapperboard', 'pen-line', 'refresh-cw', 'sparkles', 'settings-2'] as LgIconName[],
    kgMark: 'circle-check' as LgIconName,
    cards: [
      // upgrade-03 LB46: 설명에서 제목 반복 제거 (매년 새로 제작 / 이야기)
      { key: 'series', title: '매년 새로운 시리즈', desc: '반복 수강의 지루함을 줄입니다.' },
      { key: 'story', title: '몰입형 스토리 콘텐츠', desc: '법정 필수 내용을 자연스럽게 익힙니다.', more: '비교표 보기', less: '비교표 닫기' },
      { key: 'ops', title: '전담 운영 지원', items: ['전담 운영자 정·부 2명 지정', '월 1회 이상 방문 관리'] },
    ],
  },
  // upgrade-01 LB25 + upgrade-02 LB35: 도입 절차 독립 블록
  process: {
    id: 'mandatory-process',
    kicker: '도입 절차',
    title: '신청부터 운영까지 4단계',
    steps: [
      // upgrade-03 LB46: 설명 20자 이내로 단축(사실 범위 유지). 10/1 미팅에서 최종 확정
      { key: 'pick', label: '과정 선택', desc: '진단·과정 카드에서 과정을 담습니다' },
      { key: 'apply', label: '상담 신청', desc: '담은 과정으로 상담을 신청합니다' },
      { key: 'fix', label: '구성 확정', desc: '인원·일정·운영 방식을 함께 정합니다' },
      { key: 'run', label: '교육 운영', desc: '전담 운영자가 운영을 지원합니다' },
    ],
    cta: { label: '빠른 상담 신청', gaId: 'legal_process_consult' },
  },
  // upgrade-02 LB32·LB33: 카드뉴스 스토리 + 소개서 컴팩트 카드
  resources: {
    id: 'mandatory-resources',
    kicker: '자료',
    title: '카드뉴스와 과정소개서',
    // upgrade-03 LB46: 리드 생략 (목차 제목 '카드뉴스로 먼저 보기' 가 역할을 대신)
    cardNewsLabel: '법정교육 카드뉴스',
    storyTitle: '카드뉴스로 먼저 보기',
    counter: (i: number, n: number) => `${i} / ${n}`,
    prev: '이전 카드', next: '다음 카드',
    open: (n: number) => `카드뉴스 ${n}번 크게 보기`,
    close: '닫기',
    brochure: {
      title: '2026 법정필수교육 과정소개서',
      includes: ['과정 구성', '학습 목표', '강사 정보'],
      meta: 'PDF · 7개 과정',
      cta: '과정소개서 받기',
      next: '담은 과정으로 빠른 상담하기',
      cover: { src: '/images/legal/brochure-cover.jpg', alt: '2026 법정필수교육 과정소개서 표지' },
    },
  },
  faq: { show: false, items: [] as { q: string; a: string }[] }, // 답변 확정 전 비표시
  // 빠른 상담 (upgrade-02 LB34 패널 + upgrade-01 LB27 짧은 폼). 사진은 장식(alt 빈 값), 출처 ref/legal/ASSET_SOURCES.md
  inquiry: {
    kicker: '빠른 상담',
    panelTitle: ['매년 받는 법정교육,', 'KG에듀원에서 한 번에 관리하세요'],
    promises: [
      { icon: 'clock', text: '영업일 1일 내 담당자가 연락드립니다' },
      { icon: 'users', text: '담은 과정 기준으로 인원·일정에 맞춘 운영 방식을 안내합니다' },
    ],
    pickedTitle: (n: number) => `담은 과정 ${n}개`,
    // upgrade-03 LB46: 빈 상태 문구 삭제 — '담은 과정 0개' 제목과 같은 뜻
    addCommon: '공통 추천 4과정 담기',
    remove: '빼기',
    photo: { src: 'https://images.unsplash.com/photo-1668092548064-730e05fd0324', alt: '' },
  },
  tray: { count: (n: number) => `선택 과정 ${n}개`, more: (n: number) => `외 ${n}`, cta: '빠른 상담', listTitle: '선택한 과정', remove: '빼기' },
} as const;
