# Claude Code 프롬프트 최종 v1.0: /kium 공개교육 보기 필터 간소화 (F36·F37)

> 첨부 2개: `KEESS_kium_필터간소화_F36F37_기술명세서_최종_v1.0_261007.md` · `KEESS_kium_F36F37_필터간소화.patch`
> 직전 세션이 「푸시 승인 대기」에서 멈춰 있으면 그 세션에 그대로 붙여넣습니다(새 세션도 가능).

---

## 프롬프트 본문

```
[직전 단계 결정]
- F34 푸시는 보류합니다. 승인하지 않습니다.
- 62f3d93 · a821341 위에 F36·F37을 커밋한 뒤 3건을 한 번에 푸시합니다.
- G3 21/21 근거(g3.txt)는 별도 기록으로 남기므로 진행에 영향 없음.

역할: KEESS law-B 레포 담당 시니어 풀스택 개발자
기준: 첨부 기술명세서 최종 v1.0 (단일 기준)
참조: 첨부 패치 (HEAD a821341 기준, Cowork에서 git apply 결과가 검증본과 바이트 일치 · 28/28 실측)

목표: /kium 과정안내의 공개교육 보기에서 분야·기간 필터 제거(F36). 전체과정 보기의 분야 필터는 유지.
      모집 상태 행은 0건 아닌 상태 2종 이상일 때만 노출(F37).

[실행 규칙]
- Playwright·브라우저 실행 금지(크래시 재발 방지). 검증은 명령만 출력하고 실행은 내가 한다
- 3001 포트 프로세스는 건드리지 않는다
- 명세 §4 외 변경 금지: lib/kium/*, CSS, KiumCourseGrid, 데이터, 카피 무수정
- git add . / -A 금지. 파일 단위 add
- [멈춤]에서는 반드시 내 승인을 기다린다

[0. 상태 확인]
- git status --short · git log --oneline -3
- 기대: HEAD a821341 · 추적 파일 변경 0 · 미추적 = qa/, _superseded/, 260911 명세서
- 3001 LISTENING 여부만 보고

[1. 패치 적용]
- 첨부 명세서 · 패치를 ref/kium/spec/ 에 저장
  · ref/kium/spec/KEESS_kium_필터간소화_F36F37_기술명세서_최종_v1.0_261007.md
  · ref/kium/spec/KEESS_kium_F36F37_필터간소화.patch
- git apply --check ref/kium/spec/KEESS_kium_F36F37_필터간소화.patch → 통과 시 git apply
- 실패 시 수동 적용 금지, 충돌 위치 보고 [멈춤]
- git diff --stat → KiumCoursesTab.tsx 수정 + scripts/verify-kium-f36.mjs 신규, 2개만

[2. 명세 대조]
- 명세 §4 15항목을 diff와 1:1 대조해 표로 보고(항목 / 위치 / 일치)
- grep -n "kium-cf-month\|changeMonth\|MONTHS\|openCategoryCounts" components/kium/KiumCoursesTab.tsx → 0건
- grep -n "kium-cf-cat" components/kium/KiumCoursesTab.tsx → 1건 이상(전체과정 보기 분야 행 유지 확인)

[3. README]
- 명세 §8 두 곳만 수정, git diff README.md 표시

[4. 정적 게이트]
- G1: npx tsc --noEmit → 0
- G2: npm run build → 성공 · 경고 목록 · /kium 라우트 줄
- 빌드가 추적 파일(tsconfig.tsbuildinfo, next-env.d.ts 등)을 바꿨으면 커밋하지 말고 보고 [멈춤: 해당 시]

[5. G3 명령 출력] [멈춤]
아래를 그대로 출력하고 내 결과를 기다린다.
  터미널1 (기존 3001 서버가 있으면 Ctrl+C 후):
    cd "C:\오피스키퍼 예외\workspace\KEESS_law-B"
    npm.cmd run start
  터미널2 (Ready 후):
    cd "C:\오피스키퍼 예외\workspace\KEESS_law-B"
    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $OutputEncoding = [System.Text.Encoding]::UTF8
    $env:BASE="http://localhost:3001"; node scripts/verify-kium-f36.mjs | Tee-Object -FilePath "$env:TEMP\f36.txt"; notepad "$env:TEMP\f36.txt"
  기대: 28/28 PASS
  주의: npm run start는 직전 build 결과를 서비스하므로 4단계 build 이후에 띄울 것

[6. 커밋] (내가 28/28을 붙여넣은 뒤)
- add 대상 5개:
  · components/kium/KiumCoursesTab.tsx
  · scripts/verify-kium-f36.mjs
  · README.md
  · ref/kium/spec/KEESS_kium_필터간소화_F36F37_기술명세서_최종_v1.0_261007.md
  · ref/kium/spec/KEESS_kium_F36F37_필터간소화.patch
- git diff --cached --stat 확인
- 메시지:
  feat(kium): 공개교육 보기 분야·기간 필터 제거 · 모집 상태 조건부 노출 (F36·F37)
- 커밋 후 git status --short: 미추적 3종만

[7. 푸시 전 보고] [멈춤]
- git fetch law-b
- git log --oneline law-b/main..HEAD → 기대 3건(62f3d93 · a821341 · F36 커밋)
- git log --oneline HEAD..law-b/main → 기대 0건(1건 이상이면 푸시 금지, 보고)
- 표로 보고 후 승인 대기

[8. 푸시] (승인 후)
git push law-b feat/legal-b
git push law-b feat/legal-b:main
- 출력 전문 · git fetch law-b 후 HEAD · law-b/main · law-b/feat/legal-b 해시 일치 확인
- 실패 시 재시도·force 금지, 원인·해결안만 보고

[9. G5 명령 출력]
Vercel Ready 후 내가 실행:
  [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $OutputEncoding = [System.Text.Encoding]::UTF8
  $env:BASE="https://law-b.vercel.app"; node scripts/verify-kium-f36.mjs | Tee-Object -FilePath "$env:TEMP\g5.txt"; notepad "$env:TEMP\g5.txt"

[최종 보고 표]
| 항목 | 결과 |
| 패치 적용 · 명세 대조 15항목 | |
| G1 tsc · G2 build | |
| G3 로컬 28/28 | |
| 커밋 해시 · 메시지 | |
| 푸시 · 해시 일치 | |
| G5 배포 검수 | 대기(사용자 실행) |

FAIL 또는 기대값과 다른 결과는 즉시 멈추고 원인·수정안을 표로 보고한다.
```

---

## F37 미채택 시 (모집 상태 행을 항상 노출)
프롬프트 본문 끝에 추가:
```
[F37 미채택] 패치 적용 후 showStatusRow를 true로 고정하고 status 자동 복귀 effect를 삭제한다. 그 외 F36은 그대로.
```
