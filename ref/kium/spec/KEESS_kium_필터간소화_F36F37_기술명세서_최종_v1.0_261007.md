# KEESS /kium 공개교육 보기 필터 간소화 기술명세서 최종 v1.0 (F36·F37)

| 항목 | 내용 |
|---|---|
| 작성 | 2026-10-07 · HRD사업지원팀 임지홍 |
| 선행 | F34·F35 과정 축소 19 → 11 (커밋 62f3d93 · a821341, 로컬 커밋 완료 · 미푸시) |
| 대상 | law-B 레포 `feat/legal-b` → https://law-b.vercel.app/kium |
| 기능 ID | **F36** 공개교육 보기 분야·기간 필터 제거 / **F37** 모집 상태 행 노출 조건 |
| 수정 파일 | `components/kium/KiumCoursesTab.tsx` 1개 · `scripts/verify-kium-f36.mjs` 신규 · `README.md` |
| 참조 패치 | `KEESS_kium_F36F37_필터간소화.patch` (HEAD a821341 기준 · `git apply` 결과가 검증본과 바이트 일치 · Cowork 실측 28/28) |

## 1. 요청 · 판단

| 구분 | 내용 |
|---|---|
| 요청 | 공개교육 보기에서 **분야 · 기간** 필터 삭제. 남는 필터: 보기 전환(전체과정/공개교육) + 모집 상태 |
| 범위 | **전체과정 보기의 분야 필터는 유지** (11과정 · 5분야 탐색 수단) |
| 근거 | 공개교육 5과정 15회차: 분야 칩 1~3건 · 기간 칩 4~6회차 → 고르는 비용만 증가 |
| 대체 정보 | 분야: 카드·상세의 분야 라벨 / 기간: 일정 스트립(날짜순) · 전체 일정 목록(월 그룹) |

## 2. 변경 전후

| 영역 | 현행 (F34 후) | 변경 후 |
|---|---|---|
| 전체과정 보기 | 세그먼트 + 분야 | **무변경** (세그먼트 + 분야) |
| 공개교육 보기 | 세그먼트 + 분야 + 기간 + 모집 상태 | **세그먼트 + 모집 상태** |
| 모집 상태 행 | 공개교육 보기에서 항상 | **F37**: 0건 아닌 상태 2종 이상일 때 (검토용 칩 ON이면 항상) |
| 일정 헤더 범위 | `10~12월` 하드코딩 + 월·분야 반영 | 남은 회차 월에서 파생 + 상태명 |
| 분야 선택 후 보기 전환 | 공개교육 보기에도 분야 적용 | 공개교육 보기는 분야 미적용 · URL에서 `cat` 내림 → 전체과정 복귀 시 선택 복원 |
| `?cat=` 딥링크 | 두 보기 모두 적용 | 전체과정만 적용 · `mode=open`이면 무시하고 제거 |
| `?month=` 딥링크 | 적용 | 무시하고 제거 |
| 카드 · 상세 · 스트립 · 일정 목록 · CTA · 카피 | | **무변경** |

## 3. F37 설계 근거 (권장 · 채택 기본)

- 운영 keess.co.kr처럼 전 회차 `모집중`이면 `[전체 20] [모집중 20]` → 같은 집합 이중 표시
- F22(0건 상태 칩 미노출, 9/7 회의 결정)를 행 단위로 확장한 동일 원칙
- 마감임박·개강확정이 생기면 행이 스스로 등장 → 운영 수동 조작 불필요
- law-b는 검토용 시드 4상태 + `SHOW_REVIEW_CHIP = true` → 행 노출이 정상 (화면 변화 없음)
- 행이 숨을 때 선택 상태 잔존 방지: `status → 'all'` 자동 복귀
- **미채택 시**: `showStatusRow`를 `true` 고정 + 복귀 effect 삭제 (그 외 F36 동일)

## 4. 구현 사양 (`KiumCoursesTab.tsx`)

| # | 위치 | 변경 |
|---|---|---|
| 1 | import | `openCategoryCounts` 제거 (`getCategoryCounts` · `KiumCategory` 유지) |
| 2 | 타입·상수 | `type Month` · `MONTHS` 제거 (`type Cat` 유지) |
| 3 | state | `month` 제거 · `catRef`(보기 전환 시 URL 복원용) 추가 |
| 4 | `scoped` | `useMemo` 월·분야 필터 → `const scoped = future;` (이름 유지: 상태 칩 카운트 모수) |
| 5 | 카탈로그 | `openCats` 제거 · `categories = allCats` · `catTotal = allCourses.length` |
| 6 | `syncQuery` | 인자 `{ mode?, cat? }`. `mode=open` → `cat` 삭제 / `mode=all` → `catRef`가 `all`이 아니면 `cat` 복원 / `month`는 항상 삭제 |
| 7 | 마운트 딥링크 | `openEntry`(mode=open 또는 구 #open)면 `?cat=` 무시. `month` 또는 (openEntry && cat) 존재 시 `replaceState`로 제거. `qMonth` 파싱 삭제 |
| 8 | 핸들러 | `changeMonth` 삭제 · `changeCat` 유지 · `resetFilters` = `setStatus('all')` |
| 9 | 파생값 | `monthRange`: future의 displayMonth min~max (같으면 `N월`, 0건 `''`) |
| 10 | F37 | `activeStatusKinds` · `showStatusRow = activeStatusKinds >= 2 \|\| SHOW_REVIEW_CHIP \|\| reviewMode` · 숨김 시 status 복귀 effect |
| 11 | `scopeLabel` | `[monthRange, 상태 라벨]` (분야 항목 삭제) |
| 12 | JSX 컨테이너 | `.kium-vfilters` = `!isOpenMode \|\| (!seasonOff && showStatusRow)`일 때만 렌더 |
| 13 | JSX 행 | 분야 행 `!isOpenMode` 전용 · 기간 행 삭제 · 상태 행 `isOpenMode && !seasonOff && showStatusRow` |
| 14 | `<KiumCourseGrid>` | `cat={isOpenMode ? 'all' : cat}` (그 외 prop 무변경) |
| 15 | 주석 | 필터 블록 · scoped · 카운트 주석을 F36·F37 기준으로 갱신 |

**무수정**: `lib/kium/*` · CSS · `KiumCourseGrid` · `KiumOpenTab`(SHOW_OPEN_TAB=false) · 데이터 · 카피

## 5. UI/UX 기준

| 항목 | 기준 |
|---|---|
| 간격 | 신규 CSS 0. 공개교육 보기는 상태 행이 `.kium-vfilters .kium-frow:first-of-type{margin-top:18px}`를 그대로 받음 (Cowork PC 1440 · MO 390 실측 이상 없음) |
| 레이블 | 상태 행 라벨 `모집 상태` 유지 |
| 상태 보존 | 전체과정 분야 선택은 보기 전환 왕복 후 복원 (사용자 맥락 유지) |
| 접근성 | aria-live = `{범위} · {상태} N개 회차` 파생 · 행 라벨 id `kium-cf-cat`(전체) · `kium-cf-st`(공개) |
| 빈 상태 | `해당 조건의 회차가 없습니다` + [필터 초기화] = 상태만 초기화 |
| 반응형 | MO 390 가로 넘침 0 |

## 6. 검증 (`scripts/verify-kium-f36.mjs`, 28단언 · 이동 타임아웃 90초 · 예외 시에도 요약 출력)

| ID | 단언 |
|---|---|
| B1 | 전체과정: 분야 행만 · 분야 칩 전체 11 + 5종(2/2/3/3/1) · 카드 11 · 삭제 과정명 0 · 세그먼트 11/5 · AI활용 클릭 → 3장 + `?cat=ai` |
| B2 | 공개교육: 분야·기간 행 0 · 상태 행 노출 · 헤더 `10~12월 15개` · 카드 5 |
| B3 | 상태 칩 선택 → 헤더 반영 · [전체] 복귀 15 |
| B4 | Empty Case → 빈 상태 → [필터 초기화] → 15 |
| B5 | `cat=ai` 3장 · `cat=roleup` 11장 · `cat=ai&month=11` 3장(month 제거) · `mode=open&cat=ai` / `&month=12` / 복합 → 5장, cat·month 제거 |
| B6 | `?cat=ai` → 공개교육(5장, cat 없음) → 전체과정(3장, cat=ai 복원) · 콘솔 에러 0 |
| B7 | kium-04 상세 오픈 · MO 390 가로 넘침 0 |
| B8 | `/` `/content` `/hrd` `/leadership` `/ax-ai` 200 |

- verify-kium-f34의 **A5(기간 칩) · A6 두 번째 단언(공개교육 분야 칩)**은 F36으로 폐기 → /kium 회귀 기준은 verify-kium-f36
- Cowork 실측(dev): **28/28 PASS**

## 7. 게이트

| 단계 | 기준 |
|---|---|
| G1 | `npx tsc --noEmit` 0 |
| G2 | `npm run build` 성공 · 경고 0 |
| G3 | `npm run start`(프로덕션 서버) + verify-kium-f36 28/28 (사용자 터미널) |
| G4 | `law-b/main..HEAD` = 3건(62f3d93 · a821341 · F36) 한 번에 푸시 |
| G5 | https://law-b.vercel.app 대상 verify-kium-f36 28/28 |

## 8. README
- 라우트 표 `/kium`에 `필터: 전체과정=분야 · 공개교육=모집 상태(F36·F37)` 추가
- Changelog 최상단 `### ★ /kium 공개교육 보기 필터 간소화 (F36·F37 · 261007)` 3줄: 제거 범위 · F37 조건 · 회귀 스크립트

## 9. 롤백
- F36 커밋 단독 `git revert` → F34 상태(공개교육 분야·기간 칩 복귀)
