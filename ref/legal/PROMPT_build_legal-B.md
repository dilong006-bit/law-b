# Claude Code 빌드 프롬프트: 법정필수교육 노출 B안 (홈 진입 + /content 법정 허브)

- 사용법: 아래 블록을 **단계별로 하나씩** Claude Code 채팅창에 붙여 넣기
- 각 단계는 끝나면 멈추고 보고. 보고 확인 후 다음 단계 입력
- 기준 문서: `ref/legal/PRD_KEESS_26827_legal-B_v1.0.md`, `ref/legal/TECHSPEC_KEESS_26827_legal-B_v1.0.md`
- 확인 URL: law-b 저장소 Vercel 배포 main (각 단계 통과 커밋이 바로 반영)

---

## 단계 0. 문서 숙지 및 환경 정리

```
KEESS 법정필수교육 노출 B안 빌드를 시작합니다. 완성도가 가장 중요한 작업입니다.

[먼저 읽을 문서, 이 순서대로]
1. CLAUDE.md
2. ref/design/Design.md
3. ref/legal/KEESS_26827_법정필수_B안_UIUX전략_v1.0_260928.md
4. ref/legal/KEESS_26827_법정필수_B안_페이지구성전략_v1.1_260928.md
5. ref/legal/PRD_KEESS_26827_legal-B_v1.0.md
6. ref/legal/TECHSPEC_KEESS_26827_legal-B_v1.0.md
7. ref/spec/KEESS_모바일대응_고도화_기술명세서_및_프롬프트_v1.0_260810.md

[최우선 원칙]
- 원 소스 반응형: 하나의 마크업·CSS로 PC·태블릿·모바일 모두 자연스럽게. 기기별 컴포넌트 분기 금지
- 기술명세서 §0 절대 규칙 10개 준수. 위반이 필요해 보이면 코드를 쓰지 말고 먼저 보고
- 카피는 기술명세서 HUB_COPY 확정본 그대로. 대시 문자 사용 금지
- 과태료 수치, 교육비, 외부 작품명, 확인 전 운영 지원 항목, FAQ 노출 금지
- GNB 변경 금지

[이번 단계 작업: 환경 정리만, 코드 수정 금지]
1. git status 확인
2. 추적 파일 변경만 보관: git stash push -m "kium-wip-before-legal-b"
   (-u 사용 금지. ref/legal 미추적 문서가 함께 보관되면 안 됨)
3. 원격 추가: git remote add law-b https://github.com/dilong006-bit/law-b.git
4. 기존 원격 푸시 차단: origin, newscope, pedu, b-type 각각 git remote set-url --push <name> no_push
5. git push law-b main
6. git checkout -b feat/legal-b
7. npm ci → npm run build 로 기준 빌드 통과 확인
8. ref/legal/ 문서 6개가 그대로 있는지 확인

[보고 형식]
- 문서 이해 요약 7줄 이내 (LB1~LB17 범위, 이번 작업에 영향 큰 절대 규칙, 선택 상태 흐름)
- 환경 정리 결과 (각 명령 성공 여부, git remote -v)
- 기준 빌드 결과
- 착수 전 질문 (있을 때만)
이후 멈추고 대기하세요.
```

---

## 단계 1. law-A 법정 모듈 이식 (커밋 1)

```
기술명세서 §1에 따라 law-A 법정 모듈을 이식하세요.
- git remote add law-a https://github.com/dilong006-bit/keess-law-A.git (푸시 차단: set-url --push law-a no_push)
- git fetch law-a feat/legal-a
- 기술명세서 §1 목록의 파일만 checkout. nav 관련 파일, app/legal, LegalHero·LegalCourses·LegalCourseCard·LegalResources·LegalStandard·LegalInquirySection 은 가져오지 말 것
- law-A styles/legal.css 에서 LegalCardNews, LegalCourseField 가 쓰는 규칙만 styles/legal-hub.css 로 복사

[확인]
- git diff main --stat 으로 변경 범위 보고
- data/nav.ts, components/common/Nav.tsx, styles/components.css 변경 0
- HomeInquiry, ContentModals: 선택 prop·선택 인자 외 변경 없음
- 홈·/kium·/content 화면 변화 없음 (1440, 390 캡처)
- npx tsc --noEmit, npm run build

커밋: chore(legal): law-A 법정 모듈 이식 (데이터·썸네일·희망과정 필드·소개서)
푸시: git push law-b feat/legal-b && git push law-b feat/legal-b:main
보고 후 멈추세요.
```

---

## 단계 2. 검색 노출 차단 (커밋 2)

```
app/layout.tsx metadata 에 robots: { index: false, follow: false } 를 추가하세요 (시안 저장소 전용).
확인: 빌드 후 홈 HTML 에 <meta name="robots" content="noindex, nofollow">
커밋: chore(seo): 시안 사이트 검색 노출 차단
푸시 후 보고하고 멈추세요.
```

---

## 단계 3. 데이터·진단 규칙·선택 상태 (커밋 3)

```
기술명세서 §3, §4에 따라 구현하세요.
- data/legal.ts: LegalKind, kind, kindNote, sessions, short, detail 추가 (§3-1 표 그대로)
  audience·goals 는 ref/legal 소개자료 PDF p.9~15 문장을 의미 변경 없이 존댓말 명사형으로
  성희롱·자금세탁 outline 은 null
  교육비 필드 만들지 않기
- data/legalHub.ts: LEGAL_SEASON, HUB_COPY (§3-2 그대로)
- lib/legal/diagnose.ts: diagnose() (§3-3)
- lib/legal/pick.tsx: PickProvider, usePick (§4)

[확인]
- diagnose() 27개 조합 결과를 표로 출력해 보고 (의무/권고/업종별/smallNote)
- 7개 과정 detail 누락 필드 0
- npx tsc --noEmit, npm run build

커밋: feat(legal-data): B안 데이터·진단 규칙·선택 상태
푸시 후 보고하고 멈추세요.
```

---

## 단계 4. 홈: 히어로 공지 알약·캠페인 밴드 (커밋 4)

```
기술명세서 §5에 따라 구현하세요.
- HeroCarousel 선택 prop notice. 슬라이드 밖 단일 레이어 (.hero-track 앞), 6개 슬라이드 모두 같은 위치
- .hero.has-notice .hs-content 상단 여백으로 겹침 해소 (값은 실측으로 결정, 모든 슬라이드 동일)
- 560 이하 축약 (라벨만), 터치 44px
- CampaignBand: 법정 카드(7fr) + 인재키움 카드(5fr), 760 이하 1열, 1040 이하 법정 카드 내부 세로
- 카드뉴스 재제작본이 없으므로 hc-visual 은 썸네일 2×2 모자이크
- LegalCardNews 에 autoplay('off'|'desktop'), showPlayToggle 선택 prop 추가 (기본값에서 기존 동작 동일)
- LEGAL_SEASON.on=false 이면 알약·법정 카드 모두 미렌더 (기존 홈과 동일)

작성 순서: 390px 먼저 → 넓혀 가며 확인

[확인]
- 6개 슬라이드 × 1440·1024·768·390 에서 알약과 .hs-tag·h1 박스 교차 0, 세로 간격 16px 이상 (수치 표로 보고)
- 760/761, 1040/1041 경계 캡처
- 390 첫 화면: 알약과 히어로 제목이 동시에 보이는지
- LEGAL_SEASON.on=false 로 잠시 바꿔 기존 홈과 동일한지 확인 후 되돌리기

커밋: feat(home): 히어로 공지 알약·캠페인 밴드
푸시 후 보고하고 멈추세요.
```

---

## 단계 5. /content: 진입·허브 골격·헤더·진단 (커밋 5)

```
기술명세서 §6-1 ~ §6-4에 따라 구현하세요.
- data/content.ts: 법정 hex href '#mandatory', badge '2026', AXISNAV id 'mandatory'
- Sections.tsx: 6축 타일 배지, 기존 #ax5 블록을 LegalHub 로 교체
- LegalHub 는 §6-2 구조 그대로. 아직 없는 블록(라인업, 법령, 운영, 차별점, 자료, 문의)은 id 가진 빈 자리만
- #ax5 하위 호환 앵커, 모든 허브 앵커 scroll-margin-top
- HubHead: AxHead 마크업 재사용, 시즌 문구, 탭 칩 4개 (640 이하 가로 스크롤 + 엣지 페이드)
- Diagnose: 네이티브 라디오 칩, 결과 3그룹 + 소규모 안내 + 참고용 문구 + 모두 담기 (aria-live)

[확인]
- /content#mandatory, /content#ax5 직접 진입 시 허브 제목이 고정 헤더에 가리지 않음 (1440, 390)
- 진단: 키보드만으로 3문항 선택 → 모두 담기 가능
- 880/881 경계에서 진단 2열 ↔ 1열
- /content 다른 축(ax1~ax4, ax6) 화면 변화 없음

커밋: feat(content): 법정 허브 골격·헤더·필요 과정 진단
푸시 후 보고하고 멈추세요.
```

---

## 단계 6. 과정 라인업·상세·선택 바 (커밋 6, 핵심 단계)

```
기술명세서 §6-5, §6-10에 따라 구현하세요.

[라인업]
- 필터 칩(전체/법정 의무/권고/업종별), 법정 의무 한 번에 담기
- 카드: 썸네일 16:9, 담기 버튼(우상단 44px, aria-pressed), 구분 배지, 차시, 제목, 대상·주기, 자세히 보기, 맛보기 ↗
- 그리드: 4열 → 1040 이하 3열 → 880 이하 2열 → 560 이하 1열 가로형
- 맛보기 링크: target=_blank, rel="noopener noreferrer", aria-label "(새 창)"

[상세]
- 761 이상: 열린 카드가 속한 행 뒤에 전체 폭 상세 행 삽입 (열 수는 matchMedia 로 계산)
- 760 이하: 바텀시트 (기존 useModal 재사용, 포커스 트랩, ESC, 트리거로 포커스 복귀, 배경 스크롤 잠금, dvh, safe-area)
- /kium 시트 스타일을 공통으로 재사용할 수 있으면 재사용, 불가하면 이유 보고 후 동일 값 복제
- 내용 순서 §6-5 그대로, outline null 이면 섹션 자체 비표시
- 하단 담기 + 맛보기, 이전/다음 과정

[선택 바]
- 표시 조건 4개 모두 (선택 1개 이상, 허브 안, 문의 섹션 밖, 입력 포커스 아님)
- 561 이상 가운데 알약(최대 720px), 560 이하 하단 전체 폭 + safe-area
- body.legal-tray-on 으로 .to-top 위로, .teaser 숨김 (components.css 규칙 추가만)
- 펼침 목록에서 개별 빼기

[확인]
- 1440, 1180, 1024, 820, 768, 390, 360 에서 3번째 카드 상세 열기 캡처 (행 위치 정확한지)
- 760/761 경계에서 인라인 ↔ 시트 전환
- 담기 → 선택 바 N 증가 → 빼기 → 카드 상태 해제
- 390 터치 에뮬레이션: 선택 바와 to-top·teaser 겹침 0, 입력 포커스 시 선택 바 숨김
- 모든 조작부 44px 이상

커밋: feat(content): 과정 라인업·상세 패널·선택 바
푸시 후 보고하고 멈추세요.
```

---

## 단계 7. 법정 기준·운영 지원·차별점·자료 (커밋 7)

```
기술명세서 §6-6 ~ §6-9에 따라 구현하세요.
- LawTable: 같은 데이터로 표(641 이상)와 카드(640 이하), 880 이하 대상·주기 합침, 과태료 열 없음, 기준일·출처·유의 문구
- 괴롭힘은 구분 '권고'로 표시
- OpsSupport: show:true 항목만 (현재 2개)
- Difference: timeline 의 cc 렌더 금지, 차별점 표 + 640 이하 블록
- Resources: 카드뉴스(autoplay off, 자리 표시) + 소개서 패널
  ContentModals 에 선택 콜백 onLeadSubmitted 추가 → setPrefill, 성공 화면 '담은 과정으로 도입 문의하기' 링크

[확인]
- 페이지 텍스트 검색: '과태료' 수치, '만원', '지구오락실', '지구마블', 'Demon Hunters', '이수 현황', '미이수자' 0건
- 소개서 받기 → 제출 성공 → 문의 섹션 이동 시 회사·이름·이메일 자동 채움
- /content 과정리스트 다운로드 기존과 동일 (회귀)
- 640/641, 880/881 경계 캡처

커밋: feat(content): 법정 기준·운영 지원·차별점·자료
푸시 후 보고하고 멈추세요.
```

---

## 단계 8. 법정 문의 연동 (커밋 8)

```
기술명세서 §6-11에 따라 구현하세요.
- HomeInquiry 선택 prop 추가: optionalFold, prefill, courseValue / onCourseChange (미지정 시 기존 완전히 동일)
- optionalFold: 회사규모·예상 교육인원·문의 내용·첨부를 '추가 정보 (선택)' 접기로. 기본 닫힘, 안에 오류가 있으면 자동 열림
- 선택 상태 ↔ 희망과정 체크 양방향 동기화
- leadSource="content-legal", presetInterests=['compliance'], payload 구조 불변

[확인]
- 흐름 테스트: 진단 모두 담기 → 카드 1개 빼기 → 선택 바 문의하기 → 희망과정 체크 일치 → 폼에서 1개 추가 → 카드 담김 표시
- 검증 5케이스 (0개, 기타 빈칸, 51자 차단, 해제 후 재평가, 정상 제출) + payload.message 출력
- 390: 입력 16px, 키보드 열림 시 선택 바 숨김
- 홈·/kium 폼: 필드·접기·payload 기존과 동일 (회귀)

커밋: feat(inquiry): 법정 문의 연동 (선택 동기화·추가 정보 접기·자동 채움)
푸시 후 보고하고 멈추세요.
```

---

## 단계 9. 반응형·품질 검증 (커밋 9)

```
기술명세서 §9에 따라 scripts/verify-legal-b.mjs 를 작성하고 실행하세요.
- npm run build && npm run start 기준
- 폭 9개(1920, 1440, 1280, 1180, 1024, 820, 768, 390, 360) + 경계(1041/1040, 941/940, 881/880, 761/760, 641/640, 561/560)
- 390·360 은 hasTouch, isMobile
- §9 표의 모든 항목 자동 판정
- 캡처: test-results/legal-b/{page}-{폭}.png (전체 페이지) + 상세 펼침, 바텀시트, 선택 바 펼침, 진단 결과 상태

실패 항목은 원인·수정 내용을 적고 수정 후 재실행. 명세 규칙과 충돌하는 수정이 필요하면 멈추고 보고.
모두 통과하면 커밋: test(legal-b): 반응형·흐름 검증 스크립트와 결과
푸시: git push law-b feat/legal-b && git push law-b feat/legal-b:main

[최종 보고]
- 변경·신규 파일 목록
- 검사 결과 표 (항목 × 폭)
- 명세와 다르게 구현한 곳과 이유
- 미해결·확인 필요 사항 (카드뉴스 재제작본, 소개서 수정본, 운영 지원 3·4, FAQ 답변, 법령 검수, 실기기 확인)
```

---

## 공통 주의 (모든 단계에 적용)
- 한 단계에서 다음 단계 범위를 미리 구현하지 않기
- 공통 컴포넌트 수정은 선택 prop 추가만, 기존 호출부 수정 금지
- 새 색·섀도·라운드·브레이크포인트가 필요해 보이면 코드 작성 전 보고
- 커밋 전 항상 390px와 1440px 확인
- tsc·build 실패 상태로 푸시 금지 (main 은 항상 통과본)
- law-b 외 원격으로 푸시 금지
