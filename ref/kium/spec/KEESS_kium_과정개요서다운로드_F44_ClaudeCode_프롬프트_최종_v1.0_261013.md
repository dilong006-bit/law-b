# Claude Code 프롬프트 최종 v1.0: /kium 과정개요서 다운로드 게시 (F44)

> 새 세션에 그대로 붙여넣기. 명세서 · 전략 · 검증 스크립트는 Cowork가 레포에 배치 완료.
> 붙여넣기 전 사용자 준비: DRM 복호화 개정본을 `ref/kium/brochure/KG에듀원_2026_인재키움프리미엄_과정개요서.pdf`로 저장 (11과정 · 단가 없음 육안 확인)

```
역할: KEESS law-B 레포 담당 시니어 풀스택 개발자
기준: ref/kium/spec/KEESS_kium_과정개요서다운로드_F44_기술명세서_최종_v1.0_261013.md
목표: F42 게시 스위치(off)를 F44 규칙(영문 서버 파일명 · 한글 다운로드 표시명 · ?v= 캐시 · 히어로 미노출)으로 교정해 켜고, 개정본 PDF를 배치해 커밋 1건으로 law-b에 배포한다.

[규칙]
- Playwright · 브라우저 실행 금지. 검증 스크립트는 명령만 출력, 실행은 내가 한다
- 3001 프로세스 건드리지 않음 · 명세 외 변경 금지 · git add . / -A 금지
- 기대값과 다르면 즉시 멈추고 표로 보고

[1. 상태 확인]
  git log --oneline -1 → d010bd2
  git status --short (추적 변경 0) · git fetch law-b → law-b/main..HEAD 0 · HEAD..law-b/main 0
  sha256sum 대조(명세 §7): brochure.ts 704d7619… · home.ts 76480008… · KiumCoursesTab.tsx 334ba870… · README.md fbe6db97…
  sha256sum scripts/verify-kium-f44.mjs → d2bed005f72becd8a98e7bffa55edbaf747c01d71bb3031f1bee1a9e0a7f818b

[2. 파일 게이트 G0]
  원본: ref/kium/brochure/KG에듀원_2026_인재키움프리미엄_과정개요서.pdf (없으면 멈추고 요청)
  첫 5바이트 = %PDF- (아니면 DRM 암호화본 → 즉시 멈춤) · 10MB 미만 · 바이트 수 · SHA-256 기록
  public/downloads/kgeduone_kium_premium_course_overview_2026.pdf 로 복사 → SHA-256 원본과 일치
  sizeLabel 계산: Math.round(bytes/1024) → 'PDF · NNNKB' (1MB 이상 'PDF · N.NMB')

[3. 코드 적용] 명세 §3 그대로
  lib/kium/brochure.ts 전체 교체 (§3-1, sizeLabel만 G0 실측값)
  data/home.ts 히어로 조건 KIUM_BROCHURE.ready && KIUM_BROCHURE.showInHero (§3-2)
  components/kium/KiumCoursesTab.tsx type="application/pdf" 추가 · 주석 F44 (§3-3)
  README.md 작업 이력 최상단에 추가:
    ### ★ 인재키움 과정개요서 다운로드 게시 (F44 · 261013)
    - **범위**: F42 스위치 on. 서버 파일 `public/downloads/kgeduone_kium_premium_course_overview_2026.pdf`(고정) · 다운로드 표시명 `KG에듀원_2026_인재키움프리미엄_과정개요서.pdf`(`<a download>`) · 캐시 `?v=261008`(교체 시 수령일로 갱신) · 라벨 `과정개요서 받기` · 메타 `PDF · {실측}`
    - **위치**: 과정안내 세그먼트 행 오른쪽만(두 보기 공통). 홈 히어로 2차 버튼은 `showInHero=false`로 미노출(10/8 확정 범위 밖)
    - **회귀**: `scripts/verify-kium-f44.mjs` 20단언 신설. 기준: `ref/kium/spec/KEESS_kium_과정개요서다운로드_F44_기술명세서_최종_v1.0_261013.md`
  README F42 항목 제목의 '게시 스위치 off' → '게시 스위치 off → F44에서 on'
  grep -rn "공개교육_과정소개서\|과정 소개서 받기" components data lib app → 0건

[4. 게이트] npx tsc --noEmit → 0 · npm run build → 성공 · 경고 0 · /kium 줄 · 추적 부산물 생기면 멈춤

[5. G3 명령 출력 후 멈춤] (EXPECT_BYTES에 G0 실측 바이트를 채워서 출력)
  터미널1 (기존 3001 서버 반드시 Ctrl+C 후 재시작):
    cd "C:\오피스키퍼 예외\workspace\KEESS_law-B"
    npm.cmd run start
  터미널2 (Ready 후):
    cd "C:\오피스키퍼 예외\workspace\KEESS_law-B"
    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $OutputEncoding = [System.Text.Encoding]::UTF8
    $env:BASE="http://localhost:3001"; $env:EXPECT_BYTES="<실측>"; node scripts/verify-kium-f44.mjs | Tee-Object -FilePath "$env:TEMP\g3.txt"; node scripts/verify-kium-f40.mjs | Tee-Object -FilePath "$env:TEMP\g3.txt" -Append; notepad "$env:TEMP\g3.txt"
  기대: 20/20 PASS + 22/22 PASS

[6. 내가 결과(20/20 · 22/22)를 붙여넣으면: 커밋 → 푸시까지 사전 승인, 멈추지 않음]
  결과 본문 없이 자리표시 문구만 오면 진행하지 말고 결과 본문을 요청한다

  개별 add 9개:
    lib/kium/brochure.ts · data/home.ts · components/kium/KiumCoursesTab.tsx · README.md
    public/downloads/kgeduone_kium_premium_course_overview_2026.pdf
    scripts/verify-kium-f44.mjs
    ref/kium/spec/KEESS_kium_과정개요서다운로드_F44_UXUI전략_v1.0_261013.md
    ref/kium/spec/KEESS_kium_과정개요서다운로드_F44_기술명세서_최종_v1.0_261013.md
    ref/kium/spec/KEESS_kium_과정개요서다운로드_F44_ClaudeCode_프롬프트_최종_v1.0_261013.md
  (ref/kium/brochure/ 원본은 커밋하지 않음)
  메시지:
    feat(kium): 과정개요서 다운로드 게시 · 서버 파일명 · 표시명 분리 (F44)

    - 서버 kgeduone_kium_premium_course_overview_2026.pdf · 표시명 KG에듀원_2026_인재키움프리미엄_과정개요서.pdf (<a download>) · ?v=261008
    - 과정안내 세그먼트 행만 노출, 홈 히어로 showInHero=false · 라벨 '과정개요서 받기'
    - 검증: tsc 0 · build 경고 0 · verify-kium-f44 20/20 · verify-kium-f40 22/22 (로컬 프로덕션 서버)

  커밋 후: git status --short → 추적 변경 0
  푸시 조건(전부 충족 시 즉시 실행): git fetch law-b · law-b/main..HEAD = 1건 · HEAD..law-b/main = 0건 · 추적 변경 0
  git push law-b feat/legal-b
  git push law-b feat/legal-b:main
  git fetch law-b → HEAD · law-b/main · law-b/feat/legal-b 해시 일치 확인
  실패 시 재시도 · force 금지, 원인과 내가 실행할 명령 2줄 출력 후 멈춤

[7. G5 명령 출력] (Vercel Ready 후 내가 실행)
  [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $OutputEncoding = [System.Text.Encoding]::UTF8
  $env:BASE="https://law-b.vercel.app"; $env:EXPECT_BYTES="<실측>"; node scripts/verify-kium-f44.mjs | Tee-Object -FilePath "$env:TEMP\g5.txt"; node scripts/verify-kium-f40.mjs | Tee-Object -FilePath "$env:TEMP\g5.txt" -Append; notepad "$env:TEMP\g5.txt"
  실기기: PC Chrome · iOS Safari · Android Chrome에서 [과정개요서 받기] → 저장 파일명 KG에듀원_2026_인재키움프리미엄_과정개요서.pdf 확인

[최종 보고 표]
| 단계 | 결과 |
| 1 상태 · 해시 | |
| 2 G0 바이트 · SHA-256 · %PDF- · sizeLabel | |
| 3 코드 적용 · grep 0 | |
| 4 tsc · build | |
| 5 G3 20/20 · 22/22 | |
| 6 커밋 해시 · 푸시 · 해시 3종 일치 | |
| 7 G5 | 대기(사용자 실행) |
```
