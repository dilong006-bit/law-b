# Claude Code 프롬프트 05: F44 자동 검증 · 커밋 · 푸시 · 배포 확인 (무중단)

> 같은 세션(G3 대기 상태)에 붙여넣기. 사용자 터미널 실행 없이 G3 · G5를 Claude Code가 직접 수행.
> 사전 확인: Cowork가 빌드 산출물 기준 f44 20/20 · f40 22/22 사전 검증 완료(261013 16:10).

```
G3 · G5를 네가 직접 실행하고 커밋 → 푸시 → 배포 확인까지 멈추지 않고 진행한다. 아래 전 단계 사전 승인.
멈추는 경우는 2가지뿐: 검증 FAIL · 푸시 거부. 그 외에는 질문 없이 끝까지 진행한다.

[정정] verify-kium-f44.mjs 단언 수 = 20 (D1~D9 · P1~P6 · H1~H3 · R1~R2). 기대값 f44 20/20 · f40 22/22.

[1. 커밋 전 수정]
  README.md F44 항목 「verify-kium-f44.mjs` 22단언」 → 「20단언」 (F42 항목 verify-kium-f40 22단언은 유지)
  sha256sum scripts/verify-kium-f44.mjs → d2bed005f72becd8a98e7bffa55edbaf747c01d71bb3031f1bee1a9e0a7f818b
  sha256sum public/downloads/kgeduone_kium_premium_course_overview_2026.pdf → 57c3377887da60b7…

[2. G3 자동 실행 (포트 3005, 3001 프로세스 절대 건드리지 않음)]
  빌드 산출물은 직전 build 그대로 사용 (README만 바뀌었으므로 재빌드 불필요)
  기동: npx next start -p 3005 > <scratchpad>/g3-server.log 2>&1 &  → 최대 30초 폴링으로 http://localhost:3005/kium 200 확인
  실행:
    BASE=http://localhost:3005 EXPECT_BYTES=564785 node scripts/verify-kium-f44.mjs
    BASE=http://localhost:3005 node scripts/verify-kium-f40.mjs
  종료: netstat -ano | grep ":3005 .*LISTENING" 의 PID만 taskkill //PID <pid> //F (3001 PID와 겹치면 즉시 멈춤)
  판정: 20/20 · 22/22 아니면 커밋 금지, FAIL 표 보고 후 멈춤

[3. 커밋] 개별 add 12개 (git add . / -A 금지)
    lib/kium/brochure.ts · data/home.ts · components/kium/KiumCoursesTab.tsx · README.md
    public/downloads/kgeduone_kium_premium_course_overview_2026.pdf
    scripts/verify-kium-f44.mjs
    ref/kium/spec/KEESS_kium_과정개요서다운로드_F44_UXUI전략_v1.0_261013.md
    ref/kium/spec/KEESS_kium_과정개요서다운로드_F44_기술명세서_최종_v1.0_261013.md
    ref/kium/spec/KEESS_kium_과정개요서다운로드_F44_ClaudeCode_프롬프트_최종_v1.0_261013.md
    ref/kium/spec/KEESS_kium_과정개요서다운로드_F44_ClaudeCode_프롬프트_02_G0재개_261013.md
    ref/kium/spec/KEESS_kium_과정개요서다운로드_F44_ClaudeCode_프롬프트_03_G0판정정정_261013.md
    ref/kium/spec/KEESS_kium_과정개요서다운로드_F44_ClaudeCode_프롬프트_04_최종실행_261013.md
  + 이 파일: ref/kium/spec/KEESS_kium_과정개요서다운로드_F44_ClaudeCode_프롬프트_05_자동배포_261013.md (총 13개)
  커밋 금지: ref/kium/brochure/ 전부 · qa/ · _superseded/ · 기타 기존 미추적
  메시지:
    feat(kium): 과정개요서 다운로드 게시 · 서버 파일명 · 표시명 분리 (F44)

    - 서버 kgeduone_kium_premium_course_overview_2026.pdf · 표시명 KG에듀원_2026_인재키움프리미엄_과정개요서.pdf (<a download>) · ?v=261008
    - 게시본: 사업부 개정본(261001) 11과정 · 13쪽 · 단가 포함 원형(10/13 확정) · 552KB
    - 과정안내 세그먼트 행만 노출, 홈 히어로 showInHero=false · 라벨 '과정개요서 받기'
    - 검증: tsc 0 · build 경고 0 · verify-kium-f44 20/20 · verify-kium-f40 22/22 (로컬 프로덕션 서버 :3005)
  커밋 후 git status --short --untracked-files=no → 0

[4. 푸시]
  git fetch law-b → law-b/main..HEAD = 1 · HEAD..law-b/main = 0 확인
  git push law-b feat/legal-b
  git push law-b feat/legal-b:main
  git fetch law-b → HEAD · law-b/main · law-b/feat/legal-b 해시 일치
  거부 시 재시도 · force 금지, 원인 보고 후 멈춤

[5. Vercel 반영 대기 · G5 자동 실행]
  30초 간격 최대 20회(10분) 폴링: curl -s https://law-b.vercel.app/kium | grep -c "kgeduone_kium_premium_course_overview_2026" ≥ 1
  반영 확인 즉시:
    BASE=https://law-b.vercel.app EXPECT_BYTES=564785 node scripts/verify-kium-f44.mjs
    BASE=https://law-b.vercel.app node scripts/verify-kium-f40.mjs
  10분 내 미반영: 커밋 해시와 「Vercel 대시보드 확인 필요」만 보고 (재푸시 금지)

[최종 보고 표]
| 단계 | 결과 |
| 1 README 수정 · 해시 2종 | |
| 2 G3 :3005 f44 · f40 · 서버 종료 | |
| 3 커밋 해시 · 13개 · 추적 변경 0 | |
| 4 푸시 · 해시 3종 일치 | |
| 5 Vercel 반영 시각 · G5 f44 · f40 | |
| 남은 일 | 실기기 다운로드 파일명 확인(사용자) · 업무 27338 정정 댓글(사용자) |
```
