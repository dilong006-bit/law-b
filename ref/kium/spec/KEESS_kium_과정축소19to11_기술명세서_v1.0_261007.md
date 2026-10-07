# KEESS /kium 인재키움 과정 축소(19 → 11) 기술명세서 v1.0

- 작성: 2026-10-07 · HRD사업지원팀 임지홍
- 요청: HRD솔루션팀 지예정 대리 (2026-10-07 10:08)
- 근거: `별첨1 2026년 중소기업 인재 키움 프리미엄 훈련 과정_최종_261007.xlsx` 시트 「2. 신청 훈련과정 정보」 빨간 행 8건
- 대상: law-B 레포 (`github.com/dilong006-bit/law-b`) → https://law-b.vercel.app/kium
- 기능 ID: **F34**(과정·회차 삭제) · **F35**(분야 7종 → 5종 + 0건 분야 칩 방어)

## 1. 요청 해석

| 구분 | 내용 |
|---|---|
| 요청 | 인재키움 운영 과정 19 → 11, 빨간 표기 8개 과정 KEESS 삭제 |
| 성격 | 데이터 삭제 (카피·디자인 변경 아님) |
| 원천 정합 | 엑셀 빨간 행 8 = 요청 본문 8 (일치) |
| 명칭 차이 | 본문 `Role-Up` ↔ 엑셀 `Role Up` · 본문 `현장 플레잉 코칭 과정` ↔ 엑셀 `현장 플레잉 코치 과정` → 동일 과정(연번 18) |

## 2. 삭제 매핑

| 엑셀 연번 | 과정(공식명) | 코드 ID | 분야 | 공개교육 회차 |
|---|---|---|---|---|
| 3 | 리텐션 On-Powering 과정 | kium-03 | onboarding | onpow-r1 · onpow-r2 |
| 5 | Role Up(승진자): 사원~대리 | kium-05 | roleup | 없음 |
| 6 | Role Up(승진자): 과장~차장 | kium-06 | roleup | 없음 |
| 7 | Role Up(승진자): 부장 | kium-07 | roleup | 없음 |
| 12 | 전략적 비즈니스 협상 스킬 | kium-12 | business | nego-r1 |
| 13 | 스피치&프레젠테이션 클리닉 | kium-13 | business | speech-r1 |
| 14 | 인정받는 직장인의 구두보고 스킬 | kium-14 | business | report-r1 |
| 18 | 현장 플레잉 코치 과정 | kium-18 | leadership | 없음 |

## 3. 변경 전후 수치

| 항목 | 변경 전 | 변경 후 |
|---|---|---|
| 전체 과정 | 19 | **11** |
| 분야 | 7종 | **5종** (승진자·비즈니스 역량 소멸) |
| 분야별 | 온보딩 3 · 승진자 3 · 리더십 3 · AI 3 · 비즈니스 3 · 커뮤니케이션 3 · CS 1 | **온보딩 2 · 리더십 2 · AI 3 · 커뮤니케이션 3 · CS 1** |
| 공개교육 과정 | 9 | **5** (kium-04 · 09 · 10 · 11 · 19) |
| 공개교육 회차 | 20 | **15** |
| 월별 회차 | 10월 6 · 11월 7 · 12월 7 | **10월 5 · 11월 6 · 12월 4** |
| 위탁(비공개) 과정 | 10 | **6** (kium-01 · 02 · 08 · 15 · 16 · 17) |

잔여 11개 과정명은 엑셀 비표기 11행과 1:1 일치.

## 4. 수정 파일·위치

| # | 파일 | 수정 내용 |
|---|---|---|
| 1 | `lib/kium/data.ts` | `KIUM_COURSES`에서 8건 객체 삭제 · `KiumCategory` 유니언에서 `roleup`·`business` 제거 · `KIUM_CATEGORY_META` 2키 삭제 + `order` 1~5 재부여 · 헤더 주석에 [F34·F35 · 261007] 이력 |
| 2 | `lib/kium/sessions.ts` | `KIUM_SESSIONS`에서 5건 삭제(onpow-r1·r2, nego-r1, speech-r1, report-r1) · 주석 내 `9과정` 표기 → 파생값 표현으로 정리 |
| 3 | `lib/kium/pricing.ts` | kium-03·12·13·14 키 삭제 |
| 4 | `lib/kium/openThumbs.ts` | kium-03·12·13·14 매핑 삭제 |
| 5 | `lib/kium/queries.ts` | `getCategoryCounts()`에 `.filter(c => c.count > 0)` 추가 (0건 분야 칩 구조적 차단, `openCategoryCounts()`와 규칙 통일) |
| 6 | `styles/kium.css` | `data-cat="roleup"`·`"business"` 규칙 삭제(사용처 0) |
| 7 | 컴포넌트 주석 | `19과정` · `9과정` · `위탁 10과정` 하드 표기 → `전체 과정` · `공개교육 과정` · `위탁 과정`으로 일반화 (동작 무변경) |
| 8 | `README.md` | 라우트 표 · 데이터 소스(과정 11 · 분야 5종 · 회차 15 · 월별 5/6/4 · 교육비 5건) · Changelog 신규 항목 |
| 9 | `scripts/verify-kium-f34.mjs` | 신규 회귀 단언 스크립트 (§6) |

수정 없음(파생값이라 자동 반영): 세그먼트 카운트 · 분야 칩 · 히어로 `N개 회차`(`KIUM_SESSION_TOTAL`) · 기간 칩 카운트 · 일정표 · 스트립 · 가장 빠른 개강.

## 5. 설계 원칙

- **삭제만, 재작성 없음**: 잔여 11건의 문안·수치·modules·썸네일·회차 일자·status 시드는 바이트 단위 무변경
- **ID 재번호 금지**: kium-01 ~ kium-19 결번 유지. 딥링크·GA·감사 기록의 키 안정성 우선
- **카운트 수기 금지 유지**: 모든 숫자는 `KIUM_COURSES`·`KIUM_SESSIONS` 파생
- **0건 분야 미노출**: 전체 보기·공개교육 보기 동일 규칙
- **죽은 딥링크 안전 처리**: `?course=kium-05` → `getCourseById` undefined → 패널 미오픈 · `?cat=roleup` → 칩 목록에 없음 → `전체` 유지 (기존 가드로 충족, 404·크래시 없음)
- **이미지 파일 보존**: `public/images/kium/open/kium-03·12·13·14.jpg`, `kium-03.sample.jpg`는 참조만 해제(롤백 대비). 정리 시 별도 태스크
- **범위 밖**: `/leadership`(P2)의 On-Powering·Role-Up 소개(기업교육 솔루션, 인재키움 아님) · `public/downloads` 과정리스트 xlsx · 운영 keess.co.kr

## 6. 검증 단언 (verify-kium-f34)

| ID | 단언 |
|---|---|
| A1 | 전체 보기 카드 11장, 삭제 8개 과정명 DOM 0건 |
| A2 | 분야 칩 = 전체 11 · 신입·온보딩 2 · 리더십·관리자 2 · AI활용 3 · 커뮤니케이션·조직활성화 3 · CS·민원응대 1, `승진자`·`비즈니스 역량` 0건 |
| A3 | 세그먼트 `전체과정 11` / `공개교육 5` |
| A4 | 공개교육 히어로 `15개 회차` |
| A5 | 공개교육 보기 기간 칩 10월 5 · 11월 6 · 12월 4 |
| A6 | 공개교육 보기 카드 5장, 분야 칩 0건 분야 없음 |
| A7 | `?course=kium-05` · `?cat=roleup` 접근 시 콘솔 에러 0, 화면 정상 |
| A8 | 잔여 과정 상세 패널 정상 오픈(kium-04 · kium-01) |
| A9 | 타 라우트(/, /content, /hrd, /leadership) 200 |
| 빌드 | `tsc --noEmit` 0 · `next build` 성공 |

기존 `verify-btype.mjs`·`verify-btype2.mjs`는 kium-03·13·14를 표본으로 쓰는 단언이 있어 F34 이후 해당 항목은 **폐기 대상**(표본 과정 소멸). 회귀 기준은 verify-kium-f34로 이관.

## 7. 배포

- 브랜치 `feat/legal-b` 커밋 → `law-b` 원격 `feat/legal-b` + `main` 푸시 → Vercel 자동 배포
- 배포 후 https://law-b.vercel.app/kium 대상 §6 재실행

## 8. 후속 확인 (사업부)

- 운영 keess.co.kr 반영 시점 (개발 신승용 이관)
- 삭제 과정의 기존 문의·신청 건 처리 (사이트 범위 밖)
- 홍보 자료 다운로드(9/21 미팅 3번 항목) 진행 시 11개 기준 적용
