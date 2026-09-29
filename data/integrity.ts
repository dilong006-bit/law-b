// 청렴훈련 캠페인 게재 (ref/integrity/TECHSPEC_KEESS_integrity-campaign_v1.0.md §3) — 카피 단일 정의, 문구 수정 금지
// 이미지는 한국산업인력공단 캠페인 배너의 일러스트 영역만 자른 가공 완료본(730×328). 출처: ref/integrity/ASSET_SOURCES.md

/** 부정훈련 모달 탭 키. 기존 3개 탭 키('info'·'report'·'lookup')는 그대로 두고 캠페인만 추가 */
export type IntegrityTab = 'campaign' | 'info' | 'report' | 'lookup';

export const INTEGRITY_COPY = {
  modalTitle: '청렴훈련 · 부정훈련 신고',
  tabLabel: '청렴훈련 캠페인',
  visual: {
    png: '/images/integrity/integrity-campaign-visual.png',
    webp: '/images/integrity/integrity-campaign-visual.webp',
    width: 730, height: 328,
    alt: '캠페인 청렴훈련, #건강한 훈련문화, 부당영업 NO, 청렴훈련 YES',
    caption: '한국산업인력공단 청렴훈련 캠페인',
  },
  tag: '#건강한 훈련문화',
  title: '캠페인 청렴훈련',
  lead: '법정의무교육은 강요하지 않습니다.',
  pair: { no: '부당영업 NO', yes: '청렴훈련 YES' },
  credit: '청렴훈련 캠페인은 한국산업인력공단과 함께 합니다.',
  report: { q: '부당영업·부정훈련을 알고 계신가요?', cta: '신고 접수로 이동' },
  footer: { guide: '청렴훈련 · 부정훈련 예방', report: '부정훈련 신고' },
} as const;
