# Claude Code 프롬프트 v1.0: 인재키움 공개교육 신청 유도 (F40 ~ F43) 빌드 · 푸시 · 배포

> 새 세션에 그대로 붙여넣기. PRD · 기술명세서 · 패치 4개는 Cowork가 레포 `ref/kium/spec/`에 배치 완료. 첨부 불필요.

```
역할: KEESS law-B 레포 담당 시니어 풀스택 개발자
기준: ref/kium/spec/KEESS_kium_공개교육신청유도_F40-F43_기술명세서_v1.0_261007.md (이하 명세)
목표: 패치 4개를 순서대로 적용 · 검증해 기능별 커밋 4건을 만들고 law-b에 배포한다.

[규칙]
- Playwright · 브라우저 실행 금지. 검증 스크립트는 명령만 출력, 실행은 내가 한다
- 3001 프로세스 건드리지 않음 · 명세 외 변경 금지 · 수동 적용 금지(git apply만)
- git add . / -A 금지(파일 개별 add) · force 금지
- 기대값과 다르면 즉시 멈추고 표로 보고. 줄바꿈(CRLF) 차이뿐이면 보고 후 계속

[1. 상태 확인]
  git log --oneline -1 → ffbb02d
  git status --short → 추적 변경 0 (미추적 qa/ · _superseded/ 등은 무시)
  sha256sum ref/kium/spec/KEESS_kium_*_F4*.patch → 명세 §6-1 4건 일치

[2. 패치 ① ~ ④ 순차 적용 · 커밋] 각 단계 같은 절차, 멈추지 않고 진행
  a) git apply --check <패치> → git apply <패치>
  b) git diff --stat (신규 파일은 git status로 확인) → 명세 §1 파일 목록과 일치
  c) sha256sum → 명세 §6-2 해당 단계 값과 일치
  d) npx tsc --noEmit → 0
  e) 개별 add 후 커밋

  ① ref/kium/spec/KEESS_kium_1_F43_상단CTA.patch
    add: components/kium/KiumHero.tsx · components/kium/KiumHeroCta.tsx · components/kium/KiumTabs.tsx
         components/kium/KiumCoursesTab.tsx · lib/kium/gotoOpen.ts · README.md
         ref/kium/spec/KEESS_kium_1_F43_상단CTA.patch
    메시지:
      feat(kium): 상단 CTA 공개교육 신청하기 · 문의하기 교체, 공개교육 바로가기 (F43)

      - 1차 [공개교육 신청하기] → 과정안내 탭 + 공개교육 보기 전환 후 목록 위치 이동
      - 2차 [문의하기] → #inq · 구 라벨 신청 문의 · 지원대상 확인 제거(상단)
      - ?tab=courses 딥링크 착지(상담 딥링크 제외)

  ② ref/kium/spec/KEESS_kium_2_F41_GNB칩.patch
    add: styles/components.css · README.md · ref/kium/spec/KEESS_kium_2_F41_GNB칩.patch
    메시지:
      feat(nav): 인재키움 프리미엄 칩 확대 · 반짝임 2회 후 정지 (F41)

      - 14px · 36px · 히트 44px 유지
      - 7s 무한 반복 → 4.8s 내 종료(WCAG 2.2.2) · hover/포커스 1회 · 모션 줄이기 시 없음

  ③ ref/kium/spec/KEESS_kium_3_F40_히어로공개교육.patch
    add: data/home.ts · components/sections/home/HeroCarousel.tsx · lib/kium/sessions.ts
         styles/home.css · app/layout.tsx · README.md · ref/kium/spec/KEESS_kium_3_F40_히어로공개교육.patch
    메시지:
      feat(home): 히어로 인재키움 공개교육 슬라이드 · 첫 장 교차 C안 (F40)

      - 정부지원 슬라이드 → 공개교육 슬라이드(HRD사업팀 원고), 종전 슬라이드 KIUM_GOV_SLIDE 보존
      - HERO_START='alternate': 접속마다 법정 ↔ 공개교육 첫 장 교차, 깜빡임 0
      - 다음 개강 배지 자동 · 키보드 포커스 시 자동 넘김 정지

  ④ ref/kium/spec/KEESS_kium_4_F42_과정소개서.patch
    add: lib/kium/brochure.ts · data/home.ts · components/sections/home/HeroCarousel.tsx
         components/kium/KiumCoursesTab.tsx · styles/kium-open.css · scripts/verify-kium-f40.mjs · README.md
         ref/kium/spec/KEESS_kium_4_F42_과정소개서.patch
         ref/kium/spec/KEESS_kium_공개교육신청유도_F40-F43_PRD_v1.0_261007.md
         ref/kium/spec/KEESS_kium_공개교육신청유도_F40-F43_기술명세서_v1.0_261007.md
         ref/kium/spec/KEESS_kium_공개교육신청유도_F40-F43_ClaudeCode_프롬프트_v1.0_261007.md
    메시지:
      feat(kium): 과정 소개서 다운로드 게시 스위치(off) · 통합 검증 스크립트 (F42)

      - lib/kium/brochure.ts ready=false: 개정본 수령 전 버튼 DOM 0
      - 노출 위치: 홈 공개교육 슬라이드 2차 버튼 · 과정안내 세그먼트 행
      - scripts/verify-kium-f40.mjs 22단언(F40~F43)

  커밋 후: git log --oneline -5 · git status --short → 추적 변경 0

[3. 빌드 게이트]
  npm run build
  - 성공 · 경고 0 · `/` · `/kium` 줄 표시 → 4로
  - exit 134 등 메모리 부족 → 재시도 금지. B안(사전 승인): Cowork 클라우드 빌드 통과분과 바이트 일치 확인됨 → 4 생략하고 5로
  - 그 외 실패 → 멈춤 · 로그 마지막 30줄 보고
  - 빌드가 추적 파일을 바꾸면 멈춤

[4. G3 명령 출력 후 멈춤] (빌드 성공 시만)
  터미널1 (기존 3001 서버 Ctrl+C 후):
    cd "C:\오피스키퍼 예외\workspace\KEESS_law-B"
    npm.cmd run start
  터미널2 (Ready 후):
    cd "C:\오피스키퍼 예외\workspace\KEESS_law-B"
    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $OutputEncoding = [System.Text.Encoding]::UTF8
    $env:BASE="http://localhost:3001"; node scripts/verify-kium-f40.mjs | Tee-Object -FilePath "$env:TEMP\g3.txt"; node scripts/verify-kium-f39.mjs | Tee-Object -FilePath "$env:TEMP\g3.txt" -Append; node scripts/verify-legal-lb58.mjs | Tee-Object -FilePath "$env:TEMP\g3.txt" -Append; notepad "$env:TEMP\g3.txt"
  기대: 22/22 · 30/30 · 7/7
  내가 결과 본문을 붙여넣으면 5로(사전 승인). 자리표시 문구만 오면 진행하지 말고 결과 본문을 요청한다

[5. 푸시] 조건 전부 충족 시 즉시 실행
  git fetch law-b → law-b/main..HEAD = 4건 · HEAD..law-b/main = 0건 · 추적 변경 0
  git push law-b feat/legal-b
  git push law-b feat/legal-b:main
  git fetch law-b → HEAD · law-b/main · law-b/feat/legal-b 해시 일치
  실패 시 재시도 · force 금지, 원인과 내가 실행할 명령 2줄 출력 후 멈춤

[6. G5 명령 출력] (Vercel Ready 후 내가 실행)
  [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $OutputEncoding = [System.Text.Encoding]::UTF8
  $env:BASE="https://law-b.vercel.app"; node scripts/verify-kium-f40.mjs | Tee-Object -FilePath "$env:TEMP\g5.txt"; node scripts/verify-kium-f39.mjs | Tee-Object -FilePath "$env:TEMP\g5.txt" -Append; node scripts/verify-legal-lb58.mjs | Tee-Object -FilePath "$env:TEMP\g5.txt" -Append; notepad "$env:TEMP\g5.txt"
  수동 확인 4건: 명세 §7-4

[최종 보고 표]
| 단계 | 결과 |
| 1 상태 · 패치 해시 | |
| 2 ①~④ 적용 · 해시 · tsc · 커밋 해시 | |
| 3 build (성공 / B안) | |
| 4 G3 | 성공 시 결과 · B안이면 생략 |
| 5 푸시 · 해시 3종 | |
| 6 G5 | 대기(사용자 실행) |
```
