# Claude Code 빌드 프롬프트 (최종): 법정필수교육 노출 B안 upgrade-04 (HRD사업팀 검토 반영)

- 사전 준비: 아래 4개 파일이 `KEESS_law-B/ref/legal/` 에 있음 (저장 완료)
  - KEESS_26827_사업검토반영_수정전략_v2.0_261006.md
  - PRD_KEESS_26827_legal-B_v1.0_upgrade-04.md
  - TECHSPEC_KEESS_26827_legal-B_v1.0_upgrade-04.md
  - PROMPT_build_legal-B_upgrade-04.md
- 순서: **단계 16** (구조·문구) → 보고 확인 → **단계 17** (폼) → 보고 확인 → **단계 18** (검수·보고·배포)
- 기준 커밋: feat/legal-b ce05d8b
- 목표: 요청자 최종 확인용 배포 → 10/19 오픈

---

## 단계 16. 허브 구조·문구 정리 (커밋 16)

```
[배경]
HRD사업팀 검토 회신 (업무번호 27219, Figma 코멘트 #63~#71) 9건 반영.
의도: 보여줄 수 있는 것만, 약속할 수 있는 만큼만. 신청에서 수료까지 쉬운 법정교육.
이번 증분은 '덜어내기'. 삭제 요청 블록은 플래그 비표시로 보존 (D27).

[문서 숙지 (ref/legal/, 이 순서대로)]
1. KEESS_26827_사업검토반영_수정전략_v2.0_261006.md (소스 실측, 숨은 연동 L1~L9)
2. PRD_KEESS_26827_legal-B_v1.0_upgrade-04.md (LB48~LB57, Q1~Q7 기본값은 요청자 확정. Q2 는 지표 전체 비표시)
3. TECHSPEC_KEESS_26827_legal-B_v1.0_upgrade-04.md (D27~D36, §2~§11)
- 이전 결정 D1~D26, 짝 설계·밸런스·대비·아이콘 규칙 유지
- 문서와 코드가 다르거나 불명확하면 코드 작성 전 보고하고 멈춤

[작업 전 점검]
- git status: 기존 미추적 파일(qa/, ref/kium/...)은 건드리지 않고 커밋에 넣지 않음. stash@{0} 유지
- 기준 화면 캡처 (1440, 880, 390): test-results/legal-b/up04/before/

[커밋 16 범위: LB48~LB53, LB56]
16-1. LB48 진단 비표시 (§2): diagnose.show=false, LegalHub 조건 렌더, 진단 코드·규칙 보존
16-2. LB49 헤더 (§3): needs 표식, 아이콘 키 맵, --lg-n 그리드, 지표 스트립 전체 비표시(statsShow=false) → 버튼 2 (6열 폭)
16-3. LB50 대표 과정 (§4): 제목 교체, 필터·한 번에 담기·.lg-tools 제거, 관련 CSS 정리
16-4. LB51 (§5): law.show=false, StandardAndDiff 블록 2개 분리, #mandatory-diff, kicker '차별점', 카드 2장 c6, D30 CSS
      641~880 미니 타임라인 넘침 확인. 넘치면 하한을 760 으로 바꾸고 보고
16-5. LB52 4단계 (§6): 원고 그대로 (마침표 포함), 키 select/confirm/operate/complete,
      수료 아이콘 후보 award → badge-check → graduation-cap, npm run icons:legal 재생성
16-6. LB53 소개서 메타 줄 삭제 (§7)
16-7. LB56 연동 (§10): 홈 히어로 desc·trust, 플로팅 바 법정 구역 sub, 요약 패널 '과정 둘러보기'

[자체 확인]
- 홈·/content 보이는 글자 검색: '7개', '7 과정', '진단 결과', '공통 추천', '정·부', '월 1회' → 0
- 1440 / 1041 / 1040 / 880 / 641 / 640 / 560 / 390 / 320 가로 스크롤 0
- 짝 높이 비 0.95~1.05: 차별점 2장, 4단계 4장, 자료 블록

커밋: feat(content): 법정 허브 HRD사업팀 검토 반영 (진단·법정 표 비표시, 대표 과정, 4단계, 연동 문구)
- ref/legal 새 문서 4개 포함
절차: npx tsc --noEmit → npm run build → npm run test:unit → commit (Co-Authored-By 유지)
이 단계는 푸시하지 않음

[보고 (짧게)]
- 문서 이해 요약 3줄
- 명세와 다르게 구현한 곳과 이유
- 채택된 수료 아이콘 이름
- 4단계 설명 줄 수 (1440, 1041, 880, 390)
- 차별점 2열 하한 (641 유지 또는 760 변경)
- 삭제 문자열 검색 결과, 전후 캡처 경로, 커밋 해시
보고 후 멈추세요.
```

---

## 단계 17. 법정 폼 인원 필드·희망과정 (커밋 17)

```
[커밋 16 판단]
(여기에 커밋 16 보고에 대한 승인·수정 사항 기입)

[범위: LB54, LB55 (TECHSPEC §8, §9)]
공유 폼(HomeInquiry)은 선택 prop 으로만 바꾼다. prop 미지정 페이지(홈·/kium·/leadership·/hrd)는 동작·마크업·동의문이 한 글자도 바뀌면 안 됨.

17-1. 결함 재현 테스트 먼저 (§9-2)
- 산업안전보건교육 옵션만 추가한 상태에서, 체크 후 과정 카드 담기 시 체크가 풀리는지 E2E 로 재현
- 실패(재현) 확인 결과를 보고에 포함. 재현되지 않으면 그 사실과 근거를 보고하되 조치 2·3 은 그대로 적용

17-2. LB55 희망과정 (§9)
- LEGAL_COURSE_OPTIONS 8개, LEGAL_SYNC_OPTIONS
- CourseFieldConfig.syncOptions, HomeInquiry 동기화 이펙트 부분 덮어쓰기, pick.setFromOptions 동일값 가드
- '기타' 전폭 (D36)

17-3. LB54 인원 필드 (§8)
- INQ.trainees 에 lte300 '~ 300명' 추가 (~ 100명 다음)
- HomeInquiry requiredSlot prop, 필수 키 배열 교체(검증·첫 오류 포커스 2곳), 슬롯 렌더, sizeRow 중복 방지, 'none' 제외, 페이로드 키 유지
- 동의문 consentItems(slot) 함수: '2. 수집 항목' 두 줄만 교체. slot='position' 출력이 기존 문구와 완전 일치
- HubInquiry: requiredSlot="trainees", HIDDEN=['companySize','attachment'], COURSE_FIELD.syncOptions
- 코드 주석: 법정 폼 동의문 변형은 운영 이관 전 정보보호팀 확인 대상

[테스트]
- lib/legal/__tests__/review261006.test.ts (§11-1)
- tests-fi/legal-review-261006.spec.ts (§11-2 1~11). 실제 전송 금지: 검증 차단 경로만 쓰거나 page.route 로 가로채 abort
- tests-fi/uiux-k2.spec.ts 필터 테스트 교체 (§11-3)

커밋: feat(content): 법정 문의 폼 예상 교육인원 필수·산업안전보건교육 희망과정
절차: npx tsc --noEmit → npm run build → npm run test:unit → npm run test:e2e:fi → commit
이 단계는 푸시하지 않음

[보고 (짧게)]
- 결함 재현 결과 (재현 여부, 조치 후 통과)
- 홈 폼 회귀 확인 (직급/직책 필수, 동의문 문자열 동일 여부)
- 법정 폼 3·4 행 정렬 (1440, 880, 390) 캡처
- 테스트 결과 요약 (단위·E2E 통과 수), 커밋 해시
보고 후 멈추세요.
```

---

## 단계 18. 통합 검수 + 배포 + 보고 (커밋 18)

```
[커밋 17 판단]
(여기에 커밋 17 보고에 대한 승인·수정 사항 기입)

[통합 검수 (TECHSPEC §11-4, §11-5)]
- 11폭 실측: 1440 / 1280 / 1041 / 1040 / 880 / 760 / 641 / 640 / 560 / 390 / 320
  - 가로 스크롤 0, 헤더 버튼 2 균등 폭·지표 비표시, 차별점 전환점, 4단계 높이 비·줄 수, 희망과정 2×4 + 기타 전폭, 폼 행 정렬, 터치 44px
- 해시 진입: #mandatory, #mandatory-courses, #mandatory-diff, #mandatory-process, #mandatory-resources, #mandatory-inquiry 착지·포커스
  - 구 앵커 #mandatory-diagnose, #mandatory-law: 오류 없이 허브 상단 착지
- 플로팅 바: /content 법정 구역 문구 교체, 상담 이동·첫 칸 포커스
- 콘솔 오류 0, CLS < 0.05, 외부 요청 images.unsplash.com 만, axe 위반 0 (기존 기준)
- 전후 캡처: test-results/legal-b/up04/after/ (헤더·대표 과정·차별점·4단계·소개서·폼, 1440·880·390)

[REPORT]
- ref/legal/REPORT_legal-B_upgrade-04.md
  - 요청 9건 ↔ LB ↔ 커밋 ↔ 확인 결과 표
  - 연동 정리 L1~L9 결과
  - Q1~Q7 확정값 목록
  - 정보보호팀 확인 대상 (법정 폼 동의문 변형)
  - 운영 이관 메모: 접수 메일 템플릿 직급/직책 빈 값 처리, 인원 '~ 300명' 값(lte300) 수신 측 매핑

커밋: test(legal-b): 검토 반영 통합 검수·보고
절차: npx tsc --noEmit → npm run build → npm run test:unit → npm run test:e2e:fi → commit
푸시 (하나씩, 결과 확인 후 다음):
  1. git push law-b feat/legal-b
  2. git push law-b feat/legal-b:main
  3. git ls-remote law-b
배포 확인: Vercel law-b 배포 완료 대기 → npx playwright test -c playwright.prod.config.ts
- 스모크가 이번 변경(문구·블록 삭제)으로 깨지면 기대값만 갱신하는 별도 커밋으로 처리하고 보고
- 차단·실패 시 우회 금지 후 보고, stash@{0} 유지

[보고 (짧게)]
- 검수 표 (폭별 결과, 앵커, 플로팅 바, 성능·접근성)
- 커밋 16·17·18 해시, 푸시 결과, 배포 URL, 스모크 결과
- 남은 확인 사항 (P1 정보보호팀)
보고 후 멈추세요.
```

---

## 공통 주의
- 확정 원고(4단계, 카드뉴스), 법적 고지, 과정 원문 문구 수정 금지
- 삭제 요청 블록·규칙·데이터 파일 삭제 금지 (플래그 비표시)
- 새 색·토큰·라운드·브레이크포인트 금지, Lucide 단일 세트, 런타임 아이콘 API 호출 금지
- 공유 폼 변경은 선택 prop 으로만, 미지정 페이지 회귀 0
- 실제 문의 전송 금지 (E2E·검수 모두)
- 푸시는 law-b 로만, 명령 3개 하나씩, --force·태그 푸시 금지
- 대시(—, –) 문장부호 사용 금지 (문서·주석·화면 문구)
