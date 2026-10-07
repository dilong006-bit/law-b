# 기술명세서: 인재키움 공개교육 신청 유도 (F40 ~ F43) v1.0

| 항목 | 내용 |
|---|---|
| 작성 | 2026-10-07 · HRD사업지원팀 임지홍 |
| 근거 | `ref/kium/spec/KEESS_kium_공개교육신청유도_F40-F43_PRD_v1.0_261007.md` |
| 레포 | KEESS_law-B · `feat/legal-b` → law-b(`feat/legal-b`, `main`) → https://law-b.vercel.app |
| 기준 HEAD | `ffbb02d` · 추적 변경 0 |
| 구현 상태 | Cowork 클라우드 클론에서 구현 · 빌드 · 실측 완료 → 패치 4개로 전달 |
| 규모 | 15파일 · +448 / −52 (신규 4: gotoOpen.ts · KiumHeroCta.tsx · brochure.ts · verify-kium-f40.mjs) |

## 1. 커밋 구성 (순서 고정 · 기능별 독립 원복)

| # | 패치 | 기능 | 파일 |
|---|---|---|---|
| ① | `KEESS_kium_1_F43_상단CTA.patch` | /kium 상단 CTA · 공개교육 바로가기 · 딥링크 착지 | KiumHero.tsx · KiumHeroCta.tsx(신규) · KiumTabs.tsx · KiumCoursesTab.tsx · lib/kium/gotoOpen.ts(신규) · README |
| ② | `KEESS_kium_2_F41_GNB칩.patch` | GNB 칩 확대 · 유한 반짝임 | styles/components.css · README |
| ③ | `KEESS_kium_3_F40_히어로공개교육.patch` | 홈 공개교육 슬라이드 · C안 교차 · 배지 · 포커스 정지 | data/home.ts · HeroCarousel.tsx · lib/kium/sessions.ts · styles/home.css · app/layout.tsx · README |
| ④ | `KEESS_kium_4_F42_과정소개서.patch` | 소개서 다운로드(스위치 off) · 통합 검증 스크립트 | lib/kium/brochure.ts(신규) · data/home.ts · HeroCarousel.tsx · KiumCoursesTab.tsx · styles/kium-open.css · scripts/verify-kium-f40.mjs(신규) · README |

## 2. F43 /kium 상단 CTA

| 항목 | 구현 |
|---|---|
| 컴포넌트 | `KiumHeroCta.tsx`('use client') · KiumHero(서버 컴포넌트)는 버튼 블록만 교체 |
| 1차 | `<a class="btn btn-ink" href="/kium?tab=courses&mode=open" data-ga-id="kium_hero_open">공개교육 신청하기` · 클릭 시 `preventDefault` → `gotoOpenCourses()` (수정키 클릭은 기본 동작 = 새 탭) |
| 2차 | `<a class="kium-btn-ghost" href="#inq" data-ga-id="kium_hero_inquiry">문의하기` |
| 신호 | `lib/kium/gotoOpen.ts`: `KIUM_GOTO_OPEN_EVENT='kium:goto-open'` · `KIUM_OPEN_HREF` · 의존 0(순환 import 방지) |
| KiumTabs | 신호 수신 → 과정안내 탭 `select()`(페이드 · 해시 · 패널 첫 헤딩 포커스 · 탭바 스크롤). 이미 활성이면 스크롤만. 최신 상태는 ref로 참조 |
| KiumCoursesTab | 신호 수신 → `changeMode('open', { anchor:false })` (스크롤은 KiumTabs 단일 책임) |
| 딥링크 착지 | `?tab=` 진입 효과에 추가: 탭 index > 0 이고 상담 파라미터(`consult · apply · course · session · round`) 없을 때만 2프레임 뒤 `scrollToContent('auto')` |
| `scrollToContent` | 인자 `force?: 'auto'` 추가(기존 호출은 동작 동일) |

## 3. F41 GNB 칩

| 속성 | 전 | 후 |
|---|---|---|
| height / font-size / padding | 32px / 13px / 0 14px | 36px / 14px / 0 16px |
| 히트 확장 `::after` | top · bottom −6px | −4px (합계 44px 유지) |
| spark | 16px | 17px |
| shimmer | `7s infinite` | `chip-shimmer 2.2s var(--ease) .4s 2 both` (종료 4.8초) |
| spark twinkle | `7s infinite` | `2.2s .4s 2 both` (같은 시간축) |
| hover · focus-visible | 없음 | `chip-shimmer-once 1.1s` 1회 |
| reduced-motion | shimmer 숨김 | 동일 + `animation:none` |

- 마크업(Nav.tsx) 무변경 · 940px 이하 무변경

## 4. F40 홈 히어로

### 4-1 데이터 (`data/home.ts`)
| 요소 | 내용 |
|---|---|
| `HeroSlide.nextOpenBadge?` | 신규 선택 필드 |
| `KIUM_GOV_SLIDE` | 종전 정부지원 슬라이드 보존(export, 미노출) |
| `KIUM_OPEN_SLIDE` | id `kium-open` · theme `kium` · tag `공개교육` · eyebrow `2026 중소기업 인재 키움 프리미엄 훈련` · title `필요한 직원만,<br>필요한 교육으로` · sub 원고(`<br class="br-pc">`) · cta `공개교육 신청` → `KIUM_OPEN_HREF` · gaId `hero_kium_open` · link `인재키움 프리미엄 알아보기` → `/kium` · gaId `hero_kium_more` |
| `HERO_START` | `'alternate' \| 'legal' \| 'kium'` · 현재 `'alternate'` |
| `HERO_SLIDES` | 시즌 on: `[법정, 공개교육, 브랜드, 예시 4]`(`'kium'`이면 1·2 반대) · 시즌 off: BASE(공개교육 2번째) |
| `HERO_ROTATE` | `LEGAL_SEASON.on && HERO_START==='alternate'` |

### 4-2 C안 첫 장 교차 (`HeroCarousel.tsx`)
| 단계 | 동작 |
|---|---|
| SSG | 항상 `HERO_SLIDES` 순서로 렌더(서버 = 첫 클라이언트 렌더) · 각 슬라이드 `data-slide={id}` |
| ① 인라인 스크립트 | 섹션 직전 `<script>` · 첫 페인트 전 `localStorage.keess_hero_start` 직전 값의 반대(없으면 50:50, 저장 불가 시 무작위) → `<html data-hero-start>` + `window.__keessHeroStart` |
| ② CSS(home.css) | `html[data-hero-start=kium] .hero:not([data-hero-ready])` 동안 법정 숨김 · 공개교육 활성 표시(전환 효과 없음) |
| ③ 레이아웃 효과 | `pickStart()` 값이 kium이면 1·2번 교환 → `data-hero-ready` on (페인트 전) → ②규칙 해제, 화면 변화 0 |
| 클라이언트 전환 진입 | 스크립트 미실행 → `pickStart()`가 같은 규칙으로 직접 결정 |
| `app/layout.tsx` | `<html suppressHydrationWarning>` (html 자신의 속성 경고만 억제) |

### 4-3 배지 · 접근성
- `getUpcomingSession(now)` 신규(sessions.ts): 개강일 ≥ 오늘 · 마감 아님 · 가장 빠른 회차. now=null이면 데이터 기준
- `useNextOpenLabel()`: 초기값 now=null(SSG 일치) → 마운트 후 오늘 기준 재계산 · 0건이면 미출력
- 배지 마크업: 기존 `.hs-tag` 안 `.hs-tag-dot` + `.hs-tag-next`(레이아웃 불변)
- 포커스 정지: `onFocus` → 타이머 정지 · `onBlur`(relatedTarget이 캐러셀 밖) → 재개. hover 정지와 독립 플래그

## 5. F42 과정 소개서

| 항목 | 구현 |
|---|---|
| 설정 | `lib/kium/brochure.ts` `KIUM_BROCHURE = { ready:false, label, fileName, href:'/downloads/KG에듀원_인재키움프리미엄_공개교육_과정소개서.pdf', sizeLabel:'PDF' }` |
| 홈 | ready일 때만 `KIUM_OPEN_SLIDE.secondary`(download 필드) → HeroCarousel이 `<a download>`로 렌더(Next Link 미사용) |
| /kium | 세그먼트 행 오른쪽 `.kium-brochure` 링크(아이콘 · 라벨 · 용량) · GA `kium_brochure_download` · 행은 `:has(.kium-brochure)`일 때만 정렬 변경 |
| 현재 | ready=false → 두 곳 DOM 0 (실측 시 ready=true + 더미 PDF로 2곳 렌더 · 다운로드 확인 완료) |
| 개정본 반영 | 파일 배치 · sizeLabel 실측 · ready=true (후속 커밋 1건) |

## 6. 무결성 기준값 (SHA-256)

### 6-1 패치
| 파일 | 해시 |
|---|---|
| `KEESS_kium_1_F43_상단CTA.patch` | `fa95a9b7392be4b2dd38ee09b1a2009aec4d32f226767073624e5575390035b2` |
| `KEESS_kium_2_F41_GNB칩.patch` | `c1736e80b4ff60e45d5c8053837ee87596dfca8ede882a0d497ff27295d41500` |
| `KEESS_kium_3_F40_히어로공개교육.patch` | `04bd4d87bde8175b4a08593a316f756d5a5ca0854a7091c25d43f78ec24db888` |
| `KEESS_kium_4_F42_과정소개서.patch` | `0c54e96324f2f5779dfa4736ad0a52780cbc6079730d2842d896f578718544cd` |

### 6-2 적용 결과 (각 패치 적용 직후)
| 단계 | 파일 | 해시 |
|---|---|---|
| ① | components/kium/KiumHero.tsx | `c8f0e41c5881f9e83be210f422b1f6ddcd4d157f6b78123da74cc20f60a80fe9` |
| ① | components/kium/KiumHeroCta.tsx | `1a1e4f87ad0b9aabd4c1de4b4e022a41ab22c4ab0804c9b1c6901d42c95b953d` |
| ① | components/kium/KiumTabs.tsx | `a6044316fc76c512d90ffc23ffe612d9892db761e479ba3aaa3422a468ab9580` |
| ① | components/kium/KiumCoursesTab.tsx | `247d04a989990c26bc28622e2d601546447ca7829fd9b999ea683f968bb5db43` |
| ① | lib/kium/gotoOpen.ts | `488316440c3a5223a9d4a8c257219087750bf2e0247718e7232e4068c82ba291` |
| ① | README.md | `ef83cc03beeaa66d2b0ee0c41fbdd45e0406e3cabc73529c150b5e465a36eba3` |
| ② | styles/components.css | `c177c0a0293d42127e2f9b4338c7e041748889a90bb73f8963fa7122d639a61c` |
| ② | README.md | `128957a5b765b2807f9f097d09c50e4fe1e71d9e250edaabe9b808f2ec5fbd44` |
| ③ | app/layout.tsx | `946161a8900411855337958ded1a62093fdd61fe90e2c3b6d5d4cc93e47b1093` |
| ③ | components/sections/home/HeroCarousel.tsx | `01a1dfc9c904428af1076906fcab30448b24570f20f00e3c848a6ebb675e8e0e` |
| ③ | data/home.ts | `7a35c90bdd7d20fd4d09b5c0e841b3079c15dddfceeb1bfab2272074854c01bc` |
| ③ | lib/kium/sessions.ts | `2aa7c02d90e143d94b9def525074af7a2b0cbe35f27d00f9a21d9a6246ab0de5` |
| ③ | styles/home.css | `4a2ca597bd17e6a62c04ecaa303ce60ddd4f40bcbabeeef7cd2f936af6f26d6b` |
| ③ | README.md | `ef7c567e636085192ee3e534d05af492b312bbcb50578a412560124dd98b3c5e` |
| ④ | components/kium/KiumCoursesTab.tsx | `334ba870086461c82432183759a57f8f08ad8b2c99493729df9c8dd1f730c23e` |
| ④ | components/sections/home/HeroCarousel.tsx | `a234bf280e949240cbebd1a16ca0b9444dc6f8dd918fafb1ce61bb0fe0410f3b` |
| ④ | data/home.ts | `618714ff6902c74d79b57c88f1e125f95f046e76ca1bfcf8c9172113bdae5c78` |
| ④ | lib/kium/brochure.ts | `704d7619e36a149ddbb8b704d65e5e47e2c4df7125f238a70bda8eb957790610` |
| ④ | scripts/verify-kium-f40.mjs | `01beb74d39b402a99b13369cc9e5b0ef85154760396074db5e48437ced33b8be` |
| ④ | styles/kium-open.css | `995549d6d499e34050f44ed12967623f73a2dcc0604bffd439e066a9865ab661` |
| ④ | README.md | `d4446532b553761710f9af498d6fda850e053bcf09feb157d57e25a2ae434538` |

## 7. 검증

### 7-1 Cowork 사전 검증 (완료)
| 항목 | 결과 |
|---|---|
| tsc · build | 0 · 성공 · 경고 0 · `/` 7.58 kB · `/kium` 17.6 kB |
| 패치 재현 | `ffbb02d` 깨끗한 클론에 4개 순차 적용 → 최종 파일 바이트 일치 |
| verify-kium-f40 | 22/22 |
| 회귀 | verify-kium-f39 30/30 · verify-legal-lb58 7/7 |
| 브라우저 실측 30단언 | 첫 방문 20회 분포 10:10 · 재방문 교차 · 하이드레이션 전 첫 장(JS 차단) · 하이드레이션 후 유지 · 콘솔 오류 0 · 포커스 정지 · /kium 클릭 전환 · 탭바 72px 정렬 · 딥링크 착지 · 상담 딥링크 폼 이동 유지 · 칩 1440/1280/1024 1줄 · 모션 줄이기 · 768/390 터치 44px 이상 · 가로 스크롤 0 |
| dev 하이드레이션 경고 | 0 (첫 장 legal · kium 각각) |

### 7-2 `scripts/verify-kium-f40.mjs` (브라우저 없이 HTML · CSS)
| ID | 단언 |
|---|---|
| H1 ~ H11 | 홈 200 · SSG 순서(법정 1 · 공개교육 2) · 7장 · 태그 · 배지 · 메인 · 서브 · 1차 버튼 href/GA · 보조 링크 · C안 스크립트 · 정부지원 문구 0 |
| B1 | 소개서 off: 버튼 0 (on이면 PDF 200) |
| K1 ~ K6 | /kium 200 · 버튼 순서 · 1차 href/GA · 2차 #inq/GA · 구 라벨 0 · FAQ [신청 문의] 유지 |
| C1 ~ C4 | CSS 수집 · 칩 36/14 · 반짝임 2회(무한 0) · C안 규칙 |

### 7-3 게이트
| 단계 | 기준 | 실행 |
|---|---|---|
| G1 | 패치별 `git apply --check` · 해시 §6 일치 · `npx tsc --noEmit` 0 | Claude Code |
| G2 | `npm run build` 성공 · 경고 0 (메모리 부족 exit 134면 B안: 클라우드 빌드 통과분과 바이트 일치이므로 Vercel 빌드를 게이트로 진행) | Claude Code |
| G3 | (G2 성공 시) 로컬 프로덕션 서버 verify-kium-f40 22/22 · f39 30/30 · lb58 7/7 | 사용자 |
| G4 | 커밋 4건 · `law-b/main..HEAD`=4 · `HEAD..law-b/main`=0 · 푸시 · 해시 3종 일치 | Claude Code |
| G5 | Vercel Ready 후 배포본 22/22 · 30/30 · 7/7 + 수동 확인 4건 | 사용자 |

### 7-4 G5 수동 확인
1. 홈 새로고침 3회: 첫 장이 법정 ↔ 공개교육 번갈아 노출 · 깜빡임 없음
2. 공개교육 슬라이드 [공개교육 신청] → /kium 공개교육 회차 목록 위치 착지
3. /kium 상단 [공개교육 신청하기] → 같은 페이지 공개교육 보기 · 목록 위치
4. GNB 칩: 진입 후 2회 반짝이고 멈춤 · 마우스 올리면 1회

## 8. 실패 대응
| 상황 | 대응 |
|---|---|
| apply --check 실패 · 해시 불일치 | 즉시 멈춤 · 표 보고(줄바꿈 차이뿐이면 보고 후 계속) |
| build OOM(exit 134) | B안: G3 생략 · 커밋 · 푸시 · G5로 검증 |
| Vercel 빌드 실패 | 이전 배포 유지됨 · 로그 확인 후 보고 |
| 배포 후 결함 | 해당 기능 커밋만 `git revert` (①~④ 독립) |
| C안 · 슬라이드 · 소개서 결정 변경 | §4-1 · §5 상수 전환 후속 커밋 |
