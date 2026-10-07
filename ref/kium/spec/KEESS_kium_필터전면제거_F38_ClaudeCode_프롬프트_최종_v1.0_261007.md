# Claude Code 프롬프트 최종 v1.0: /kium 과정안내 필터 전면 제거 (F38)

> 패치·명세서·이 프롬프트는 Cowork가 레포 `ref/kium/spec/`에 직접 배치. 첨부 불필요.
> G3(로컬 검증)를 먼저 사용자가 실행하는 방식이 아니라, 빌드 후 멈췄다가 결과를 받아 커밋·푸시까지 진행.

```
역할: KEESS law-B 레포 담당 시니어 풀스택 개발자
기준: ref/kium/spec/KEESS_kium_필터전면제거_F38_기술명세서_최종_v1.0_261007.md
패치: ref/kium/spec/KEESS_kium_F38_필터전면제거.patch (HEAD 7984057 기준 · Cowork 27/27 실측)
목표: 전체과정 보기의 분야 필터까지 제거(F38). 공개교육 보기(모집 상태, F37)는 무변경.

[규칙]
- Playwright·브라우저 실행 금지. 검증은 명령만 출력, 실행은 내가 한다
- 3001 포트 프로세스 건드리지 않음
- 명세 §2 외 변경 금지 · git add . / -A 금지

[1. 무결성] 다르면 즉시 멈춤
  git log --oneline -1 → 7984057 · 추적 변경 0
  sha256sum ref/kium/spec/KEESS_kium_F38_필터전면제거.patch
    → daa72041f7d4cf50b89418cb33f11e93dc664aac33ac35068089fa237a4687ec

[2. 적용]
  git apply --check → git apply (실패 시 수동 적용 금지, 오류 전문 보고 후 멈춤)
  git diff --stat → KiumCoursesTab.tsx(19+ / 73-) + scripts/verify-kium-f38.mjs 신규, 2개만
  sha256sum components/kium/KiumCoursesTab.tsx scripts/verify-kium-f38.mjs
    → 190aeeb2730318f7de6f9ef5d596691cff3c6401994f1700553e36872163acac
    → fa3814bcf8326c2654bb5c9a387d3d6a6ce80b0690a55a9d0ffde8bc6f80e4d7
  (줄바꿈 차이뿐이면 보고 후 계속)

[3. 대조] 명세 §2 9항목 표 · grep "kium-cf-cat\|changeCat\|catRef\|getCategoryCounts" KiumCoursesTab.tsx → 0건

[4. README] 명세 §6 두 곳만 수정, git diff README.md 표시

[5. 게이트] G1 npx tsc --noEmit · G2 npm run build(경고·/kium 줄) · 빌드가 추적 파일 바꾸면 멈춤

[6. G3 명령 출력 후 멈춤]
  터미널1: 기존 3001 서버 Ctrl+C → cd "C:\오피스키퍼 예외\workspace\KEESS_law-B" → npm.cmd run start
  터미널2:
    cd "C:\오피스키퍼 예외\workspace\KEESS_law-B"
    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $OutputEncoding = [System.Text.Encoding]::UTF8
    $env:BASE="http://localhost:3001"; node scripts/verify-kium-f38.mjs | Tee-Object -FilePath "$env:TEMP\f38.txt"; notepad "$env:TEMP\f38.txt"
  기대 27/27

[7. 내가 27/27을 보내면: 커밋 → 푸시까지 사전 승인]
  개별 add 6개:
    components/kium/KiumCoursesTab.tsx · scripts/verify-kium-f38.mjs · README.md
    ref/kium/spec/KEESS_kium_필터전면제거_F38_기술명세서_최종_v1.0_261007.md
    ref/kium/spec/KEESS_kium_F38_필터전면제거.patch
    ref/kium/spec/KEESS_kium_필터전면제거_F38_ClaudeCode_프롬프트_최종_v1.0_261007.md
  메시지: feat(kium): 과정안내 필터 전면 제거 · 전체과정 분야 필터 삭제 (F38)
  푸시 조건(전부 충족 시 멈추지 않고 실행):
    git fetch law-b · law-b/main..HEAD = 1건 · HEAD..law-b/main = 0건 · 추적 변경 0
  git push law-b feat/legal-b
  git push law-b feat/legal-b:main
  해시 3종(HEAD · law-b/main · law-b/feat/legal-b) 일치 확인
  실패 시 재시도·force 금지, 내가 실행할 명령 2줄 출력 후 멈춤

[8. G5 명령 출력]
  $env:BASE="https://law-b.vercel.app"; node scripts/verify-kium-f38.mjs | Tee-Object -FilePath "$env:TEMP\g5.txt"; notepad "$env:TEMP\g5.txt"

단계별 표 보고, 기대값과 다르면 즉시 멈춘다.
```
