# Claude Code 프롬프트 최종 v1.0: F45 과정 소개서 라벨 · 메타 고도화 (자동 배포)

> 새 세션 또는 F44 세션에 붙여넣기. 검증 · 커밋 · 푸시 · 배포 확인까지 무중단.

```
역할: KEESS law-B 레포 담당 시니어 풀스택 개발자
기준: ref/kium/spec/KEESS_kium_과정소개서라벨_F45_전략및기술명세서_v1.0_261013.md (먼저 전문을 읽는다)
목표: /kium 과정 소개서 링크 라벨을 「과정 소개서 받기」로, 용량 메타를 「(PDF 552KB)」 12px · 400 · #6b7079로 바꾸고 law-b에 배포한다.
전 단계 사전 승인. 멈추는 경우는 검증 FAIL · 푸시 거부 · 기대값 불일치 3가지뿐.

[규칙] 3001 프로세스 손대지 않음 · 명세 외 변경 금지 · git add . / -A 금지 · Playwright 금지

[1. 상태]
  HEAD fa07e0a · 추적 변경: scripts/verify-kium-f44.mjs 1건만 M (Cowork 갱신본) · law-b/main 앞섬 0 · 뒤처짐 0
  해시(명세 §7): brochure.ts 0e1a0711… · KiumCoursesTab.tsx 8c7e515d… · kium-open.css 995549d6… · README.md 430be9b8…
  sha256sum scripts/verify-kium-f44.mjs → 3579b66b26e847aaec1457e802279c1b3f7f5341f7ca5840e5883bdfc574b925

[2. 코드] 명세 §5 그대로
  lib/kium/brochure.ts: label '과정 소개서 받기' · sizeLabel 'PDF 552KB' · 주석 [F42 · F44 · F45] (§5-1)
  components/kium/KiumCoursesTab.tsx: 메타 span 1줄만 템플릿 문자열 `(${sizeLabel})`로 교체 · 라벨 줄 무변경 · 주석 F45 (§5-2)
  styles/kium-open.css: .kium-brochure .meta 1줄 교체 + 주석 (§5-3)
  README.md 작업 이력 최상단:
    ### ★ 인재키움 과정 소개서 라벨 · 메타 고도화 (F45 · 261013)
    - **라벨**: `과정개요서 받기` → `과정 소개서 받기`(고객 용어 · 법정 `과정소개서 받기`와 동사 패턴 통일). 다운로드 파일명은 과정개요서 유지
    - **메타**: `PDF · 552KB`(12px · 600) → `(PDF 552KB)`(12px · 400 · #6b7079 · AA 4.77:1 · tabular-nums)
    - **회귀**: `scripts/verify-kium-f44.mjs` 22단언(D7 · D8 · R1 갱신 + C1 · C2 신설). 기준: `ref/kium/spec/KEESS_kium_과정소개서라벨_F45_전략및기술명세서_v1.0_261013.md`
  grep -rn "과정개요서 받기" components data lib app → 0건

[3. 게이트] npx tsc --noEmit 0 · npm run build 성공 · 경고 0 · 추적 부산물 0
  .next/server/app/kium.html grep: 「과정 소개서 받기」 1건 · 「(PDF 552KB)」 1건 · 「과정개요서 받기」 0건

[4. G3 자동 (:3005)]
  npx next start -p 3005 > <scratchpad>/g3.log 2>&1 & → 최대 30초 폴링 /kium 200
  BASE=http://localhost:3005 EXPECT_BYTES=564785 node scripts/verify-kium-f44.mjs → 22/22
  BASE=http://localhost:3005 node scripts/verify-kium-f40.mjs → 22/22
  종료: netstat -ano 의 :3005 LISTENING PID만 taskkill //PID <pid> //F
  종료 시 Node UV_HANDLE_CLOSING assertion(exit 127)은 단언 전부 PASS면 통과로 본다

[5. 커밋] 개별 add 7개
    lib/kium/brochure.ts · components/kium/KiumCoursesTab.tsx · styles/kium-open.css · README.md
    scripts/verify-kium-f44.mjs
    ref/kium/spec/KEESS_kium_과정소개서라벨_F45_전략및기술명세서_v1.0_261013.md
    ref/kium/spec/KEESS_kium_과정소개서라벨_F45_ClaudeCode_프롬프트_최종_v1.0_261013.md
  메시지:
    feat(kium): 과정 소개서 링크 라벨 · 용량 메타 고도화 (F45)

    - 라벨 '과정개요서 받기' → '과정 소개서 받기' (다운로드 파일명 유지)
    - 메타 'PDF · 552KB' 600 → '(PDF 552KB)' 400 · #6b7079 (AA 4.77:1)
    - 검증: tsc 0 · build 경고 0 · verify-kium-f44 22/22 · verify-kium-f40 22/22 (:3005)
  커밋 후 추적 변경 0

[6. 푸시] law-b/main..HEAD = 1 · HEAD..law-b/main = 0 확인 후
  git push law-b feat/legal-b · git push law-b feat/legal-b:main · 해시 3종 일치. 거부 시 force 금지 · 보고 후 멈춤

[7. Vercel · G5 자동]
  30초 간격 최대 20회: curl -s https://law-b.vercel.app/kium | grep -c "(PDF 552KB)" ≥ 1
  반영 즉시 BASE=https://law-b.vercel.app 로 f44(EXPECT_BYTES=564785) 22/22 · f40 22/22

[최종 보고 표]
| 1 상태·해시 | 2 코드·grep | 3 tsc·build·HTML | 4 G3 | 5 커밋 | 6 푸시·해시 | 7 반영 시각·G5 |
```
