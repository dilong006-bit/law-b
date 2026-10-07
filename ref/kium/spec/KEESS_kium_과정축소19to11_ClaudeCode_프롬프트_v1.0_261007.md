# Claude Code 프롬프트: /kium 인재키움 과정 축소 19 → 11 (F34·F35)

기준 문서: `ref/kium/spec/KEESS_kium_과정축소19to11_기술명세서_v1.0_261007.md` (단일 기준)

## 지시
레포 `KEESS_law-B` 브랜치 `feat/legal-b`에서 아래를 수행하라. 잔여 11과정의 문안·수치·회차 일자·status는 절대 수정하지 않는다. ID 재번호 금지.

1. `lib/kium/data.ts`
   - `KIUM_COURSES`에서 id `kium-03, kium-05, kium-06, kium-07, kium-12, kium-13, kium-14, kium-18` 객체 삭제
   - `KiumCategory`에서 `roleup`, `business` 제거
   - `KIUM_CATEGORY_META`: onboarding 1 · leadership 2 · ai 3 · comm 4 · cs 5
   - 헤더에 `[과정 축소 · F34·F35 · 261007]` 이력 주석 추가 (19 → 11, 근거 엑셀 파일명)
2. `lib/kium/sessions.ts`: `onpow-r1, onpow-r2, nego-r1, speech-r1, report-r1` 삭제
3. `lib/kium/pricing.ts`, `lib/kium/openThumbs.ts`: kium-03·12·13·14 키 삭제
4. `lib/kium/queries.ts` `getCategoryCounts()`: `.filter((c) => c.count > 0)` 추가
5. `styles/kium.css`: `data-cat="roleup"`, `data-cat="business"` 규칙 삭제
6. 컴포넌트·lib 주석의 `19과정`·`9과정`·`위탁 10과정` 표기를 수치 없는 표현으로 정리
7. `README.md`: 라우트 표 · 데이터 소스 섹션 수치 갱신, Changelog 최상단에 F34·F35 항목
8. `scripts/verify-kium-f34.mjs` 작성: 명세 §6 A1~A9 단언, `BASE` 환경변수
9. `npx tsc --noEmit` → `npm run build` → 로컬 3001에서 verify-kium-f34 실행, 전건 통과 시 커밋
   - 메시지: `feat(kium): 인재키움 과정 축소 19→11 · 분야 5종 · 공개교육 15회차 (F34·F35)`
10. `git push law-b feat/legal-b` 및 `git push law-b feat/legal-b:main` → Vercel 배포 후 BASE=https://law-b.vercel.app 재검증

## 완료 보고 형식
- 변경 파일 목록 · 단언 결과 표 · 커밋 해시 · 배포 URL
