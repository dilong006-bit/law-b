# 기술명세서 증분: KEESS 법정필수교육 노출 B안 upgrade-02

| 항목 | 내용 |
|------|------|
| **Version** | 1.2 (Enhancement #2) |
| **상위 문서** | PRD_KEESS_26827_legal-B_v1.0_upgrade-02.md (LB32~LB39) |
| **기준 명세** | TECHSPEC v1.0 + TECHSPEC upgrade-01 (§13 결정 D1~D9 포함). 이 문서에 없는 내용은 기준 명세 그대로 |
| **전략 근거** | KEESS_26827_법정필수_B안_UIUX전략_upgrade-03_260929.md |
| **기준 커밋** | law-b main e0e783b (커밋 11 보완 반영) |
| **작성일** | 2026-09-29 |

---

## 0. 전제

### 0-1. 유지
- upgrade-01 §0-1 절대 규칙 10개, §0-2 밸런스 규칙 B1~B8
- §13 결정 D1~D9 (높이 예산 D1, 대비 D9 등)

### 0-2. 추가 결정

| 코드 | 결정 |
|---|---|
| D10 | 아이콘은 Iconify **Lucide 단일 세트**. 빌드 전 추출 스크립트로 사용 아이콘만 `lib/legal/iconData.ts` 에 생성. 런타임 Iconify API·세트 전체 번들 금지 |
| D11 | Unsplash 사진은 images.unsplash.com 핫링크(D6 유지) + `srcset` 폭별 해상도 + 비율 고정 + 실패 시 중립 면 |
| D12 | 사진 사용처는 PRD LB39 표 4곳만 |
| D13 | 같은 행 요소는 짝 관계(`data-pair`)와 높이 결정자(`data-height-owner`)를 명시 |
| D14 | 긴 폼 옆 패널은 sticky 요약 예외(`data-sticky-summary`) |
| D15 | 출처 기록 파일명 `ref/legal/ASSET_SOURCES.md` (기존 IMAGE_SOURCES.md 이름 변경 + 아이콘 절 추가) |

### 0-3. 상용화 기준 (전 커밋)
- 콘솔 오류·경고 0, 깨진 이미지 0, CLS 합계 < 0.05 (/content, / 첫 로드)
- 외부 런타임 요청 도메인: images.unsplash.com 만 (api.iconify.design 0)
- 모든 사진·아이콘 출처·라이선스 기록

---

## 1. 파일 맵

| 구분 | 경로 | LB |
|---|---|---|
| 신규 | scripts/gen-legal-icons.mjs | LB38 |
| 신규(생성물, 커밋) | lib/legal/iconData.ts | LB38 |
| 교체 | components/legal-hub/icons.tsx → `LgIcon` 래퍼 | LB38 |
| 신규 | lib/legal/unsplash.ts (srcset 생성) | LB39 |
| 신규 | components/legal-hub/LgPhoto.tsx (사진 공용, 실패 대체) | LB39 |
| 신규 | components/legal-hub/CardNewsStory.tsx (뷰어 + 목차) | LB32 |
| 신규 | components/legal-hub/CardNewsLightbox.tsx | LB32 |
| 신규 | components/legal-hub/BrochureCard.tsx | LB33 |
| 신규 | components/legal-hub/ConsultSummary.tsx (빠른 상담 패널) | LB34 |
| 신규 | components/legal-hub/Process.tsx (독립 블록) | LB35 |
| 수정 | components/legal-hub/StandardAndDiff.tsx (운영 카드 사진 선택) | LB39 |
| 수정 | components/legal-hub/LegalHub.tsx (블록 순서) | 전체 |
| 수정 | components/legal-hub/HubInquiry.tsx (패널 교체) | LB34 |
| 수정 | data/legal.ts, data/legalHub.ts | 전체 |
| 수정 | package.json devDependencies: `@iconify-json/lucide`, `@iconify/utils` | LB38 |
| 이름 변경 | ref/legal/IMAGE_SOURCES.md → ASSET_SOURCES.md | D15 |
| 신규 | public/images/legal/brochure-cover.jpg | LB33 |
| 폐기(미작성) | upgrade-01 의 CardNewsGrid, BrochureBanner 설계 | LB26 폐기 |

---

## 2. 데이터

### 2-1. data/legal.ts
```ts
export type LegalCardNews = { photo: string; alt: string; title: string; summary: string };
// photo: images.unsplash.com 기본 URL (쿼리 없이). 최종본 수령 시 로컬 경로로 교체 가능 (LgPhoto 가 둘 다 처리)
export const LEGAL_CARDNEWS: readonly LegalCardNews[] = [
  { photo: 'https://images.unsplash.com/photo-…', alt: '법정교육, 우리 회사는 몇 개나 끝냈나요?',
    title: '법정교육, 우리 회사는 몇 개나 끝냈나요?', summary: '매년 챙겨야 할 법정교육을 점검해 보세요' },
  { photo: '…', alt: '교육만 열면 끝일까요?',
    title: '교육만 열면 끝일까요?', summary: '대상 선정부터 증빙까지 담당자가 챙길 일' },
  { photo: '…', alt: '2026년 최신 법정필수교육, KG에듀원이 한 곳에 모았습니다',
    title: '2026년 최신 법정필수교육, 한 곳에 모았습니다', summary: '최신 콘텐츠 · 맞춤 구성 · 운영 지원' },
  { photo: '…', alt: '올해 법정교육, 지금 KG에듀원에서 점검하세요',
    title: '올해 법정교육, 지금 점검하세요', summary: '3가지 질문으로 필요한 과정 확인' },
] as const;
```
- 임시 사진은 카드뉴스 원고 문구를 담지 않으므로 alt 는 임시 기간 동안 `title` 과 같게 두고, 최종본 수령 시 최종 문구 전문으로 교체

### 2-2. data/legalHub.ts HUB_COPY (추가·변경분)
```ts
process: { id: 'mandatory-process', kicker: '도입 절차', title: '신청부터 운영까지 4단계', /* steps, cta 는 upgrade-01 그대로 */ },
resources: {
  id: 'mandatory-resources',
  kicker: '자료',
  title: '카드뉴스와 과정소개서',
  lead: '짧게 훑어보고, 자세한 내용은 과정소개서로 받아보세요.',
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
inquiry: {
  kicker: '빠른 상담',
  panelTitle: ['매년 받는 법정교육,', 'KG에듀원에서 한 번에 관리하세요'],
  promises: [
    { icon: 'clock', text: '영업일 1일 내 담당자가 연락드립니다' },
    { icon: 'users', text: '담은 과정 기준으로 인원·일정에 맞춘 운영 방식을 안내합니다' },
  ],
  pickedTitle: (n: number) => `담은 과정 ${n}개`,
  pickedEmpty: '아직 담은 과정이 없습니다.',
  addCommon: '공통 추천 4과정 담기',
  remove: '빼기',
  photo: { src: 'https://images.unsplash.com/photo-…', alt: '' },   // 장식, alt 빈 값
},
diff: { /* upgrade-01 그대로 */ opsPhoto: { src: 'https://images.unsplash.com/photo-…', alt: '' } },
```
- `COMMON_PICK = ['sexual','disability','harassment','privacy']` (진단 공통 추천과 동일 배열을 diagnose.ts 에서 export 해 재사용)

---

## 3. 아이콘 시스템 (LB38, D10)

### 3-1. 추출 스크립트 scripts/gen-legal-icons.mjs
```js
// 사용법: node scripts/gen-legal-icons.mjs  → lib/legal/iconData.ts 생성
import { writeFileSync } from 'node:fs';
import { icons } from '@iconify-json/lucide';
import { getIconData, iconToSVG } from '@iconify/utils';

const NAMES = [
  'search-check','layout-grid','message-circle','clipboard-check','plus','check','minus','x',
  'chevron-left','chevron-right','chevron-up','chevron-down','arrow-right','external-link',
  'refresh-cw','clapperboard','headset','shield-check',
  'list-checks','message-square-text','calendar-check','monitor-play',
  'download','file-text','maximize-2','clock','users',
];
const out = {};
for (const n of NAMES) {
  const data = getIconData(icons, n);
  if (!data) throw new Error(`lucide 에 없는 아이콘: ${n}`);
  const { body } = iconToSVG(data);
  out[n] = body.replaceAll('stroke-width="2"', 'stroke-width="1.5"');
}
const ver = JSON.parse(await (await import('node:fs/promises')).readFile(new URL('../node_modules/@iconify-json/lucide/package.json', import.meta.url))).version;
writeFileSync('lib/legal/iconData.ts',
`// 자동 생성 파일. 직접 수정 금지 (scripts/gen-legal-icons.mjs)
// 출처: Iconify Lucide ${ver}, ISC License. 24px, stroke 1.5
export const LG_ICONS = ${JSON.stringify(out, null, 2)} as const;
export type LgIconName = keyof typeof LG_ICONS;
`);
```
- 아이콘 이름이 Lucide 에 없으면 스크립트가 실패 → 같은 의미의 다른 이름으로 바꾸고 보고
- package.json scripts 에 `"icons:legal": "node scripts/gen-legal-icons.mjs"` 추가

### 3-2. LgIcon (components/legal-hub/icons.tsx)
```tsx
import { LG_ICONS, type LgIconName } from '@/lib/legal/iconData';
export function LgIcon({ name, size = 20, label, className }: { name: LgIconName; size?: number; label?: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={`lg-ico${className ? ' ' + className : ''}`}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true, focusable: 'false' })}
      dangerouslySetInnerHTML={{ __html: LG_ICONS[name] }} />
  );
}
```
```css
.lg-ico{flex:none;display:inline-block;vertical-align:middle;color:currentColor}
```

### 3-3. 아이콘 매핑

| 위치 | 아이콘 |
|---|---|
| 빠른 실행 | search-check / layout-grid / message-circle |
| 진단 결과 강조 | clipboard-check |
| 담기 / 담음 / 빼기 | plus / check / minus |
| 상세 닫기·이전·다음·맛보기 | x / chevron-left / chevron-right / external-link |
| 법정 기준 제목 | shield-check |
| 차이 카드 | refresh-cw (시리즈) / clapperboard (몰입형 스토리) / headset (전담 운영) |
| 도입 절차 | list-checks (선택) / message-square-text (신청) / calendar-check (확정) / monitor-play (운영) |
| 카드뉴스 | chevron-left / chevron-right / maximize-2 / x |
| 소개서 | file-text / check(칩) / download(버튼) |
| 상담 패널 | clock / users / minus(빼기) |
| 트레이 | chevron-up / chevron-down / x |
| 홈 법정 슬라이드 보조 링크 | arrow-right |

- 허브 기존 `icons.tsx` 의 수작업 SVG 는 전부 위 매핑으로 교체. 모양이 달라지는 곳은 캡처로 전후 비교 보고
- 허브 밖(GNB, 푸터, 다른 축) 아이콘은 변경 금지

---

## 4. Unsplash 사진 (LB39, D11)

### 4-1. lib/legal/unsplash.ts
```ts
const W = [640, 1080, 1600, 2000] as const;
export function isUnsplash(src: string) { return src.startsWith('https://images.unsplash.com/'); }
export function unsplashUrl(base: string, w: number, ratio?: [number, number]) {
  const h = ratio ? `&h=${Math.round((w * ratio[1]) / ratio[0])}` : '';
  return `${base.split('?')[0]}?auto=format&fit=crop&q=78&w=${w}${h}`;
}
export function unsplashSrcSet(base: string, ratio?: [number, number], widths: readonly number[] = W) {
  return widths.map((w) => `${unsplashUrl(base, w, ratio)} ${w}w`).join(', ');
}
```

### 4-2. LgPhoto
```tsx
// props: src(Unsplash 기본 URL 또는 로컬), alt, ratio([4,5] 등), sizes, eager?, className?
// - Unsplash 면 src=unsplashUrl(1080), srcSet=unsplashSrcSet, 로컬이면 그대로
// - 컨테이너 aspect-ratio 로 공간 선점 (CLS 0)
// - onError: 이미지 숨기고 컨테이너 배경 var(--surface) 만 남김, data-failed 속성
// - loading: eager ? 'eager' : 'lazy', decoding="async"
```
- 기존 공통 `Img` 컴포넌트에 선택 prop(srcSet, sizes, onError)을 추가해 재사용할 수 있으면 그 방법 우선 (공통 컴포넌트 선택 prop 규칙). 불가하면 LgPhoto 신규
- sizes 예: 카드뉴스 뷰어 `(max-width:880px) 86vw, 367px`, 라이트박스 `min(90vw, 560px)`, 상담 패널 `(max-width:880px) 0px, 480px`

### 4-3. 사진 선정 기준·주제

| 용도 | 비율 | 주제 (검색어 예) |
|---|---|---|
| 카드뉴스 1 | 4:5 | 일정 점검: `planner laptop desk`, `calendar notebook office` |
| 카드뉴스 2 | 4:5 | 서류 정리: `documents desk work`, `paperwork office` |
| 카드뉴스 3 | 4:5 | 온라인 수강: `online course laptop`, `earphones laptop learning` |
| 카드뉴스 4 | 4:5 | 밝은 사무 공간: `bright office interior`, `modern workspace` |
| 상담 패널 배경 | 패널 비율 cover | 상담·협의: `meeting table notebook`, `business meeting hands` |
| 운영 카드 | 16:9 | 운영 현장: `team working office`, `office collaboration` |

- 공통: Unsplash 무료(Unsplash+ 제외), 얼굴 비식별, 자연광·따뜻한 중립 톤, 타사 로고·화면·문자 최소, 히어로(Kelly Sikkema)와 톤 통일, 기존 사진 ID 중복 금지
- 각 용도 후보 2~3장 비교 후 선정, ASSET_SOURCES 에 사진 페이지·작가·날짜·URL 기록

---

## 5. LB32 CardNewsStory

### 5-1. 구조
```
div.lg-block#mandatory-resources.lg-anchor
  BlockHead(resources)
  div.lg-row.lg-story[data-balance-row][data-pair="media-nav"]
    div.lg-c4.lg-story-media[data-height-owner]
      div.lg-cn[role=region][aria-roledescription=carousel][aria-label="법정교육 카드뉴스"]
        ul.lg-cn-track (scroll-snap, [data-hscroll])
          li.lg-cn-slide[role=group][aria-label="1 / 4"] > button.lg-cn-open (aria-label open(n)) > LgPhoto ratio 4:5
        div.lg-cn-ctrl > button(prev, chevron-left) + span.lg-cn-count(1 / 4, tabular-nums) + button(next, chevron-right)
      p.lg-cn-cap (880 이하만: 현재 장 title)
    div.lg-c8.lg-story-side
      h4.lg-sub-title (storyTitle)
      ol.lg-toc > li > button.lg-toc-item[aria-current] (title + summary)
      BrochureCard
```
- 881~1040: `.lg-c4 → span 5`, `.lg-c8 → span 7` (허브 범위 클래스 `.lg-story` 안에서만 재정의)

### 5-2. 상태·동작
- `index` 1개 (0~3). 뷰어·목차·캡션·라이트박스 모두 이 값 사용
- 트랙: 모든 폭에서 같은 scroll-snap 트랙
  - 881 이상: 슬라이드 폭 100% (피크 없음), 트랙 스크롤바 숨김
  - 880 이하: 슬라이드 폭 86%, 다음 장 피크, 간격 12px
- 이전·다음·목차 클릭 → `track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior })` (reduced-motion 이면 'auto')
- 스크롤 → rAF 로 가장 가까운 슬라이드 계산해 index 갱신 (사용자 스와이프 동기화)
- 끝에서 다음: 비활성 (순환 없음). 버튼 `disabled` + 시각 약화
- 목차 항목: `aria-current="true"` 현재 장, 방향키 위아래로 항목 간 포커스 이동 (Should)
- 이미지 버튼 클릭 → 라이트박스 (현재 index)

### 5-3. 높이 맞춤
```css
.lg-story{align-items:stretch}
.lg-story-media{display:flex;flex-direction:column;gap:12px}
.lg-cn-slide{aspect-ratio:4/5}
.lg-story-side{display:flex;flex-direction:column;gap:var(--lg-gap-card)}
.lg-toc{display:grid;grid-auto-rows:1fr;gap:8px;flex:1;margin:0;padding:0;list-style:none}
.lg-toc-item{height:100%;min-height:44px;text-align:left;border-left:3px solid transparent;padding:10px 16px;border-radius:0 var(--r) var(--r) 0;background:#fff;border:1px solid var(--line);border-left-width:3px}
.lg-toc-item[aria-current="true"]{border-left-color:var(--p4)}
.lg-toc-item[aria-current="true"] .t{color:var(--ink);font-weight:800}
.lg-toc-item .t{font-size:15px;font-weight:700;color:var(--muted)}
.lg-toc-item .s{margin-top:4px;font-size:13px;color:var(--muted)}
@media(max-width:1040px){.lg-toc-item .s{display:none}}
@media(max-width:880px){.lg-story-side .lg-sub-title,.lg-toc{display:none}.lg-story-media{max-width:480px;margin-inline:auto;width:100%}}
@media (hover:hover) and (pointer:fine){.lg-toc-item:hover .t{color:var(--ink)}}
```
- 좌측 높이(4:5 이미지 + 컨트롤)가 결정자, 우측은 목차가 `flex:1` 로 남는 높이를 나눔
- 우측 채움 ≥ 85% 가 안 나오면 목차 항목 패딩으로 조정 (여백 추가 금지), 결과 보고

### 5-4. 라이트박스 (CardNewsLightbox)
- useModal 재사용, `role=dialog aria-modal aria-label="법정교육 카드뉴스"`
- 이미지 `LgPhoto ratio 4:5`, 최대 높이 86dvh, sizes `min(90vw, 560px)`
- 이전·다음·`1 / 4`·닫기(44px), ESC, 좌우 방향키, 닫으면 연 버튼으로 포커스 복귀, 배경 스크롤 잠금
- 닫을 때 index 를 뷰어에 반영 (라이트박스에서 넘긴 장이 뷰어에도 보임)
- 전환 200ms 페이드, reduced-motion 즉시
- 사진 실패 장은 열기 버튼 비활성

---

## 6. LB33 BrochureCard
```
article.lg-box.lg-brochure
  div.lg-brochure-cover (3:4, 폭 96px, 1041 이상 / 880 이하 80px) > img (로컬 brochure-cover.jpg)
  div.lg-brochure-body
    h5 or p.lg-brochure-title (강조, h4 다음 단계 태그 규칙 확인)
    ul.lg-brochure-inc > li (check 아이콘 + 텍스트) × 3 (한 줄 칩)
    p.lg-brochure-meta (file-text 아이콘 + PDF · 7개 과정)
    div.lg-box-foot > button.btn.btn-ink (download 아이콘 + 과정소개서 받기)
```
- `display:grid; grid-template-columns:auto 1fr; gap:16px; align-items:center`
- 게이트 모달·성공 링크(`next` → goConsult) 기존 로직 재사용
- 표지 생성: 소개서 PDF 1쪽을 기존 pdf.js 헤드리스 도구로 600px 폭 렌더 → brochure-cover.jpg (≤ 80KB). 1쪽에 가격·과태료 수치가 있으면 사용 금지 후 보고, 이 경우 file-text 아이콘 큰 버전 + --surface 면으로 대체

---

## 7. LB35 Process 독립 블록
- `div.lg-block#mandatory-process.lg-anchor` + BlockHead(process)
- 본문은 upgrade-01 §6-5 그대로, 아이콘은 §3-3 매핑
- 자료 블록 앞에 위치

---

## 8. LB34 ConsultSummary (빠른 상담 패널)

### 8-1. 구조
```
div.lg-block#mandatory-inquiry.lg-anchor
  BlockHead(inquiry.kicker, h3 = panelTitle 을 시각 제목으로 쓰면 BlockHead h3 는 sr-only 가능 여부 보고)
  div.lg-row.lg-consult[data-balance-row][data-pair="summary-action"][data-sticky-summary]
    aside.lg-c5.lg-consult-panel
      LgPhoto (inquiry.photo, cover, lazy) + div.lg-consult-veil (오버레이)
      div.lg-consult-inner (sticky)
        p.lg-consult-title (panelTitle 2줄)
        ul.lg-consult-promise > li (LgIcon clock/users + text) × 2
        section.lg-consult-picked[aria-live=polite]
          p (pickedTitle(n))
          ul > li (과정명 + button.lg-link 빼기[minus], 44px) … 
          또는 p(pickedEmpty) + button.btn-line-light (addCommon)
    div.lg-c7[data-height-owner] > HomeInquiry (upgrade-01 §6-7 호출값 그대로)
```

### 8-2. 스타일·동작
```css
.lg-consult-panel{position:relative;overflow:hidden;border-radius:var(--r);background:var(--ink);color:#fff}
.lg-consult-panel .lg-photo{position:absolute;inset:0}
.lg-consult-veil{position:absolute;inset:0;background:color-mix(in srgb,var(--ink) 86%,transparent)}
.lg-consult-inner{position:sticky;top:141px;padding:32px}
.lg-consult-inner.no-sticky{position:static}
@media(max-width:880px){
  .lg-consult-panel .lg-photo{display:none}
  .lg-consult-inner{position:static;padding:18px 20px}
  .lg-consult-promise{display:none}
  .lg-consult-picked ul{display:flex;gap:8px;overflow-x:auto}   /* [data-hscroll] */
}
```
- 오버레이 86% 는 기존 값이 아니면 기존 다크 오버레이 값(히어로 .hs-scrim 등) 중 대비 4.5:1 을 만족하는 값으로 대체하고 보고
- sticky 해제: 패널 내부 높이 > `innerHeight - 160` 이면 `.no-sticky` (resize 시 재계산)
- 빼기 → `pick.remove(id)` → 폼 희망과정·카드·트레이 동기화 (기존 선택 상태)
- 공통 추천 담기 → `pick.addMany(COMMON_PICK)`
- 버튼 색: 다크 면 위 보조 버튼은 기존 밝은 테두리 버튼 클래스 사용, 글자 4.5:1 (D9)

---

## 9. LB36 히어로 2차 버튼
- upgrade-01 커밋 11 입력(11-0) 그대로. 이 문서에서는 결과만 검증 대상

---

## 10. 허브 최종 조립 (LegalHub)
```
HubHead + QuickActions
Diagnose            #mandatory-diagnose   data-pair="input-result"
CourseLineup        #mandatory-courses
StandardAndDiff     #mandatory-law        (차이 카드 행 data-pair="peer")
Process             #mandatory-process    (카드 행 data-pair="peer")
CardNewsStory       #mandatory-resources  data-pair="media-nav"
HubInquiry          #mandatory-inquiry    data-pair="summary-action" data-sticky-summary
PickAnnouncer, PickTray
```

---

## 11. 반응형 표 (upgrade-01 §8 대비 변경 행)

| 요소 | 1041+ | 881~1040 | 761~880 | 561~760 | ~560 |
|---|---|---|---|---|---|
| 자료 | 4+8 (뷰어 + 목차·소개서) | 5+7, 요약 줄 숨김 | 세로: 뷰어(피크) + 캡션 + 소개서 | 동일 | 동일 |
| 빠른 상담 | 5+7, 사진 패널 sticky | 5+7 | 폼 위 요약 바 | 동일 | 동일 |
| 도입 절차 | 독립 블록 4열 | 4열 | 2×2 | 2×2 | 세로 |

---

## 12. 검증 (LB37 + 상용화, verify-legal-b.mjs 확장)

| 항목 | 판정 |
|---|---|
| 짝 행 높이 | `[data-balance-row]` 에서 결정자 외 요소 높이 / 결정자 높이 = 0.95~1.05 (세로 전환 폭 제외) |
| 자료 우측 채움 | 목차 + 소개서 콘텐츠 / 우측 컬럼 ≥ 0.85 |
| sticky 요약 | 과정 3개 담은 상태에서 패널 콘텐츠 ≥ 폼 높이 45%, 폼을 끝까지 스크롤하는 동안 `.lg-consult-picked` 가 뷰포트 안 |
| 인덱스 동기화 | 목차 클릭·이전/다음·스와이프·라이트박스 이동 후 4곳 index 일치 |
| 아이콘 | 허브 svg.lg-ico 외 인라인 아이콘 0 (홈 슬라이드 포함), 계산 stroke-width 1.5, api.iconify.design 요청 0 |
| 사진 | 사용처 외 Unsplash 이미지 0, 모든 사진 srcset 존재, images.unsplash.com 차단 시 깨진 이미지 0·목차 정상 |
| CLS | /, /content 첫 로드 layout-shift 합 < 0.05 |
| 외부 요청 | 요청 도메인 목록에 자체 도메인·images.unsplash.com 외 0 |
| 콘솔 | 오류·경고 0 |
| 높이 예산 | 1440 ≤ 4422, 390 ≤ 7434, 블록 ≤ 900 (과정 그리드 예외) |
| 기존 | upgrade-01 §10 전 항목, 9폭 가로 스크롤 0, 44px, 금지어 0, 회귀 0 |

- 캡처: `test-results/legal-b/up02/{커밋}/`

---

## 13. 커밋 계획

| # | 커밋 | 범위 |
|---|---|---|
| 11 | feat(content): 허브 밸런스 기반·헤더·진단·과정 타일 (+히어로 2차 버튼 대비) | 이미 전달된 입력 그대로 |
| 12 | feat(content): 아이콘 시스템·법정 기준·도입 절차·카드뉴스 스토리 | 12-0 LB38, LB24, LB35, LB32, LB33, LB39(카드뉴스·운영·표지), D15 |
| 13 | feat(inquiry): 요약형 빠른 상담·선택 바 | LB27, LB34, LB39(상담 사진), LB28, LB31 |
| 14 | test(legal-b): 짝 설계·상용화 검수·최종 보고 | LB37, REPORT |

- 각 커밋: `npx tsc --noEmit` → `npm run build` → commit → 하나씩 `git push law-b feat/legal-b` / `git push law-b feat/legal-b:main` / `git ls-remote law-b`
- 차단 시 우회 금지, stash@{0} 유지

---

## 14. 완료 정의
- PRD upgrade-02 LB32~LB39 완료 조건, upgrade-01 LB18~LB31 (LB26 폐기 제외) 완료 조건 충족
- §12 전 항목 통과 또는 사유 승인
- ASSET_SOURCES.md 에 사진 전부(신규 7장 + 기존 5장)와 아이콘 세트·버전·목록·라이선스 기록
- 사람 실기기 확인 1회 (iPhone Safari, Android Chrome, iPad)
