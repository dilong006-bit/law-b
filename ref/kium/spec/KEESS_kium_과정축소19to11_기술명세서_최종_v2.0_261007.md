# KEESS /kium 인재키움 과정 축소(19 → 11) 기술명세서 최종 v2.0

| 항목 | 내용 |
|---|---|
| 문서 | 기술명세서 최종 v2.0 (v1.0 대체, 빌드 단일 기준) |
| 상위 | `KEESS_kium_과정축소19to11_PRD_최종_v2.0_261007.md` |
| 레포 | `C:\오피스키퍼 예외\workspace\KEESS_law-B` · 브랜치 `feat/legal-b` · 원격 `law-b` |
| 배포 | https://law-b.vercel.app/kium (`main` 푸시 → Vercel) |
| 선행 커밋 | `62f3d93 feat(kium): 인재키움 과정 축소 19→11 · 분야 5종 · 공개교육 15회차 (F34·F35)` (로컬, 미푸시) |
| 기능 ID | F34 · F35 (README 기준 최신 F33 다음, 충돌 없음 확인) |

## 1. 삭제 매핑 (엑셀 ↔ 코드)

| 엑셀 연번 | 과정(공식명) | 코드 ID | 분야 | 회차 |
|---|---|---|---|---|
| 3 | 리텐션 On-Powering 과정 | kium-03 | onboarding | onpow-r1 · onpow-r2 |
| 5 | Role Up(승진자): 사원~대리 | kium-05 | roleup | 없음 |
| 6 | Role Up(승진자): 과장~차장 | kium-06 | roleup | 없음 |
| 7 | Role Up(승진자): 부장 | kium-07 | roleup | 없음 |
| 12 | 전략적 비즈니스 협상 스킬 | kium-12 | business | nego-r1 |
| 13 | 스피치&프레젠테이션 클리닉 | kium-13 | business | speech-r1 |
| 14 | 인정받는 직장인의 구두보고 스킬 | kium-14 | business | report-r1 |
| 18 | 현장 플레잉 코치 과정 | kium-18 | leadership | 없음 |

잔여 11: kium-01 · 02 · 04 · 08 · 09 · 10 · 11 · 15 · 16 · 17 · 19 (엑셀 비표기 11행과 1:1)

## 2. 파일별 변경 사양

### 2-1. `lib/kium/data.ts`
- `KIUM_COURSES`에서 §1의 8개 객체 삭제 (최상위 `  {` ~ `  },` 블록 단위). 마지막 객체 뒤 쉼표 정리
- 타입: `export type KiumCategory = 'onboarding'|'leadership'|'ai'|'comm'|'cs'`
- 메타 (색 재배정 없음, 순서만 압축)

```ts
export const KIUM_CATEGORY_META: Record<KiumCategory, { label: string; order: number }> = {
  onboarding: { label: '신입·온보딩', order: 1 },
  leadership: { label: '리더십·관리자', order: 2 },
  ai:         { label: 'AI활용', order: 3 },
  comm:       { label: '커뮤니케이션·조직활성화', order: 4 },
  cs:         { label: 'CS·민원응대', order: 5 },
}
```
- 타입 선언 위 이력 주석: `[과정 축소 · F34·F35 · 261007]` 근거·삭제 ID·재번호 금지·분야 소멸

### 2-2. `lib/kium/sessions.ts`
- `KIUM_SESSIONS`에서 5건 및 해당 그룹 주석 4줄 삭제
- 배열 위 이력 주석: 20 → 15, 월별 5/6/4, 상단 주석의 `20건`·`9과정`은 작성 시점 값임을 명시
- JSDoc `공개교육 9과정` → `공개교육 개설 과정` (2곳)
- `openCategoryCounts()` · `KIUM_SESSION_TOTAL` · `isOpenCourse()` 로직 무변경 (파생)

### 2-3. `lib/kium/pricing.ts` · `lib/kium/openThumbs.ts`
- `kium-03 · 12 · 13 · 14` 키 삭제 → 각 5건
- openThumbs 주석 `과정안내 탭 19장 중 9장이` → `과정안내 탭의 공개교육 과정 카드가`
- `public/images/kium/open/kium-03·12·13·14.jpg`, `public/images/kium/kium-03.sample.jpg` 파일 보존 (참조만 해제)

### 2-4. `lib/kium/queries.ts`
```ts
export function getCategoryCounts() {
  return (Object.keys(KIUM_CATEGORY_META) as KiumCategory[])
    .sort(/* order ASC */)
    .map((key) => ({ key, label: ..., count: KIUM_COURSES.filter((c) => c.category === key).length }))
    // [F35 · 261007] 0건 분야는 칩 자체를 만들지 않는다(openCategoryCounts와 규칙 통일).
    .filter((c) => c.count > 0);
}
```
- 효과: 칩 렌더(`KiumCoursesTab` L402) · `?cat=` 딥링크 검증(L227) · `KiumCourseGrid` L140 가드에 동시 적용

### 2-5. `styles/kium.css`
- 삭제 4줄: `.kium-lab.cat[data-cat="roleup"]` · `[data-cat="business"]` · `.kium-thumb[data-cat="roleup"]` · `[data-cat="business"]`
- 잔여 5종 색 값 무변경 (onboarding #2563EB · leadership #3730A3 · ai #0891B2 · comm #52525B · cs var(--p2))

### 2-6. 컴포넌트 주석 (동작 무변경)
| 파일 | 변경 |
|---|---|
| `KiumCoursePanel.tsx` | `공개교육 9과정` → `공개교육 개설 과정` · `위탁 10과정` → `위탁 과정` |
| `KiumCoursesTab.tsx` | `19과정 전건` → `전체 과정 전건` · `(전체 19 / 공개교육 9)` → `(전체 과정 수 / 공개교육 과정 수)` · `19개 전건에` → `전체 과정에` |
| `SessionListView.tsx` | `공개교육 9과정 전건` → `공개교육 과정 전건` |

### 2-7. `README.md`
- 라우트 표 `/kium`: `11과정 · 공개교육 5과정 15회차 · F34 261007`
- 데이터 소스: 과정 11 · 카테고리 5종(분포) · 회차 15(월별 5/6/4) · 교육비 5 · 공개/위탁 5/6
- Changelog 최상단 `### ★ 인재키움 과정 축소 19 → 11 (F34·F35 · 261007)`

### 2-8. `scripts/verify-kium-f34.mjs` (신규)
- `BASE` 환경변수, 선택 `PW_CHROMIUM`(브라우저 실행 경로)
- 단언 21건: §4

## 3. UI/UX 영향 검토 (변경 없음 확인 항목)

| 영역 | 판단 |
|---|---|
| 카드 그리드 | 기존 반응형 auto 배치. 마지막 행 2장 좌측 정렬은 카탈로그 표준 패턴 → 보정 불필요 |
| 분야 칩 MO | 칩 6개로 가로 스크롤 길이 감소 → 개선 효과 |
| 카테고리 색 | 재배정 없음 → 재방문 학습 유지 |
| 히어로 스택 | kium-01·04·09 → 영향 없음 |
| 스트립 3상태 커버리지 | 10.12 / 10.14 / 10.19 유지 |
| 빈 상태 | 기존 문구·로직 재사용 |
| 접근성 | aria-label 수치(`기간 전체, 15개 회차` 등)·live region 모두 파생 → 자동 정합 |
| 사업소개 탭 카피 | 삭제 과정 언급 0건 확인 |

## 4. 검증 단언 (verify-kium-f34)

| ID | 단언 |
|---|---|
| A1 | 전체 카드 11장(잔여 ID 전건) · 삭제 과정명 DOM 0건 |
| A2 | 분야 칩 전체 11 · 2/2/3/3/1 · 승진자·비즈니스 역량 칩 0 |
| A3 | 세그먼트 11 / 5 |
| A4 | 기간 전체 15개 회차 |
| A5 | 10월 5 · 11월 6 · 12월 4 |
| A6 | 공개교육 카드 5장 · 분야 칩 count 0 없음 · 전체 5 |
| A7 | 죽은 딥링크 4종 200 · 카드 정상 · 콘솔/페이지 에러 0 |
| A8 | kium-04 · kium-01 상세 패널 오픈 |
| A9 | `/` · `/content` · `/hrd` · `/leadership` · `/ax-ai` 200 |

로컬 dev 실측(2026-10-07): **21/21 PASS** · `tsc --noEmit` 0 · PC 1440 / MO 390 스크린샷 이상 없음

### 폐기 대상 기존 단언
`verify-btype.mjs` L296 · `verify-btype2.mjs` L491~589 · L1406~1488 은 kium-03·13·14를 표본으로 사용 → 표본 소멸로 실패가 정상. F34 이후 /kium 회귀 기준은 verify-kium-f34

## 5. 빌드 · 배포 게이트

| 단계 | 기준 |
|---|---|
| G1 | `npx tsc --noEmit` 오류 0 |
| G2 | `npm run build` 성공 (Google Fonts 접근 가능한 로컬 Windows에서) |
| G3 | `npm run dev` → verify-kium-f34 BASE=http://localhost:3001 21/21 |
| G4 | `git push law-b feat/legal-b feat/legal-b:main` |
| G5 | Vercel Ready 후 BASE=https://law-b.vercel.app 21/21 |

## 6. 롤백
- `git revert 62f3d93` → 재푸시 (데이터·이미지 원본 보존 상태라 무손실)
