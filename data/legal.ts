// 법정필수교육 노출 A안 (/legal) — 데이터·카피 단일 원본
// 기준: ref/legal/TECHSPEC_KEESS_26827_legal-A_v1.0.md §2 (카피 확정본, 변경 금지)
// AX5(법정 기준·근거)는 data/content.ts 에서 import 하여 값 재기입 금지.

import { AX5 } from '@/data/content';

export type LegalCourseId =
  | 'harassment' | 'sexual' | 'disability' | 'ethics' | 'pension' | 'privacy' | 'aml';

/** 구분 배지 (legal-B §3-1) — 법정 의무 / 권고 / 업종별. 색이 아니라 문구로 구분한다 */
export type LegalKind = 'mandatory' | 'recommended' | 'industry';

export interface LegalCourse {
  id: LegalCourseId;
  order: number;
  name: string;           // 카드·접근성 라벨용 정식명
  option: string;         // 희망과정 체크박스 라벨
  classkey: string;
  thumb: string;
  lawKey: string | null;  // AX5.laws[].h3 와 일치할 때만 값, 없으면 null
  // ── B안 추가 (legal-B §3-1). 출처: 2026 법정필수교육 과정소개서 PDF p.9~15, 비용 항목은 옮기지 않는다
  kind: LegalKind;
  kindNote?: string;      // 업종별 표기 보조 (예: '금융', '공공·기업')
  sessions: number;       // 차시 (소개서 '학습차시')
  short: string;          // 카드 제목용 짧은 이름
  detail: {
    audience: string[];       // 이런 분께 (소개서 '학습대상')
    goals: string[];          // 학습 목표 (소개서 '학습목표', 명사형 개조식으로만 다듬음)
    outline: string[] | null; // 주요 학습 내용 (소개서 표기 그대로, null 이면 비표시)
    instructor: { name: string; bio: string }; // 소개서 'SME 정보' 대표 약력 1줄
  };
}

export const LEGAL_COURSES: readonly LegalCourse[] = [
  // 소개서 p.11
  { id: 'harassment', order: 1, name: '법정헌터스 직장 내 괴롭힘 예방 교육편', option: '직장 내 괴롭힘 예방 교육', classkey: '403888', thumb: '/images/legal/harassment.jpg', lawKey: '직장 내 괴롭힘 예방',
    kind: 'recommended', sessions: 2, short: '직장 내 괴롭힘 예방',
    detail: {
      audience: ['직장 내 괴롭힘에 대한 학습과 대응방안이 필요한 직장인', '직장 내 괴롭힘 예방교육 실시가 필요한 사업주'],
      goals: ['직장 내 고충발생 원인 및 대응 필요성 설명', '직장 내 괴롭힘 구제절차 설명'],
      outline: ['직장 내 고충발생 원인 및 대응 필요성', '직장 내 괴롭힘 구제절차'],
      instructor: { name: '박정연', bio: '노무법인 마로 대표' },
    } },
  // 소개서 p.9 (주요 학습 내용은 장애인 과정 내용이 잘못 들어가 있어 null, 수정본 수령 시 추가)
  { id: 'sexual',     order: 2, name: '법정헌터스 성희롱 예방 교육편',         option: '성희롱 예방 교육',         classkey: '403886', thumb: '/images/legal/sexual.jpg',     lawKey: '성희롱 예방',
    kind: 'mandatory', sessions: 2, short: '성희롱 예방',
    detail: {
      audience: ['성희롱에 대한 학습과 예방이 필요한 직장인', '성희롱 예방교육 실시가 필요한 사업주'],
      goals: ['직장 내 성희롱 관련 법령과 개념 설명', '직장 내 성희롱 성립요건과 유형 설명', '직장 내 성희롱 발생 시 고충상담 및 구제절차 설명'],
      outline: null,
      instructor: { name: '박정연', bio: '노무법인 마로 대표' },
    } },
  // 소개서 p.10
  { id: 'disability', order: 3, name: '법정헌터스 장애인 인식개선 교육편',     option: '장애인 인식개선 교육',     classkey: '403887', thumb: '/images/legal/disability.jpg', lawKey: '장애인 인식개선',
    kind: 'mandatory', sessions: 2, short: '장애인 인식개선',
    detail: {
      audience: ['장애인 인식개선을 통해 행복한 직장을 만들고자 하는 직장인', '장애인 인식개선 교육 실시가 필요한 사업주'],
      goals: ['장애인에 대한 올바른 이해를 통한 장애에 대한 편견과 인식 개선', '장애 유형별 특성 이해 및 함께 일하기 위한 에티켓 숙지'],
      outline: ['장애인에 대한 인식', '장애의 유형별 특성'],
      instructor: { name: '김혜원', bio: '한국장애인고용공단 장애인인식개선교육 강사자격' },
    } },
  // 소개서 p.12
  { id: 'ethics',     order: 4, name: '법정헌터스 윤리경영 교육편',            option: '윤리경영 교육',            classkey: '403890', thumb: '/images/legal/ethics.jpg',     lawKey: null,
    kind: 'industry', kindNote: '공공·기업', sessions: 2, short: '윤리경영',
    detail: {
      audience: ['공기업, 공공기관, 기업체 임직원', '윤리경영이 필요한 모든 기업체 임직원'],
      goals: ['기업 생존 전략과 사회·제도의 진화 설명', '윤리경영의 발달 단계 및 내재화 방법 설명'],
      outline: ['윤리경영의 시대: 기업 생존 전략과 사회·제도의 진화', '윤리경영의 시대: 내재화 및 조직문화 형성'],
      instructor: { name: '이서연', bio: '한국 자기경영 연구소 대표' },
    } },
  // 소개서 p.13
  { id: 'pension',    order: 5, name: '법정헌터스 퇴직연금가입자 교육편',      option: '퇴직연금 가입자 교육',     classkey: '403889', thumb: '/images/legal/pension.jpg',    lawKey: '퇴직연금',
    kind: 'mandatory', sessions: 3, short: '퇴직연금 가입자',
    detail: {
      audience: ['퇴직연금제도에 대한 학습이 필요한 직장인', '퇴직연금 교육의 실시가 필요한 사업주'],
      goals: ['퇴직연금제도의 도입배경 이해 및 퇴직급여의 종류 설명', '퇴직연금제도가 사용자와 근로자에게 주는 이익 이해 및 퇴직연금의 적절한 운용'],
      outline: ['퇴직연금제도의 기본이해', '퇴직연금 제도의 변경', '퇴직연금 상품 예시'],
      instructor: { name: '박정연', bio: '노무법인 마로 대표' },
    } },
  // 소개서 p.14
  { id: 'privacy',    order: 6, name: '[김경식×with.선] 개인정보보호 및 정보보안교육', option: '개인정보보호 및 정보보안 교육', classkey: '404463', thumb: '/images/legal/privacy.jpg', lawKey: '개인정보보호',
    kind: 'recommended', sessions: 4, short: '개인정보보호·정보보안',
    detail: {
      audience: ['다양한 사이버 공격의 위험성을 알고 개인정보보호를 실천해야 하는 임직원', '정보보안 관련 법령이 아닌 실제 업무 시 적용할 수 있는 개인정보보호 실천법이 필요한 임직원'],
      goals: ['개인정보의 정의와 보호 필요성, 그리고 유출 피해의 심각성 인식', '개인정보보호법의 핵심 조항과 보호 원칙 이해 및 실제 업무 적용'],
      outline: ['개인정보보호의 기본 개념과 개인정보 보호 필요성', '개인정보의 유형과 개인정보보호법 이해', '정보보안의 개념과 위협 사례', '일상에서 실천하는 개인정보 보호 및 정보보안 수칙'],
      instructor: { name: '안성열', bio: '법무법인 새별 대표변호사' },
    } },
  // 소개서 p.15 (주요 학습 내용은 원문에 없어 null)
  { id: 'aml',        order: 7, name: '꼭 알아야 하는 자금세탁방지법',          option: '자금세탁방지 교육',        classkey: '404905', thumb: '/images/legal/aml.jpg',        lawKey: null,
    kind: 'industry', kindNote: '금융', sessions: 12, short: '자금세탁방지',
    detail: {
      // 소개서 p.15 학습대상 오기재 추정(금융소비자보호 문구), 요청자 확인 대기
      audience: ['금융기관 종사자'],
      goals: ['불법자금의 세탁을 적발하고 예방하기 위한 자금세탁방지법의 자세한 내용 파악 및 최신 법규의 규제 사항에 대한 발빠른 파악과 대응', '사례를 통한 자금세탁방지법의 활용 범위와 사례 분석 및 실생활 반영'],
      outline: null,
      instructor: { name: '정지열', bio: '자금세탁방지전문가(CAMS) 자격 보유' },
    } },
];

/** id → 과정 (없으면 undefined) */
export const courseById = (id: LegalCourseId) => LEGAL_COURSES.find((c) => c.id === id);

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

// 카드뉴스 4장 (디자이너 요청 확정본, 1080×1350). 재제작본 수령 시 src 만 '/images/legal/cardnews-01.jpg' ~ '04.jpg' 로 교체
export const LEGAL_CARDNEWS: { src: string | null; alt: string }[] = [
  { src: null, alt: '법정교육, 우리 회사는 몇 개나 끝냈나요?' },
  { src: null, alt: '교육만 열면 끝일까요?' },
  { src: null, alt: '2026년 최신 법정필수교육, KG에듀원이 한 곳에 모았습니다' },
  { src: null, alt: '올해 법정교육, 지금 KG에듀원에서 점검하세요' },
];
