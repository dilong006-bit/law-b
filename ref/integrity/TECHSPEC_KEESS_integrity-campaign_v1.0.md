# 기술명세서: KEESS 청렴훈련 캠페인 게재 v1.0

| 항목 | 내용 |
|------|------|
| **Version** | 1.0 |
| **상위 문서** | ref/integrity/PRD_KEESS_integrity-campaign_v1.0.md (IC1~IC7) |
| **준수 기준** | CLAUDE.md, ref/design/Design.md, 법정필수 B안 절대 규칙·결정 D1~D26 중 공통 규칙 |
| **저장소 / 브랜치** | law-b / feat/legal-b (법정필수 B안과 같은 배포) |
| **작성일** | 2026-09-29 |

---

## 0. 절대 규칙
1. 새 색·폰트·섀도·라운드·브레이크포인트 금지. 토큰과 기존 클래스만
2. 기존 예방안내·신고 접수·신고 조회 탭의 마크업·동작·API 호출 변경 금지 (탭 순서 인덱스가 바뀌어 생기는 참조만 조정)
3. 캠페인 이미지 원본 훼손 금지: 제공 파일 그대로, CSS 로 확대 금지 (표시 폭 ≤ 730px)
4. 캠페인 탭에 빨강 경고 스타일(예방안내 탭의 경고 박스 클래스) 사용 금지
5. 공단 로고·타 기관 이름·타 기관 UI 노출 금지
6. 문구는 §3 그대로. 대시 문자 금지
7. GNB 변경 금지, 백엔드 변경 금지
8. hover 는 `(hover:hover) and (pointer:fine)` 안, reduced-motion 대응

---

## 1. 착수 전 실측 (코드 변경 없음, 보고 후 진행)
- 모달 컴포넌트 위치: `grep -rn "부정훈련 예방 및 신고"` 로 찾기 (컴포넌트, 데이터, 푸터)
- 탭 구현 방식: 상태 키(인덱스인지 문자열 키인지), role=tablist 여부, 방향키 지원 여부
- 모달을 여는 모든 진입점과 각 진입점이 여는 탭 (푸터 2개 외 존재 여부)
- 딥링크(해시·쿼리)로 탭을 여는 기능 여부
- 모달 안 기존 아이콘 구현 방식 (인라인 SVG / LgIcon / 기타)
- 탭 영역의 360·390 폭 표시 방식 (가로 스크롤 / 균등 폭)
- 결과를 표로 보고한 뒤 §2 이후 진행 (막히는 점이 없으면 보고와 함께 바로 진행 가능)

---

## 2. 파일

| 구분 | 경로 | ID |
|---|---|---|
| 신규(제공) | public/images/integrity/integrity-campaign-visual.png (730×328) | IC3 |
| 신규(제공) | public/images/integrity/integrity-campaign-visual.webp (730×328) | IC3 |
| 신규 | components/…/IntegrityCampaignTab.tsx (모달 컴포넌트 옆 같은 폴더) | IC2, IC5 |
| 수정 | 부정훈련 모달 컴포넌트 (제목, 탭 목록, 기본 탭, 탭 전환 함수 노출) | IC1, IC4, IC5 |
| 수정 | 푸터 링크 데이터·컴포넌트 | IC4 |
| 수정 | 모달 스타일 파일 (ic- 접두어 규칙 추가) | IC2 |
| 신규 | ref/integrity/ASSET_SOURCES.md | IC3 |

- 원본 소스 보관: `ref/integrity/src/integrity_banner_1920x384.jpg` (게재 배너 원본 캡처), `ref/integrity/src/integrity_poster_popup.png` (참고용, 사이트 미사용)

---

## 3. 카피 (data 파일 또는 컴포넌트 상수 1곳에 정의)

```ts
export const INTEGRITY_COPY = {
  modalTitle: '청렴훈련 · 부정훈련 신고',
  tabLabel: '청렴훈련 캠페인',
  visual: {
    png: '/images/integrity/integrity-campaign-visual.png',
    webp: '/images/integrity/integrity-campaign-visual.webp',
    width: 730, height: 328,
    alt: '캠페인 청렴훈련, #건강한 훈련문화, 부당영업 NO, 청렴훈련 YES',
    caption: '한국산업인력공단 청렴훈련 캠페인',
  },
  tag: '#건강한 훈련문화',
  title: '캠페인 청렴훈련',
  lead: '법정의무교육은 강요하지 않습니다.',
  pair: { no: '부당영업 NO', yes: '청렴훈련 YES' },
  credit: '청렴훈련 캠페인은 한국산업인력공단과 함께 합니다.',
  report: { q: '부당영업·부정훈련을 알고 계신가요?', cta: '신고 접수로 이동' },
  footer: { guide: '청렴훈련 · 부정훈련 예방', report: '부정훈련 신고' },
} as const;
```

---

## 4. 모달 변경 (IC1, IC4)

### 4-1. 탭 정의
```ts
type IntegrityTab = 'campaign' | 'guide' | 'report' | 'lookup';
const TABS = [
  { key: 'campaign', label: INTEGRITY_COPY.tabLabel },
  { key: 'guide',    label: '예방안내' },
  { key: 'report',   label: '신고 접수' },
  { key: 'lookup',   label: '신고 조회' },
];
```
- 기존 탭 상태가 숫자 인덱스면 문자열 키로 바꾸는 것을 권장. 바꾸기 어려우면 인덱스를 +1 보정하고 모든 참조를 찾아 수정, 보고
- 모달 열기 함수 인자: `openIntegrity(tab?: IntegrityTab)`, 기본값 `'campaign'`
- 기존에 '예방안내' 를 기본으로 열던 호출은 인자 없이 호출 → 캠페인 탭
- '신고' 로 열던 호출은 `'report'` 유지

### 4-2. 제목
- 모달 헤더 제목 → `INTEGRITY_COPY.modalTitle`, aria-labelledby 연결 유지

### 4-3. 푸터
- 링크 1: `청렴훈련 · 부정훈련 예방` → `openIntegrity()`
- 링크 2: `부정훈련 신고` → `openIntegrity('report')`
- 기존 푸터 레이아웃·구분자 스타일 유지

### 4-4. 딥링크
- 기존 딥링크가 있으면 `campaign` 키 추가, 없으면 새로 만들지 않음

---

## 5. 캠페인 탭 (IC2, IC3, IC5)

### 5-1. 마크업
```
div[role=tabpanel][id=integrity-panel-campaign][aria-labelledby=integrity-tab-campaign].ic-panel
  figure.ic-visual
    picture
      source type=image/webp srcSet=webp
      img src=png width=730 height=328 alt=... decoding=async loading=lazy
    figcaption.ic-caption
  div.ic-body
    p.ic-tag  #건강한 훈련문화
    h3.ic-title  캠페인 청렴훈련
    p.ic-lead  법정의무교육은 강요하지 않습니다.
    ul.ic-pair
      li.ic-chip.is-no  (금지 아이콘) 부당영업 NO
      li.ic-chip.is-yes (체크 아이콘) 청렴훈련 YES
    p.ic-credit
  div.ic-report
    p  부당영업·부정훈련을 알고 계신가요?
    button.btn (기존 보조 버튼 클래스) 신고 접수로 이동 (화살표 아이콘)
```
- 제목 태그 수준은 기존 탭 안 소제목 태그와 맞춤 (기존이 h3 가 아니면 그 수준 따름)

### 5-2. 스타일 (모달 스타일 파일, ic- 접두어)
```css
.ic-visual{margin:0;background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:16px;text-align:center}
.ic-visual img{display:block;width:100%;max-width:730px;height:auto;margin:0 auto;border-radius:calc(var(--r) - 4px)}
.ic-caption{margin-top:8px;font-size:12px;color:var(--muted)}
.ic-body{margin-top:20px}
.ic-tag{font-size:13px;font-weight:700;color:var(--muted)}
.ic-title{margin-top:4px;font-size:20px;font-weight:800;color:var(--ink)}
.ic-lead{margin-top:8px;font-size:15px;color:var(--ink)}
.ic-pair{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0 0;padding:0;list-style:none}
.ic-chip{display:inline-flex;align-items:center;gap:6px;min-height:36px;padding:0 14px;border-radius:999px;font-size:14px;font-weight:700}
.ic-chip.is-no{background:var(--surface);color:var(--muted);border:1px solid var(--line)}
.ic-chip.is-yes{background:color-mix(in srgb,var(--p4) 8%,#fff);color:var(--ink);border:1px solid color-mix(in srgb,var(--p4) 25%,#fff)}
.ic-credit{margin-top:12px;font-size:13px;color:var(--muted)}
.ic-report{margin-top:20px;padding-top:16px;border-top:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
@media(max-width:560px){.ic-visual{padding:10px}.ic-report{flex-direction:column;align-items:stretch}.ic-report .btn{width:100%}}
```
- 위 크기 값(12/13/14/15/20, 36, 14·16·20 여백)은 모달 안 기존 값으로 대체 가능하면 기존 값 사용, 새 값이 되는 경우 보고
- P4 8%·25% 는 법정 허브 결정 D5 기존 값
- 칩은 정보 표시용(li), 클릭 요소 아님 → 44px 규칙 대상 아님

### 5-3. 아이콘
- 모달 기존 아이콘 방식 그대로 (실측 결과 따름)
- 필요 아이콘 3개: 금지(circle-x 또는 ban), 체크(circle-check), 이동(arrow-right)
- 법정 허브 LgIcon(Lucide, 선 1.5) 재사용이 모달 방식과 충돌하지 않으면 재사용, 선택 결과 보고

### 5-4. 신고 연결 (IC5)
```ts
onClick={() => { setTab('report'); requestAnimationFrame(() => document.getElementById('integrity-tab-report')?.focus()); }}
```
- 기존 탭 포커스 규칙과 다르면 기존 규칙 따름 (패널 포커스 방식이면 패널로)
- 모달 스크롤 컨테이너를 맨 위로 이동

### 5-5. 이미지 실패 대체
- img onError → 이미지 숨김, figure 에 `data-failed`, 같은 비율(730/328) 빈 --surface 면 유지, 캡션 유지

---

## 6. 반응형

| 폭 | 캠페인 탭 |
|---|---|
| 모달 최대 폭 | 비주얼 카드 전폭, 이미지 최대 730px 가운데 |
| 761~ | 신고 연결 한 줄 (문구 좌, 버튼 우) |
| ~560 | 비주얼 여백 축소, 신고 버튼 전체 폭, 칩 줄바꿈 허용 |
| 360 | 탭 4개 기존 방식으로 표시, 탭 라벨 줄바꿈 0, 가로 스크롤은 탭 영역 내부만 |

---

## 7. 자사 카피 점검 (IC6)
- 검색 범위: app, components, data (빌드 산출물 제외)
- 패턴 (정규식, 대소문자 무시)
  - `법정.{0,12}(무료|증정|서비스|끼워|덤)`
  - `(무료|증정|서비스|덤).{0,12}법정`
  - `(환급|정부지원|인재키움).{0,20}법정.{0,12}(무료|제공)`
- 결과: 파일·줄·문구 표로 보고. 0건이면 0건 보고. 수정은 하지 않음

---

## 8. 검증

| 항목 | 판정 |
|---|---|
| 기본 탭 | 푸터 '청렴훈련 · 부정훈련 예방' → 캠페인 탭 aria-selected=true |
| 신고 링크 | 푸터 '부정훈련 신고' → 신고 접수 탭 |
| 신고 연결 | 캠페인 탭 버튼 → 신고 접수 탭 활성 + 포커스 이동 |
| 기존 탭 회귀 | 예방안내·신고 접수·신고 조회 패널 innerHTML 이 변경 전과 동일 (탭 id 재번호 제외), 신고 폼 검증·제출 흐름 동일 |
| 키보드 | 탭 전환 키 동작 기존과 동일, ESC 닫기, 포커스 트랩 |
| 이미지 | width/height 지정, CLS 0, webp 로드, 실패 시 대체 면 |
| 대비 | 본문·칩 글자 4.5:1, 아이콘 3:1 (D18 방식) |
| 반응형 | 1440, 1040, 880, 760, 640, 560, 390, 360 가로 스크롤 0, 탭 라벨 줄바꿈 0 |
| 금지 | 캠페인 탭 안 경고 박스 클래스 0, 공단 로고 0, 대시 문자 0 |
| 카피 점검 | §7 결과 |
| 공통 | tsc·build 통과, 콘솔 0, 법정 허브 검수(verify-legal-b) 통과 유지 |

- 캡처: `test-results/integrity/` (모달 1440·390·360, 캠페인 탭, 신고 이동 후)

---

## 9. 커밋
- `feat(common): 청렴훈련 캠페인 탭 (부정훈련 모달)` = 법정필수 B안 커밋 15
- 법정필수 B안 통합 검수·최종 보고는 커밋 16 으로 이동, 이 기능 검증 결과 포함
- 절차: `npx tsc --noEmit` → `npm run build` → commit → 하나씩 `git push law-b feat/legal-b` / `git push law-b feat/legal-b:main` / `git ls-remote law-b`

## 10. 완료 정의
- IC1~IC7 완료 조건 충족, §8 전 항목 통과
- ASSET_SOURCES.md 기록 (배너 출처, 자른 영역 좌표 840,28,730,328, 공단 원본 수령 시 교체 예정)
