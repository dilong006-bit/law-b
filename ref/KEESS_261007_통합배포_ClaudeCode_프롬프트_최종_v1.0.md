# Claude Code 프롬프트 최종 v1.0: 10/7 통합 배포 (F38 · F39 · LB58)

> 직전 세션(G3 대기 상태)에 그대로 붙여넣기. 새 세션도 가능.
> 파일은 Cowork가 레포에 배치 완료. 첨부 불필요.

```
역할: KEESS law-B 레포 담당 시니어 풀스택 개발자
기준: ref/KEESS_261007_통합배포_F38F39_LB58_기술명세서_최종_v1.0.md
목표: F38·F39(적용 완료, 미커밋)에 LB58(법정 허브 문구 2건)을 더해 한 번의 빌드·검증으로 커밋 2건을 만들고 law-b에 배포한다.

[규칙]
- Playwright·브라우저 실행 금지. 검증 스크립트는 명령만 출력, 실행은 내가 한다
- 3001 프로세스 건드리지 않음 · 명세 외 변경 금지 · git add . / -A 금지 · 수동 적용 금지
- 기대값과 다르면 즉시 멈추고 표로 보고

[1. 상태 확인]
  git log --oneline -1 → 7984057
  git status --short (추적): README.md · components/kium/KiumCoursesTab.tsx · lib/kium/sessions.ts 3건만 M
  sha256sum: KiumCoursesTab.tsx 190aeeb2… · sessions.ts 23627aa2… (명세 §4)
  sha256sum ref/legal/KEESS_legal-B_LB58_교육프로세스문구_v2.patch → c051679a478295434bb3df122da6b18b8a2fbcad747e47b7dcb597d4dda5bef7
  (v1 패치 ref/legal/KEESS_legal-B_LB58_교육프로세스문구.patch 는 사용하지 않음)

[2. LB58 적용]
  git apply --check → git apply ref/legal/KEESS_legal-B_LB58_교육프로세스문구_v2.patch
  git diff --stat → 기존 3건 + data/legalHub.ts · tests-fi/legal-review-261006.spec.ts 수정 + scripts/verify-legal-lb58.mjs 신규
  sha256sum 대조(명세 §4): legalHub.ts 09b95515… · spec.ts 24ac9db1… · verify-legal-lb58.mjs 2c145589…
  grep -rn "도입 절차\|수료까지 4단계" data components app → 주석 외 0건

[3. 게이트] npx tsc --noEmit → 0 · npm run build → 성공·경고 0·/kium·/content 줄 · 추적 부산물 생기면 멈춤

[4. G3 명령 출력 후 멈춤]
  터미널1 (기존 3001 서버 반드시 Ctrl+C 후 재시작):
    cd "C:\오피스키퍼 예외\workspace\KEESS_law-B"
    npm.cmd run start
  터미널2 (Ready 후):
    cd "C:\오피스키퍼 예외\workspace\KEESS_law-B"
    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $OutputEncoding = [System.Text.Encoding]::UTF8
    $env:BASE="http://localhost:3001"; node scripts/verify-kium-f39.mjs | Tee-Object -FilePath "$env:TEMP\g3.txt"; node scripts/verify-legal-lb58.mjs | Tee-Object -FilePath "$env:TEMP\g3.txt" -Append; notepad "$env:TEMP\g3.txt"
  기대: 30/30 PASS + 7/7 PASS

[5. 내가 결과(30/30 · 7/7)를 붙여넣으면: 커밋 2건 → 푸시까지 사전 승인, 멈추지 않음]
  결과 본문 없이 자리표시 문구만 오면 진행하지 말고 결과 본문을 요청한다

  커밋 ① (kium) 개별 add 11개:
    components/kium/KiumCoursesTab.tsx · lib/kium/sessions.ts · README.md
    scripts/verify-kium-f38.mjs · scripts/verify-kium-f39.mjs
    ref/kium/spec/KEESS_kium_필터전면제거_F38_기술명세서_최종_v1.0_261007.md
    ref/kium/spec/KEESS_kium_필터전면제거_F38_ClaudeCode_프롬프트_최종_v1.0_261007.md
    ref/kium/spec/KEESS_kium_F38_필터전면제거.patch
    ref/kium/spec/KEESS_kium_회차숨김_F39_기술명세서_최종_v1.0_261007.md
    ref/kium/spec/KEESS_kium_F39_회차숨김.patch
    ref/kium/spec/KEESS_kium_F38F39_긴급배포_ClaudeCode_프롬프트_v1.0_261007.md
  메시지:
    feat(kium): 과정안내 필터 전면 제거 · 수강신청 종료 회차 5건 숨김 (F38·F39)

    - F38: 전체과정 보기 분야 필터 삭제, ?cat= · ?month= 두 보기 모두 무시·제거
    - F39: agent-r1 · data-r1 · aijob-r1 · relead-r1 · cs-r1 hidden → 노출 10회차(11월 6 / 12월 4)
    - 검증: tsc 0 · build 경고 0 · verify-kium-f39 30/30 (로컬 프로덕션 서버)

  커밋 ② (content) 개별 add 7개:
    data/legalHub.ts · tests-fi/legal-review-261006.spec.ts · scripts/verify-legal-lb58.mjs
    ref/legal/TECHSPEC_KEESS_26827_legal-B_v1.0_upgrade-05.md
    ref/legal/KEESS_legal-B_LB58_교육프로세스문구_v2.patch
    ref/KEESS_261007_통합배포_F38F39_LB58_기술명세서_최종_v1.0.md
    ref/KEESS_261007_통합배포_ClaudeCode_프롬프트_최종_v1.0.md
  메시지:
    feat(content): 법정 허브 교육 프로세스 문구 변경 (LB58)

    - 키커 '도입 절차' → '교육 프로세스', 제목 '신청부터 수료까지 4단계' → '신청부터 수료까지 손쉽게!'
    - HRD사업팀 10/7 요청 원고 그대로 · 구성·4단계 문구·버튼 무변경
    - 검증: verify-legal-lb58 7/7 · tests-fi 기대값 갱신

  커밋 후: git status --short → 추적 변경 0 (미추적 잔여: qa/ · _superseded/ · 260911 명세서 · LB58 v1 패치 · PROMPT_build_legal-B_upgrade-05.md 는 커밋하지 않음)

  푸시 조건(전부 충족 시 즉시 실행): git fetch law-b · law-b/main..HEAD = 2건 · HEAD..law-b/main = 0건 · 추적 변경 0
  git push law-b feat/legal-b
  git push law-b feat/legal-b:main
  git fetch law-b → HEAD · law-b/main · law-b/feat/legal-b 해시 일치 확인
  실패 시 재시도·force 금지, 원인과 내가 실행할 명령 2줄 출력 후 멈춤

[6. G5 명령 출력] (Vercel Ready 후 내가 실행)
  [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $OutputEncoding = [System.Text.Encoding]::UTF8
  $env:BASE="https://law-b.vercel.app"; node scripts/verify-kium-f39.mjs | Tee-Object -FilePath "$env:TEMP\g5.txt"; node scripts/verify-legal-lb58.mjs | Tee-Object -FilePath "$env:TEMP\g5.txt" -Append; notepad "$env:TEMP\g5.txt"

[최종 보고 표]
| 단계 | 결과 |
| 1 상태 · 2 LB58 적용 · 해시 | |
| 3 tsc · build | |
| 4 G3 30/30 · 7/7 | |
| 5 커밋 ① ② 해시 · 푸시 · 해시 3종 일치 | |
| 6 G5 | 대기(사용자 실행) |
```
