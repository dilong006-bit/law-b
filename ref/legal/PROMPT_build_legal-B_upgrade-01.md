# Claude Code 빌드 프롬프트: 법정필수교육 노출 B안 upgrade-01

- 사용법: 아래 블록을 **단계별로 하나씩** Claude Code 채팅창에 붙여 넣기. 각 단계는 보고 후 멈춤
- 사전 준비 (사람이 직접): 아래 4개 파일을 `KEESS_law-B/ref/legal/` 에 저장
  - KEESS_26827_법정필수_B안_UIUX전략_upgrade-02_260929.md
  - PRD_KEESS_26827_legal-B_v1.0_upgrade-01.md
  - TECHSPEC_KEESS_26827_legal-B_v1.0_upgrade-01.md
  - PROMPT_build_legal-B_upgrade-01.md
- 확인 URL: https://law-b.vercel.app (main 푸시 시 자동 반영)

---

## 단계 A. 문서 숙지 + 실측 (코드 변경 없음)

```
KEESS 법정필수교육 B안 upgrade-01 을 시작합니다. 기능 추가보다 '섹션 밸런스'가 핵심인 작업입니다.

[읽을 문서, 순서대로]
1. ref/legal/KEESS_26827_법정필수_B안_UIUX전략_upgrade-02_260929.md
2. ref/legal/PRD_KEESS_26827_legal-B_v1.0_upgrade-01.md (LB18~LB31)
3. ref/legal/TECHSPEC_KEESS_26827_legal-B_v1.0_upgrade-01.md
4. 기준 문서: PRD·TECHSPEC B안 v1.0, ref/design/Design.md, CLAUDE.md

[핵심 원칙]
- 기술명세서 §0-1 절대 규칙 10개 + §0-2 밸런스 규칙 B1~B9
- 규칙을 지키려면 콘텐츠를 빼거나 카피를 바꿔야 하는 경우: 코드 작성 전 보고
- 대시 문자 금지, 노출 금지 항목 유지, GNB 변경 금지

[실측, production 빌드, 1440×900 과 390×844]
1. /content 6개 축 섹션 높이 (ax1~ax4, #mandatory, ax6), 법정 제외 5개 중앙값 H, 목표 H×3
2. 허브 현재 블록별 높이 (헤더, 진단, 라인업, 법정 표, 운영, 차별점, 자료, 문의)
3. [data-balance-row] 가 될 행 후보(진단, 자료, 문의)의 형제 높이 차와 빈 공간 비율 현재값
4. /content 다른 축이 쓰는 간격 값 3종 (섹션 내부 블록 사이, 제목과 본문 사이, 카드 사이) 과 해당 CSS 위치
   → TECHSPEC §3 --lg-gap-block / --lg-gap-head / --lg-gap-card 에 쓸 값
5. 다른 축 헤더(AxHead) 와 h3 클래스·크기, 법정 허브 헤더와 차이
6. 홈 히어로: HERO_SLIDES 타입 정의, 슬라이드 수·순서, 이미지 처리(next/image 여부, priority), 오버레이·스크림 유무, 1번 슬라이드 제목 태그(h1/h2)
7. HomeInquiry 필수 필드 목록 (직급/직책 필수 여부), optionalFold 사용처
8. 삭제 예정 파일 사용처 grep: HeroNotice, CampaignBand, OpsSupport, Difference, Resources, LegalCardNews, home-campaign.css
9. P4 옅은 면 color-mix 비율이 기존 코드에 있는지
10. 로컬에서 unsplash.com, images.unsplash.com 접속 가능 여부 (GET 1회만)

[보고 형식]
- 실측 표 (항목 × 값)
- TECHSPEC 와 코드가 다른 곳, 착수 전 결정이 필요한 곳
여기서 멈추세요. 코드 수정 금지.
```

---

## 단계 B. 홈 히어로 법정 슬라이드 + 홈 정리 (커밋 9)

```
단계 A 실측 확인했습니다. [여기에 A 결과에 대한 결정 사항을 붙여 넣기]

기술명세서 §2-1 heroSlide, §2-4, §4, §7 기준으로 커밋 9 를 진행하세요. LB18, LB19, LB29(히어로)

1. 히어로 이미지 (§7)
   - Unsplash 에서 히어로 후보를 찾아 1장 선정, PC 16:9 hero-legal.jpg, 모바일 4:5 hero-legal-m.jpg
   - 얼굴 비식별 컷 우선, 자연광, 타사 로고·화면 없음
   - ref/legal/IMAGE_SOURCES.md 작성 (파일, 용도, URL, 작가, 날짜, 임시 여부)
   - 다운로드 불가 시 우회 금지, 중립 그라데이션 배경으로 두고 보고
2. 법정 슬라이드
   - LEGAL_SEASON.on 이면 HERO_SLIDES 선두, off 면 기존 배열 그대로
   - 슬라이드 타입 확장은 선택 필드만, 기존 슬라이드 렌더 불변
   - 스크림, 버튼 세로 쌓기(760 이하), 1번 이미지만 priority
   - 페이지 h1 1개 유지 (실측 결과대로)
3. 홈 정리
   - HeroNotice, CampaignBand 렌더 제거, 사용처 0 이면 파일 삭제
   - HeroCarousel notice prop 제거, .hero.has-notice 및 사용처 없는 hc- 규칙 제거
   - git diff 3155256 -- app/page.tsx components/sections/home/HeroCarousel.tsx 결과가 슬라이드 확장분만인지 확인

[검증]
- 1440, 1280, 1040, 880, 760, 390, 360, 1366×657 에서 제목·버튼·신뢰 1줄 가림 없음
- 스크림 위 글자 대비 실측값 (제목, 설명, 버튼)
- 자동 넘김, 일시정지, 포커스 순서, reduced-motion
- LEGAL_SEASON.on=false 임시 빌드에서 홈 DOM 이 3155256 과 동일 (확인 후 되돌림)
- 홈 가로 스크롤 0, 금지어 0, 콘솔 오류 0
- 캡처: test-results/legal-b/up01/09/

커밋: feat(home): 법정 히어로 1번 슬라이드·홈 정리
절차: npx tsc --noEmit → npm run build → commit (Co-Authored-By 유지)
하나씩: git push law-b feat/legal-b → git push law-b feat/legal-b:main → git ls-remote law-b
차단 시 우회 금지 후 보고, stash@{0} 유지

[보고] 명세와 다른 곳, 검증 표, 대비 값, 캡처 경로(1440·390), IMAGE_SOURCES 요약, 해시·푸시 결과. 보고 후 멈추세요.
```

---

## 단계 C. 허브 밸런스 기반 + 헤더·진단·과정 타일 (커밋 10)

```
기술명세서 §2-1(head, diagnose, lineup), §2-3, §3, §5, §6-1~§6-3 기준으로 커밋 10 을 진행하세요. LB20~LB23

1. 밸런스 기반 (§3)
   - .lg-row 12열, 분할 클래스, .lg-box 2종, .lg-box-foot, 간격 변수 3개(단계 A 실측값 사용)
   - BlockHead 컴포넌트, data-balance-row 속성
2. HubHead + QuickActions (§6-1)
   - 다른 축 헤더와 같은 컴포넌트·클래스, season·tabs 제거
   - 빠른 상담 항목은 이 단계에서 #mandatory-inquiry 이동 (goConsult 는 커밋 12)
3. Diagnose (§2-3, §6-2)
   - diagnose() 부분 응답 버전, 27조합 기존 결과 동일 + 64조합 테스트
   - 5+7 높이 맞춤, 결과 패널 항상 채움, defaultNote/note 전환
4. CourseLineup (§6-3)
   - CustomTile, span 계산(필터 결과 수 기준), is-wide 가로 배치
   - CourseDetail 하단 '이 과정으로 상담' (이 단계에서는 담기 + #mandatory-inquiry 이동)
   - 인라인 상세 삽입 위치 회귀 확인

[검증]
- 진단 행, 과정 그리드: 형제 높이 차 ≤ 5%, 빈 공간 ≤ 15%
- 과정 그리드 마지막 행 빈 칸 0: 필터 4종 × 1440/1040/880/390
- 3열 구간 7번째 카드 상세 열기 시 삽입 위치
- 헤더 제목 계산값이 다른 축 헤더와 동일
- 9폭 가로 스크롤 0, 44px, 금지어 0, 홈·/kium·다른 축 회귀 0
- 캡처: test-results/legal-b/up01/10/

커밋: feat(content): 허브 밸런스 기반·헤더·진단·과정 타일
절차 동일 (tsc → build → commit → 하나씩 푸시 3개)

[보고] 명세와 다른 곳, 검증 표(밸런스 수치 포함), 캡처 경로, 해시·푸시 결과. 보고 후 멈추세요.
```

---

## 단계 D. 법정 기준·차이·도입 절차·자료 (커밋 11)

```
기술명세서 §2-1(law, diff, process, resources), §2-2, §6-4~§6-6, §7 기준으로 커밋 11 을 진행하세요. LB24~LB26, LB29

1. StandardAndDiff (§6-4)
   - LawTable 그대로 + 차이 카드 3장(4+4+4) + 비교표 펼치기(카드 행 아래 12열)
   - OpsSupport, Difference 삭제 (사용처 0 확인)
2. Process (§6-5)
   - 4단계, 숫자 없는 ol, 아이콘 4종 인라인 SVG 1.5, 연결선 규칙, cta 1개
   - '이수 현황', '수료증', '미이수자' 금지
3. 자료 (§6-6, §7)
   - 카드뉴스 임시 실사 4장 Unsplash 선정 → 1080×1350 크롭 cardnews-01~04.jpg, IMAGE_SOURCES.md 추가
   - 소개서 1쪽 렌더 → brochure-cover.jpg (가격·과태료 수치 있으면 사용 금지, 보고)
   - CardNewsGrid (4열 / 2×2 / 스와이프), CardNewsLightbox (useModal), BrochureBanner (4+8)
   - LEGAL_CARDNEWS_READY=false 또는 로드 실패 시 Empty (점선·문구 없음)
   - Resources.tsx, LegalCardNews 삭제 (사용처 0 확인)

[검증]
- 차이 카드 3장, 도입 절차 4장, 카드뉴스 4장, 소개서 배너: 형제 높이 차 ≤ 5%, 빈 공간 ≤ 15%
- 비교표 펼침 전후 카드 높이 불변, aria-expanded
- 라이트박스: 열기·방향키·ESC·포커스 복귀·스크롤 잠금·reduced-motion
- 560 이하 카드뉴스 스와이프와 1 / 4 표시, 가로 스크롤 검사에서 [data-hscroll] 제외
- 자리표시(점선, '예정', '준비 중') 0
- 소개서 제출 → 성공 화면 링크 동작, prefill 저장 유지
- 9폭 가로 스크롤 0, 44px, 금지어 0, 회귀 0
- 캡처: test-results/legal-b/up01/11/ (특히 자료 블록 1440·880·390)

커밋: feat(content): 법정 기준·차이·도입 절차·자료 재설계
절차 동일

[보고] 명세와 다른 곳, 검증 표, 이미지 5장 출처 요약, 캡처 경로, 해시·푸시 결과. 보고 후 멈추세요.
```

---

## 단계 E. 빠른 상담 + 선택 바 (커밋 12)

```
기술명세서 §2-1(inquiry, tray), §6-7~§6-9 기준으로 커밋 12 를 진행하세요. LB27, LB28, LB31

1. HomeInquiry 선택 prop: hiddenFields, messageRows (미지정 시 기존 100% 동일)
   - optionalFold: 허브 외 사용처 없으면 prop과 코드 제거, 있으면 유지 후 보고
2. HubInquiry: 5+7, 다크 패널(panelTitle, panelBody, panelPoints, 담은 과정 칩 또는 pickedEmpty) + 짧은 폼
   - 표시: 회사·기관명, 담당자명, 연락처, 직급/직책(운영 필수 시), 이메일, 희망과정, 문의 내용(2줄), 동의
   - 비표시: 회사규모, 예상 교육인원, 첨부 (payload 키는 기본값 유지)
3. goConsult (§6-8) 와 진입점 7곳 연결: QuickActions, CustomTile, CourseDetail(시트는 닫은 뒤), Process, 소개서 성공 링크, PickTray, 홈 히어로(해시 진입 포커스)
4. PickTray CTA '빠른 상담'
5. data-ga-id 전체 (PRD LB31 표)

[검증]
- 패널·폼 높이 차 ≤ 5% (1041 이상)
- 흐름 3종: 홈 히어로 빠른 상담 → /content 폼 첫 칸 포커스 / 진단 담기 → 트레이 빠른 상담 → 희망과정 일치 / 상세 '이 과정으로 상담' (인라인·시트 둘 다)
- 검증 5케이스: 희망과정 0개 / 기타 빈칸 / 기타 51자 차단 / 선택 후 해제 재평가 / 정상 제출
- 정상 제출 payload 예시 1건 (더미): 키 구성이 커밋 8 과 동일, lead_source content-legal
- 회귀: 홈·/kium 문의 폼 DOM·검증·payload 기존과 동일
- 390·360: 입력 16px, 44px, 입력 포커스 시 트레이 숨김
- 캡처: test-results/legal-b/up01/12/

커밋: feat(inquiry): 법정 빠른 상담·선택 바
절차 동일

[보고] 명세와 다른 곳, 검증 표, payload 예시, 캡처 경로, 해시·푸시 결과. 보고 후 멈추세요.
```

---

## 단계 F. 밸런스 QA + 최종 보고 (커밋 13)

```
기술명세서 §10 기준으로 검증 스크립트를 확장하고 최종 보고를 작성하세요. LB30

1. scripts/verify-legal-b.mjs 확장 (§10 표 전 항목)
   - 폭: 1440, 1280, 1041, 1040, 881, 880, 760, 390, 360 + 1366×657
   - 대상: 로컬 production 빌드 + https://law-b.vercel.app (배포본은 읽기 항목만, 폼 제출 금지)
2. 결과: test-results/legal-b/up01/13/result.json + 캡처
3. ref/legal/REPORT_legal-B_upgrade-01.md
   - 커밋 9~13 요약, 명세와 다른 곳 전체와 이유
   - §10 결과 표 (항목 × 폭, 로컬·배포)
   - 높이 예산: H, 허브 높이, 블록별 높이 (전후 비교)
   - 남은 확인: 카드뉴스 최종본(10/12, src·alt 교체), 소개서 수정본, 도입 절차 문구(유현경), 운영 지원 3·4번, 법무 검토, 히어로 실사 교체 여부, noindex 해제 시점
4. 실패 항목은 수정하지 말고 원인·수정안만 보고

커밋: test(legal-b): 밸런스 QA·최종 보고
절차 동일

[보고] 결과 표 요약, 실패 항목과 수정안, REPORT 경로, 해시·푸시 결과. 보고 후 멈추세요.
```

---

## 공통 주의
- 한 단계에서 다음 단계 범위 미리 구현 금지
- 공통 컴포넌트는 선택 prop만, 기존 호출부 수정 금지
- 새 색·섀도·라운드·브레이크포인트가 필요해 보이면 코드 작성 전 보고
- 커밋 전 390·1440 확인, tsc·build 실패 상태로 푸시 금지
- 푸시는 law-b 로만, 명령 3개를 하나씩. --force, 태그 푸시 금지
- Bash heredoc 대신 Write·Edit 도구로 파일 작성
