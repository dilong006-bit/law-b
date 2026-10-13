# KEESS /kium 과정개요서 다운로드 게시 기술명세서 최종 v1.0 (F44)

| 항목 | 내용 |
|---|---|
| 작성 | 2026-10-13 · HRD사업지원팀 임지홍 |
| 업무 | 27338 [디자인·개발] 10/19 배포 · 「/kium 과정안내: 과정 홍보 자료 다운로드」 · 10/8 댓글 파일 규칙 |
| 레포 | KEESS_law-B · `feat/legal-b` → law-b(`feat/legal-b`, `main`) → https://law-b.vercel.app |
| 기준 HEAD | `d010bd2` (F40 후속) · `law-b/main` 동일 · 추적 변경 0 |
| 전략 문서 | `KEESS_kium_과정개요서다운로드_F44_UXUI전략_v1.0_261013.md` |
| 기능 ID | F44 (README 최신 F43 다음) |
| 커밋 계획 | 1건 (kium) → 푸시 |

## 1. 현재 상태 (10/13 실측)

| 항목 | 상태 |
|---|---|
| 배포본 /kium | 다운로드 링크 DOM 0 (F42 `KIUM_BROCHURE.ready=false`) |
| 서버 파일 | 없음. `public/downloads/`에 법정 소개서 · 과정리스트 2건뿐 |
| 구 설정 | 서버명 = 표시명 = 한글 `KG에듀원_인재키움프리미엄_공개교육_과정소개서.pdf` · 캐시 파라미터 없음 · 히어로 · 과정안내 단일 스위치 |
| 원본 후보 | 다운로드 폴더 `2026_인재키움_과정개요서_261001.pdf.sLDH` 등 전부 DRM 암호화 → 그대로 게시 시 고객이 열 수 없음 |

## 2. 변경 범위

| # | 파일 | 변경 |
|---|---|---|
| 1 | `public/downloads/kgeduone_kium_premium_course_overview_2026.pdf` | 신규 · 복호화 개정본 (원본 위치 `ref/kium/brochure/`) |
| 2 | `lib/kium/brochure.ts` | 전면 교체 (§3-1) |
| 3 | `data/home.ts` | 히어로 2차 버튼 조건에 `showInHero` 추가 (§3-2) |
| 4 | `components/kium/KiumCoursesTab.tsx` | 링크에 `type="application/pdf"` · 주석 F44 (§3-3) |
| 5 | `scripts/verify-kium-f44.mjs` | 신규 · 20단언 (Cowork 배치 완료) |
| 6 | `README.md` | 작업 이력 최상단 F44 항목 · F42 항목 상태 표기 |

- 무변경: `styles/kium-open.css`(F42 스타일 그대로) · `HeroCarousel.tsx` · GA id · 세그먼트 · 필터 · 다른 페이지

## 3. 코드 명세

### 3-1. `lib/kium/brochure.ts` (전체 교체)

```ts
/**
 * [F42 · 261007 → F44 · 261013] 인재키움 프리미엄 과정개요서 다운로드 (업무 27338 · 10/8 댓글).
 *
 * ★ 게시 스위치
 *   ready      = 전체 스위치. false면 모든 위치에서 DOM 0
 *   showInHero = 홈 히어로 공개교육 슬라이드 2차 버튼. F44 false
 *                (10/8 확정 범위 밖 · 1차 CTA [공개교육 신청] 경쟁 · 자동 전환 캐러셀 노출 불안정)
 *   과정안내 세그먼트 행 링크는 ready만 따른다(두 보기 공통)
 *
 * ★ 파일 규칙
 *   서버 파일명 SERVER_FILE 고정. 개정본도 같은 이름으로 덮어쓴다
 *   교체 시 VERSION(수령일 YYMMDD) · sizeLabel(실측) 2개만 갱신 → ?v= 로 캐시 무효화
 *   다운로드 표시명은 fileName(<a download>)
 * 방식: 폼 없는 직접 다운로드(게이트 없음). 상담 전환은 [문의하기] · 회차 카드가 받는다.
 */
const SERVER_FILE = 'kgeduone_kium_premium_course_overview_2026.pdf';
const VERSION = '261008';

export const KIUM_BROCHURE = {
  ready: true,
  showInHero: false,
  label: '과정개요서 받기',
  fileName: 'KG에듀원_2026_인재키움프리미엄_과정개요서.pdf',
  href: `/downloads/${SERVER_FILE}?v=${VERSION}`,
  /** 실측: Math.round(bytes / 1024) → 'PDF · NNNKB' (1MB 이상은 'PDF · N.NMB') */
  sizeLabel: 'PDF · 552KB',
} as const;
```

- `sizeLabel`은 실측 564,785B → `PDF · 552KB`

### 3-2. `data/home.ts`

```ts
  // [F42 · F44] 과정개요서: ready && showInHero 일 때만 2차 버튼 생성(F44 showInHero=false → 필드 자체가 없다)
  ...(KIUM_BROCHURE.ready && KIUM_BROCHURE.showInHero
    ? { secondary: { label: KIUM_BROCHURE.label, href: KIUM_BROCHURE.href, gaId: 'hero_kium_brochure', download: KIUM_BROCHURE.fileName } }
    : {}),
```

### 3-3. `components/kium/KiumCoursesTab.tsx`

- 주석: `{/* [F42 · F44] 과정개요서: KIUM_BROCHURE.ready on일 때만 DOM 생성. 두 보기 공통 · 세그먼트 행 오른쪽(좁은 화면은 아래 줄) */}`
- `<a>` 속성 순서: `className` · `href` · `download` · `type="application/pdf"` · `data-ga-id`
- 그 외 마크업 · 아이콘 · 라벨 바인딩 무변경

### 3-4. 렌더 결과 (SSG HTML 기대값)

```html
<a class="kium-brochure" href="/downloads/kgeduone_kium_premium_course_overview_2026.pdf?v=261008"
   download="KG에듀원_2026_인재키움프리미엄_과정개요서.pdf" type="application/pdf"
   data-ga-id="kium_brochure_download">… 과정개요서 받기<span class="meta">PDF · 552KB</span></a>
```

## 4. 화면 기준

| 뷰포트 | 배치 |
|---|---|
| PC 1440 · 태블릿 810 | 세그먼트 좌측 · 링크 우측 정렬 (F42 CSS `:has()` 규칙) |
| 모바일 390 | 세그먼트 아래 줄 좌측 · 터치 44px |
| 보기 전환 | 전체과정 / 공개교육 모두 동일 위치 노출 |
| 홈 | 공개교육 슬라이드 무변경 ([공개교육 신청] + 보조 링크) |

## 5. 파일 게이트 (G0)

| # | 확인 | 담당 |
|---|---|---|
| G0-1 | DRM 복호화본을 `ref/kium/brochure/KG에듀원_2026_인재키움프리미엄_과정개요서.pdf`에 저장 (이중 확장자 `.pdf.pdf` 정리) | 사용자 |
| G0-2 | 내용: 노출 11과정만 · 폐강 8과정 미포함 · 단가는 사업부 제공본 그대로 허용(261013 확정, 공개교육 5과정 금액 pricing.ts 일치) | Claude Code 자동 |
| G0-3 | 첫 5바이트 `%PDF-` · 바이트 수 · SHA-256 기록 · 10MB 미만 | Claude Code |
| G0-4 | `public/downloads/kgeduone_kium_premium_course_overview_2026.pdf`로 복사 후 SHA-256 원본과 일치 | Claude Code |

- `ref/kium/brochure/` 원본은 커밋하지 않음 (게시본은 `public/downloads/` 1벌)
- 261013 G0 1차 결과: 10/8 댓글 첨부본 = 19개 과정판(단가 포함 · 820,232B, `(19개)` 파일과 크기 동일) → 게시 불가 판정
- 게시 대상: 10/8 14:59 수령 `2026_인재키움_과정개요서_261001` 복호화본 · G0-2는 프롬프트 02에서 텍스트 추출 자동 검사(11과정 전부 · 폐강 8과정 0 · 단가 0)로 전환
- 261013 16:00 261001 복호화본 실측: 564,785B · 13쪽 · SHA-256 `57c3377887da60b7c733b0a16ed38e27f2c0ef228b02846c8147b04cbaf89241` · 11과정 11/11 · 폐강 0 · 단가 표 1 + `원 / 인` 11건
- **단가 포함 게시 확정 (2026-10-13 임지홍)**: 사업부 제공 개정본 원형 유지. G0-2 c는 「단가 0」 → 「2쪽 단가 표 1 · 과정별 단가 11건 · 공개교육 5과정 금액 = `lib/kium/pricing.ts` 일치」로 변경
- 위탁 6과정 단가도 PDF에는 노출됨 (화면은 기존대로 공개교육 5과정만 교육비 노출, 화면 정책 무변경)
- 차단: 19개판 복호화본 SHA-256 `65c528d0…` (`-원본.pdf`로 같은 폴더 보관 중, 커밋 · 게시 금지)

## 6. 검증 (`scripts/verify-kium-f44.mjs` · 20단언)

| ID | 단언 |
|---|---|
| D1~D2 | /kium 200 · 링크 1건 |
| D3~D6 | href(영문 + `?v=261008`) · download 표시명 · GA id · `type` |
| D7~D9 | 라벨 `과정개요서 받기` · 메타 형식 · 세그먼트 행 안 위치 |
| P1~P6 | PDF 200 · content-type · `%PDF-`(DRM 아님) · 바이트 = `EXPECT_BYTES` · `?v` 없는 경로 200 · 구 한글 경로 404 |
| H1~H3 | 홈 200 · 히어로 개요서 버튼 0 · 공개교육 슬라이드 기존 링크 유지 |
| R1~R2 | 구 라벨 · 구 파일명 0건 |

- 병행: `verify-kium-f40.mjs` 22/22 (B1이 on 분기로 전환 · PDF 200 확인)
- 해시: `scripts/verify-kium-f44.mjs` = `d2bed005f72becd8a98e7bffa55edbaf747c01d71bb3031f1bee1a9e0a7f818b`

## 7. 무결성 기준값 (변경 전 SHA-256)

| 파일 | 해시 |
|---|---|
| `lib/kium/brochure.ts` | `704d7619e36a149ddbb8b704d65e5e47e2c4df7125f238a70bda8eb957790610` |
| `data/home.ts` | `76480008635bbf777143f5864783cfe6eb81d0d51b63b0d50e337f964c57d1e6` |
| `components/kium/KiumCoursesTab.tsx` | `334ba870086461c82432183759a57f8f08ad8b2c99493729df9c8dd1f730c23e` |
| `README.md` | `fbe6db972f80c8b55bf992c38de17302f0a8f641e8393f6cd1f75579fe973798` |

## 8. 게이트

| 단계 | 기준 | 실행 |
|---|---|---|
| G0 | §5 파일 게이트 | 사용자 + Claude Code |
| G1 | `npx tsc --noEmit` 0 | Claude Code |
| G2 | `npm run build` 성공 · 경고 0 · 추적 부산물 0 | Claude Code |
| G3 | 프로덕션 서버 재시작 후 f44 **20/20** + f40 **22/22** | 사용자 터미널 |
| G4 | 커밋 1건 · `law-b/main..HEAD` = 1 · `HEAD..law-b/main` = 0 → 푸시 · 해시 3종 일치 | Claude Code |
| G5 | Vercel Ready 후 배포본 대상 20/20 + 22/22 · 실기기 다운로드 파일명 확인 (PC Chrome · iOS Safari · Android Chrome) | 사용자 |

## 9. 실패 대응
- P3 FAIL: DRM 암호화본 배치 → 복호화본으로 교체 후 G0부터
- P4 FAIL: `EXPECT_BYTES` 누락 또는 파일 불일치 → G0-3 실측값 재확인
- D3 · R2 FAIL: build 누락 또는 서버 재시작 누락 → G2 · 서버 재시작
- 푸시 실패: 재시도 · force 금지, 원인과 사용자 실행 명령만 보고
- 배포 후 Critical: F44 커밋 `git revert` 1건으로 원복 (F42 off 상태 복귀)

## 10. 운영 반영 가이드 (신승용 과장 인계용)

| 항목 | 기준 |
|---|---|
| 위치 | /kium 과정안내 · 보기 전환 세그먼트 행 오른쪽 (모바일 아래 줄) · 두 보기 공통 |
| 라벨 · 메타 | `과정개요서 받기` · `PDF · 552KB` (실측) |
| 마크업 | `<a href="/downloads/kgeduone_kium_premium_course_overview_2026.pdf?v=261008" download="KG에듀원_2026_인재키움프리미엄_과정개요서.pdf" type="application/pdf">` |
| 파일 교체 | 같은 서버 파일명으로 덮어쓰기 + `?v=` 수령일 갱신 |
| 교차 도메인 주의 | `download` 속성은 같은 도메인에서만 동작. CDN 등 다른 도메인에서 서빙하면 응답 헤더 `Content-Disposition: attachment; filename="kgeduone_kium_premium_course_overview_2026.pdf"; filename*=UTF-8''KG%EC%97%90%EB%93%80%EC%9B%90_2026_%EC%9D%B8%EC%9E%AC%ED%82%A4%EC%9B%80%ED%94%84%EB%A6%AC%EB%AF%B8%EC%97%84_%EA%B3%BC%EC%A0%95%EA%B0%9C%EC%9A%94%EC%84%9C.pdf` 필요 |
| 홈 히어로 | 개요서 버튼 미노출 |
| GA | `kium_brochure_download` |

## 11. 범위 밖
- 홈 히어로 1번 위치: 업무 27338 본문 「공개교육 슬라이드 단독 노출 (C안 해제)」 vs 프로토타입 C안 → 이번 빌드 무변경, 운영은 업무 본문 기준
- 목록 하단 보조 블록 다운로드 (차기 후보)
