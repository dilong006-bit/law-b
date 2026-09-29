# 기술명세서 증분: KEESS 법정필수교육 노출 B안 upgrade-01

| 항목 | 내용 |
|------|------|
| **Version** | 1.1 (Enhancement #1) |
| **상위 문서** | ref/legal/PRD_KEESS_26827_legal-B_v1.0_upgrade-01.md (LB18~LB31) |
| **기준 명세** | ref/legal/TECHSPEC_KEESS_26827_legal-B_v1.0.md (이 문서에 없는 내용은 기준 명세 그대로) |
| **전략 근거** | ref/legal/KEESS_26827_법정필수_B안_UIUX전략_upgrade-02_260929.md |
| **기준 커밋** | law-b main e1adb1f |
| **작업 폴더 / 원격** | `KEESS_law-B` / https://github.com/dilong006-bit/law-b (원격명 `law-b`) |
| **작성일** | 2026-09-29 |

---

## 0. 절대 규칙

### 0-1. 기준 명세 §0 유지 (요약)
1. 신규 색·폰트·섀도·라운드·브레이크포인트·버튼 변형 금지. 토큰과 기존 클래스만
2. 브레이크포인트 1040 / 940 / 880 / 820 / 760 / 740 / 720 / 640 / 560 만
3. 원 소스 반응형. JS 분기는 matchMedia로 동작만
4. 공통 컴포넌트는 선택 prop 추가만. 미지정 시 마크업 100% 동일
5. hover는 `(hover:hover) and (pointer:fine)` 안에서만, reduced-motion 대응
6. 카피는 HUB_COPY만 참조. 대시 문자·느낌표 금지
7. 노출 금지: 과태료 수치·금액, 교육비·가격, 외부 작품명(지구오락실, 지구마블, K-POP Demon Hunters), '이수 현황', '미이수자', 수료증 관리 주장, FAQ
8. 백엔드 추가 금지, payload 구조 불변
9. GNB 변경 금지, noindex 유지
10. P4 면 위 글자·아이콘은 --ink (흰색 금지)

### 0-2. 밸런스 규칙 (이번 증분 신규, LB20)
| 코드 | 규칙 |
|---|---|
| B1 | 허브 레이아웃은 `.lg-row` 12열 그리드와 허용 분할 클래스만 사용. 고정 px 열 금지 |
| B2 | `.lg-row` 안 형제 요소는 `align-items:stretch`. 형제 높이 차 ≤ 5% |
| B3 | 행 빈 공간 ≤ 15% |
| B4 | 자리표시 0 (점선 테두리, '예정', '준비 중') |
| B5 | 모든 블록은 `BlockHead` (kicker + h3 + 리드 선택). 하위 묶음은 h4 |
| B6 | 카드는 `.lg-box`(기본) 와 `.lg-box.is-accent`(P4 옅은 면) 2종만 |
| B7 | 블록당 1차 버튼 1개, 허브 다크 면 1곳(빠른 상담 패널) |
| B8 | 과정 그리드 마지막 행 빈 칸 0 (모든 열 수, 모든 필터 상태) |
| B9 | 허브 높이 ≤ H × 3 (H: 실측 단계 산출) |

규칙을 지키기 위해 콘텐츠를 임의로 빼거나 카피를 바꿔야 하면 코드 작성 전 보고.

---

## 1. 파일 맵

| 구분 | 경로 | LB |
|---|---|---|
| 신규 | components/legal-hub/BlockHead.tsx | LB20 |
| 신규 | components/legal-hub/QuickActions.tsx | LB21 |
| 신규 | components/legal-hub/CustomTile.tsx | LB23 |
| 신규 | components/legal-hub/StandardAndDiff.tsx (LawTable 포함 조립) | LB24 |
| 신규 | components/legal-hub/Process.tsx | LB25 |
| 신규 | components/legal-hub/CardNewsGrid.tsx | LB26 |
| 신규 | components/legal-hub/CardNewsLightbox.tsx | LB26 |
| 신규 | components/legal-hub/BrochureBanner.tsx | LB26 |
| 신규 | lib/legal/goConsult.ts (빠른 상담 이동·포커스 공용 함수) | LB27 |
| 신규 | ref/legal/IMAGE_SOURCES.md | LB29 |
| 신규 | public/images/legal/hero-legal.jpg, hero-legal-m.jpg, cardnews-01~04.jpg, brochure-cover.jpg | LB29 |
| 수정 | data/legalHub.ts (HUB_COPY 키 추가·정리) | 공통 |
| 수정 | data/legal.ts (LEGAL_CARDNEWS 4개) | LB26 |
| 수정 | data/home.ts (시즌 슬라이드 선두 삽입) | LB18 |
| 수정 | components/sections/home/HeroCarousel.tsx (슬라이드 선택 필드 렌더, notice prop 제거) | LB18, LB19 |
| 수정 | app/page.tsx (HeroNotice·CampaignBand 제거) | LB19 |
| 수정 | lib/legal/diagnose.ts (부분 응답·기본 추천) | LB22 |
| 수정 | components/legal-hub/LegalHub.tsx (블록 재조립) | 전체 |
| 수정 | HubHead, Diagnose, CourseLineup, CourseDetail, HubInquiry, PickTray | LB21~LB28 |
| 수정 | components/sections/home/HomeInquiry.tsx (선택 prop `hiddenFields`, `messageRows`, optionalFold 제거) | LB27 |
| 수정 | styles/legal-hub.css (그리드·박스·블록 헤더·신규 블록) | 전체 |
| 삭제 | components/home/HeroNotice.tsx, components/home/CampaignBand.tsx, styles/home-campaign.css 중 사용처 없는 규칙 | LB19 |
| 삭제 | components/legal-hub/OpsSupport.tsx, Difference.tsx, Resources.tsx | LB24, LB26 |
| 삭제 | components/legal/LegalCardNews.tsx (다른 사용처 없을 때만, 있으면 보고) | LB26 |

- 삭제 전 `grep` 으로 사용처 0 확인. 남은 사용처가 있으면 삭제하지 말고 보고

---

## 2. 데이터

### 2-1. data/legalHub.ts HUB_COPY (추가·변경분만)
```ts
heroSlide: {
  tag: '2026 법정필수교육',
  title: ['올해 법정교육,', '한 곳에서 준비하세요'],
  desc: '성희롱 예방부터 자금세탁방지까지 2026년 최신 7개 과정. 필요한 과정 확인부터 도입 상담까지 함께합니다.',
  primary: { label: '과정 보기', href: '/content#mandatory', gaId: 'home_hero_legal_courses' },
  secondary: { label: '빠른 상담', href: '/content#mandatory-inquiry', gaId: 'home_hero_legal_consult' },
  sub: { label: '과정소개서 받기', href: '/content#mandatory-resources', gaId: 'home_hero_legal_brochure' },
  trust: '7개 과정 · 매년 자체 제작 · 전담 운영자 배정',
  image: { src: '/images/legal/hero-legal.jpg', srcMobile: '/images/legal/hero-legal-m.jpg', alt: '' },
},
head: {
  // kicker, title 기존 유지
  lead: '2026년 법정필수교육 7개 과정을 확인하고 바로 상담을 신청하세요.',
  quick: [
    { label: '필요 과정 찾기', href: '#mandatory-diagnose', gaId: 'legal_quick_find' },
    { label: '과정 보기', href: '#mandatory-courses', gaId: 'legal_quick_courses' },
    { label: '빠른 상담', href: '#mandatory-inquiry', gaId: 'legal_quick_consult', consult: true },
  ],
  // season, tabs 제거 (사용처 정리 후)
},
diagnose: {
  kicker: '필요 과정 찾기',
  title: '우리 회사에 필요한 과정 찾기',
  sub: '3가지 질문에 답하면 추천 과정이 바로 바뀝니다.',
  defaultNote: '공통 추천입니다. 3가지 질문에 답하면 우리 회사 기준으로 바뀝니다.',
  // q, groups, smallNote, note, addAll, added 기존 유지. empty 제거
},
lineup: {
  kicker: '과정 라인업',
  title: '2026 법정필수교육 7개 과정',
  sub: '과정을 담아 두면 상담 신청 시 그대로 전달됩니다.',
  customTile: {
    title: '찾는 과정이 없나요?',
    desc: '기업 상황에 맞춰 과정을 구성해 드립니다.',
    cta: '맞춤 구성 상담', gaId: 'legal_course_custom_consult',
  },
  detailConsult: '이 과정으로 상담',
  // 기존 키 유지
},
law: {
  kicker: '법정 기준',
  title: '교육별 법적 근거와 대상',
  // cols, basis, notes 기존 유지
},
diff: {
  title: 'KG에듀원 법정교육이 다른 점',
  cards: [
    { key: 'series', title: '매년 새로운 시리즈', desc: '해마다 새로 제작해 반복 수강의 지루함을 줄입니다.' },
    { key: 'story', title: '몰입형 스토리 콘텐츠', desc: '법정 필수 내용을 이야기 속에서 자연스럽게 익힙니다.', more: '비교표 보기', less: '비교표 닫기' },
    { key: 'ops', title: '전담 운영 지원', items: ['전담 운영자 정·부 2명 지정', '월 1회 이상 방문 관리'] },
  ],
},
process: {
  kicker: '도입 절차',
  title: '신청부터 운영까지 4단계',
  steps: [
    { key: 'pick', label: '과정 선택', desc: '진단이나 과정 카드에서 필요한 과정을 담습니다.' },
    { key: 'apply', label: '상담 신청', desc: '담은 과정 그대로 빠른 상담을 신청합니다.' },
    { key: 'fix', label: '구성 확정', desc: '담당자가 인원·일정·운영 방식을 함께 정합니다.' },
    { key: 'run', label: '교육 운영', desc: '전담 운영자가 학습 기간 동안 운영을 지원합니다.' },
  ],
  cta: { label: '빠른 상담 신청', gaId: 'legal_process_consult' },
},
resources: {
  id: 'mandatory-resources',
  title: '카드뉴스와 과정소개서',
  cardNewsLabel: '법정교육 카드뉴스',
  open: (n: number) => `카드뉴스 ${n}번 크게 보기`,
  counter: (i: number, n: number) => `${i} / ${n}`,
  brochure: {
    title: '2026 법정필수교육 과정소개서',
    desc: '내부 보고와 과정 검토에 필요한 내용을 한 번에 담았습니다.',
    includes: ['과정 구성', '학습 목표', '강사 정보'],
    meta: 'PDF · 7개 과정',
    cta: '과정소개서 받기',
    next: '담은 과정으로 빠른 상담하기',
    cover: { src: '/images/legal/brochure-cover.jpg', alt: '2026 법정필수교육 과정소개서 표지' },
  },
  // placeholder 제거
},
inquiry: {
  kicker: '빠른 상담',
  panelTitle: ['매년 받는 법정교육,', 'KG에듀원에서 한 번에 관리하세요'],
  panelBody: '선택하신 과정을 기준으로 담당자가 영업일 1일 내 연락드립니다.',
  panelPoints: ['담은 과정 기준으로 상담', '인원·일정에 맞춘 운영 방식 안내'],
  pickedLabel: '담은 과정',
  pickedEmpty: '아직 담은 과정이 없습니다. 아래에서 희망과정을 선택하세요.',
  // foldLabel 제거
},
tray: { /* 기존 */ cta: '빠른 상담' },
// notice, campaign, ops(독립 블록) 제거
```
- 제거 키는 사용처를 먼저 없앤 뒤 삭제. 타입 오류로 누락 확인

### 2-2. data/legal.ts LEGAL_CARDNEWS
```ts
export const LEGAL_CARDNEWS = [
  { src: '/images/legal/cardnews-01.jpg', alt: '법정교육, 우리 회사는 몇 개나 끝냈나요?' },
  { src: '/images/legal/cardnews-02.jpg', alt: '교육만 열면 끝일까요?' },
  { src: '/images/legal/cardnews-03.jpg', alt: '2026년 최신 법정필수교육, KG에듀원이 한 곳에 모았습니다' },
  { src: '/images/legal/cardnews-04.jpg', alt: '올해 법정교육, 지금 KG에듀원에서 점검하세요' },
] as const;
// 임시: Unsplash 실사 (ref/legal/IMAGE_SOURCES.md). 10/12 최종본 수령 시 같은 파일명으로 교체, alt는 최종 문구 파일 기준 전문
```
- 이미지 파일이 없으면 `src` 존재 여부를 빌드 시점이 아닌 데이터 플래그로 판단: `LEGAL_CARDNEWS_READY = true | false` (false면 Empty 렌더, §6-6)

### 2-3. lib/legal/diagnose.ts (부분 응답)
```ts
export type DiagResult = {
  mandatory: LegalCourseId[]; recommended: LegalCourseId[]; industry: LegalCourseId[];
  smallNote: boolean; complete: boolean;
};
export function diagnose(a: DiagAnswer): DiagResult {
  const mandatory: LegalCourseId[] = ['sexual', 'disability'];
  if (a.pension === 'yes' || a.pension === 'unknown') mandatory.push('pension');
  const recommended: LegalCourseId[] = ['harassment', 'privacy'];
  const industry: LegalCourseId[] =
    a.industry === 'finance' ? ['aml'] : a.industry ? ['ethics'] : [];
  return {
    mandatory, recommended, industry,
    smallNote: a.size === 'lt10',
    complete: Boolean(a.size && a.pension && a.industry),
  };
}
```
- null 반환 제거 → 결과 패널 항상 채움
- 3문항 완료 27조합 결과는 기존 함수와 동일해야 함 (기존 27조합 테스트 재사용)
- 부분 응답 조합(64개 = 각 문항 미응답 포함 4×4×4) 테스트 추가

### 2-4. data/home.ts
```ts
const LEGAL_HERO_SLIDE = { /* 기존 슬라이드 타입 형태로 HUB_COPY.heroSlide 매핑 */ };
export const HERO_SLIDES = LEGAL_SEASON.on ? [LEGAL_HERO_SLIDE, ...BASE_SLIDES] : BASE_SLIDES;
```
- 기존 슬라이드 타입에 없는 필드(secondary, sub, trust, image.srcMobile)는 **선택 필드로 타입 확장**, HeroCarousel은 값이 있을 때만 렌더
- 기존 슬라이드의 렌더 결과는 불변

---

## 3. 밸런스 기반 CSS (styles/legal-hub.css, LB20)

```css
/* 12열 행 */
.lg-row{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:var(--lg-gap-card);align-items:stretch}
.lg-c12{grid-column:span 12}.lg-c8{grid-column:span 8}.lg-c7{grid-column:span 7}
.lg-c6{grid-column:span 6}.lg-c5{grid-column:span 5}.lg-c4{grid-column:span 4}.lg-c3{grid-column:span 3}
@media(max-width:880px){
  .lg-row>.lg-c3{grid-column:span 6}
  .lg-row>.lg-c4,.lg-row>.lg-c5,.lg-row>.lg-c6,.lg-row>.lg-c7,.lg-row>.lg-c8{grid-column:span 12}
}
@media(max-width:560px){.lg-row>.lg-c3{grid-column:span 12}}

/* 박스 2종 */
.lg-box{background:#fff;border:1px solid var(--line);border-radius:var(--r);box-shadow:var(--shadow-1);display:flex;flex-direction:column}
.lg-box.is-accent{background:color-mix(in srgb,var(--p4) 8%,#fff);border-color:color-mix(in srgb,var(--p4) 30%,var(--line))}
.lg-box>.lg-box-foot{margin-top:auto}   /* 버튼·링크를 바닥에 붙여 높이 맞춤 */

/* 블록 간격 */
.lg-block+.lg-block{margin-top:var(--lg-gap-block)}
.lg-bh{margin-bottom:var(--lg-gap-head)}
```
- `--lg-gap-block`, `--lg-gap-head`, `--lg-gap-card` 는 **새 값이 아니라** /content 다른 축에서 실측한 기존 값을 허브 범위 변수로 옮겨 쓰는 것 (실측 단계에서 값 보고)
- `color-mix` 비율(8%, 30%)은 기존 허브에서 이미 쓰는 값이 있으면 그 값 사용, 없으면 보고
- 허브 배경은 1종 유지. 블록 구분은 간격과 BlockHead로만 (블록별 배경 교차 없음)
- `data-balance-row` 속성: 높이 맞춤 검사 대상 행에 부여 (§10)

### 3-1. BlockHead
```
div.lg-bh
  p.lg-bh-kicker (오렌지 선 + 라벨, 기존 kicker 스타일)
  h3.lg-bh-title (다른 축 h3와 같은 클래스·크기)
  p.lg-bh-lead (선택)
```
- props: `{ kicker: string; title: string; lead?: string; id?: string }`
- 하위 묶음 제목: `h4.lg-sub-title` (기존 h4 스타일 재사용)

---

## 4. 홈 (LB18, LB19)

### 4-1. 법정 슬라이드
- 구조: 기존 슬라이드 마크업 재사용. 추가 요소만 선택 렌더
```
div.hs (1번)
  picture (source media="(max-width:760px)" srcMobile / img src)  ← next/image 사용 시 동일 효과로
  div.hs-scrim (좌→우 그라데이션)
  div.wrap > div.hs-body
    span.hs-tag / h1 or h2 (기존 슬라이드 제목 태그 규칙 따름)
    p.hs-desc
    div.hs-acts > a.btn(1차) + a.btn-glass(2차)
    a.hs-sub (760 이하 숨김)
    p.hs-trust
```
- 스크림: 기존 히어로 오버레이가 있으면 재사용. 없으면 `linear-gradient(90deg, rgb(0 0 0 / .62) 0%, rgb(0 0 0 / .35) 45%, transparent 75%)`, 760 이하 `linear-gradient(0deg, rgb(0 0 0 / .7) 0%, rgb(0 0 0 / .3) 55%, transparent 80%)`. 새 값 도입이므로 **대비 실측값과 함께 보고**
- 이미지: 1번 슬라이드만 `priority`, `sizes="100vw"`, object-position PC `70% 50%`, 모바일은 별도 파일
- 버튼: 760 이하 세로 쌓기, 각 전체 폭, 44px 이상
- 제목 태그: 기존 1번 슬라이드가 h1이면 법정 슬라이드가 h1, 기존 브랜드 슬라이드는 h2로 (페이지 h1 1개 유지). 기존 구조가 다르면 보고

### 4-2. 홈 정리
- app/page.tsx: HeroNotice, CampaignBand 렌더 제거
- HeroCarousel: `notice` prop과 관련 마크업·클래스 제거 → B안 착수 전(3155256)과 비교해 슬라이드 선택 필드 외 차이 0
- styles: `.hero.has-notice`, hc- 접두어 규칙 중 사용처 없는 것 제거
- 확인: `git diff 3155256 -- app/page.tsx components/sections/home/HeroCarousel.tsx` 결과가 슬라이드 확장분만

---

## 5. 허브 조립 (LegalHub.tsx)

```
section#mandatory.section[aria-labelledby=mandatory-title]
  span#ax5
  PickProvider
    div.wrap
      HubHead + QuickActions                          .lg-block
      Diagnose            #mandatory-diagnose          .lg-block  (lg-row 5+7)
      CourseLineup        #mandatory-courses           .lg-block  (lg-grid + CustomTile)
      StandardAndDiff     #mandatory-law               .lg-block  (표 12 → lg-row 4+4+4)
      Process + 자료      #mandatory-process, #mandatory-resources  .lg-block
      HubInquiry          #mandatory-inquiry           .lg-block  (lg-row 5+7)
    PickAnnouncer, PickTray
```
- 앵커 `.lg-anchor` scroll-margin 규칙 기존 유지, 신규 `#mandatory-process` 에도 적용
- SubNav spy: 허브 안 모든 앵커에서 '법정 헌터스' 활성 유지

---

## 6. 블록 명세

### 6-1. LB21 HubHead + QuickActions
- HubHead: 다른 축 AxHead와 동일 컴포넌트·클래스. season, tabs 렌더 제거
- QuickActions: `nav[aria-label="법정필수교육 바로가기"] > ul > li > a.btn-line-dark` 3개, 같은 폭
  - 1041 이상 한 줄 3개 / 560 이하 1열 전체 폭
  - `consult:true` 항목은 `goConsult()` 호출 (§6-7)

### 6-2. LB22 Diagnose
- `div.lg-row[data-balance-row]` > `.lg-c5.lg-box`(문항) + `.lg-c7.lg-box`(결과)
- 결과: 항상 diagnose() 결과 렌더. `complete=false` 면 defaultNote, true면 note
- 결과 변경 시 새로 추가된 과정 칩만 240ms 강조 (reduced-motion 즉시)
- `.lg-box-foot` 에 `추천 과정 모두 담기` (btn-ink, 이 블록 유일 1차 버튼)
- 880 이하 세로

### 6-3. LB23 CourseLineup + CustomTile + CourseDetail
- 그리드 마지막에 CustomTile 1개 (필터 결과 뒤, 항상)
- 타일 span 계산
```ts
const rem = count % cols;               // count = 필터 결과 과정 수
const span = rem === 0 ? cols : cols - rem;
// cols 는 기존 COL_MQ 판정값. style={{ gridColumn: `span ${span}` }}
```
  - span ≥ 2 이면 타일 내부 가로 배치 (`.lg-tile.is-wide`: 텍스트 좌, 버튼 우), 1이면 세로
  - 560 이하(1열 가로형 카드 구간)에서는 세로 박스, 높이 자동
- CustomTile: `.lg-box.is-accent`, 버튼 `btn-line-dark`, 클릭 시 `goConsult()`
- 인라인 상세 삽입 행 계산: 과정 카드 인덱스 기준 기존 로직 유지. 타일은 항상 마지막이므로 영향 없음을 검증 (3열 7과정에서 7번째 카드 상세 → 3행 뒤 삽입, 타일은 상세 아래로)
- CourseDetail 하단 고정 버튼 3개: `담기/담음` + `이 과정으로 상담`(해당 과정 addMany 후 goConsult) + `맛보기 ↗`
  - 760 이하 바텀시트: 닫은 뒤 goConsult 실행 (시트 포커스 복귀와 충돌 없게 순서 보장)
- 도구 줄의 `법정 의무 과정 한 번에 담기` 유지

### 6-4. LB24 StandardAndDiff
```
div.lg-block#mandatory-law
  BlockHead(law)
  LawTable (기존 그대로)
  h4.lg-sub-title (diff.title)
  div.lg-row[data-balance-row] > article.lg-c4.lg-box × 3
  div#lg-diff-table[hidden] .lg-c12  ← 비교표 (기존 difftable + 640 이하 카드)
```
- 카드 series: 미니 타임라인 (기존 .timeline/.tnode 축소 재사용, yr·nm·cur, cc 금지)
- 카드 story: `.lg-box-foot` 에 `비교표 보기` 버튼 (`aria-expanded`, `aria-controls="lg-diff-table"`). 펼침 영역은 카드 행 **아래** 12열
- 카드 ops: items 2개 체크 리스트
- 880 이하 1열
- OpsSupport, Difference 파일 삭제

### 6-5. LB25 Process
```
div.lg-block#mandatory-process
  BlockHead(process)
  ol.lg-steps (시각적 번호 없음, list-style none) > li.lg-c3.lg-box × 4
    span.lg-step-ico (inline SVG 24, stroke 1.5)
    strong.lg-step-label / p.lg-step-desc
  div.lg-steps-foot > button.btn-ink (process.cta → goConsult)
```
- 연결선: 1041 이상 카드 사이 가로선(가상 요소, --line), 561~880 2×2 연결선 없음, 560 이하 좌측 세로선 타임라인
- 이 블록 1차 버튼은 cta 1개
- 아이콘: pick 체크리스트 / apply 말풍선 / fix 달력 / run 사람+모니터

### 6-6. LB26 CardNewsGrid + Lightbox + BrochureBanner
```
div#mandatory-resources.lg-anchor
  h4.lg-sub-title (resources.title)
  ul.lg-cn-grid[data-hscroll] > li > button.lg-cn-item (aria-label open(n)) > img (4:5)
  BrochureBanner: div.lg-row[data-balance-row] > .lg-c4 (표지) + .lg-c8 (내용)
```
- CardNewsGrid
```css
.lg-cn-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--lg-gap-card)}
.lg-cn-item{aspect-ratio:4/5;border-radius:var(--r);overflow:hidden;box-shadow:var(--shadow-1);background:var(--surface)}
@media(max-width:880px){.lg-cn-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:560px){
  .lg-cn-grid{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:12px;margin-inline:-16px;padding-inline:16px}
  .lg-cn-grid>li{flex:0 0 78%;scroll-snap-align:start}
}
```
  - 560 이하 `1 / 4` 표시 (스크롤 위치로 갱신, aria-live 없음)
  - hover 확대 효과는 마우스 기기만 (scale 1.02, 240ms)
  - `LEGAL_CARDNEWS_READY=false` 또는 이미지 로드 실패: 같은 크기 `--surface` 면만 (테두리·문구 없음), 버튼 비활성, alt 없음 `aria-hidden`
- CardNewsLightbox (useModal 재사용)
  - `div[role=dialog][aria-modal][aria-label="법정교육 카드뉴스"]`
  - 이미지 최대 높이 86dvh, 4:5 유지, 이전·다음 44px, `1 / 4`, 닫기, ESC, 좌우 방향키
  - 닫으면 연 카드로 포커스 복귀, 배경 스크롤 잠금
  - 전환 200ms 페이드, reduced-motion 즉시
  - 스와이프 제스처는 Could (시간 허용 시)
- BrochureBanner
  - 좌 `.lg-c4`: 표지 이미지 3:4, `object-fit:contain`, 배경 --surface, shadow-2
  - 우 `.lg-c8.lg-box`: 제목(h4 크기), desc, includes 3개(체크 아이콘), meta, `.lg-box-foot` 에 `과정소개서 받기`(btn-ink, openDownload('legalBrochure', 옵션 기존)) 
  - 성공 화면 링크 문구 `next`, 동작 goConsult
  - 880 이하 세로 (표지 최대 240px 가운데)
- 자료 영역 1차 버튼은 소개서 버튼 1개
- Resources.tsx, LegalCardNews 삭제 (§1 조건)

### 6-7. LB27 HubInquiry (빠른 상담)
```
div.lg-block#mandatory-inquiry.lg-anchor
  BlockHead(inquiry.kicker, 시각 제목은 패널 제목이므로 h3는 sr-only 가능 여부 보고)
  div.lg-row[data-balance-row]
    aside.lg-c5.lg-consult-panel (다크 면, 허브 유일)
      h3 panelTitle / p panelBody / ul panelPoints / div 담은 과정 칩 (없으면 pickedEmpty)
    div.lg-c7 > HomeInquiry
```
- HomeInquiry 호출
```tsx
<HomeInquiry
  presetInterests={['compliance']}
  leadSource="content-legal"
  courseField={{ ...기존 }}
  hiddenFields={['companySize', 'trainees', 'attachment']}
  messageRows={2}
  prefill={pick.prefill}
  courseValue={pickedOptions}
  onCourseChange={pick.setFromOptions}
/>
```
- 신규 선택 prop
  - `hiddenFields`: 지정 필드 렌더 생략, payload 값은 기본값(빈 문자열 또는 null) 유지
  - `messageRows`: 문의 내용 textarea rows
  - 미지정 시 기존 렌더·검증·payload 100% 동일
- `optionalFold` prop과 코드 제거 (허브 외 사용처 없음 확인 후). 사용처가 있으면 유지하고 보고
- 패널·폼 높이: 1041 이상 stretch. 패널 내부 `justify-content:space-between` 으로 칩 영역을 하단에 배치
- 880 이하 세로 (패널 먼저, 짧게)

### 6-8. goConsult (lib/legal/goConsult.ts)
```ts
export function goConsult(opts?: { from?: string }) {
  const el = document.getElementById('mandatory-inquiry');
  if (!el) { location.href = '/content#mandatory-inquiry'; return; }
  el.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'start' });
  const first = el.querySelector<HTMLElement>('input:not([type=hidden]),textarea');
  window.setTimeout(() => first?.focus({ preventScroll: true }), prefersReduced() ? 0 : 450);
}
```
- 해시 진입(홈 히어로): HubInquiry `useEffect` 에서 `location.hash === '#mandatory-inquiry'` 이면 레이아웃 안정 후(이미지 로드와 무관하게 `requestAnimationFrame` 2회) 첫 칸 포커스 `preventScroll`
- 진입점: QuickActions, CustomTile, CourseDetail, Process, 소개서 성공 링크, PickTray, 홈 히어로(해시)

### 6-9. LB28 PickTray
- CTA 문구 `빠른 상담`, `href="#mandatory-inquiry"` 유지 + onClick goConsult
- 숨김 조건에 `#mandatory-inquiry` 교차 유지 (기존), 입력 포커스 유지

---

## 7. 이미지 소싱 (LB29)

### 7-1. 절차
1. Unsplash 검색 (https://unsplash.com/ko). 검색어
   - 히어로: `office laptop learning`, `online training laptop`, `hands laptop office`
   - 카드뉴스 1: `planner calendar laptop office` / 2: `documents desk office work` / 3: `online course laptop` / 4: `modern office interior`
2. 선정 기준: 얼굴 비식별(뒷모습, 손, 원경), 자연광, 중립·따뜻한 톤, 타사 로고·화면 없음, 5장 톤 통일
3. 다운로드: 사진 페이지의 원본 URL을 확인 후 `https://images.unsplash.com/photo-...?...&w=2400&q=80&fm=jpg` 형태로 받기 (히어로 2400px, 카드뉴스 1080×1350 크롭, 모바일 히어로 1080×1350 크롭)
4. 크롭·압축: 히어로 PC 16:9 ≤ 350KB, 모바일 4:5 ≤ 250KB, 카드뉴스 4:5 1080×1350 ≤ 250KB (sharp 또는 기존 도구)
5. 기록: ref/legal/IMAGE_SOURCES.md
```
| 파일 | 용도 | Unsplash URL | 작가 | 받은 날짜 | 비고 |
| hero-legal.jpg | 홈 히어로 PC | https://unsplash.com/photos/... | 이름 | 2026-09-29 | 임시, 교체 가능 |
```
6. 네트워크 차단·다운로드 실패: 우회 금지. 해당 슬롯 Empty(§6-6) 또는 히어로는 중립 그라데이션 배경으로 두고 보고

### 7-2. 소개서 표지
- `public/downloads/KG에듀원_2026_법정필수교육_과정소개서.pdf` 1쪽을 기존 pdf.js 헤드리스 도구로 900px 폭 렌더 → brochure-cover.jpg (≤ 150KB)
- 1쪽에 교육비·가격·과태료 수치가 있으면 사용 금지, 보고

---

## 8. 반응형 표 (허브, 구현 기준)

| 요소 | 1041+ | 881~1040 | 761~880 | 561~760 | ~560 |
|---|---|---|---|---|---|
| 홈 법정 슬라이드 | 텍스트 좌·피사체 우 | 동일, 텍스트 최대 560 | 동일 | 모바일 이미지·버튼 세로 | 동일 |
| 빠른 실행 | 3개 한 줄 | 한 줄 | 한 줄 | 한 줄 | 1열 |
| 진단 | 5+7 | 5+7 | 세로 | 세로 | 세로 |
| 과정 | 4열 + 타일 | 3열 + 타일(2칸) | 2열 + 타일 | 2열 + 타일 | 1열 가로형 + 타일 |
| 상세 | 행 아래 | 행 아래 | 행 아래 | 바텀시트 | 바텀시트 |
| 법정 표 | 5열 | 5열 | 4열 | 4열 (641+) / 카드 | 카드 |
| 차이 카드 | 3열 | 3열 | 1열 | 1열 | 1열 |
| 도입 절차 | 4열 가로선 | 4열 | 2×2 | 2×2 | 세로 타임라인 |
| 카드뉴스 | 4열 | 4열 | 2×2 | 2×2 | 가로 스와이프 |
| 소개서 배너 | 4+8 | 4+8 | 세로 | 세로 | 세로 |
| 빠른 상담 | 5+7 | 5+7 | 세로 | 세로 | 세로 |

---

## 9. 접근성
- 기준 명세 §8 유지
- 라이트박스: dialog, 포커스 트랩, ESC, 방향키, 포커스 복귀
- 도입 절차: `ol` 의미 유지, 시각적 숫자 없음
- 비교표 토글: `aria-expanded` / `aria-controls`
- 히어로 스크림 위 글자 4.5:1, 버튼 3:1 이상 실측
- goConsult 포커스 이동 시 스크린리더가 폼 레이블을 읽는지 확인

---

## 10. 검증 (scripts/verify-legal-b.mjs 확장, LB30)

| 항목 | 판정 방법 |
|---|---|
| 형제 높이 차 | `[data-balance-row]` 직계 자식 높이 max/min ≤ 1.05 (한 행에 놓인 자식끼리만 비교, 880 이하 세로 전환 구간 제외) |
| 행 빈 공간 | 각 `[data-balance-row]` 에서 1 − (자식 박스 면적 합 + gap 면적) / 행 면적 ≤ 0.15 |
| 자리표시 | 허브 안 computed `border-style: dashed` 0, 텍스트 `예정`·`준비 중` 0 |
| 블록 헤더 | 모든 `.lg-block` 에 `.lg-bh-kicker` 와 h3 존재 |
| 1차 버튼 | `.lg-block` 마다 `.btn-ink` ≤ 1 |
| 다크 면 | 허브 안 배경 --ink 요소 = 1 (트레이·시트 제외) |
| 마지막 행 | 과정 그리드: 필터 4종 × 열 수 4종에서 마지막 행 점유 열 = cols |
| 높이 예산 | 1440×900 허브 높이 ≤ H × 3 (H 실측값 기록) |
| 홈 | 1번 슬라이드 법정, 알약·밴드 DOM 0, 스크림 대비, 시즌 off 시 3155256 홈 DOM 동일 |
| 흐름 | 홈 `빠른 상담` → /content 폼 첫 칸 포커스 / 진단 담기 → 트레이 → 빠른 상담 → 희망과정 일치 / 상세 `이 과정으로 상담` |
| 라이트박스 | 열기·이동·ESC·포커스 복귀, reduced-motion 즉시 |
| 기존 항목 | 기준 명세 §9 전 항목 (가로 스크롤 9폭, 44px, 금지어, 회귀) |

- 폭: 1440, 1280, 1041, 1040, 881, 880, 760, 390, 360 (+ 짧은 화면 1366×657)
- 캡처: `test-results/legal-b/up01/{단계}/{블록}-{폭}.png`

---

## 11. 커밋 계획

| # | 커밋 | 범위 |
|---|---|---|
| 실측 | (커밋 없음) | H, 블록 높이, 간격 토큰, 히어로 구조, 폼 필수 항목 |
| 9 | feat(home): 법정 히어로 1번 슬라이드·홈 정리 | LB18, LB19, LB29 히어로 |
| 10 | feat(content): 허브 밸런스 기반·헤더·진단·과정 타일 | LB20, LB21, LB22, LB23 |
| 11 | feat(content): 법정 기준·차이·도입 절차·자료 재설계 | LB24, LB25, LB26, LB29 카드뉴스·표지 |
| 12 | feat(inquiry): 빠른 상담·선택 바 | LB27, LB28, LB31 |
| 13 | test(legal-b): 밸런스 QA·최종 보고 | LB30 |

- 각 커밋: `npx tsc --noEmit` → `npm run build` → commit → 하나씩 `git push law-b feat/legal-b` / `git push law-b feat/legal-b:main` / `git ls-remote law-b`
- 차단 시 우회 금지, stash@{0} 유지

---

## 12. 완료 정의
- PRD upgrade-01 LB18~LB31 완료 조건 충족
- §10 자동 검수 전 항목 통과, 실패 항목 0 또는 사유 승인
- 기존 회귀 0 (홈 다른 슬라이드, /kium, /content 다른 축, 과정리스트 모달, 홈·/kium 문의 폼)
- IMAGE_SOURCES.md 기록 완료

---

## 13. 결정 기록 (단계 A 실측 후, 2026-09-29, 요청자 확정)

| # | 항목 | 결정 | 이 문서에서 대체되는 곳 |
|---|---|---|---|
| D1 | 높이 예산 B9 | 블록 1개 ≤ 900px (1440 기준, 과정 그리드 예외). 허브 전체 ≤ H×6 (1440: 737×6 = 4422 / 390: 1239×6 = 7434). 초과 시 콘텐츠를 빼지 않고 블록별 높이와 함께 보고 | §0-2 B9, §10 높이 예산 |
| D2 | 히어로 제목 태그 | 법정 슬라이드도 h1 (기존 규칙 유지, 기존 슬라이드 마크업 불변). '페이지 h1 다수'는 사이트 공통 이슈로 REPORT 별도 개선 항목에만 기록 | §4-1 제목 태그 |
| D3 | BlockHead | kicker = 기존 `.substep` 스타일, 제목 h3 = 홈 `.ptext h3` 값 `clamp(20px,2.3vw,28px)`. 클래스는 `lg-bh-*`, 값은 기존 값 그대로 | §3-1 |
| D4 | 간격 변수 | `--lg-gap-block` 72px (640 이하 52px, 현행) / `--lg-gap-head` 30px (content.css `.jobgrid` margin-top) / `--lg-gap-card` 16px (content.css `.jobgrid`·`.rmcols`·`.gftiers` gap) | §3 |
| D5 | `.lg-box.is-accent` | 배경 `color-mix(in srgb,var(--p4) 8%,#fff)`, 테두리 `color-mix(in srgb,var(--p4) 25%,#fff)` (둘 다 기존 사용 비율) | §3 |
| D6 | 히어로 이미지 | 기존 Img 컴포넌트 + images.unsplash.com 핫링크 (다른 슬라이드와 같은 방식). 1번 슬라이드만 eager. 모바일은 같은 사진 크롭 URL(`w=1080&h=1350&fit=crop`)을 `imgMobile` 선택 필드로. 스크림은 기존 `.hs-scrim`. 타입 확장: eyebrow 선택화, imgMobile·secondary·link·trust 선택 필드 | §2-4, §4-1, §7 (로컬 파일 저장 대신 핫링크) |
| D7 | 커밋 번호 | 한 칸씩 밀어 10~14. 기준 커밋 321ab9a. 10 홈 히어로·홈 정리 / 11 밸런스 기반·헤더·진단·과정 타일 / 12 기준·차이·절차·자료 / 13 빠른 상담·선택 바 / 14 QA·최종 보고 | §11 |
| D8 | 빠른 상담 폼 | 직급/직책 필수 유지해 포함. optionalFold 는 커밋 13 에서 제거 | §6-7 |

| D9 | 대비 기준 | 버튼·링크 안 글자 4.5:1, 버튼 경계·아이콘(비텍스트) 3:1. 측정은 글자가 놓이는 영역(버튼 가로 20~80%, 세로 25~75%)과 경계 1px 기둥 기준 | §9 |

### 13-1. 커밋 10 구현 중 추가 결정 (보고 대상)
- 법정 슬라이드 theme: 기존 `new`(P4 그라데이션) 재사용. 같은 theme 두 슬라이드의 React key 충돌을 막기 위해 선택 필드 `id` 추가(DOM 미출력)
- 선택 요소가 있는 슬라이드(`.actions-2`)가 있을 때만 히어로 최소 높이 720px (`.hero:has(.actions-2)`). 1366×657 에서 인디케이터와 8px 겹침 해소. B안 커밋 4 승인 방식 재사용, 시즌 off 면 적용 없음

### 13-2. 커밋 11 측정 정정 (히어로 2차 버튼)
- 커밋 10 보고의 2차(유리) 버튼 글자 3.13~3.98, 경계 약 2.5 는 버튼 사각형 전체(알약 모서리 바깥·테두리 픽셀 포함)를 잰 측정 오차
- D9 방식 재측정(8개 폭): 글자 6.02~9.53, 경계 3.39~3.62 → 현재 btn-glass 가 D9 충족, 변경 없음
- 대안 기록: P1·P2 히어로의 선+투명 변형(axai.css·leadership.css `.act .btn-glass`) 적용 시 글자 8.89~14.73, 경계 3.78~4.18
