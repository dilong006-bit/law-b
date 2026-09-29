# 기술명세서 증분: KEESS 법정필수교육 노출 B안 upgrade-03 (시각 고도화)

| 항목 | 내용 |
|------|------|
| **Version** | 1.3 (Enhancement #3) |
| **상위 문서** | PRD_KEESS_26827_legal-B_v1.0_upgrade-03.md (LB40~LB47) |
| **기준 명세** | TECHSPEC v1.0, upgrade-01, upgrade-02 (결정 D1~D18). 이 문서에 없는 내용은 기준 명세 그대로 |
| **전략 근거** | KEESS_26827_법정필수_B안_시각고도화전략_upgrade-04_260929.md |
| **기준 커밋** | 커밋 13 반영본 |
| **작성일** | 2026-09-29 |

---

## 0. 전제

### 0-1. 유지
- 절대 규칙, 밸런스 B1~B8, 짝 설계 D13, 높이 예산 D16·D17, 대비 D9·D18, Lucide 단일 세트 D10

### 0-2. 추가 결정
| 코드 | 결정 |
|---|---|
| D19 | 아이콘 규칙 I1~I8 (전략 §3) 을 허브 전체에 적용 |
| D20 | 아이콘 크기 3단: 16 (배지·칩) / 20 (라벨·행) / 24 (아이콘 타일) |
| D21 | 아이콘 타일 `.lg-ico-tile`: 40×40, radius 12px (기존 라운드 값 중 가장 가까운 값 사용, 없으면 --r), 배경 P4 8% (D5 is-accent 배경과 동일), 아이콘 --ink |
| D22 | 구분 배지 컴포넌트 1종(`KindBadge`)을 진단·법정 표·과정 카드가 공유 |
| D23 | 글자 수 측정 예외: 법적 고지(참고용 결과, 기준일·출처, 제재 안내), 과정 원문(detail.*), 법정 표 셀 |
| D24 | 글자 수 측정 기준: 빠른 상담 폼 제외 (홈·/kium 과 공유하는 HomeInquiry 라 허브에서 문구를 바꿀 수 없음). 기준값 A = 1163 (커밋 13 반영본, 1440) |
| D25 | 수치 스트립 배치: 1041 이상 빠른 실행(8열) 옆 4열(`data-balance-row`, `data-pair="peer"`), 1040 이하 리드 아래, 560 이하 4칸 한 줄 우선(숫자 22 = 허브 h2 390 계산값, 라벨 12). 라벨 줄바꿈·44px 침범 시 2×2. 헤더 높이 상한 +90px 는 1440 기준 |
| D26 | 진단 범례: 별도 범례 없이 그룹 제목 KindBadge 가 개수를 포함해 범례를 겸함. 막대 바로 아래 그룹 제목이 막대 색 순서(의무·권고·업종별)와 같게 배치, 색만으로 구분하지 않음 |

---

## 1. 파일 맵
| 구분 | 경로 | LB |
|---|---|---|
| 수정 | scripts/gen-legal-icons.mjs (NAMES 추가) → lib/legal/iconData.ts 재생성 | 전체 |
| 수정 | data/legal.ts (`icon` 필드) | LB40 |
| 수정 | data/legalHub.ts (stats, 아이콘 매핑, 리드 다이어트) | LB41~46 |
| 신규 | components/legal-hub/KindBadge.tsx | LB41, LB44 |
| 신규 | components/legal-hub/CourseIcon.tsx (id → LgIcon) | LB40 |
| 신규 | components/legal-hub/HubStats.tsx | LB45 |
| 신규 | components/legal-hub/DiagSummary.tsx | LB41 |
| 수정 | HubHead, Diagnose, CourseCard, CourseDetail, CustomTile, StandardAndDiff(LawTable·비교표), PickTray, ConsultSummary | LB40~44 |
| 수정 | styles/legal-hub.css | 전체 |
| 수정 | test-results/legal-b/tools (검수 스크립트, gitignore) + scripts/verify-legal-b.mjs | LB47 |

---

## 2. 아이콘 추가 (gen-legal-icons.mjs NAMES)

```js
// 과정 아이덴티티 (후보 배열: 앞에서부터 존재하는 첫 이름 사용)
const COURSE_ICON_CANDIDATES = {
  harassment: ['heart-handshake', 'users-round'],
  sexual:     ['shield-user', 'shield-alert', 'shield'],
  disability: ['accessibility'],
  ethics:     ['scale'],
  pension:    ['piggy-bank'],
  privacy:    ['lock-keyhole', 'lock'],
  aml:        ['landmark'],
};
// 그 밖에 추가
'users','building-2','lightbulb','briefcase','circle-play','target','user-round','puzzle',
'pen-line','sparkles','settings-2','circle-check'
```
- 스크립트가 후보를 순서대로 찾고, 선택 결과를 `lib/legal/iconData.ts` 하단에 `export const COURSE_ICON = {...} as const` 로 함께 출력
- 과정 id 는 기존 LegalCourseId 와 일치해야 함 (다르면 코드의 id 를 기준으로 매핑하고 보고)
- 모든 후보가 없으면 스크립트 실패 → 보고

---

## 3. 데이터

### 3-1. data/legal.ts
```ts
import { COURSE_ICON } from '@/lib/legal/iconData';
// LEGAL_COURSES 각 항목에 icon: COURSE_ICON[id]
```

### 3-2. data/legalHub.ts (추가·변경)
```ts
head: {
  // 리드 다이어트 결과로 교체 (1줄 32자 이내)
  stats: [
    { num: '7', label: '과정' },
    { num: '3', label: '문항 진단' },
    { num: '4', label: '단계 도입' },
    { num: '1일', label: '내 연락' },
  ],
},
diagnose: {
  qIcons: { size: 'users', pension: 'piggy-bank', industry: 'building-2' },
  groupIcons: { mandatory: 'shield-check', recommended: 'lightbulb', industry: 'briefcase' },
  summary: { pre: '추천', post: '과정' },
},
lineup: {
  sessionsIcon: 'circle-play',
  detailIcons: { audience: 'users', goals: 'target', outline: 'list-checks', instructor: 'user-round', law: 'scale' },
  customTile: { /* 기존 */ icon: 'puzzle' },
},
diff: {
  rowIcons: ['clapperboard', 'pen-line', 'refresh-cw', 'sparkles', 'settings-2'], // difftable 행 순서와 동일
  kgMark: 'circle-check',
},
```
- 아이콘 이름 타입은 `LgIconName` 으로 제한 (오타 시 tsc 실패)

---

## 4. 컴포넌트

### 4-1. CourseIcon
```tsx
export function CourseIcon({ id, size = 16 }: { id: LegalCourseId; size?: 16 | 18 | 20 }) {
  return <LgIcon name={courseById(id).icon} size={size} className="lg-course-ico" />;
}
```
- 사용처: 진단 칩(16), 상세 헤더(20), 법정 표 교육명(18), 트레이 목록(16), 빠른 상담 요약(16)
- 과정 카드 본문에는 사용하지 않음

### 4-2. KindBadge
```tsx
// kind: 'mandatory' | 'recommended' | 'industry', note?: string (예: '공공·기업'), count?: number
<span className={`lg-kind lg-kind--${kind}`}><LgIcon name={groupIcons[kind]} size={16}/>{label}{note && ` · ${note}`}{count != null && <b>{count}</b>}</span>
```
- 기존 배지 색 체계 그대로 (의무 P4 10% 면 + --ink 글자, 권고 surface + --ink, 업종별 흰 면 + line 테두리 + --muted)
- 과정 카드 배지, 진단 그룹 라벨·범례, 법정 표 구분 셀이 이 컴포넌트를 공유 → 기존 개별 배지 마크업 교체

### 4-3. HubStats (LB45)
```
dl.lg-stats > div.lg-stat × 4 > dt.lg-stat-num (7) + dd.lg-stat-label (과정)
```
```css
.lg-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));margin-top:var(--lg-gap-card);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.lg-stat{padding:14px 16px}
.lg-stat+.lg-stat{border-left:1px solid var(--line)}
.lg-stat-num{font-size:32px;font-weight:800;line-height:1.1;color:var(--ink);font-variant-numeric:tabular-nums}
.lg-stat-label{margin-top:4px;font-size:13px;color:var(--muted)}
@media(max-width:560px){.lg-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.lg-stat:nth-child(3){border-left:0}.lg-stat:nth-child(n+3){border-top:1px solid var(--line)}}
```
- 32px 가 기존 타이포 값에 없으면 가장 가까운 기존 값(허브 h2 1440 계산값 32px) 사용
- dl/dt/dd 순서: 스크린리더가 '7 과정' 으로 읽히도록 dt 가 숫자

### 4-4. DiagSummary (LB41)
```
div.lg-dg-sum
  p.lg-dg-total > span 추천 + b.lg-dg-n (N) + span 과정
  div.lg-dg-bar[role=img][aria-label="법정 의무 3, 권고 2, 업종별 1"]
    span.seg--mandatory (flex-grow: 3) + span.seg--recommended (2) + span.seg--industry (1)
  (D26: 별도 범례 없음 — 아래 그룹 제목 KindBadge(count) 가 범례 겸용)
```
```css
.lg-dg-n{font-size:28px;font-weight:800;font-variant-numeric:tabular-nums;margin:0 4px}
.lg-dg-bar{display:flex;gap:3px;height:8px;border-radius:999px;overflow:hidden;margin-top:10px}
.lg-dg-bar span{transition:flex-grow .24s var(--ease)}
.seg--mandatory{background:var(--p4)}
.seg--recommended{background:color-mix(in srgb,var(--p4) 45%,#fff)}
.seg--industry{background:var(--line)}
@media (prefers-reduced-motion:reduce){.lg-dg-bar span{transition:none}}
```
- 45% 는 기존 값. 결과 그룹 라벨은 KindBadge 로 교체, 칩 앞 CourseIcon 16
- 요약 추가로 결과 칸이 문항 칸보다 커지면 높이 결정자가 바뀜 → 짝 수치 확인 후 data-height-owner 재지정 보고

### 4-5. Diagnose 문항 라벨
```
p.lg-q-label > LgIcon(qIcons[key], 20) + 텍스트
```

### 4-6. CourseCard / CourseDetail / CustomTile (LB42)
- 카드 메타: `KindBadge` + `LgIcon circle-play 16` + `<b>12</b>차시`
- 상세 헤더: `CourseIcon 20` + 과정명
- 상세 소제목: `h4.lg-dt-h > LgIcon(detailIcons[key], 20) + 텍스트`
- 학습 목표 li 간격: 기존 목록 간격 토큰 한 단계 위 (새 값 금지)
- CustomTile: `div.lg-ico-tile > LgIcon puzzle 24` 좌측 배치, is-wide 가로 배치 유지

```css
.lg-ico-tile{flex:none;width:40px;height:40px;border-radius:12px;display:grid;place-items:center;background:color-mix(in srgb,var(--p4) 8%,#fff);color:var(--ink)}
```
- 도입 절차 4단계, 차이 카드 3장의 기존 아이콘도 `.lg-ico-tile` 규격으로 통일

### 4-7. 비교표 (LB43)
- 행 라벨 셀: `LgIcon(rowIcons[i], 20)` + 텍스트 (--ink 아이콘 --muted)
- KG 열 셀: `LgIcon circle-check 18` (--ink) + 굵은 글자
- 일반 열: 아이콘 없음, --muted
- 640 이하 카드형: 같은 규칙
- 행 높이 고정 확인 (아이콘 추가 전후 ±2px)

### 4-8. LawTable (LB44)
- 교육명 셀: `CourseIcon 18` + 교육명
- 구분 셀: `KindBadge` (아이콘 14 → D20 에 없음 → 16 사용)

### 4-9. PickTray · ConsultSummary
- 목록 과정명 앞 `CourseIcon 16`

---

## 5. 텍스트 다이어트 (LB46)

### 5-1. 절차
1. 현재 허브의 보이는 텍스트를 수집 (1440, 예외 D23 제외) → 글자 수 A
2. 아래 규칙으로 문구 수정
3. 다시 수집 → B, 감소율 (A − B) / A ≥ 15%
4. 변경 전후 표를 보고

### 5-2. 규칙
- BlockHead 리드 1줄 32자 이내, 제목 반복 금지. 필요 없으면 리드 생략 가능
- 같은 의미 안내가 두 곳 이상이면 한 곳만
- 빈 상태·보조 문구는 한 문장
- 법적 고지·과정 원문·법정 표 셀은 수정 금지

### 5-3. 리드 초안 (적용 기준, 32자 이내)
| 블록 | 현재 | 변경 |
|---|---|---|
| 헤더 | 2026년 법정필수교육 7개 과정을 확인하고 바로 상담을 신청하세요. | 과정 확인부터 상담까지 한 곳에서 (수치 스트립이 7개 과정을 대신) |
| 진단 | 3가지 질문에 답하면 추천 과정이 바로 바뀝니다. | 답하는 즉시 추천 과정이 바뀝니다 |
| 과정 | 과정을 담아 두면 상담 신청 시 그대로 전달됩니다. | 담은 과정은 상담에 그대로 전달됩니다 |
| 자료 | 짧게 훑어보고, 자세한 내용은 과정소개서로 받아보세요. | (리드 생략, 목차 제목이 역할 대신) |
| 그 밖 | 코드의 현재 리드를 규칙대로 정리, 보고 | |

---

## 6. 반응형

| 요소 | 1041+ | 881~1040 | 561~880 | ~560 |
|---|---|---|---|---|
| 수치 스트립 | 4칸 한 줄 | 4칸 | 4칸 | 2×2 |
| 진단 요약 | 결과 칸 상단 | 동일 | 동일 | 동일, 막대 전폭 |
| 비교표 아이콘 | 행 라벨 20 | 동일 | 동일 | 카드형 동일 |
| 칩 아이콘 | 16 | 16 | 16 | 16 |

---

## 7. 접근성
- 모든 LgIcon 은 장식: aria-hidden (라벨 글자가 의미 전달)
- 구분 막대: role=img + aria-label 에 개수 전부
- 수치 스트립: dl/dt/dd
- 색만으로 구분 금지: 막대 옆 범례 배지(아이콘 + 글자 + 개수)
- 대비: 배지 글자 4.5:1, 아이콘 3:1 (D18 방식)

---

## 8. 검증 (LB47, verify-legal-b.mjs 확장)

| 항목 | 판정 |
|---|---|
| 시각 앵커 | 1440×900, 허브 상단부터 900px 단위 화면마다 [img, .lg-ico-tile, .lg-stat, .lg-dg-bar, .lg-cn-slide] 중 1개 이상 보임 |
| 아이콘 밀도 | 각 화면 svg.lg-ico ≤ 24 |
| 라벨당 1개 | 라벨 요소(.lg-q-label, .lg-dt-h, .lg-kind, 표 셀, 칩) 안 svg.lg-ico ≤ 1, p 문단 안 0 |
| 과정 아이콘 일치 | 진단 칩·상세 헤더·법정 표·트레이·상담 요약에서 과정별 아이콘 이름 동일 (data-icon 속성으로 비교) |
| 진단 요약 | N = 칩 수, 막대 비율 = 그룹 개수, 답 변경 시 동시 갱신 |
| 글자 수 | 감소율 ≥ 15% (D23 예외 제외) |
| 밸런스 유지 | 진단·자료·차이·절차·상담 짝 행 높이 비 0.95~1.05 |
| 헤더 | 높이 증가 ≤ 90px (1440) |
| 대비 | 배지 글자 4.5, 아이콘 3 |
| 공통 | 9폭 가로 스크롤 0, 44px, 금지어 0, CLS < 0.05, 콘솔 0, 외부 요청 images.unsplash.com 만, 회귀 0 |

- LgIcon 에 `data-icon={name}` 속성 추가 (검수용, 렌더 영향 없음)
- 캡처: `test-results/legal-b/up03/14/` 전후 비교 (진단, 과정 상세, 비교표, 헤더) 1440·390

---

## 9. 커밋 계획
| # | 커밋 | 범위 |
|---|---|---|
| 13 | feat(inquiry): 요약형 빠른 상담·선택 바 | upgrade-02 (진행분) |
| 14 | feat(content): 시각 고도화 (과정 아이콘·진단 요약·수치 스트립·비교표) | LB40~LB46 |
| 15 | test(legal-b): 짝 설계·시각 앵커·상용화 검수·최종 보고 | LB37 + LB47 + REPORT |

- 절차: tsc → build → commit → 하나씩 push 3개, 차단 시 우회 금지, stash@{0} 유지

## 10. 완료 정의
- PRD upgrade-03 LB40~LB47 완료 조건 충족
- upgrade-02 밸런스·상용화 기준 유지
- 10/1(목) 15:00 전 커밋 14 배포
