# 기술명세서 증분 (최종): KEESS 법정필수교육 노출 B안 upgrade-04 (HRD사업팀 검토 반영)

| 항목 | 내용 |
|------|------|
| **Version** | 1.4 (Enhancement #4) |
| **상위 문서** | PRD_KEESS_26827_legal-B_v1.0_upgrade-04.md (LB48~LB57) |
| **기준 명세** | TECHSPEC v1.0, upgrade-01~03 (결정 D1~D26). 이 문서에 없는 내용은 기준 명세 그대로 |
| **전략 근거** | KEESS_26827_사업검토반영_수정전략_v2.0_261006.md |
| **기준 커밋** | feat/legal-b ce05d8b |
| **작성일** | 2026-10-06 |
| **Status** | Approved (최종). 요청자 확정값 Q1~Q7 반영, 미확정은 P1(동의문 정보보호팀 확인) 1건 |

---

## 0. 전제

### 0-1. 유지
- 절대 규칙, 밸런스 B1~B8, 짝 설계 D13, 높이 예산 D16·D17, 대비 D9·D18, Lucide 단일 세트 D10, 아이콘 규칙 D19~D21
- 새 색·토큰·라운드·브레이크포인트 금지 (기존 기준점 1040 / 880 / 760 / 640 / 560 만 사용)
- 공유 폼(HomeInquiry) 변경은 선택 prop 으로만. prop 미지정 페이지(홈·/kium·/leadership·/hrd) 동작·마크업 불변

### 0-2. 추가 결정
| 코드 | 결정 |
|---|---|
| D27 | 삭제 요청 블록은 데이터 플래그 비표시 (`diagnose.show`, `law.show` = false). 컴포넌트·규칙·데이터 파일 삭제 금지. faq.show 와 같은 방식 |
| D28 | 플래그 의존 요소는 `needs?: 'diagnose'` 표식으로 함께 걸러낸다 (바로가기·지표) |
| D29 | 바로가기 그리드는 항목 수를 CSS 변수로 받는다 (`--lg-n`). 지표 스트립은 `head.statsShow=false` 로 전체 비표시, 이때 바로가기는 6열 폭 (`.lg-head-row.no-stats>.lg-quick`) |
| D30 | 다른 점 카드 2장: 641 이상 2열(c6), 640 이하 1열. 880 이하 전폭 규칙의 예외는 `.lg-diffc` 범위로 한정 |
| D31 | 4단계 설명은 확정 원고 우선 (upgrade-03 '20자 이내' 규칙 이 블록 해제). 1041 이상 3줄 이내 확인 |
| D32 | 법정 폼 필수 슬롯: `requiredSlot='trainees'` 일 때 직급/직책 자리에 예상 교육인원(필수)을 렌더, 직급/직책 미렌더. 페이로드 키 불변 |
| D33 | 인원 선택지 '~ 300명'(lte300) 전 폼 공통 추가. 필수 슬롯에서는 'none'(해당없음) 제외 |
| D34 | 동의문 필수·선택 항목 문자열은 폼 설정에서 파생 (하드코딩 1곳 → 함수 1개) |
| D35 | 희망과정 동기화는 '과정에 매핑되는 옵션'만 외부 상태로 덮어쓴다. 매핑 없는 옵션(산업안전보건교육)은 체크 상태 보존 |
| D36 | 희망과정 '기타'는 전폭 1행 (grid-column 1 / -1) |

---

## 1. 파일 맵
| 구분 | 경로 | LB |
|---|---|---|
| 수정 | data/legalHub.ts | LB48~53, 56 |
| 수정 | data/legal.ts (LEGAL_COURSE_OPTIONS) | LB55 |
| 수정 | data/home.ts (INQ.trainees) | LB54 |
| 수정 | data/floatingInquiry.ts (법정 구역 sub) | LB56 |
| 수정 | components/legal-hub/LegalHub.tsx | LB48, LB51 |
| 수정 | components/legal-hub/QuickActions.tsx, HubStats.tsx | LB49 |
| 수정 | components/legal-hub/CourseLineup.tsx | LB50 |
| 수정 | components/legal-hub/StandardAndDiff.tsx | LB51 |
| 수정 | components/legal-hub/Process.tsx | LB52 |
| 수정 | components/legal-hub/BrochureCard.tsx | LB53 |
| 수정 | components/legal-hub/ConsultSummary.tsx | LB56 |
| 수정 | components/legal-hub/HubInquiry.tsx | LB54, LB55 |
| 수정 | components/sections/home/HomeInquiry.tsx | LB54, LB55 |
| 수정 | lib/legal/courseField.ts (syncOptions), lib/legal/pick.tsx (동일값 가드) | LB55 |
| 수정 | scripts/gen-legal-icons.mjs → lib/legal/iconData.ts 재생성 | LB52 |
| 수정 | styles/legal-hub.css | LB49~55 |
| 수정 | tests-fi/uiux-k2.spec.ts | LB57 |
| 신규 | tests-fi/legal-review-261006.spec.ts | LB57 |
| 신규 | lib/legal/__tests__/review261006.test.ts (순수 로직) | LB55 |

---

## 2. LB48 진단 비표시

```ts
// data/legalHub.ts
diagnose: { show: false, /* 기존 키 전부 유지 */ }
```
```tsx
// LegalHub.tsx
{HUB_COPY.diagnose.show && <Diagnose />}
```
- 블록 순서 주석 갱신: 헤더 → 대표 과정 → 차별점 → 도입 절차 → 자료 → 빠른 상담
- lib/legal/diagnose.ts, Diagnose.tsx, DiagSummary.tsx 보존 (import 만 유지되면 트리셰이킹 영향 없음)

## 3. LB49 헤더 바로가기·지표

```ts
head: {
  statsShow: false,                    // 요청자 확정: 지표 전체 비표시 (stats 배열은 보존)
  stats: [ /* 기존 4개 그대로 */ ],
  quick: [
    { label: '필요 과정 찾기', href: '#mandatory-diagnose', gaId: 'legal_quick_find', needs: 'diagnose' },
    { label: '과정 보기', href: '#mandatory-courses', gaId: 'legal_quick_courses' },
    { label: '빠른 상담', href: '#mandatory-inquiry', gaId: 'legal_quick_consult', consult: true },
  ],
}
```
- 공용 헬퍼: `const on = (x: { needs?: 'diagnose' }) => !x.needs || HUB_COPY.diagnose.show`
- QuickActions: `QUICK_ICONS` 를 인덱스 배열에서 항목 키 기반 맵으로 변경 (필터 후 아이콘 어긋남 방지)
  - `{ '#mandatory-diagnose':'search-check', '#mandatory-courses':'layout-grid', '#mandatory-inquiry':'message-circle' }`
- 렌더: `<ul style={{'--lg-n': items.length}}>`, `{H.statsShow && <HubStats />}`, 행에 `no-stats` 클래스 (statsShow=false 일 때)
- 바로가기 nav 클래스: statsShow 면 `lg-c8`, 아니면 `lg-c6`
- CSS
```css
.lg-quick ul{grid-template-columns:repeat(var(--lg-n,3),minmax(0,1fr))}
/* lg-c6 은 880 이하 기존 규칙으로 전폭. 560 이하 바로가기 1열 규칙 유지 */
```
- 결과: 버튼 2 (1041 이상 6열 폭, 버튼당 기존 폭과 비슷) / 지표 DOM 0

## 4. LB50 대표 과정

```ts
lineup: {
  title: '2026 법정필수교육 대표 과정',
  // filters, addMandatory 삭제
}
```
- CourseLineup.tsx
  - `filter` 상태·`changeFilter`·`MANDATORY_IDS`·`.lg-tools` 마크업·`useEdgeFade` 사용 제거
  - `visible = LEGAL_COURSES`
  - 상세 이전·다음, 맞춤 타일 span 계산 로직 불변
- CSS: `.lg-tools`, `.lg-filter-in`, `.lg-addmand` 규칙 삭제 (다른 곳 사용 없음 확인 후)
- KindBadge·kindLabel·kindIcons 유지 (카드 배지 사용)

## 5. LB51 법정 표 비표시 · 차별점 블록

```ts
law: { show: false, /* 기존 키 유지 */ },
diff: {
  kicker: '차별점',
  title: 'KG에듀원 법정교육이 다른 점',
  cards: [
    { key: 'series', ... },
    { key: 'story', ... },
  ],                                   // ops 삭제
}
```
- StandardAndDiff.tsx 반환을 블록 2개로 분리 (Fragment)
```tsx
<>
  {W.show && (
    <div className="lg-block lg-anchor" id="mandatory-law">
      <BlockHead kicker={W.kicker} title={W.title} /><LawTable />
    </div>
  )}
  <div className="lg-block lg-anchor" id="mandatory-diff">
    <BlockHead kicker={F.kicker} title={F.title} />
    <div className="lg-row lg-diffc" data-balance-row data-pair="peer" style={{'--lg-n': F.cards.length}}>
      {F.cards.map(c => <article className="lg-c6 lg-box lg-diffcard" .../>)}
    </div>
    {/* 비교표 패널 그대로 */}
  </div>
</>
```
- `h4.lg-diff-h` 소제목 제거 (BlockHead 가 대체)
- 카드 클래스: 2장일 때 `lg-c6`, 3장일 때 `lg-c4` (`F.cards.length === 2 ? 'lg-c6' : 'lg-c4'`)
- ICON 맵의 ops 키, `'items' in c` 분기는 남겨도 무방 (데이터에 없음)
- CSS (D30)
```css
@media(max-width:880px){.lg-diffc>.lg-c6{grid-column:span 6}}
@media(max-width:640px){.lg-diffc>.lg-c6{grid-column:span 12}}
```
- 641~880 에서 미니 타임라인 3노드 넘침 여부 확인. 넘치면 2열 하한을 760 으로 올리고 보고 (기존 기준점)

## 6. LB52 도입 절차

```ts
process: {
  id: 'mandatory-process',
  kicker: '도입 절차',
  title: '신청부터 수료까지 4단계',
  steps: [
    { key: 'select',   label: '과정 선택 및 신청', desc: '우리 회사에 꼭 필요한 법정교육 과정을 골라 간편하게 신청합니다.' },
    { key: 'confirm',  label: '맞춤 구성 확정',   desc: '우리 회사에 꼭 맞는 필수 과정이 맞는지 꼼꼼히 점검하고 일정·인원을 확정합니다.' },
    { key: 'operate',  label: '교육 운영 및 독려', desc: '전담 운영자가 학습 독려부터 진행 상황까지 밀착 관리합니다.' },
    { key: 'complete', label: '손쉬운 수료 완료', desc: '번거로운 후속 절차 없이 간편하게 수료증까지 발급받습니다.' },
  ],
  cta: { label: '빠른 상담 신청', gaId: 'legal_process_consult' },
}
```
- 문구는 요청 원고 그대로 (마침표 포함). 수정 금지
- Process.tsx ICON: `{ select:'list-checks', confirm:'calendar-check', operate:'monitor-play', complete:<신규> }`
- 신규 아이콘: gen-legal-icons.mjs NAMES 후보 순서 `award` → `badge-check` → `graduation-cap`, 첫 존재 이름 채택 → `npm run icons:legal` 로 iconData.ts 재생성, 채택 이름 보고
- 높이: peer 유지. 1041 이상 설명 줄 수 측정 (목표 ≤ 3), 초과 시 `.lg-step-desc` 크기 변경 금지, 보고만

## 7. LB53 소개서 카드

- `resources.brochure.meta` 삭제, BrochureCard `.lg-brochure-meta` 줄 삭제
- `.lg-brochure-meta` CSS 삭제
- 자료 블록 짝 높이 비 재측정

## 8. LB54 법정 폼 인원 필드 (D32~D34)

### 8-1. 데이터
```ts
// data/home.ts INQ.trainees
{ value: 'none', label: '해당없음' },
{ value: 'lte9', label: '1~9명' },
{ value: 'lte50', label: '~ 50명' },
{ value: 'lte100', label: '~ 100명' },
{ value: 'lte300', label: '~ 300명' },   // 추가 (26827 법정 검토 #69)
{ value: 'lte500', label: '~ 500명' },
{ value: 'lte1000', label: '~ 1000명' },
{ value: 'gt1000', label: '~ 1000명 이상' },
```

### 8-2. HomeInquiry prop
```ts
/** 필수 4번째 슬롯 (연락처 옆). 'trainees' 면 직급/직책 대신 예상 교육인원(필수). 기본 'position' */
requiredSlot?: 'position' | 'trainees';
```
- `const slot = requiredSlot ?? 'position'`
- 필수 키 배열: `const REQ = ['company','name','phone', slot] as const` → submit 검증·첫 오류 포커스 2곳 모두 교체
- 렌더 (3·4 행)
  - slot='position': 기존 마크업 그대로
  - slot='trainees':
```tsx
<div className={fld('trainees')}>
  <label htmlFor="f-trainees">예상 교육인원 <span className="req">*</span></label>
  <select id="f-trainees" name="expectedTrainees" value={v.trainees} onChange={upd('trainees')}
    aria-required="true" aria-invalid={!!errs.trainees}>
    <option value="">선택</option>
    {INQ.trainees.filter(o => o.value !== 'none').map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
  <span className="err" aria-live="polite">예상 교육인원을 선택해 주세요.</span>
</div>
```
- sizeRow: slot='trainees' 이면 trainees 를 sizeRow 에서 렌더하지 않음 (중복 id 금지)
- 페이로드: `position: slot === 'position' ? v.position.trim() : ''` (키 유지)
- 오류 지우기: 기존 upd 로직이 errs[k] 를 푸는지 확인, trainees 도 동일 동작
- 플로팅 바 프리필 trainees: 'none' 이 들어오면 slot='trainees' 에서는 빈 값 처리

### 8-3. 동의문 (D34)
```ts
function consentItems(slot: 'position' | 'trainees') {
  return slot === 'trainees'
    ? { req: '담당자명, 회사·기관명, 연락처, 이메일, 예상 교육인원',
        opt: '회사 규모(임직원 수), 관심 영역, 문의 내용, 첨부파일' }
    : { req: '담당자명, 회사·기관명, 직급/직책, 연락처, 이메일',
        opt: '회사 규모(임직원 수), 예상 교육인원, 관심 영역, 문의 내용, 첨부파일' };
}
```
- 기존 동의문 JSX 의 '2. 수집 항목' 두 줄만 함수 값으로 교체. 나머지 문장 수정 금지
- 기본(slot='position') 출력 문자열이 현재 문구와 완전 일치해야 함 (회귀 0)
- 운영 이관 전 정보보호팀 확인 대상 (PRD P1). 코드 주석에 표기

### 8-4. HubInquiry
```tsx
const HIDDEN = ['companySize', 'attachment'] as const;   // trainees 는 필수 슬롯으로 이동
<HomeInquiry requiredSlot="trainees" hiddenFields={HIDDEN} ... />
```
- `hidden('trainees')` false 이지만 slot 처리로 sizeRow 중복 없음 확인 (companySize 만 숨김이면 sizeRow 가 회사 규모 1칸으로 남지 않게: slot='trainees' 이고 companySize 숨김이면 sizeRow null)

## 9. LB55 희망과정 산업안전보건교육 (D35, D36)

### 9-1. 데이터
```ts
export const LEGAL_COURSE_OPTIONS = [
  '직장 내 괴롭힘 예방 교육', '장애인 인식개선 교육', '성희롱 예방 교육', '윤리경영 교육',
  '퇴직연금 가입자 교육', '개인정보보호 및 정보보안 교육', '자금세탁방지 교육', '산업안전보건교육',
] as const;
/** 과정 카드와 연결되는 옵션 (담은 과정 동기화 대상). 산업안전보건교육은 콘텐츠 없음 → 제외 */
export const LEGAL_SYNC_OPTIONS = LEGAL_COURSES.map((c) => c.option);
```

### 9-2. 결함 위험 (기준 커밋 실측)
- 경로: 체크 → `onCourseChange(전체 체크 목록)` → `pick.setFromOptions` → `idsFromOptions` 가 매핑 없는 옵션 무시 → `setPicked(새 배열)` → `courseValue` 재계산 → HomeInquiry 이펙트가 `courseField.options` 전체를 `courseValue` 기준으로 덮어씀 → 산업안전보건교육 해제
- 조치 1 (courseField 계약)
```ts
export interface CourseFieldConfig { ...; /** 외부 선택 상태가 덮어쓰는 옵션. 미지정이면 options 전체(기존 동작) */ syncOptions?: readonly string[]; }
```
- 조치 2 (HomeInquiry 이펙트)
```ts
const sync = courseField.syncOptions ?? courseField.options;
setCourseSel((cur) => {
  const same = sync.every((o) => !!cur[o] === courseValue.includes(o));
  if (same) return cur;
  const next = { ...cur };
  sync.forEach((o) => { next[o] = courseValue.includes(o); });
  return next;                         // sync 밖 옵션은 cur 값 보존
});
```
- 조치 3 (pick.tsx 동일값 가드): `setFromOptions` 결과가 기존 picked 와 같으면 이전 배열 반환 (불필요한 재렌더·이펙트 차단)
- HubInquiry COURSE_FIELD 에 `syncOptions: LEGAL_SYNC_OPTIONS` 지정
- 순서: 결함을 재현하는 테스트를 먼저 작성해 실패 확인 → 조치 → 통과 (§11)

### 9-3. 배치 (D36)
```css
.lg-course-field .lg-course-etc{grid-column:1 / -1}
```
- 560 이하 1열 규칙 그대로
- 제출 토큰 예: `[희망과정: 성희롱 예방 교육·산업안전보건교육]`
- ConsultSummary·PickTray·카드 수: 산업안전보건교육 미포함 (정상)

## 10. LB56 연동 정리

```ts
heroSlide: {
  desc: '성희롱 예방부터 자금세탁방지까지 2026년 최신 대표 과정. 필요한 과정 확인부터 도입 상담까지 함께합니다.',
  trust: '대표 과정 · 매년 자체 제작 · 전담 운영자 배정',
}
inquiry: {
  // addCommon 삭제
  browse: { label: '과정 둘러보기', href: '#mandatory-courses', gaId: 'legal_consult_browse' },
}
```
- floatingInquiry.ts /content #mandatory 구역 sub: '담은 과정으로 바로 문의할 수 있습니다'
- ConsultSummary 빈 상태: 버튼 → 링크 버튼 (`btn btn-glass`, plus 아이콘 → arrow-down 또는 layout-grid 중 아이콘 세트에 있는 것), 클릭 시 #mandatory-courses 로 이동 (reduced-motion 이면 즉시). `COMMON_PICK` import 제거
- 검색 대상 문자열 (홈·/content 보이는 글자): '7개', '7 과정', '진단 결과', '공통 추천', '정·부', '월 1회' → 0

## 11. LB57 검수

### 11-1. 단위 (vitest, lib/legal/__tests__/review261006.test.ts)
- idsFromOptions(['산업안전보건교육']) → []
- LEGAL_SYNC_OPTIONS 에 산업안전보건교육 없음, LEGAL_COURSE_OPTIONS 길이 8
- courseToken(['성희롱 예방 교육','산업안전보건교육'], '') 결과 일치
- consentItems('position') 문자열 = 기준 커밋 동의문 문자열

### 11-2. E2E (tests-fi/legal-review-261006.spec.ts, /content)
1. #mandatory-diagnose, #mandatory-law 없음 / #mandatory-diff 있음
2. 바로가기 2, `.lg-stats` 0
3. 대표 과정 제목 텍스트, 필터·한 번에 담기 없음, 카드 7
4. 차별점 카드 2, '월 1회' 없음
5. 4단계 라벨·설명 원고 일치
6. 소개서 카드 'PDF ·' 없음
7. 폼: 직급/직책 없음, '~ 300명' 선택지, '해당없음' 없음. 회사·담당자·연락처·이메일·희망과정·동의를 채우고 인원만 비운 채 제출 → 검증 차단, 오류 노출, 포커스 f-trainees (검증 차단이라 전송 없음)
8. 동의문 펼침 → '예상 교육인원' 필수 줄 포함, '직급/직책' 없음
9. 산업안전보건교육 체크 → 과정 카드 담기 → 빼기 → 여전히 체크. 실제 전송 금지 (E2E 는 프로덕션 빌드라 실 엔드포인트 가능성). 토큰 직렬화는 단위 테스트로 확인, E2E 에서 전송 경로를 확인하려면 page.route 로 요청을 가로채 본문만 검사하고 abort
10. 홈(/) 폼: 직급/직책 필수 유지, 예상 교육인원 선택지에 '~ 300명' 존재 (회귀)
11. 홈 히어로 법정 슬라이드 설명·신뢰 문구에 '7개' 없음

### 11-3. 기존 테스트 갱신
- tests-fi/uiux-k2.spec.ts: `.lg-filter-in` 320 넘침 테스트 → 필터 삭제로 대상 소멸. '대표 과정 블록 320 가로 넘침 0' 검사로 교체
- tests-fi/cardnews.spec.ts:125 (`mandatory-diagnose` 링크 0) 유지 (그대로 통과)

### 11-4. 반응형 실측 (Playwright 스크립트, test-results/legal-b/up04/)
- 폭: 1440 / 1280 / 1041 / 1040 / 880 / 760 / 641 / 640 / 560 / 390 / 320
- 측정: 문서 가로 스크롤 0, 헤더 버튼 2 균등 폭(차 ≤ 1px), 지표 DOM 0, 차별점 2열/1열 전환점, 4단계 카드 높이 비·설명 줄 수, 희망과정 2×4 + 기타 전폭, 폼 3·4 행 높이 정렬, 터치 대상 44px
- 캡처: 헤더·대표 과정·차별점·4단계·소개서·폼 (1440, 880, 390) 전후 비교

### 11-5. 공통
- `npx tsc --noEmit`, `npm run build`, `npm run test:unit`, `npm run test:e2e:fi` 통과
- 콘솔 오류 0, CLS < 0.05, 외부 요청 images.unsplash.com 만
- 배포 후 `npx playwright test -c playwright.prod.config.ts` 스모크
