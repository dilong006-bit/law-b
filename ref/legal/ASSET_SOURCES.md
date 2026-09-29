# KEESS 법정필수교육 B안 자산 출처 기록 (사진 + 아이콘)

- 업무번호 26827 / 기준: TECHSPEC upgrade-01 §7·결정 D6, TECHSPEC upgrade-02 D15 (IMAGE_SOURCES.md → ASSET_SOURCES.md 이름 변경, 아이콘 절 추가)
- 사진 라이선스: Unsplash License (상업적 사용 가능, 표기 의무 없음, 초상권 동의 미보장). Unsplash+ 유료 사진은 사용하지 않음
- 핫링크라 파일은 저장소에 없음. 교체 시 `data/legalHub.ts` `HUB_COPY.heroSlide.image`, `data/legal.ts` `LEGAL_CARDNEWS[].photo` 의 URL 만 바꾼다

## 아이콘 (B안 upgrade-02, 커밋 12)

| 항목 | 값 |
|---|---|
| 세트 | Iconify Lucide (`@iconify-json/lucide` 1.2.137) |
| 라이선스 | ISC (Lucide Contributors). 표기 의무 없음, 저작권 고지는 이 문서로 갈음 |
| 추출 도구 | `@iconify/utils` 3.1.7 (`getIconData`·`iconToSVG`), devDependency |
| 방식 | 빌드 전 추출 스크립트 `scripts/gen-legal-icons.mjs` (`npm run icons:legal`) → `lib/legal/iconData.ts` 생성. 런타임 외부 요청 없음, 전체 세트는 번들에 들어가지 않음 |
| 규격 | 24px 뷰박스, stroke 1.5 (원본 2 → 1.5 치환), `currentColor` |
| 사용 범위 | /content 법정 허브, 홈 히어로 법정 슬라이드 링크 |

사용 아이콘 27개: search-check, layout-grid, message-circle, clipboard-check, plus, check, minus, x, chevron-left, chevron-right, chevron-up, chevron-down, arrow-right, external-link, refresh-cw, clapperboard, headset, shield-check, list-checks, message-square-text, calendar-check, monitor-play, download, file-text, maximize-2, clock, users

추가 시: 스크립트의 `NAMES` 에 Lucide 이름을 넣고 `npm run icons:legal` 재실행.

## 카드뉴스 임시 실사 4장 (B안 upgrade-02, 커밋 12)

- 받은 날짜 2026-09-29, 모두 임시 (10/12 최종본 수령 시 교체)
- 크롭: 4:5, `lib/legal/unsplash.ts` 가 `w/h/fit=crop` 쿼리와 srcset(640/1080/1600/2000)을 붙인다
- 선정 기준: 무료, 얼굴 비식별, 자연광·따뜻한 중립 톤, 타사 로고·화면 문자 최소, 홈 히어로 사진과 톤 통일

| 장 | 주제 | 선정 사진 페이지 | 작가 | 핫링크 기본 URL |
|---|---|---|---|---|
| 1 | 올해 이수 점검 | https://unsplash.com/photos/macbook-pro-white-ceramic-mugand-black-smartphone-on-table-cckf4TsHAuw | Andrew Neel | https://images.unsplash.com/photo-1499750310107-5fef28a66643 |
| 2 | 담당자가 챙길 일 (서류) | https://unsplash.com/photos/a-laptop-computer-sitting-on-top-of-a-wooden-desk-3q4V539j_bw | 2H Media | https://images.unsplash.com/photo-1631557777232-a2632ae3c67d |
| 3 | 한 곳에 모은 최신 교육 (수강) | https://unsplash.com/photos/macbook-pro-near-white-open-book-FHnnjk1Yj7Y | Nick Morrison | https://images.unsplash.com/photo-1501504905252-473c47e087f8 |
| 4 | 지금 점검 (업무 공간) | https://unsplash.com/photos/office-workspace-with-white-desks-PG8NyM_Mcts | Adolfo Félix | https://images.unsplash.com/photo-1577412647305-991150c7d163 |

### 카드뉴스 후보 비교

| 장 | 후보 | 사진 페이지 | 작가 | 평가 |
|---|---|---|---|---|
| 1 | **선정** cckf4TsHAuw | https://unsplash.com/photos/macbook-pro-white-ceramic-mugand-black-smartphone-on-table-cckf4TsHAuw | Andrew Neel | 원목 책상·메모·펜으로 '점검' 맥락, 히어로와 같은 원목·자연광 톤, 화면 문자 없음 |
| 1 | 1SAnrIxw5OY | https://unsplash.com/photos/macbook-pro-on-top-of-brown-table-1SAnrIxw5OY | Kari Shea | 깔끔하나 노트북만 있어 맥락 정보 없음 |
| 1 | kBtuVD25HAA | https://unsplash.com/photos/macbook-pro-on-brown-wooden-table-kBtuVD25HAA | Paulina Chmolowska | 따뜻한 톤이나 소품이 많아 4:5 에서 초점이 흩어짐 |
| 2 | **선정** 3q4V539j_bw | https://unsplash.com/photos/a-laptop-computer-sitting-on-top-of-a-wooden-desk-3q4V539j_bw | 2H Media | 노트북 옆 서류·펜으로 '담당자 업무' 맥락, 원목 톤, 서류 문자 판독 불가 |
| 2 | 8DEDp6S93Po | https://unsplash.com/photos/tax-forms-and-coffee-on-desk-8DEDp6S93Po | Kelly Sikkema | 서류 맥락은 강하나 세금 양식 문자가 읽히고 톤이 어두움 |
| 2 | snNHKZ-mGfE | https://unsplash.com/photos/stacks-of-paper-documents-and-file-folders-snNHKZ-mGfE | Wesley Tingey | 서류 더미가 '부담'으로 읽혀 카피 톤과 어긋남 |
| 3 | **선정** FHnnjk1Yj7Y | https://unsplash.com/photos/macbook-pro-near-white-open-book-FHnnjk1Yj7Y | Nick Morrison | 노트북·열린 노트·자연광으로 '수강' 맥락, 화면 내용 흐림 |
| 3 | mfB1B1s4sMc | https://unsplash.com/photos/person-sitting-front-of-laptop-mfB1B1s4sMc | Christin Hume | 손·자연광은 좋으나 4:5 크롭에서 노트북이 거의 안 보임 |
| 3 | hBuwVLcYTnA | https://unsplash.com/photos/person-using-macbook-hBuwVLcYTnA | Christin Hume | 타이핑 클로즈업이라 1장·2장과 구도가 겹침 |
| 4 | **선정** PG8NyM_Mcts | https://unsplash.com/photos/office-workspace-with-white-desks-PG8NyM_Mcts | Adolfo Félix | 밝은 오픈 오피스, 인물 원거리로 비식별, '조직 전체 점검' 맥락 |
| 4 | Ugnm0F4e00U | https://unsplash.com/photos/office-workspace-with-rows-of-desks-Ugnm0F4e00U | Petr | 구도는 비슷하나 천장이 어두워 톤이 차가움 |
| 4 | srTPWPbK0Dg | https://unsplash.com/photos/a-room-with-a-desk-and-a-chair-srTPWPbK0Dg | Musemind UX Agency | 개인 집무실 느낌이라 '조직' 맥락이 약함 |

## 차이 카드 '전담 운영 지원' 사진 (B안 upgrade-02 LB39) — 후보만 기록, 미적용 (카드 높이 편차 74.1%)

행 높이 시뮬레이션에서 사진 추가 시 행 높이 +30.1%, 세 카드 높이 편차 74.1% 로 짝 균형 기준을 넘어 적용하지 않았다(커밋 12 보고 승인, LB39 조건대로 확정). 후보만 기록한다.

| 후보 | 사진 페이지 | 작가 | 평가 |
|---|---|---|---|
| VBLHICVh-lI | https://unsplash.com/photos/group-of-people-having-a-meeting-VBLHICVh-lI | Mario Gogh | 원거리·저조도로 얼굴 비식별, 운영 회의 맥락 |
| HXOllTSwrpM | https://unsplash.com/photos/person-sitting-beside-table-HXOllTSwrpM | Ant Rozetsky | 뒷모습 위주, 자연광 |
| YI_9SivVt_s | https://unsplash.com/photos/people-sitting-on-chair-in-front-of-computer-YI_9SivVt_s | Israel Andrade | 운영 센터 느낌이나 모니터 화면이 많음 |

## 빠른 상담 패널 배경 (B안 upgrade-02 LB34·LB39, 커밋 13)

- 받은 날짜 2026-09-29, 임시(사내 촬영본으로 교체 가능). 장식 이미지라 alt 빈 값
- 표시: 1041 이상 다크 패널 전체 cover, 서버 크롭 2:5(세로로 긴 패널) + 오버레이(home.css .hs-scrim 값). 880 이하 숨김
- 선정 기준: 무료, 얼굴 비식별, 상담·협의 맥락, 히어로·카드뉴스와 같은 원목·자연광 톤
- 검색어: business meeting table hands / consultation office / meeting notebook discussion / team discussion laptop office

| 후보 | 사진 페이지 | 작가 | 평가 |
|---|---|---|---|
| **선정** BJqzjxwQhK8 | https://unsplash.com/photos/a-few-people-working-at-a-table-BJqzjxwQhK8 | sarah b | 책상 위 필기하는 손과 노트, 얼굴 프레임 밖. 원목·자연광 톤이 히어로·카드뉴스와 같음 |
| nNMBa7Y1Ymk | https://unsplash.com/photos/two-people-sitting-at-a-table-with-laptops-nNMBa7Y1Ymk | Priscilla Du Preez | 두 사람이 노트북을 함께 보는 협의 장면, 얼굴 비식별. 검은 테이블·차가운 톤이라 톤 통일에서 밀림 |
| 1H1LBKvD7ew | https://unsplash.com/photos/a-man-and-a-woman-sitting-at-a-white-table-1H1LBKvD7ew | Carrie Allen | 정장 차림 서명 장면, 얼굴 비식별. 흰 배경이 밝아 오버레이 위 글자 대비 여유가 적고 계약 느낌이 강함 |

핫링크 기본 URL: https://images.unsplash.com/photo-1668092548064-730e05fd0324 (`data/legalHub.ts` `HUB_COPY.inquiry.photo.src`)

## 과정소개서 표지 (B안 upgrade-02, 커밋 12, 로컬 파일)

| 파일 | 원본 | 크기 | 비고 |
|---|---|---|---|
| public/images/legal/brochure-cover.jpg | `public/downloads` 법정 과정소개서 PDF 1쪽 렌더 (KG에듀원 자사 표지) | 600×338, 약 10KB | 가로 표지라 16:9 로 표시. 가격·과태료 문구 없음. 8쪽은 7개 외 과정이 있어 제외 |

## 신규 (B안 upgrade-01)

| 파일/용도 | 사진 페이지 | 작가 | 받은 날짜 | 핫링크 URL | 임시 여부 |
|---|---|---|---|---|---|
| 홈 히어로 법정 슬라이드 PC (16:9 크롭) | https://unsplash.com/photos/a-person-typing-on-a-laptop-kA50vHmCxbk | Kelly Sikkema | 2026-09-29 | https://images.unsplash.com/photo-1663524789611-2c8330848379?q=80&w=2000&auto=format&fit=crop | 임시, 사내 촬영본으로 교체 가능 |
| 홈 히어로 법정 슬라이드 모바일 (4:5 크롭) | 위와 같음 | Kelly Sikkema | 2026-09-29 | https://images.unsplash.com/photo-1663524789611-2c8330848379?q=80&w=1080&h=1350&auto=format&fit=crop | 임시 |

### 히어로 후보 비교 (2026-09-29, 검색어: office laptop learning / online training laptop / hands laptop office)

| 후보 | 사진 페이지 | 작가 | 평가 |
|---|---|---|---|
| **선정** kA50vHmCxbk | https://unsplash.com/photos/a-person-typing-on-a-laptop-kA50vHmCxbk | Kelly Sikkema | 손과 노트북이 오른쪽, 왼쪽은 노트와 연필이라 텍스트 영역이 비고 '준비·학습' 맥락이 드러남. 원목·자연광의 따뜻한 중립 톤, 얼굴·화면·로고 없음 |
| kRNZiGKtz48 | https://unsplash.com/photos/person-wearing-watch-near-laptop-kRNZiGKtz48 | NordWood Themes | 좌측 여백은 가장 넓으나 흰 배경이 차갑고 맥락 정보가 적음 |
| 1Qc2qcK5kGo | https://unsplash.com/photos/a-close-up-of-a-person-typing-on-a-laptop-1Qc2qcK5kGo | Selina | 창가 자연광이 좋으나 손이 좌측 텍스트 영역에 걸림 |

## 기존 (추적용, 수정 없음)

기존 코드(data/home.ts)에 핫링크 URL 만 있고 사진 페이지·작가 기록은 없음.

| 용도 | 핫링크 URL | 사진 페이지·작가 |
|---|---|---|
| 홈 히어로 brand | https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop | 미기록 |
| 홈 히어로 event | https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop | 미기록 |
| 홈 히어로 new | https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop | 미기록 |
| 홈 히어로 gov | https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop | 미기록 |
| 홈 히어로 case | https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2000&auto=format&fit=crop | 미기록 |
