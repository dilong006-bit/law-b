# Claude Code 프롬프트: F38 + F39 동시 적용 · 긴급 배포 (261007)

> 패치 2개·명세 2개는 Cowork가 레포 `ref/kium/spec/`에 배치 완료. 첨부 불필요.
> G3 결과만 사용자가 전달하면 커밋·푸시까지 멈추지 않고 진행.

```
역할: KEESS law-B 레포 담당 시니어 풀스택 개발자
목표: 오늘(10/7) 배포분 마무리. F38(전체과정 분야 필터 제거) + F39(수강신청 종료 회차 5건 숨김)를 한 번에 적용·검증·배포한다.
기준: ref/kium/spec/KEESS_kium_필터전면제거_F38_기술명세서_최종_v1.0_261007.md
      ref/kium/spec/KEESS_kium_회차숨김_F39_기술명세서_최종_v1.0_261007.md

[규칙]
- Playwright·브라우저 실행 금지(검증은 명령만 출력) · 3001 프로세스 건드리지 않음
- 명세 외 변경 금지 · git add . / -A 금지 · 수동 적용 금지

[1. 무결성 · 적용] 다르면 즉시 멈춤
  git log --oneline -1 → 7984057 · 추적 변경 0
  sha256sum ref/kium/spec/KEESS_kium_F38_필터전면제거.patch → daa72041f7d4cf50b89418cb33f11e93dc664aac33ac35068089fa237a4687ec
  sha256sum ref/kium/spec/KEESS_kium_F39_회차숨김.patch     → 47de306fb101c7d1ac27e7e2a8c1cddfe5b4e17efa3fd8cc064936fb0980e5d3
  git apply --check 두 패치 → git apply F38 → git apply F39
  sha256sum 결과 대조:
    components/kium/KiumCoursesTab.tsx → 190aeeb2730318f7de6f9ef5d596691cff3c6401994f1700553e36872163acac
    lib/kium/sessions.ts               → 23627aa2e1f4b51f518bd8d9443e8beea23b654ef2b4106eb99a1ae8aaa92fcb
    scripts/verify-kium-f38.mjs        → fa3814bcf8326c2654bb5c9a387d3d6a6ce80b0690a55a9d0ffde8bc6f80e4d7
    scripts/verify-kium-f39.mjs        → eb156f6c0c4a2db4c3a65a11002fdec30d75701f1124e41952cb46dc31ee50b2
  (줄바꿈 차이뿐이면 보고 후 계속)

[2. README] F38 명세 §6 + F39 명세 §6 반영만, git diff README.md 표시

[3. 게이트] npx tsc --noEmit → 0 · npm run build → 성공·경고 0·/kium 줄 · 빌드가 추적 파일 바꾸면 멈춤

[4. G3 명령 출력 후 멈춤]
  터미널1: 기존 3001 서버 Ctrl+C →
    cd "C:\오피스키퍼 예외\workspace\KEESS_law-B"
    npm.cmd run start
  터미널2:
    cd "C:\오피스키퍼 예외\workspace\KEESS_law-B"
    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $OutputEncoding = [System.Text.Encoding]::UTF8
    $env:BASE="http://localhost:3001"; node scripts/verify-kium-f39.mjs | Tee-Object -FilePath "$env:TEMP\f39.txt"; notepad "$env:TEMP\f39.txt"
  기대 30/30 (F38 단언 포함)

[5. 내가 30/30을 보내면: 커밋 → 푸시까지 사전 승인, 멈추지 않음]
  개별 add 10개:
    components/kium/KiumCoursesTab.tsx · lib/kium/sessions.ts · README.md
    scripts/verify-kium-f38.mjs · scripts/verify-kium-f39.mjs
    ref/kium/spec/KEESS_kium_필터전면제거_F38_기술명세서_최종_v1.0_261007.md
    ref/kium/spec/KEESS_kium_필터전면제거_F38_ClaudeCode_프롬프트_최종_v1.0_261007.md
    ref/kium/spec/KEESS_kium_F38_필터전면제거.patch
    ref/kium/spec/KEESS_kium_회차숨김_F39_기술명세서_최종_v1.0_261007.md
    ref/kium/spec/KEESS_kium_F39_회차숨김.patch
  (이 프롬프트 파일 ref/kium/spec/KEESS_kium_F38F39_긴급배포_ClaudeCode_프롬프트_v1.0_261007.md 도 포함 → 11개)
  메시지:
    feat(kium): 과정안내 필터 전면 제거 · 수강신청 종료 회차 5건 숨김 (F38·F39)

    - F38: 전체과정 보기 분야 필터 삭제, ?cat= · ?month= 두 보기 모두 무시·제거
    - F39: agent-r1 · data-r1 · aijob-r1 · relead-r1 · cs-r1 hidden → 노출 10회차(11월 6 / 12월 4)
    - 검증: tsc 0 · build 경고 0 · verify-kium-f39 30/30 (로컬 프로덕션 서버)
  푸시 조건(전부 충족 시 즉시 실행): git fetch law-b · law-b/main..HEAD = 1건 · HEAD..law-b/main = 0건 · 추적 변경 0
  git push law-b feat/legal-b
  git push law-b feat/legal-b:main
  해시 3종 일치 확인 · 실패 시 재시도·force 금지, 내가 실행할 명령 2줄 출력 후 멈춤

[6. G5 명령 출력]
  $env:BASE="https://law-b.vercel.app"; node scripts/verify-kium-f39.mjs | Tee-Object -FilePath "$env:TEMP\g5.txt"; notepad "$env:TEMP\g5.txt"

단계별 표 보고, 기대값과 다르면 즉시 멈춘다.
```
