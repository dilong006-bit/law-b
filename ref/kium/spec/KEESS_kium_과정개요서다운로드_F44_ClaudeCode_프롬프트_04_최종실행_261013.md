# Claude Code 프롬프트 04 최종: F44 개정본 확정 · 빌드 · G3

> 같은 세션에 붙여넣기 (새 세션도 가능, 자체 완결). 이전 02 · 03 지시는 이 프롬프트로 대체.

```
역할: KEESS law-B 레포 담당 시니어 풀스택 개발자
기준: ref/kium/spec/KEESS_kium_과정개요서다운로드_F44_기술명세서_최종_v1.0_261013.md (§5 261013 갱신분 반영본)
목표: 261001 개정본(11과정)으로 F44를 적용·빌드하고 G3 명령 출력 후 멈춘다.

[결정 사항 · 재논의 금지]
- 게시본 = ref/kium/brochure/KG에듀원_2026_인재키움프리미엄_과정개요서.pdf (261001 복호화본, 16:00 교체)
- 단가 포함 게시 확정 (10/13 임지홍). 사업부 제공본 원형 유지, 위탁 6과정 단가 PDF 노출 허용. 화면 교육비 정책은 무변경
- 같은 폴더 KG에듀원_2026_인재키움프리미엄_과정개요서-원본.pdf 는 19개판(SHA-256 65c528d0…). 읽지도 복사하지도 커밋하지도 않는다
- 직전 G0의 「261001도 19개판」 결론은 교체 전 파일을 검사한 결과라 무효

[규칙] Playwright·브라우저 금지 · 3001 프로세스 손대지 않음 · 명세 외 변경 금지 · git add . / -A 금지 · 기대값 불일치 시 즉시 멈추고 표 보고

[1. 상태]
  HEAD d010bd2 · 추적 변경 0 · law-b/main 앞섬 0 · 뒤처짐 0
  해시: brochure.ts 704d7619… · home.ts 76480008… · KiumCoursesTab.tsx 334ba870… · README.md fbe6db97… · verify-kium-f44.mjs d2bed005…

[2. G0 (기대값 고정)]
  게시본: %PDF- · 564,785 B · SHA-256 57c3377887da60b7c733b0a16ed38e27f2c0ef228b02846c8147b04cbaf89241 · 13쪽
  차단: 65c528d0b9338c0e6b672d8f35653c235cbef6cb3d7b6cfb40e000a237b7bb53 이면 즉시 멈춤
  내용 (scratchpad chk.mjs 재사용):
    a 11과정 11/11 · b 폐강 8과정 0건
    c 단가: 2쪽 「훈련비 단가(원)」 표 1 · 「원 / 인」 11건 · 공개교육 5과정 금액이 lib/kium/pricing.ts와 일치
      (Re-Lead 400,000 · Agent 700,000 · Data 700,000 · 직무전문화 700,000 · CS 250,000)
  복사: public/downloads/kgeduone_kium_premium_course_overview_2026.pdf → SHA-256 57c33778… 일치
  sizeLabel: round(564785/1024) = 552 → 'PDF · 552KB'

[3. 코드] 명세 §3 그대로
  lib/kium/brochure.ts 전체 교체 (§3-1 · sizeLabel 'PDF · 552KB' · VERSION '261008' 유지)
  data/home.ts 조건 KIUM_BROCHURE.ready && KIUM_BROCHURE.showInHero (§3-2)
  components/kium/KiumCoursesTab.tsx type="application/pdf" (download 다음, data-ga-id 앞) · 주석 [F42 · F44] (§3-3)
  README.md 작업 이력 최상단:
    ### ★ 인재키움 과정개요서 다운로드 게시 (F44 · 261013)
    - **범위**: F42 스위치 on. 서버 파일 `public/downloads/kgeduone_kium_premium_course_overview_2026.pdf`(고정) · 다운로드 표시명 `KG에듀원_2026_인재키움프리미엄_과정개요서.pdf`(`<a download>`) · 캐시 `?v=261008`(교체 시 수령일로 갱신) · 라벨 `과정개요서 받기` · 메타 `PDF · 552KB`
    - **게시본**: 사업부 개정본(261001) 11과정 · 13쪽 · 단가 포함 원형(10/13 확정). 10/8 댓글 첨부본은 19개판이라 미사용
    - **위치**: 과정안내 세그먼트 행 오른쪽만(두 보기 공통). 홈 히어로 2차 버튼은 `showInHero=false`로 미노출
    - **회귀**: `scripts/verify-kium-f44.mjs` 20단언. 기준: `ref/kium/spec/KEESS_kium_과정개요서다운로드_F44_기술명세서_최종_v1.0_261013.md`
  README F42 제목 '게시 스위치 off' → '게시 스위치 off → F44에서 on'
  grep -rn "공개교육_과정소개서\|과정 소개서 받기" components data lib app → 0건

[4. 게이트] npx tsc --noEmit 0 · npm run build 성공·경고 0·/kium 줄 · 추적 부산물 생기면 멈춤
  git status --short: 추적 M 4건(brochure.ts · home.ts · KiumCoursesTab.tsx · README.md) + 미추적 public/downloads PDF

[5. G3 명령 출력 후 멈춤]
  터미널1 (기존 3001 서버 Ctrl+C 후):
    cd "C:\오피스키퍼 예외\workspace\KEESS_law-B"
    npm.cmd run start
  터미널2 (Ready 후):
    cd "C:\오피스키퍼 예외\workspace\KEESS_law-B"
    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $OutputEncoding = [System.Text.Encoding]::UTF8
    $env:BASE="http://localhost:3001"; $env:EXPECT_BYTES="564785"; node scripts/verify-kium-f44.mjs | Tee-Object -FilePath "$env:TEMP\g3.txt"; node scripts/verify-kium-f40.mjs | Tee-Object -FilePath "$env:TEMP\g3.txt" -Append; notepad "$env:TEMP\g3.txt"
  기대: 20/20 + 22/22

[6. 결과 본문(20/20 · 22/22)을 붙여넣으면 커밋 → 푸시까지 사전 승인] 자리표시 문구만 오면 결과 본문 요청
  개별 add 12개:
    lib/kium/brochure.ts · data/home.ts · components/kium/KiumCoursesTab.tsx · README.md
    public/downloads/kgeduone_kium_premium_course_overview_2026.pdf
    scripts/verify-kium-f44.mjs
    ref/kium/spec/KEESS_kium_과정개요서다운로드_F44_UXUI전략_v1.0_261013.md
    ref/kium/spec/KEESS_kium_과정개요서다운로드_F44_기술명세서_최종_v1.0_261013.md
    ref/kium/spec/KEESS_kium_과정개요서다운로드_F44_ClaudeCode_프롬프트_최종_v1.0_261013.md
    ref/kium/spec/KEESS_kium_과정개요서다운로드_F44_ClaudeCode_프롬프트_02_G0재개_261013.md
    ref/kium/spec/KEESS_kium_과정개요서다운로드_F44_ClaudeCode_프롬프트_03_G0판정정정_261013.md
    ref/kium/spec/KEESS_kium_과정개요서다운로드_F44_ClaudeCode_프롬프트_04_최종실행_261013.md
  커밋 금지: ref/kium/brochure/ 2개 파일 전부
  메시지:
    feat(kium): 과정개요서 다운로드 게시 · 서버 파일명 · 표시명 분리 (F44)

    - 서버 kgeduone_kium_premium_course_overview_2026.pdf · 표시명 KG에듀원_2026_인재키움프리미엄_과정개요서.pdf (<a download>) · ?v=261008
    - 게시본: 사업부 개정본(261001) 11과정 · 13쪽 · 단가 포함 원형(10/13 확정) · 552KB
    - 과정안내 세그먼트 행만 노출, 홈 히어로 showInHero=false · 라벨 '과정개요서 받기'
    - 검증: tsc 0 · build 경고 0 · verify-kium-f44 20/20 · verify-kium-f40 22/22 (로컬 프로덕션 서버)
  커밋 후 추적 변경 0 · git fetch law-b · law-b/main..HEAD = 1 · HEAD..law-b/main = 0 이면:
    git push law-b feat/legal-b
    git push law-b feat/legal-b:main
    git fetch law-b → HEAD · law-b/main · law-b/feat/legal-b 해시 일치
  실패 시 재시도·force 금지, 원인과 내 실행 명령 2줄 출력 후 멈춤

[7. G5 명령 출력] (Vercel Ready 후 내가 실행)
  [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $OutputEncoding = [System.Text.Encoding]::UTF8
  $env:BASE="https://law-b.vercel.app"; $env:EXPECT_BYTES="564785"; node scripts/verify-kium-f44.mjs | Tee-Object -FilePath "$env:TEMP\g5.txt"; node scripts/verify-kium-f40.mjs | Tee-Object -FilePath "$env:TEMP\g5.txt" -Append; notepad "$env:TEMP\g5.txt"
  실기기: PC Chrome · iOS Safari · Android Chrome [과정개요서 받기] → 저장명 KG에듀원_2026_인재키움프리미엄_과정개요서.pdf · 13쪽

[최종 보고 표]
| 1 상태 | 2 G0 해시·쪽수·a/b/c·복사 | 3 코드·grep | 4 tsc·build | 5 G3 명령 | 6 커밋·푸시·해시 | 7 G5 대기 |
```
