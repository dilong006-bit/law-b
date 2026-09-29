# Claude Code 빌드 프롬프트: 법정필수교육 노출 B안 upgrade-02

- 사용법: 아래 블록을 **단계별로 하나씩** 붙여 넣기. 각 단계는 보고 후 멈춤
- 사전 준비 (사람이 직접): 아래 5개 파일을 `KEESS_law-B/ref/legal/` 에 저장
  - KEESS_26827_법정필수_B안_UIUX전략_upgrade-03_260929.md
  - KEESS_26827_자료블록_밸런스_레퍼런스분석_v1.0_260929.md
  - PRD_KEESS_26827_legal-B_v1.0_upgrade-02.md
  - TECHSPEC_KEESS_26827_legal-B_v1.0_upgrade-02.md
  - PROMPT_build_legal-B_upgrade-02.md
- 확인 URL: https://law-b.vercel.app

## 진행 순서
| 단계 | 커밋 | 내용 |
|---|---|---|
| 커밋 11 | 11 | 이미 전달한 입력 그대로 (히어로 2차 버튼 대비, 밸런스 기반, 헤더, 진단, 과정 타일). 보고를 받은 뒤 아래 단계 12 진행 |
| 단계 12 | 12 | 아이콘 시스템(Iconify) + 법정 기준·차이 + 도입 절차 + 카드뉴스 스토리 + 소개서 카드 |
| 단계 13 | 13 | 요약형 빠른 상담 + 선택 바 |
| 단계 14 | 14 | 짝 설계·상용화 검수 + 최종 보고 |

- 커밋 11 보고에서 명세와 다른 곳이 있으면 단계 12 입력 맨 앞 [커밋 11 판단] 칸에 승인·수정 내용을 적어 붙여 넣기

---

## 단계 12. 아이콘 시스템 + 법정 기준·도입 절차·카드뉴스 스토리 (커밋 12)

```
[커밋 11 판단]
(여기에 커밋 11 보고에 대한 승인·수정 사항 기입)

[이번 기준 문서]
- ref/legal/KEESS_26827_법정필수_B안_UIUX전략_upgrade-03_260929.md
- ref/legal/PRD_KEESS_26827_legal-B_v1.0_upgrade-02.md (LB32~LB39)
- ref/legal/TECHSPEC_KEESS_26827_legal-B_v1.0_upgrade-02.md (D10~D15, §2~§7, §10~§13)
- upgrade-01 문서와 §13 결정 D1~D9 는 그대로 유효. upgrade-01 의 LB26(가로 갤러리·배너)은 폐기

[핵심 의도]
- 바로 상용화 가능한 수준: 아이콘은 Iconify 단일 세트, 실사는 Unsplash 를 정해진 곳에 최대한 품질 있게
- 빈 공간은 여백이 아니라 기능으로 채운다 (짝 설계: media-nav, peer)
- 새 색·폰트·섀도·라운드·브레이크포인트 금지. 필요해 보이면 코드 작성 전 보고

12-0. 아이콘 시스템 (LB38, D10, TECHSPEC §3)
- devDependencies: @iconify-json/lucide, @iconify/utils 설치 (npm)
- scripts/gen-legal-icons.mjs 작성, package.json 에 "icons:legal" 추가, 실행해 lib/legal/iconData.ts 생성·커밋
- 없는 아이콘 이름이 나오면 같은 의미의 Lucide 이름으로 바꾸고 보고
- components/legal-hub/icons.tsx 를 LgIcon 래퍼로 교체, 허브 전체와 홈 법정 슬라이드의 아이콘을 §3-3 매핑으로 교체
- 허브 밖(GNB, 푸터, 다른 축) 아이콘 변경 금지
- 런타임 Iconify API·세트 전체 번들 금지 (빌드 산출물에 lucide 전체 JSON 이 들어가지 않았는지 확인)
- 교체 전후 캡처 비교 (빠른 실행, 과정 카드 담기, 상세 패널, 트레이)

12-1. 법정 기준 + 차이 (LB24, TECHSPEC upgrade-01 §6-4)
- LawTable 유지 + 차이 카드 3장(4+4+4, data-pair="peer") + 비교표 펼치기(카드 행 아래 12열)
- OpsSupport, Difference 삭제 (사용처 0 확인)
- 운영 카드 상단 사진(LB39): 넣었을 때 카드 3장 높이 차가 5% 를 넘으면 넣지 말고 보고

12-2. 도입 절차 독립 블록 (LB35)
- #mandatory-process, BlockHead(도입 절차 / 신청부터 운영까지 4단계), 4단계 카드(data-pair="peer") + 연결선, 숫자 없음, 1차 버튼 1개
- '이수 현황', '수료증', '미이수자' 금지

12-3. Unsplash 사진 (LB39, D11, TECHSPEC §4)
- lib/legal/unsplash.ts, LgPhoto (기존 Img 에 선택 prop 추가로 가능하면 그 방법 우선)
- 사진 선정: 카드뉴스 임시 4장, 운영 카드 1장 (상담 패널 사진은 커밋 13)
  - 용도별 후보 2~3장 비교 후 선정, 기준: 무료(Unsplash+ 제외), 얼굴 비식별, 자연광·따뜻한 중립 톤, 타사 로고·화면·문자 최소, 히어로 사진과 톤 통일, 기존 사진 ID 중복 금지
- ref/legal/IMAGE_SOURCES.md → ASSET_SOURCES.md 이름 변경, 사진 절 추가 + 아이콘 절(세트, 버전, 라이선스 ISC, 사용 아이콘 목록) 추가

12-4. 카드뉴스 스토리 + 소개서 카드 (LB32, LB33, TECHSPEC §5, §6)
- data/legal.ts LEGAL_CARDNEWS: { photo, alt, title, summary } 4개 (문구는 TECHSPEC §2-1 그대로)
- CardNewsStory: 좌 4열 뷰어(data-height-owner) + 우 8열 목차 + BrochureCard, data-pair="media-nav"
  - 모든 폭 같은 scroll-snap 트랙, 881 이상 피크 없음, 880 이하 86% 피크 + 캡션
  - index 1개로 뷰어·목차·캡션·라이트박스 동기화, 끝에서 비활성, 자동 넘김 없음
  - 881~1040: 5+7, 요약 줄 숨김 / 880 이하: 목차 숨김, 뷰어 최대 480px 가운데
- CardNewsLightbox: useModal, ESC·방향키·포커스 복귀·스크롤 잠금, 닫을 때 index 반영
- BrochureCard: 표지(PDF 1쪽 렌더 brochure-cover.jpg, 가격·과태료 수치 있으면 사용 금지 후 보고) + 제목 + 담긴 내용 3 + meta + 과정소개서 받기(블록 유일 1차 버튼)
  - 게이트 모달·자동 채움·성공 링크 기존 로직 재사용
- Resources.tsx, LegalCardNews 삭제 (사용처 0 확인)
- 블록 순서: 헤더 → 진단 → 과정 → 법정 기준·차이 → 도입 절차 → 자료 → 문의(기존, 커밋 13 에서 교체)

[검증]
- 자료 행: 1440·1280·1040 에서 좌우 높이 비 0.95~1.05, 우측 채움 ≥ 0.85 (현재 높이 차 219.5%, 빈 공간 40.8%)
- 차이 카드 3장·도입 절차 4장: 높이 비 0.95~1.05, 비교표 펼침 전후 카드 높이 불변
- 인덱스 동기화: 목차 클릭 / 이전·다음 / 880 이하 스와이프 / 라이트박스 이동 후 4곳 일치
- 라이트박스 접근성: ESC, 방향키, 포커스 복귀, 배경 스크롤 잠금, reduced-motion
- 아이콘: 허브·법정 슬라이드 아이콘 전부 svg.lg-ico, 계산 stroke-width 1.5, api.iconify.design 요청 0
- 사진: srcset 존재, 사용처 외 Unsplash 0, images.unsplash.com 차단 시 깨진 이미지 0·목차 정상
- 허브 높이 추이 (1440·390, 블록별): D1 예산 대비
- CLS 합 < 0.05 (/content), 콘솔 오류·경고 0
- 9개 폭 가로 스크롤 0 ([data-hscroll] 제외), 44px, 금지어 0, 홈·/kium·다른 축 회귀 0
- 캡처: test-results/legal-b/up02/12/ (자료 1440·1040·390, 차이 1440·390, 도입 절차 1440·390, 아이콘 전후)

커밋: feat(content): 아이콘 시스템·법정 기준·도입 절차·카드뉴스 스토리
절차: npx tsc --noEmit → npm run build → commit (Co-Authored-By 유지)
하나씩: git push law-b feat/legal-b → git push law-b feat/legal-b:main → git ls-remote law-b
차단 시 우회 금지 후 보고, stash@{0} 유지

[보고 (짧게)]
- 명세와 다르게 구현한 곳과 이유
- 사진 선정 표 (용도, 후보, 선정 이유), 아이콘 매핑 변경분
- 검증 표 (밸런스 수치 포함), 허브 높이 추이
- 캡처 경로, 커밋 해시와 푸시 결과
보고 후 멈추세요.
```

---

## 단계 13. 요약형 빠른 상담 + 선택 바 (커밋 13)

```
[커밋 12 판단]
(여기에 커밋 12 보고에 대한 승인·수정 사항 기입)

기준: TECHSPEC upgrade-02 §2-2(inquiry), §8, upgrade-01 §6-7~§6-9. LB27, LB34, LB39(상담 사진), LB28, LB31

13-1. HomeInquiry 선택 prop (upgrade-01 §6-7)
- hiddenFields, messageRows 추가 (미지정 시 기존 100% 동일)
- optionalFold 제거 (허브 외 사용처 0 확인됨)
- 표시: 회사·기관명, 담당자명, 연락처, 직급/직책(필수), 이메일, 희망과정, 문의 내용(2줄, 선택), 동의
- 비표시: 회사규모, 예상 교육인원, 첨부 (payload 키는 기본값 유지)

13-2. ConsultSummary 패널 (LB34, TECHSPEC §8)
- 5+7, data-pair="summary-action", data-sticky-summary, 폼이 data-height-owner
- 사진: Unsplash 상담·협의 장면 1장 (후보 2~3장 비교, 얼굴 비식별), 오버레이로 흰 글자 4.5:1 이상
  - 오버레이 값은 기존 다크 오버레이 값 중 조건 만족하는 것 사용, 새 값이 필요하면 보고
- 내용: panelTitle, promises 2줄(clock, users 아이콘), 담은 과정 요약(과정명 + 빼기 44px), 0개면 pickedEmpty + 공통 추천 4과정 담기(보조 버튼)
- 1041 이상 내부 sticky(top 141px), 패널 내용이 innerHeight - 160 보다 크면 sticky 해제
- 880 이하: 사진·약속 숨김, 폼 위 요약 바(담은 과정 N개 + 칩 가로 스크롤)
- ASSET_SOURCES 에 상담 사진 추가

13-3. goConsult 와 진입점 (upgrade-01 §6-8)
- QuickActions, CustomTile, CourseDetail(시트는 닫은 뒤), Process, 소개서 성공 링크, PickTray, 홈 히어로(해시 진입 시 첫 칸 포커스)
- PickTray CTA '빠른 상담'

13-4. data-ga-id 전체 (PRD upgrade-01 LB31 + upgrade-02 §3-10)

[검증]
- 빠른 상담 행: 과정 3개 담은 상태에서 패널 콘텐츠 ≥ 폼 높이 45%, 폼 끝까지 스크롤하는 동안 담은 과정 요약이 뷰포트 안 (현재 패널 채움 19%)
- 동기화: 패널 빼기 ↔ 폼 체크 ↔ 카드 담김 ↔ 트레이 4곳 일치, 공통 추천 담기 후 4개 반영
- 흐름 3종: 홈 히어로 빠른 상담 → /content 폼 첫 칸 포커스 / 진단 담기 → 트레이 빠른 상담 → 희망과정 일치 / 상세 '이 과정으로 상담' (인라인·시트)
- 검증 5케이스: 희망과정 0개 / 기타 빈칸 / 기타 51자 차단 / 선택 후 해제 재평가 / 정상 제출
- 정상 제출 payload 예시 1건 (더미): 키 구성이 커밋 8 과 동일, lead_source content-legal
- 오버레이 위 글자 대비 실측, 다크 면 위 버튼 글자 4.5:1 (D9)
- 회귀: 홈·/kium 문의 폼 DOM·검증·payload 동일
- 390·360: 입력 16px, 44px, 입력 포커스 시 트레이 숨김
- CLS < 0.05, 콘솔 0, 9폭 가로 스크롤 0, 금지어 0
- 캡처: test-results/legal-b/up02/13/ (1440 과정 3개 담은 상태·스크롤 중, 390 요약 바, 오류 상태)

커밋: feat(inquiry): 요약형 빠른 상담·선택 바
절차 동일 (tsc → build → commit → 하나씩 푸시 3개)

[보고 (짧게)] 명세와 다른 곳, 사진 선정, 검증 표, payload 예시, 캡처 경로, 해시·푸시 결과. 보고 후 멈추세요.
```

---

## 단계 14. 짝 설계·상용화 검수 + 최종 보고 (커밋 14)

```
[커밋 13 판단]
(여기에 커밋 13 보고에 대한 승인·수정 사항 기입)

기준: TECHSPEC upgrade-02 §12, upgrade-01 §10. LB37

1. scripts/verify-legal-b.mjs 확장 (§12 전 항목 + upgrade-01 §10 전 항목)
   - 폭: 1440, 1280, 1041, 1040, 881, 880, 760, 390, 360 + 1366×657
   - 대상: 로컬 production 빌드 + https://law-b.vercel.app (배포본은 읽기 항목만, 폼 제출 금지)
   - 외부 요청 도메인 수집, CLS 측정, 콘솔 오류·경고 수집, images.unsplash.com 차단 시나리오
2. 결과: test-results/legal-b/up02/14/result.json + 캡처
3. ref/legal/REPORT_legal-B_upgrade-02.md
   - 커밋 10~14 요약, 명세와 다른 곳 전체와 이유
   - §12 결과 표 (항목 × 폭, 로컬·배포)
   - 밸런스 전후 비교: 자료 행(219.5% → ?), 상담 패널 채움(19% → ?), 진단 결과 채움(9% → ?), 허브 높이(5120 → ?)
   - 자산 목록: 사진 전체(신규·기존), 아이콘 세트·버전·목록·라이선스
   - 사이트 공통 개선 항목: 히어로 h1 다수, .hs-tag 대비, 기존 사진 출처 미기록
   - 오픈 전 남은 확인: 카드뉴스 최종본(10/12, photo·alt·title·summary 교체), 소개서 수정본(표지 재렌더), 도입 절차 문구(유현경), 운영 지원 3·4번, 법무 검토, 히어로 사진 교체 여부, noindex 해제 시점, 실기기 3종 확인
   - 교체 방법 1줄씩 (카드뉴스, 소개서·표지, 사진 교체, 아이콘 추가: icons:legal 스크립트)
4. 실패 항목은 수정하지 말고 원인·수정안만 보고

커밋: test(legal-b): 짝 설계·상용화 검수·최종 보고
절차 동일

[보고] 결과 표 요약, 전후 비교 수치, 실패 항목과 수정안, REPORT 경로, 해시·푸시 결과. 보고 후 멈추세요.
```

---

## 공통 주의
- 한 단계에서 다음 단계 범위 미리 구현 금지
- 공통 컴포넌트는 선택 prop 만, 기존 호출부 수정 금지
- 새 색·섀도·라운드·브레이크포인트·오버레이 값이 필요해 보이면 코드 작성 전 보고
- 커밋 전 390·1440 확인, tsc·build 실패 상태로 푸시 금지
- 푸시는 law-b 로만, 명령 3개를 하나씩. --force, 태그 푸시 금지
- Bash heredoc 대신 Write·Edit 도구로 파일 작성
- 사진은 Unsplash 무료 사진만, 아이콘은 Lucide 1세트만. 다른 출처 필요 시 보고
