# KEESS /kium 과정안내 필터 전면 제거 기술명세서 최종 v1.0 (F38)

| 항목 | 내용 |
|---|---|
| 작성 | 2026-10-07 · HRD사업지원팀 임지홍 |
| 선행 | F34·F35(과정 19 → 11) · F36·F37(공개교육 보기 분야·기간 제거) · law-b `7984057` 배포 완료 |
| 결정 | 신승용 과장 요청(10/7 11:22) "과정 수 변경에 따라 상세 필터 모두 제거" → 전체과정 보기 분야 필터도 제거 |
| 대상 | law-B `feat/legal-b` → https://law-b.vercel.app/kium · 운영 이관 기준 산출물 |
| 수정 | `components/kium/KiumCoursesTab.tsx` 1개 (19+ / 73-) · `scripts/verify-kium-f38.mjs` 신규 · `README.md` |
| 참조 패치 | `KEESS_kium_F38_필터전면제거.patch` (HEAD 7984057 기준, 적용 결과 검증본과 바이트 일치, Cowork 실측 27/27) |

## 1. 최종 필터 구성

| 보기 | F36 이후 (현 배포) | F38 이후 |
|---|---|---|
| 전체과정 | 세그먼트 + 분야 | **세그먼트만** (필터 영역 DOM 미생성) |
| 공개교육 | 세그먼트 + 모집 상태(F37 조건) | 무변경 |
| 카드 분야 라벨(dot) | 표시 | 무변경 (분야 정보는 카드가 전달) |

## 2. 구현 사양

| # | 위치 | 변경 |
|---|---|---|
| 1 | import | `getCategoryCounts` · `KiumCategory` 제거 |
| 2 | 타입·state | `type Cat` · `cat` state · `catRef` 제거 |
| 3 | 카탈로그 | `allCats` · `categories` · `catTotal` 제거 |
| 4 | `syncQuery` | 인자 `{ mode? }`. `cat` · `month` 쿼리 항상 삭제 |
| 5 | 마운트 딥링크 | `?cat=` 또는 `?month=` 존재 시 두 보기 모두 무시 + `replaceState`로 제거 |
| 6 | 핸들러 | `changeCat` 삭제 |
| 7 | JSX | 분야 행 삭제. `.kium-vfilters`는 `isOpenMode && !seasonOff && showStatusRow`일 때만 |
| 8 | `<KiumCourseGrid>` | `categories={[]}` `cat="all"` `onCat={() => {}}` (그리드 무수정) |
| 9 | 주석 | F38 근거로 갱신 |

**무수정**: `lib/kium/*`(getCategoryCounts 보존) · CSS · KiumCourseGrid · 데이터 · 카피 · F37 로직

## 3. UI/UX
- 전체과정 보기: 세그먼트 → 인트로 문장 → `11개 과정` → 그리드. 신규 CSS 0, 간격은 기존 규칙 (PC 1440 · MO 390 실측 이상 없음)
- 분야 탐색은 카드 상단 분야 라벨이 대체 (11장 1스크롤 스캔 규모)

## 4. 운영(keess.co.kr) 이관 시 체크
- `SHOW_REVIEW_CHIP = false` (검토용 Empty Case 칩 제거)
- 운영 회차 상태가 전건 `모집중`이면 F37에 따라 공개교육 보기 모집 상태 행도 미노출 → 공개교육 보기는 세그먼트만 남음 (의도된 결과)
- 회차 status 검토용 시드 → 실제 회신값 교체

## 5. 검증 (`scripts/verify-kium-f38.mjs`, 27단언)

| ID | 단언 |
|---|---|
| B1 | 전체과정: 필터 영역 0 · 카드 11 · 삭제 과정명 0 · 세그먼트 11/5 · 카드 분야 라벨 11 |
| B2 | 공개교육: 분야·기간 행 0 · 상태 행 노출 · 헤더 `10~12월 15개` · 카드 5 |
| B3 | 상태 칩 → 헤더 반영 · [전체] 복귀 15 |
| B4 | Empty Case → [필터 초기화] → 15 |
| B5 | `?cat=` · `?month=` 6종 → 두 보기 모두 무시 + 쿼리 제거 |
| B6 | 보기 왕복 5 ↔ 11 · URL 정상 · 콘솔 에러 0 |
| B7 | 상세 오픈 · MO 가로 넘침 0 |
| B8 | 타 라우트 5종 200 |

- verify-kium-f36의 B1(분야 칩) · B5(?cat= 유지) · B6(분야 복원)은 F38로 폐기 → 회귀 기준은 verify-kium-f38

## 6. README
- 라우트 표 `/kium` 필터 문구: `필터: 전체과정=없음 · 공개교육=모집 상태(F36·F37·F38)`
- Changelog 최상단 `### ★ /kium 과정안내 필터 전면 제거 (F38 · 261007)` 2줄: 범위 · 회귀 스크립트 교체

## 7. 게이트
G1 tsc 0 → G2 build 경고 0 → G3 `npm.cmd run start` + verify-kium-f38 27/27 → G4 푸시(law-b/main..HEAD 1건) → G5 배포본 27/27
