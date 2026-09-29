# 기술명세서: KEESS 법정필수교육 노출 B안

| 항목 | 내용 |
|------|------|
| **Version** | 1.0 |
| **상위 문서** | ref/legal/PRD_KEESS_26827_legal-B_v1.0.md (LB1~LB17) |
| **준수 기준** | CLAUDE.md, ref/design/Design.md, ref/spec/KEESS_모바일대응_고도화_기술명세서_및_프롬프트_v1.0_260810.md |
| **작업 폴더 / 원격** | `KEESS_law-B` / https://github.com/dilong006-bit/law-b (원격명 `law-b`) |
| **이식 원본** | https://github.com/dilong006-bit/keess-law-A 브랜치 feat/legal-a (원격명 `law-a`) |
| **작성일** | 2026-09-28 |

---

## 0. 절대 규칙 (위반 필요 시 코드 작성 전 보고)

1. 신규 색·폰트·섀도·라운드·브레이크포인트·버튼 변형 금지. `var(--*)` 토큰과 기존 클래스만
2. 브레이크포인트: 1040 / 940 / 880 / 820 / 760 / 740 / 720 / 640 / 560 (`max-width`)만. /kium의 767은 이식하지 않음 (760 사용)
3. 원 소스 반응형: 기기별 컴포넌트 분기 금지. JS 분기는 `matchMedia`로 동작만
4. 공통 컴포넌트 수정은 **선택 prop 추가만**. 미지정 시 기존 렌더·동작·마크업 100% 동일
5. hover는 `@media (hover:hover) and (pointer:fine)` 안에서만
6. `prefers-reduced-motion: reduce` 대응 필수
7. 카피는 이 문서와 PRD 확정본 그대로. 대시 문자·느낌표·반말 금지
8. **미검증 주장 노출 금지:** 과태료 수치, 확인 전 운영 지원 항목, 답변 미확정 FAQ, 외부 작품명(지구오락실, 지구마블, K-POP Demon Hunters), 교육비
9. 백엔드 추가 금지. 제출은 기존 `submitInquiry` 경로, payload 구조 불변
10. **GNB 변경 금지** (law-A의 nav 커밋 이식 금지)

---

## 1. 이식 (law-A → law-B)

```bash
git remote add law-a https://github.com/dilong006-bit/keess-law-A.git
git fetch law-a feat/legal-a
git checkout law-a/feat/legal-a -- \
  data/legal.ts \
  lib/legal \
  public/images/legal \
  "public/downloads/KG에듀원_2026_법정필수교육_과정소개서.pdf" \
  components/legal/LegalCardNews.tsx \
  components/legal/LegalCourseField.tsx \
  components/sections/home/HomeInquiry.tsx \
  components/sections/content/ContentModals.tsx
```
- 이식 후 확인
  - `git diff main -- components/sections/home/HomeInquiry.tsx`: courseField·panel 선택 prop 외 변경 없음
  - `git diff main -- components/sections/content/ContentModals.tsx`: 다운로드 자산 선택 인자 외 변경 없음
  - data/nav.ts, components/common/Nav.tsx, styles/components.css: **변경 없음이어야 함**
- law-A `styles/legal.css`에서 이식 컴포넌트(LegalCardNews, LegalCourseField)가 쓰는 규칙만 `styles/legal-hub.css`로 복사 (lg- 접두어 유지)
- law-A의 LegalHero, LegalCourses, LegalCourseCard, LegalResources, LegalStandard, LegalInquirySection, app/legal 은 이식하지 않음 (B안은 신규 구성)

---

## 2. 파일 맵

| 구분 | 경로 | LB |
|---|---|---|
| 이식 | data/legal.ts (확장) | 공통 |
| 신규 | data/legalHub.ts (B안 전용 데이터·카피) | 공통 |
| 신규 | lib/legal/pick.tsx (선택 상태 Provider·훅) | LB5, 6, 7, 13, 14 |
| 신규 | lib/legal/diagnose.ts (진단 규칙 순수 함수) | LB5 |
| 신규 | components/home/HeroNotice.tsx | LB1 |
| 신규 | components/home/CampaignBand.tsx | LB2 |
| 신규 | components/legal-hub/LegalHub.tsx (허브 섹션 조립) | LB4~14 |
| 신규 | components/legal-hub/HubHead.tsx | LB4 |
| 신규 | components/legal-hub/Diagnose.tsx | LB5 |
| 신규 | components/legal-hub/CourseLineup.tsx | LB6, LB7 |
| 신규 | components/legal-hub/CourseCard.tsx | LB6 |
| 신규 | components/legal-hub/CourseDetail.tsx | LB7 |
| 신규 | components/legal-hub/LawTable.tsx | LB8 |
| 신규 | components/legal-hub/OpsSupport.tsx | LB9 |
| 신규 | components/legal-hub/Difference.tsx | LB10 |
| 신규 | components/legal-hub/Resources.tsx | LB11 |
| 신규 | components/legal-hub/HubFaq.tsx | LB12 |
| 신규 | components/legal-hub/PickTray.tsx | LB13 |
| 신규 | components/legal-hub/HubInquiry.tsx | LB14 |
| 신규 | styles/legal-hub.css (lg- 접두어) | 전체 |
| 신규 | styles/home-campaign.css (hc- 접두어) | LB1, LB2 |
| 신규 | scripts/verify-legal-b.mjs | LB15 |
| 수정 | components/sections/home/HeroCarousel.tsx (선택 prop `notice`) | LB1 |
| 수정 | app/page.tsx (알약 전달, 캠페인 밴드 삽입) | LB1, LB2 |
| 수정 | components/sections/content/Sections.tsx (#ax5 → LegalHub, 6축 타일 배지) | LB3 |
| 수정 | data/content.ts (HERO.hex 법정 href, AXISNAV id) | LB3 |
| 수정 | components/sections/home/HomeInquiry.tsx (선택 prop `optionalFold`, `prefill`) | LB14 |
| 수정 | styles/components.css (body.legal-tray-on 규칙 2줄 추가) | LB13 |
| 수정 | app/layout.tsx (robots noindex, 시안 저장소 전용) | 운영 |

---

## 3. 데이터

### 3-1. data/legal.ts 확장 (이식본에 필드 추가)
```ts
export type LegalKind = 'mandatory' | 'recommended' | 'industry';

export interface LegalCourse {
  id: LegalCourseId; order: number; name: string; option: string; classkey: string; thumb: string;
  lawKey: string | null;
  // B안 추가
  kind: LegalKind;
  kindNote?: string;          // 업종별 표기 보조 (예: '금융', '공공·기업')
  sessions: number;           // 차시 (소개자료 PDF 기준)
  short: string;              // 카드 제목용 짧은 이름
  detail: {
    audience: string[];       // 이런 분께
    goals: string[];          // 학습 목표
    outline: string[] | null; // 주요 학습 내용 (null 이면 비표시)
    instructor: { name: string; bio: string };
  };
}
```

| id | short | kind | sessions | outline | 강사 |
|---|---|---|---|---|---|
| harassment | 직장 내 괴롭힘 예방 | recommended | 2 | 고충발생 원인 및 대응 필요성 / 직장 내 괴롭힘 구제절차 | 박정연 · 노무법인 마로 대표 |
| sexual | 성희롱 예방 | mandatory | 2 | **null** (원본 오기재) | 박정연 · 노무법인 마로 대표 |
| disability | 장애인 인식개선 | mandatory | 2 | 장애인에 대한 인식 / 장애의 유형별 특성 | 김혜원 · 한국장애인고용공단 장애인인식개선교육 강사 |
| ethics | 윤리경영 | industry (공공·기업) | 2 | 기업 생존 전략과 사회·제도의 진화 / 윤리경영 내재화 및 조직문화 형성 | 이서연 · 한국 자기경영 연구소 대표 |
| pension | 퇴직연금 가입자 | mandatory | 3 | 퇴직연금제도의 기본 이해 / 퇴직연금 제도의 변경 / 퇴직연금 상품 예시 | 박정연 · 노무법인 마로 대표 |
| privacy | 개인정보보호·정보보안 | recommended | 4 | 개인정보보호의 기본 개념과 보호 필요성 / 개인정보의 유형과 개인정보보호법 이해 / 정보보안의 개념과 위협 사례 / 일상에서 실천하는 개인정보 보호 및 정보보안 수칙 | 안성열 · 법무법인 새별 대표변호사 |
| aml | 자금세탁방지 | industry (금융) | 12 | **null** (원본 미기재) | 정지열 · 자금세탁방지전문가(CAMS) |

- audience·goals: 소개자료 PDF p.9~15 문장을 **존댓말 명사형으로만 다듬어** 기재 (의미 변경 금지). 원문은 ref/legal에 PDF 페이지 번호로 주석
- 교육비 필드 만들지 않음

### 3-2. data/legalHub.ts (B안 전용)
```ts
export const LEGAL_SEASON = { on: true } as const; // 알약·캠페인 카드 표시 플래그

export const HUB_COPY = {
  notice: { label: '2026 법정필수교육', cta: '과정 보기', href: '/content#mandatory' },
  campaign: {
    legal: {
      badge: '2026 법정필수교육',
      title: '올해 법정교육, 한 곳에서 준비하세요',
      desc: '성희롱 예방부터 자금세탁방지까지 7개 과정. 필요한 과정 진단부터 운영까지 함께합니다.',
      cta: { label: '과정 보기', href: '/content#mandatory' },
      sub: { label: '과정소개서 받기', href: '/content#mandatory-resources' },
    },
    kium: {
      title: '인재키움 프리미엄 공개교육',
      desc: '정부지원으로 운영되는 공개교육 일정을 확인하세요',
      cta: { label: '일정 보기', href: '/kium?tab=courses&mode=open#courses' },
    },
  },
  head: {
    kicker: 'Compliance',
    title: ['필수 기준은 정확하게, 콘텐츠는 ', '매년 새롭게'],
    lead: '2026년 법정필수교육 7개 과정을 진단부터 문의까지 한 곳에서 준비하세요.',
    season: '연내 이수 일정을 함께 계획해 드립니다.',
    tabs: [
      { id: 'mandatory-diagnose', label: '필요 과정 진단' },
      { id: 'mandatory-courses', label: '과정 보기' },
      { id: 'mandatory-law', label: '법정 기준' },
      { id: 'mandatory-inquiry', label: '도입 문의' },
    ],
  },
  diagnose: {
    title: '우리 회사에 필요한 과정 찾기',
    sub: '3가지만 선택하면 추천 과정을 보여 드립니다.',
    q: [
      { key: 'size', label: '상시 근로자 수', options: [['lt10','10인 미만'],['10to49','10~49인'],['gte50','50인 이상']] },
      { key: 'pension', label: '퇴직연금 도입', options: [['yes','도입함'],['no','도입 안 함'],['unknown','잘 모름']] },
      { key: 'industry', label: '업종', options: [['finance','금융'],['public','공공기관'],['general','일반 기업']] },
    ],
    empty: '3개 항목을 선택하면 추천 과정이 표시됩니다.',
    groups: { mandatory: '법정 의무', recommended: '권고', industry: '업종별 권장' },
    smallNote: '사업장 규모에 따라 교육 방식이 달라질 수 있습니다.',
    note: '참고용 결과입니다. 정확한 대상은 상담 시 확인해 드립니다.',
    addAll: '추천 과정 모두 담기',
    added: '담았습니다 · 선택 과정 보기',
  },
  lineup: {
    title: '2026 법정필수교육 과정',
    filters: [['all','전체'],['mandatory','법정 의무'],['recommended','권고'],['industry','업종별']],
    addMandatory: '법정 의무 과정 한 번에 담기',
    kindLabel: { mandatory: '법정 의무', recommended: '권고', industry: '업종별' },
    detail: '자세히 보기', preview: '맛보기', pick: '담기', picked: '담음',
    previewNote: '맛보기는 새 창에서 열립니다. 연결된 페이지의 \'맛보기 강의\' 버튼으로 재생됩니다.',
    sessionsUnit: '차시',
  },
  law: {
    title: '법정 기준',
    cols: ['교육', '구분', '근거', '대상', '주기'],
    basis: '2026년 9월 기준 · 출처: 찾기쉬운 생활법령정보, 한국장애인고용공단',
    notes: ['실제 적용 대상은 사업장 여건에 따라 다를 수 있습니다.', '과태료 등 제재 기준은 상담 시 최신 법령으로 안내해 드립니다.'],
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
  diff: { title: '매년 새로운 시리즈, 몰입하는 법정교육' },
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
```
- 법령 구분 데이터: 과정 `kind` 사용. 근거·대상·주기는 `lawOf(lawKey)` (AX5.laws). 괴롭힘은 `kind: 'recommended'` 이므로 표에서 '권고'로 표시되고 AX5.laws 값은 근거·대상·주기에만 사용

### 3-3. 진단 규칙 (lib/legal/diagnose.ts)
```ts
export type DiagAnswer = { size?: 'lt10'|'10to49'|'gte50'; pension?: 'yes'|'no'|'unknown'; industry?: 'finance'|'public'|'general' };
export type DiagResult = { mandatory: LegalCourseId[]; recommended: LegalCourseId[]; industry: LegalCourseId[]; smallNote: boolean } | null;

export function diagnose(a: DiagAnswer): DiagResult {
  if (!a.size || !a.pension || !a.industry) return null;
  const mandatory: LegalCourseId[] = ['sexual', 'disability'];
  if (a.pension !== 'no') mandatory.push('pension');
  const recommended: LegalCourseId[] = ['harassment', 'privacy'];
  const industry: LegalCourseId[] = a.industry === 'finance' ? ['aml'] : ['ethics'];
  return { mandatory, recommended, industry, smallNote: a.size === 'lt10' };
}
```
- 27개 조합 단위 테스트 (scripts 또는 간단한 node 검증)

---

## 4. 선택 상태 (lib/legal/pick.tsx)

```ts
interface PickCtx {
  picked: LegalCourseId[];               // order 순 정렬 유지
  has: (id: LegalCourseId) => boolean;
  toggle: (id: LegalCourseId) => void;
  addMany: (ids: LegalCourseId[]) => void; // 합집합
  remove: (id: LegalCourseId) => void;
  setFromOptions: (options: string[]) => void; // 폼 체크 → 상태
  prefill: { company?: string; name?: string; email?: string };
  setPrefill: (p: PickCtx['prefill']) => void;
}
```
- Provider 위치: LegalHub 루트 (허브 안에서만)
- 폼 연동: HubInquiry가 `picked` → option 라벨로 변환해 HomeInquiry 희망과정 초기값·변경 동기화
- 저장: 메모리만 (새로고침 초기화)
- 개수 변화 안내: 허브 안 시각적 숨김 `aria-live="polite"` 영역에 `선택 과정 N개`

---

## 5. 홈

### 5-1. LB1 HeroNotice
- HeroCarousel 선택 prop: `notice?: { label: string; cta: string; href: string; gaId: string }`
- 렌더 위치: `<section className="hero">` 안, `.hero-track` **앞**, 슬라이드 밖 단일 요소
```
div.hc-notice-layer > div.wrap > a.btn.btn-glass.hc-notice
  span.hc-dot (P4 점, aria-hidden)
  span.hc-notice-label {label}
  span.hc-notice-sep (aria-hidden, 가운뎃점)
  span.hc-notice-cta {cta}
  svg 화살표 (1.5 stroke, aria-hidden)
```
- 위치: `position:absolute; top: calc(72px + 28px); left:0; right:0; z-index` 는 슬라이드 콘텐츠 위, 인디케이터와 무관
- 슬라이드 콘텐츠와 겹침 방지: `.hero.has-notice .hs-content{padding-top:56px}` (값은 실측 후 조정, 모든 슬라이드 동일 적용)
- 인재키움 슬라이드의 `.hs-tag`와 세로 간격 16px 이상 확보 (자동 검사 대상)
- 모바일
```css
@media(max-width:560px){ .hc-notice-sep,.hc-notice-cta{display:none} .hc-notice{min-height:44px} }
```
- hover(마우스 기기): 화살표 translateX(2px) 160ms
- `LEGAL_SEASON.on === false` 이면 prop 미전달 (기존 히어로와 완전히 동일)

### 5-2. LB2 CampaignBand
- app/page.tsx: `<HeroCarousel notice={...} />` 다음, 인트로 section 앞
```
section.section.hc-band (padding 상하: 기존 .section 보다 축소, 72px / 48px)
  div.wrap > div.hc-grid
    article.hc-card.hc-legal
      div.hc-copy
        span.hc-badge
        h2.hc-title
        p.hc-desc
        div.hc-acts > a.btn.btn-ink + a.hc-link
      div.hc-visual  (카드뉴스 or 썸네일 모자이크)
    article.hc-card.hc-kium
      h2.hc-title / p.hc-desc / a.btn.btn-line-dark
```
- 그리드
```css
.hc-grid{display:grid;grid-template-columns:7fr 5fr;gap:20px}
@media(max-width:760px){.hc-grid{grid-template-columns:1fr}}
.hc-card{background:#fff;border:1px solid var(--line);border-radius:var(--r);box-shadow:var(--shadow-1);padding:28px;min-width:0}
.hc-legal{display:grid;grid-template-columns:1fr 200px;gap:24px;align-items:center}
@media(max-width:1040px){.hc-legal{grid-template-columns:1fr}.hc-visual{max-width:360px}}
@media(max-width:560px){.hc-card{padding:22px}.hc-acts .btn{width:100%;min-height:48px}}
@media (hover:hover) and (pointer:fine){.hc-card{transition:transform .3s var(--ease),box-shadow .4s var(--ease)}.hc-card:hover{transform:translateY(-3px);box-shadow:var(--shadow-2)}}
```
- hc-visual
  - 카드뉴스 재제작본 있음: LegalCardNews(`autoplay:'desktop'`, `intervalMs:6000`, `showPlayToggle:true`) 4:5
  - 없음: 썸네일 2×2 (harassment, sexual, disability, privacy) 16:9 타일, 라운드 12px, 장식 이미지 `alt=""`
- 인재키움 카드: 이미지 없음, 버튼 1개, 높이는 법정 카드에 맞춰 늘어남 (`align-items:stretch`)

### 5-3. LegalCardNews 확장 (이식본에 선택 prop 추가)
```ts
interface LegalCardNewsProps {
  slides: { src: string | null; alt: string }[];
  intervalMs?: number;                    // 기본 6000
  autoplay?: 'off' | 'desktop';           // 기본 'off'
  showPlayToggle?: boolean;               // autoplay 'desktop' 일 때 필수 true
}
```
- `desktop`: `(min-width:941px) and (hover:hover)` 에서만 자동 넘김
- 사용자 조작(버튼·스와이프·키보드) 발생 시 자동 넘김 영구 중지
- 위치 표시 `n / N` 텍스트 + 점
- 재생/정지 버튼 44px, `aria-label` 재생/일시정지
- reduced-motion: 자동 넘김 없음, 전환 즉시

---

## 6. /content

### 6-1. LB3
- data/content.ts: HERO.hex 법정 항목 `href: '#mandatory'`, `badge: '2026'` 추가 / AXISNAV `{ id: 'mandatory', label: '법정 헌터스' }`
- Sections.tsx: 6축 타일에 badge 렌더 (P4 배지, 타일 우상단), 기존 `<section id="ax5">` 블록을 `<LegalHub />`로 교체
- 하위 호환: `#ax5` 딥링크 진입 시 `#mandatory`로 이동 (허브 루트에 `<span id="ax5" aria-hidden="true" />` 앵커)
- 모든 허브 앵커: `scroll-margin-top: calc(72px + SubNav 높이 + 16px)` (고정 헤더 가림 방지)

### 6-2. LegalHub 조립
```tsx
<section className="section lg-hub" id="mandatory" aria-labelledby="mandatory-title">
  <span id="ax5" aria-hidden="true" />
  <PickProvider>
    <div className="wrap">
      <HubHead />              {/* LB4 */}
      <Diagnose />             {/* LB5, id=mandatory-diagnose */}
      <CourseLineup />         {/* LB6·7, id=mandatory-courses */}
      <LawTable />             {/* LB8, id=mandatory-law */}
      <OpsSupport />           {/* LB9 */}
      <Difference />           {/* LB10 */}
      <Resources />            {/* LB11, id=mandatory-resources */}
      {HUB_COPY.faq.show && <HubFaq />}  {/* LB12 */}
    </div>
    <HubInquiry />             {/* LB14, id=mandatory-inquiry */}
    <PickTray />               {/* LB13 */}
  </PickProvider>
</section>
```
- 허브 내부 블록 간격: 72px (640 이하 52px). 블록 제목은 `.substep` 기존 스타일 + h3

### 6-3. LB4 HubHead
- 기존 AxHead 마크업·클래스 그대로 (id `mandatory-title` 을 h2에 부여)
- 시즌 문구: `p.lg-season` (P4 7% 배경, 라운드 12px, 패딩 10px 14px)
- 탭 칩: `nav.lg-tabs[aria-label="법정 허브 바로가기"] > a.lg-tab` 4개, 기존 SubNav 칩 스타일 재사용, 640 이하 가로 스크롤 + 엣지 페이드

### 6-4. LB5 Diagnose
```
div.lg-diag#mandatory-diagnose
  div.lg-diag-q  (문항 3개)
    fieldset.lg-q > legend + div.lg-chips > label.lg-chip > input[type=radio].sr-only + span
  div.lg-diag-r[aria-live=polite]
    (null) p.lg-diag-empty
    (결과) div.lg-diag-group x3 > h4 + ul > li.lg-rchip (과정 short)
           p.lg-diag-small (size=lt10)
           p.lg-diag-note
           button.btn.btn-ink.lg-diag-add
```
- 네이티브 라디오 사용 (키보드 방향키·스크린리더 기본 지원), 칩 44px 이상, 선택 시 P4 테두리·배경 8%
- 레이아웃
```css
.lg-diag{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:24px;background:#fff;border:1px solid var(--line);border-radius:var(--r);padding:28px}
@media(max-width:880px){.lg-diag{grid-template-columns:1fr}}
@media(max-width:560px){.lg-diag{padding:20px}}
.lg-chips{display:flex;flex-wrap:wrap;gap:8px}
.lg-chip span{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border:1px solid var(--line);border-radius:999px;font-size:14.5px}
.lg-chip input:checked+span{border-color:var(--p4);background:color-mix(in srgb,var(--p4) 8%,#fff);font-weight:700}
.lg-chip input:focus-visible+span{outline:2px solid var(--ink);outline-offset:2px}
```
- 결과 전환: opacity·translateY(6px) 240ms `var(--ease)`
- 모두 담기 → `addMany` → 버튼 문구 `added` 로 변경 + 클릭 시 #mandatory-courses 이동

### 6-5. LB6·LB7 CourseLineup / CourseCard / CourseDetail
**도구 줄**
- 좌 필터 칩 (라디오 그룹, 단일 선택), 우 `법정 의무 과정 한 번에 담기` (btn-line-dark)
- 640 이하: 필터 칩 가로 스크롤, 버튼은 아래 줄 전체 폭

**카드**
```
article.lg-card[data-picked]
  button.lg-card-thumb (상세 열기, aria-expanded, aria-controls)
    img (16:9, lazy, alt="")
  button.lg-pick[aria-pressed] (우상단 44x44, 흰 원 + 체크/플러스 아이콘, aria-label "{short} 담기")
  div.lg-card-body
    div.lg-meta > span.lg-kind + span.lg-sess ("2차시", tabular-nums)
    h3 > button.lg-card-title (상세 열기)
    p.lg-card-sub (대상 · 주기, lawOf 있을 때만)
    div.lg-card-acts > button.lg-link(자세히 보기) + a.lg-link(맛보기 ↗, target=_blank rel="noopener noreferrer", aria-label "{name} 맛보기 (새 창)")
```
- 담김: 카드 테두리 `var(--p4)`, pick 버튼 P4 배경 흰 체크, 240ms 전환
- 배지 색: 법정 의무 = P4 10% 배경 + 진한 P4 글자 / 권고 = surface + ink / 업종별 = 흰 배경 + line 테두리 + muted 글자 (색 + 문구로 구분)

**그리드**
```css
.lg-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}
@media(max-width:1040px){.lg-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:880px){.lg-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}}
@media(max-width:560px){
  .lg-grid{grid-template-columns:1fr;gap:12px}
  .lg-card{display:grid;grid-template-columns:40% 1fr}
  .lg-card-thumb{aspect-ratio:auto;height:100%;min-height:112px}
}
```

**상세 (CourseDetail, /kium 방식)**
- 열 수 판정: `matchMedia` 로 1040/880/560 기준 열 수 계산 → 열린 카드가 속한 **행 뒤에** 상세 행 삽입 (`grid-column:1/-1`)
- 760 이하: 인라인 대신 바텀시트 (기존 useModal, /kium .kium-sheet 스타일 규칙을 lg- 접두어로 복제하지 말고 **공통 클래스로 재사용 가능하면 재사용**, 불가 시 동일 값 복제 후 보고)
- 내용 순서: 헤더(썸네일 좌 120px, 배지·과정명·차시) → 이런 분께 → 학습 목표 → 주요 학습 내용(outline 있을 때) → 강사 → 법적 근거(lawOf 있을 때)
- 하단 고정 버튼: `담기/담음` (btn-ink) + `맛보기 보기 ↗` (btn-line-dark)
- 이전/다음: 필터 결과 순서 기준
- 인라인 펼침 전환: 높이·불투명도 280ms, 열릴 때 상세 상단으로 스크롤(부드럽게, reduced-motion 즉시)
- 필터 변경 시 닫힘

### 6-6. LB8 LawTable
```
div#mandatory-law
  h3 / table.lg-law (PC·태블릿) / ul.lg-law-m (640 이하 카드) / p.lg-law-basis / ul.lg-law-notes
```
- 같은 데이터에서 표·카드 모두 렌더, CSS로 한쪽만 표시 (데이터 이중 기재 금지)
- 행 순서: 과정 order 순, 근거 없는 과정은 근거·대상·주기 셀에 `상담 시 안내`
- 880 이하: 대상·주기 열을 한 셀로 합침 (`대상 · 주기`)
- 640 이하: 카드 (교육명 + 구분 배지 / 근거 / 대상 / 주기)

### 6-7. LB9 OpsSupport
- `show:true` 항목만 렌더 (현재 2개 → PC 2열, 560 이하 1열). 4개가 되면 4열 → 880 이하 2열 → 560 이하 1열
- 아이콘: 인라인 SVG 1.5 stroke

### 6-8. LB10 Difference
- 시리즈 타임라인: 기존 `.timeline/.tnode` 재사용, `cc` 렌더 금지
- 차별점: 기존 `.difftable` + 640 이하 `.lg-diff-m` 블록 (같은 데이터)

### 6-9. LB11 Resources
```css
.lg-res{display:grid;grid-template-columns:minmax(0,420px) minmax(0,1fr);gap:40px;align-items:start}
@media(max-width:880px){.lg-res{grid-template-columns:1fr}.lg-res>*{max-width:480px;width:100%;margin:0 auto}}
```
- 카드뉴스: LegalCardNews `autoplay:'off'`
- 소개서: `openDownload('legalBrochure')`, 제출 성공 콜백으로 `setPrefill({company,name,email})` (ContentModals에 선택 콜백 prop `onLeadSubmitted` 추가, 미지정 시 기존 동일)
- 성공 화면 링크 `담은 과정으로 도입 문의하기` → #mandatory-inquiry

### 6-10. LB13 PickTray
- 표시 조건: `picked.length > 0` AND 허브 루트 교차(IntersectionObserver) AND 문의 섹션 비교차 AND 모바일 입력 포커스 아님(`focusin` 시 input/textarea/select 면 숨김)
```
div.lg-tray[role=region][aria-label="선택한 과정"]
  button.lg-tray-sum[aria-expanded] → "선택 과정 N개" + 요약 칩
  a.btn.btn-ink.lg-tray-cta[href=#mandatory-inquiry] 문의하기
  div.lg-tray-list (펼침: 과정명 + 빼기 버튼 각 44px)
```
```css
.lg-tray{position:fixed;left:50%;bottom:calc(20px + env(safe-area-inset-bottom));transform:translate(-50%,120%);width:min(720px,calc(100% - 32px));z-index:65;background:var(--ink);color:#fff;border-radius:999px;box-shadow:var(--shadow-3);display:flex;align-items:center;gap:12px;padding:8px 8px 8px 20px;transition:transform .28s var(--ease-out)}
.lg-tray.show{transform:translate(-50%,0)}
@media(max-width:560px){.lg-tray{left:0;right:0;width:auto;transform:translateY(120%);bottom:0;border-radius:18px 18px 0 0;padding:10px 12px calc(10px + env(safe-area-inset-bottom)) 16px}.lg-tray.show{transform:none}}
```
- 펼침 목록: 트레이 위로 열리는 패널 (라운드 18px, 최대 높이 50dvh)
- body 클래스 연동 (components.css 추가 2줄)
```css
body.legal-tray-on .to-top{bottom:calc(22px + 76px)}
body.legal-tray-on .teaser{display:none}
```
  560 이하 to-top: `bottom:calc(16px + 76px + env(safe-area-inset-bottom))` (같은 블록에 포함)
- z-index 순서: to-top 60 < tray 65 < nav 70 < 모달·시트 110 이상

### 6-11. LB14 HubInquiry
- 섹션: `section.section#mandatory-inquiry` (허브 안 마지막)
- HomeInquiry 호출
```tsx
<HomeInquiry
  presetInterests={['compliance']}
  leadSource="content-legal"
  courseField={{ ...이식본 설정 }}
  panel={{ title: HUB_COPY.inquiry.panelTitle, body: HUB_COPY.inquiry.panelBody }}
  optionalFold={{ label: HUB_COPY.inquiry.foldLabel, fields: ['companySize','trainees','message','attachment'] }}
  prefill={pick.prefill}
  courseValue={pickedOptions}           // 선택 상태 → 희망과정
  onCourseChange={pick.setFromOptions}  // 희망과정 → 선택 상태
/>
```
- 신규 선택 prop 3개: `optionalFold`, `prefill`, `courseValue/onCourseChange` (모두 미지정 시 기존 동일)
- optionalFold: 지정 필드를 `<details>` 형태 접기 영역으로 이동 (기본 닫힘, 오류가 그 안에 있으면 자동 열림). 필수 필드는 접지 않음
- 필수: 회사·기관명, 담당자명, 연락처, 직급/직책, 이메일, 희망과정, 개인정보 동의 (운영 규칙 유지)

---

## 7. 전체 반응형 표 (구현 기준)

| 요소 | 1041+ | 941~1040 | 881~940 | 761~880 | 641~760 | 561~640 | ~560 |
|---|---|---|---|---|---|---|---|
| 알약 | 전체 | 전체 | 전체 | 전체 | 전체 | 전체 | 축약 |
| 캠페인 | 2열·카드 내 좌우 | 2열·카드 내 세로 | 동일 | 동일 | 1열 | 1열 | 1열·버튼 전체 폭 |
| 진단 | 2열 | 2열 | 2열 | 1열 | 1열 | 1열 | 1열 |
| 라인업 | 4열 | 3열 | 2열 | 2열 | 2열 | 2열 | 1열 가로형 |
| 상세 | 행 아래 | 행 아래 | 행 아래 | 행 아래 | 바텀시트 | 바텀시트 | 바텀시트 |
| 법령 | 표 5열 | 표 5열 | 표 5열 | 표 4열 | 표 4열 | 카드 | 카드 |
| 운영 | n열 | 2열 | 2열 | 2열 | 2열 | 2열 | 1열 |
| 자료 | 좌우 | 좌우 | 좌우 | 세로 | 세로 | 세로 | 세로 |
| 트레이 | 가운데 알약 | 동일 | 동일 | 동일 | 동일 | 동일 | 하단 전체 폭 |
| 문의 | 좌우 | 좌우 | 좌우 | 세로 | 세로 | 세로 | 세로·접기 |

---

## 8. 접근성
- 랜드마크: 허브 section `aria-labelledby`, 트레이 `role=region`
- 담기 버튼 `aria-pressed`, 라벨에 과정명 포함
- 상세 열기 버튼 `aria-expanded`/`aria-controls`
- 바텀시트: 포커스 트랩, ESC, 닫힘 후 트리거로 포커스 복귀, 배경 스크롤 잠금
- 캐러셀: `aria-roledescription="carousel"`, 슬라이드 `role=group` `aria-label="n / N"`, 재생/정지 버튼, 이미지 문구는 alt에 전문
- 색 대비: 배지·칩 텍스트 4.5:1 이상, 비텍스트(아이콘) 3:1 이상
  - **P4 면·P4 틴트 위 글자와 아이콘은 `--ink`** (2026-09-29 빌드 실측으로 보정, 요청자 승인)
  - 흰색 금지: P4 면 위 흰 글자 2.59:1, 흰 체크 아이콘 2.59:1 (비텍스트 기준 3:1 미달)
  - 진한 P4 글자 금지: `color-mix(in srgb,#000 22%,var(--p4))` 는 P4 10% 배경 위 3.75:1 (배지 기준 4.5:1 미달)
  - `--ink` 사용 시: P4 10% 배경 위 16.8:1, P4 면 위 약 7:1
  - P4 는 배경 틴트·점(dot)·테두리 등 비텍스트 강조에만 쓴다
  - 기존 /content 요소(.difftable 마지막 열, .tnode .bn)는 허브 범위(.lg-diff)에서만 `--ink` 로 보정, 다른 영역 불변
- 모든 조작 요소 44×44 이상

---

## 9. 검증 (scripts/verify-legal-b.mjs)

| 항목 | 판정 |
|---|---|
| 가로 스크롤 | 9폭 × 3페이지(/, /content, /kium) `scrollWidth <= innerWidth` (`[data-hscroll]` 제외) |
| 알약 | 6개 슬라이드 각각에서 알약과 `.hs-tag`·h1 박스 교차 0, 세로 간격 16px 이상 |
| 캠페인 | 760/761 열 전환, 카드 텍스트 가시 |
| 진단 | 27조합 결과가 diagnose() 와 일치, 모두 담기 후 picked 일치 |
| 동기화 | 카드 담기 → 트레이 N → 폼 체크 → 폼 해제 → 카드 상태 해제 |
| 상세 | 1040/880/560 기준 열 수에 맞는 행 뒤 삽입, 760 이하 바텀시트, ESC·포커스 복귀 |
| 트레이 | 문의 섹션 진입 시 숨김, 입력 포커스 시 숨김, to-top·teaser 겹침 0 |
| 법령 | 페이지 텍스트에 '과태료' 수치·'만원' 0건 |
| 비표시 | '이수 현황·수료증 관리', '미이수자 학습 독려', FAQ 질문, 외부 작품명 0건 |
| 링크 | 맛보기 7개 target·rel, 소개서 PDF 200 |
| 터치·입력 | 390·360 조작부 44px, 입력 16px |
| 모션 | reduced-motion에서 자동 넘김 없음 |
| 회귀 | 홈 히어로(알약 제외) 동일, 홈·/kium 문의 폼 필드·payload 동일, /content 다른 축 동일 |

- 캡처: `test-results/legal-b/{page}-{폭}.png` + 상세 펼침·트레이·바텀시트 상태 캡처
- 실기기(최종 1회, 수동): iPhone Safari, Android Chrome, iPad Safari 가로·세로

---

## 10. 커밋 계획 (브랜치 feat/legal-b, 빌드 통과 커밋만 main 반영)

| # | 커밋 | 범위 |
|---|---|---|
| 0 | chore: 미커밋 kium 변경 보관·원격 정리 | stash, law-b 원격, 기존 원격 no_push |
| 1 | chore(legal): law-A 법정 모듈 이식 | §1 |
| 2 | chore(seo): 시안 사이트 검색 노출 차단 | layout robots |
| 3 | feat(legal-data): B안 데이터·진단 규칙·선택 상태 | data/legal 확장, legalHub, diagnose, pick |
| 4 | feat(home): 히어로 공지 알약·캠페인 밴드 | LB1, LB2 |
| 5 | feat(content): 6축 배지·법정 허브 골격·헤더·진단 | LB3, LB4, LB5 |
| 6 | feat(content): 과정 라인업·상세·선택 바 | LB6, LB7, LB13 |
| 7 | feat(content): 법령 기준·운영 지원·차별점·자료 | LB8~LB11 |
| 8 | feat(inquiry): 법정 문의 연동 (선택 동기화·추가 정보 접기·자동 채움) | LB14 |
| 9 | test(legal-b): 검증 스크립트·캡처 | LB15, LB16 |

- 환경 정리 (커밋 0 상세)
  - `git stash push -m "kium-wip-before-legal-b"` (**-u 금지**: ref/legal 미추적 문서가 함께 보관됨)
  - `git remote add law-b https://github.com/dilong006-bit/law-b.git`
  - origin, newscope, pedu, b-type: `git remote set-url --push <name> no_push`
  - `git push law-b main` → `git checkout -b feat/legal-b`
- 각 커밋: `npx tsc --noEmit` + `npm run build` 통과 후 `git push law-b feat/legal-b && git push law-b feat/legal-b:main`
- Vercel은 law-b 저장소 main 기준 배포 (사업 담당자 확인 URL 항상 최신 통과본)
- 각 커밋 전 390·1440 캡처 확인 (반응형을 마지막에 몰지 않음)

---

## 11. 완료 정의
- PRD Must 기능 Done 조건 충족
- §9 자동 검사 전 항목 통과
- 회귀 없음 (홈·/kium·/content 다른 축)
- 보고: 변경 파일, 명세와 다르게 구현한 곳과 이유, 미해결 확인 사항
