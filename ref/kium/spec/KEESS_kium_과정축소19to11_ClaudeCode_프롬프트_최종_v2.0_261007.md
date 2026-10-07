# Claude Code 프롬프트 최종 v2.0: /kium 인재키움 과정 축소 19 → 11 (F34·F35)

> VS Code의 Claude Code에 아래 「프롬프트 본문」을 그대로 붙여넣습니다.

---

## 프롬프트 본문

너는 KEESS 사이트를 맡은 시니어 프론트엔드 엔지니어 겸 UI/UX 디자이너다. 아래 기준 문서 2종을 먼저 끝까지 읽고 시작하라.

- 기준(단일): `ref/kium/spec/KEESS_kium_과정축소19to11_기술명세서_최종_v2.0_261007.md`
- 상위: `ref/kium/spec/KEESS_kium_과정축소19to11_PRD_최종_v2.0_261007.md`

### 절대 규칙
1. 잔여 11과정(kium-01·02·04·08·09·10·11·15·16·17·19)의 문안·수치·modules·회차 일자·status는 수정 금지
2. 과정 ID 재번호 금지, 카테고리 색 재배정 금지, 레이아웃·카피 변경 금지
3. 화면 숫자 하드코딩 금지 (전부 데이터 파생)
4. 이미지 파일 삭제 금지 (참조만 해제)
5. 각 단계 결과를 표로 보고하고, 게이트 실패 시 다음 단계로 넘어가지 말 것

### 0단계 · 상태 확인
- `git status` · `git log --oneline -3` 확인
- HEAD에 `62f3d93 feat(kium): 인재키움 과정 축소 19→11` 이 있으면 **1단계는 검수만** 하고(명세 §2 항목별 diff 대조) 2단계로 진행
- 없으면 1단계를 명세대로 구현

### 1단계 · 구현 (명세 §2)
1. `lib/kium/data.ts`: 8개 과정 삭제 · `KiumCategory` 5종 · `KIUM_CATEGORY_META` order 1~5 · 이력 주석
2. `lib/kium/sessions.ts`: onpow-r1·r2 · nego-r1 · speech-r1 · report-r1 삭제 · 이력 주석 · JSDoc 정리
3. `lib/kium/pricing.ts` · `lib/kium/openThumbs.ts`: kium-03·12·13·14 키 삭제
4. `lib/kium/queries.ts` `getCategoryCounts()`: `.filter((c) => c.count > 0)`
5. `styles/kium.css`: roleup·business 규칙 4줄 삭제
6. 컴포넌트 주석 하드 수치 정리 (명세 §2-6 표)
7. `README.md` 수치·Changelog (명세 §2-7)
8. `scripts/verify-kium-f34.mjs` 확인 (명세 §4, 21단언)

### 2단계 · 정적 검증
- `grep -rnE "kium-(03|05|06|07|12|13|14|18)\b" lib components app styles` → 0건
- `grep -rn "roleup\|business" lib components app styles` → 이력 주석 외 0건
- `npx tsc --noEmit` → 0 (G1)
- `npm run build` → 성공 (G2)

### 3단계 · 로컬 검수
- `npm run dev` (3001) 후 `BASE=http://localhost:3001 node scripts/verify-kium-f34.mjs` → 21/21 (G3)
- 시니어 UI/UX 눈검수 (PC 1440 · MO 390 스크린샷)
  - `/kium?tab=courses#courses`: 카드 11장, 마지막 행 좌측 정렬, 분야 칩 6개 1행(PC)·가로 스크롤(MO)
  - `/kium?tab=courses&mode=open#courses`: 카드 5장, 기간 칩 15 / 5 / 6 / 4, 스트립 첫 화면 3상태
  - 상세 패널(kium-04): 공개교육 일정 블록·교육비 정상
  - 사업소개 탭: 삭제 과정 언급 0
- `verify-btype*.mjs`는 실행하지 않는다 (kium-03·13·14 표본 소멸, 명세 §4 폐기 대상)

### 4단계 · 커밋
- 0단계에서 62f3d93이 있었으면 문서만 커밋:
  `docs(kium): 과정 축소 F34·F35 PRD·기술명세서·프롬프트 최종 v2.0`
  (대상: `ref/kium/spec/KEESS_kium_과정축소19to11_*최종_v2.0_261007.md`)
- 없었으면 구현+문서 커밋:
  `feat(kium): 인재키움 과정 축소 19→11 · 분야 5종 · 공개교육 15회차 (F34·F35)`

### 5단계 · 푸시 (G4)
```
git push law-b feat/legal-b
git push law-b feat/legal-b:main
```

### 6단계 · 배포 검수 (G5)
- Vercel Ready 확인 후 `BASE=https://law-b.vercel.app node scripts/verify-kium-f34.mjs` → 21/21
- 실패 항목은 원인 분석 → 수정 → 3~6단계 반복

### 완료 보고 형식
| 항목 | 결과 |
|---|---|
| 변경 파일 | 목록 |
| G1~G5 | PASS/FAIL |
| verify-kium-f34 | 로컬 n/21 · 배포 n/21 |
| 커밋 | 해시 · 메시지 |
| 배포 URL | https://law-b.vercel.app/kium |
| 눈검수 메모 | 이상 유무 |

---

## 사업부 회신 초안 (배포 확인 후)

> 지예정 대리님, 요청하신 인재키움 과정 축소(19 → 11) 반영 완료했습니다.
> - 확인 링크: https://law-b.vercel.app/kium?tab=courses#courses
> - 삭제 8개 과정과 해당 공개교육 회차 5건 함께 정리 (공개교육 15회차)
> - 과정이 모두 빠진 분야 '승진자', '비즈니스 역량'은 필터에서 제외
> - 명칭 확인 부탁드립니다: 요청 본문 'Role-Up', '현장 플레잉 코칭 과정'은 엑셀 기준 'Role Up', '현장 플레잉 코치 과정'과 동일 과정으로 보고 반영했습니다.
