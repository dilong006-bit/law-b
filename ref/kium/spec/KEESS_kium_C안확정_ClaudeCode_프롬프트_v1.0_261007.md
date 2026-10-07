# Claude Code 프롬프트 v1.0: 홈 히어로 C안 확정 반영 (F40 후속)

> 새 세션 또는 기존 세션에 붙여넣기. 패치는 Cowork가 `ref/kium/spec/`에 배치 완료. 첨부 불필요.

```
역할: KEESS law-B 레포 담당 시니어 풀스택 개발자
목표: 홈 히어로 첫 장 C안 확정(10/7 유현경 차장 · 지예정 대리 동의)을 주석 · README · PRD · 기술명세서에 반영하고 law-b에 배포한다.
성격: 동작 변경 0. HERO_START='alternate' 그대로. 주석 · 문서 · 소속 표기(지예정 대리 HRD사업팀 → HRD솔루션팀)만 수정.

[규칙]
- Playwright · 브라우저 실행 금지 · 3001 프로세스 건드리지 않음
- 명세 외 변경 금지 · 수동 적용 금지(git apply만) · git add . / -A 금지 · force 금지
- 기대값과 다르면 즉시 멈추고 표로 보고

[1. 상태 확인]
  git log --oneline -1 → 2b658f3
  git rev-parse HEAD law-b/main → 일치(F40~F43 푸시 완료 상태)
  git status --short → 추적 변경 0
  sha256sum ref/kium/spec/KEESS_kium_5_C안확정.patch
    → 693380a43f8941c8fb02d4e2679d43febf00a42884c2f2b3007c0b11e019c3eb

[2. 적용]
  git apply --check → git apply ref/kium/spec/KEESS_kium_5_C안확정.patch
  git -c core.quotepath=false diff --stat → 5파일만
  sha256sum 대조:
    README.md                        fbe6db972f80c8b55bf992c38de17302f0a8f641e8393f6cd1f75579fe973798
    components/kium/KiumHeroCta.tsx  629ba8b73794bf29fea0ce59684cee307828e01b94be41347c02d949f2b2f865
    data/home.ts                     76480008635bbf777143f5864783cfe6eb81d0d51b63b0d50e337f964c57d1e6
    ref/kium/spec/KEESS_kium_공개교육신청유도_F40-F43_PRD_v1.0_261007.md
                                     50e70e1f1ed28168df2d1611846772a276c7c9c7cc96bcb10c61260bfd79f87c
    ref/kium/spec/KEESS_kium_공개교육신청유도_F40-F43_기술명세서_v1.0_261007.md
                                     9f85733b6d027da9d79c07151f02277700ce6c9d419b07c4ec4469cb17fbd6e1
  git diff data/home.ts components/kium/KiumHeroCta.tsx → 주석 줄만 바뀌었는지 확인(코드 줄 변경 0)
  npx tsc --noEmit → 0

[3. 빌드 게이트]
  npm run build → 성공 · 경고 0
  exit 134 등 메모리 부족이면 재시도 금지, 주석 · 문서만 바뀐 변경이므로 B안(사전 승인)으로 4 진행
  그 외 실패 → 멈춤 · 마지막 30줄 보고

[4. 커밋 → 푸시] 사전 승인 · 멈추지 않음
  개별 add 7개:
    README.md · components/kium/KiumHeroCta.tsx · data/home.ts
    ref/kium/spec/KEESS_kium_공개교육신청유도_F40-F43_PRD_v1.0_261007.md
    ref/kium/spec/KEESS_kium_공개교육신청유도_F40-F43_기술명세서_v1.0_261007.md
    ref/kium/spec/KEESS_kium_5_C안확정.patch
    ref/kium/spec/KEESS_kium_C안확정_ClaudeCode_프롬프트_v1.0_261007.md
  메시지:
    docs(home): 히어로 첫 장 C안 확정 반영 · 소속 표기 정정 (F40 후속)

    - C안 확정(10/7 HRD사업팀 유현경 차장 · HRD솔루션팀 지예정 대리 동의), 동작 무변경
    - 지예정 대리 소속 HRD사업팀 → HRD솔루션팀 (주석 · README · PRD)
    - PRD §5 결정 항목 · 기술명세서 개정 이력 갱신
  푸시 조건: git fetch law-b · law-b/main..HEAD = 1건 · HEAD..law-b/main = 0건 · 추적 변경 0
  git push law-b feat/legal-b
  git push law-b feat/legal-b:main
  git fetch law-b → 해시 3종 일치 확인
  실패 시 재시도 · force 금지, 원인과 내가 실행할 명령 2줄 출력 후 멈춤

[5. G5 명령 출력] (Vercel Ready 후 내가 실행)
  [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $OutputEncoding = [System.Text.Encoding]::UTF8
  $env:BASE="https://law-b.vercel.app"; node scripts/verify-kium-f40.mjs | Tee-Object -FilePath "$env:TEMP\g5.txt"; node scripts/verify-kium-f39.mjs | Tee-Object -FilePath "$env:TEMP\g5.txt" -Append; node scripts/verify-legal-lb58.mjs | Tee-Object -FilePath "$env:TEMP\g5.txt" -Append; notepad "$env:TEMP\g5.txt"
  기대: 22/22 · 30/30 · 7/7

[최종 보고 표]
| 단계 | 결과 |
| 1 상태 · 패치 해시 | |
| 2 적용 · 해시 5종 · 코드 줄 변경 0 · tsc | |
| 3 build (성공 / B안) | |
| 4 커밋 해시 · 푸시 · 해시 3종 | |
| 5 G5 | 대기(사용자 실행) |
```
