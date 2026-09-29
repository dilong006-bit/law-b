// 법정필수교육 노출 A안 (/legal) — 데이터·카피 단일 원본
// 기준: ref/legal/TECHSPEC_KEESS_26827_legal-A_v1.0.md §2 (카피 확정본, 변경 금지)
// AX5(법정 기준·근거)는 data/content.ts 에서 import 하여 값 재기입 금지.

import { AX5 } from '@/data/content';

export type LegalCourseId =
  | 'harassment' | 'sexual' | 'disability' | 'ethics' | 'pension' | 'privacy' | 'aml';

export interface LegalCourse {
  id: LegalCourseId;
  order: number;
  name: string;           // 카드·접근성 라벨용 정식명
  option: string;         // 희망과정 체크박스 라벨
  classkey: string;
  thumb: string;
  lawKey: string | null;  // AX5.laws[].h3 와 일치할 때만 값, 없으면 null
}

export const LEGAL_COURSES: readonly LegalCourse[] = [
  { id: 'harassment', order: 1, name: '법정헌터스 직장 내 괴롭힘 예방 교육편', option: '직장 내 괴롭힘 예방 교육', classkey: '403888', thumb: '/images/legal/harassment.jpg', lawKey: '직장 내 괴롭힘 예방' },
  { id: 'sexual',     order: 2, name: '법정헌터스 성희롱 예방 교육편',         option: '성희롱 예방 교육',         classkey: '403886', thumb: '/images/legal/sexual.jpg',     lawKey: '성희롱 예방' },
  { id: 'disability', order: 3, name: '법정헌터스 장애인 인식개선 교육편',     option: '장애인 인식개선 교육',     classkey: '403887', thumb: '/images/legal/disability.jpg', lawKey: '장애인 인식개선' },
  { id: 'ethics',     order: 4, name: '법정헌터스 윤리경영 교육편',            option: '윤리경영 교육',            classkey: '403890', thumb: '/images/legal/ethics.jpg',     lawKey: null },
  { id: 'pension',    order: 5, name: '법정헌터스 퇴직연금가입자 교육편',      option: '퇴직연금 가입자 교육',     classkey: '403889', thumb: '/images/legal/pension.jpg',    lawKey: '퇴직연금' },
  { id: 'privacy',    order: 6, name: '[김경식×with.선] 개인정보보호 및 정보보안교육', option: '개인정보보호 및 정보보안 교육', classkey: '404463', thumb: '/images/legal/privacy.jpg', lawKey: '개인정보보호' },
  { id: 'aml',        order: 7, name: '꼭 알아야 하는 자금세탁방지법',          option: '자금세탁방지 교육',        classkey: '404905', thumb: '/images/legal/aml.jpg',        lawKey: null },
];

/** KGESA 오픈 시 이 함수만 교체 */
export const previewUrl = (classkey: string) =>
  `https://samplezone.campus21.co.kr/classpreview.asp?classkey=${classkey}`;

/** lawKey → AX5.laws 조회 (값 재기입 금지) */
export const lawOf = (key: string | null) => (key ? AX5.laws.find((l) => l.h3 === key) ?? null : null);

// 희망과정 옵션 표시 순서 (PC 2열 가로 읽기 순서)
export const LEGAL_COURSE_OPTIONS = [
  '직장 내 괴롭힘 예방 교육', '장애인 인식개선 교육', '성희롱 예방 교육', '윤리경영 교육',
  '퇴직연금 가입자 교육', '개인정보보호 및 정보보안 교육', '자금세탁방지 교육',
] as const;
export const LEGAL_ETC_MAX = 50;

// 카피 상수 (확정본, 변경 금지)
export const LEGAL_COPY = {
  meta: { title: '2026 법정필수교육 | KEESS', description: '성희롱 예방부터 자금세탁방지까지 2026년 최신 법정필수교육. 과정 미리보기, 과정소개서, 도입 문의를 한 곳에서.' },
  hero: {
    badge: '2026 법정필수교육',
    h1: ['법정필수교육,', 'KG에듀원에서 한 번에'],
    lead: '연 1회 이상 받아야 하는 재직자 필수 교육을 최신 콘텐츠로 준비했습니다. 과정 확인부터 운영까지 한 곳에서 관리하세요.',
    points: ['연 1회 이상 의무 이수 대상 과정', '매년 자체 제작하는 2026년 최신 콘텐츠', '권장교육까지 기업 맞춤 구성'],
    ctaPrimary: '도입 문의하기',
    ctaSecondary: '과정소개서 받기',
    moreTile: { t: '권장교육 과정도 함께', a: '전체 과정 리스트 보기', href: '/content#download' },
  },
  subnav: [
    { id: 'legal-courses', label: '과정 라인업' },
    { id: 'legal-resources', label: '자료' },
    { id: 'legal-standard', label: '법정 기준' },
    { id: 'legal-inquiry', label: '도입 문의' },
  ],
  courses: {
    eyebrow: 'Courses', title: '2026 법정필수교육 과정', sub: '과정별 미리보기로 콘텐츠를 먼저 확인해 보세요.',
    tag: '법정의무', preview: '미리보기',
    note: '미리보기는 새 창에서 열립니다. 맛보기 강의는 연결된 페이지의 \'맛보기 강의\' 버튼으로 재생됩니다.',
  },
  resources: {
    eyebrow: 'Resources', title: '카드뉴스와 과정소개서',
    cardNewsLabel: '법정교육 카드뉴스', placeholder: '디자인 재제작 예정',
    brochureTitle: '(KG에듀원) 2026 법정필수교육 과정소개서',
    brochureDesc: '과정 구성, 학습 목표, 강사 정보를 한 번에 확인할 수 있습니다. 간단한 정보 입력 후 바로 받아보세요.',
    brochureCta: '과정소개서 받기',
    // 파일 미수령 상태 안내 (확정: '자료 준비 중입니다. 입력하신 이메일로 보내드립니다.')
    // 모달 완료 화면에서 제목·본문 두 줄로 나눠 그대로 노출한다.
    brochurePendingTitle: '자료 준비 중입니다.',
    brochurePendingMsg: '입력하신 이메일로 보내드립니다.',
    previewLink: '과정 미리보기로 이동',
  },
  standard: { eyebrow: 'Compliance', title: '법정 기준은 정확하게, 콘텐츠는 매년 새롭게' },
  inquiry: {
    panelTitle: ['매년 받는 법정교육,', 'KG에듀원에서 한 번에 관리하세요'],
    panelBody: '우리 기업에 필요한 법정교육을 한 번에 안내합니다. 문의를 남겨주시면 담당자가 영업일 기준 1일 내 회신드립니다.',
    fieldLabel: '희망과정', etcLabel: '기타', etcPlaceholder: '희망 과정을 입력해 주세요',
    errRequired: '희망과정을 1개 이상 선택해 주세요.', errEtc: '기타 과정명을 입력해 주세요.',
  },
  contentLink: '법정필수교육 과정·미리보기 전체 보기',
} as const;

// 카드뉴스 (재제작본 수령 시 src만 '/images/legal/cardnews-0N.jpg' 로 교체, 1080×1350)
export const LEGAL_CARDNEWS: { src: string | null; alt: string }[] =
  Array.from({ length: 7 }, (_, i) => ({ src: null, alt: `법정교육 카드뉴스 ${i + 1} / 7` }));
