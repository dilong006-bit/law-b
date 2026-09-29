# Claude Code 빌드 프롬프트: 법정필수교육 노출 B안 upgrade-03 (시각 고도화)

- 사전 준비 (사람이 직접): 아래 4개 파일을 `KEESS_law-B/ref/legal/` 에 저장
  - KEESS_26827_법정필수_B안_시각고도화전략_upgrade-04_260929.md
  - PRD_KEESS_26827_legal-B_v1.0_upgrade-03.md
  - TECHSPEC_KEESS_26827_legal-B_v1.0_upgrade-03.md
  - PROMPT_build_legal-B_upgrade-03.md
- 순서: 커밋 13 (빠른 상담, upgrade-02 단계 13) 보고 확인 → **단계 14 (이 문서)** → 단계 15
- 목표: 10/1(목) 15:00 미팅 전 커밋 14 배포

---

## 단계 14. 시각 고도화 (커밋 14)

```
[커밋 13 판단]
(여기에 커밋 13 보고에 대한 승인·수정 사항 기입)

[배경]
대표 피드백: "텍스트가 너무 많고 텍스트 위주다"
의도 해석: 아이콘을 늘리는 것이 아니라, 읽을 것을 줄이고 볼 것을 만든다.
- 읽지 않아도 3초 안에 구조와 구분(법정 의무·권고·업종별, 과정 7종)이 보이게
- 화면(1440×900)마다 비텍스트 앵커 1개 이상
- 허브 보이는 글자 15% 이상 감소 (법적 고지·과정 원문 제외)

[새 문서 4개 숙지 (ref/legal/, 이 순서대로)]
1. KEESS_26827_법정필수_B안_시각고도화전략_upgrade-04_260929.md (대표 피드백 해석, 아이콘 규칙 I1~I8)
2. PRD_KEESS_26827_legal-B_v1.0_upgrade-03.md (LB40~LB47)
3. TECHSPEC_KEESS_26827_legal-B_v1.0_upgrade-03.md (D19~D23, §2~§8)
4. PROMPT_build_legal-B_upgrade-03.md
- 이전 결정 D1~D18, 짝 설계 수치는 그대로 유지. 이번 작업이 밸런스를 깨면 안 됨
- 문서 충돌·불명확한 곳은 코드 작성 전 보고

[커밋 14 범위: LB40~LB46]
착수 순서 권장

14-0. 아이콘 추가 (TECHSPEC §2)
- gen-legal-icons.mjs 에 과정 후보 배열과 추가 이름 반영, COURSE_ICON 출력, iconData.ts 재생성
- 후보 중 선택된 이름을 보고 (모든 후보가 없으면 멈추고 보고)
- LgIcon 에 data-icon 속성 추가 (검수용)

14-1. 과정 아이덴티티 아이콘 LB40 (§3-1, §4-1)
- LEGAL_COURSES icon 필드, CourseIcon 컴포넌트
- 사용처 5곳: 진단 칩 16 / 상세 헤더 20 / 법정 표 교육명 18 / 트레이 목록 16 / 빠른 상담 요약 16
- 과정 카드 본문에는 넣지 않음 (썸네일과 중복)

14-2. KindBadge 공용화 (§4-2)
- 과정 카드 배지, 진단 그룹 라벨·범례, 법정 표 구분 셀을 KindBadge 하나로 교체
- 색 체계는 기존 그대로, 아이콘 16 추가 (의무 shield-check / 권고 lightbulb / 업종별 briefcase)

14-3. 진단 시각화 LB41 (§4-4, §4-5)
- 문항 라벨 아이콘 20 (users / piggy-bank / building-2)
- DiagSummary: 추천 N과정 (숫자 28), 구분 막대 8px (의무 P4 / 권고 P4 45% / 업종별 --line), 범례 KindBadge + 개수
- 막대 role=img + aria-label, 전환 240ms, reduced-motion 즉시
- 요약 추가 후 진단 행 높이 결정자가 바뀌면 data-height-owner 재지정하고 보고

14-4. 과정 카드·상세·맞춤 타일 LB42 (§4-6)
- 카드 차시: circle-play 16 + 숫자 굵게
- 상세: 헤더 CourseIcon 20, 소제목 아이콘 20 (users / target / list-checks / user-round / scale), 학습 목표 목록 간격 한 단계 위 (기존 토큰)
- 맞춤 구성 타일: 좌측 .lg-ico-tile + puzzle 24
- 도입 절차·차이 카드 기존 아이콘을 .lg-ico-tile 규격으로 통일

14-5. 비교표 LB43 (§4-7)
- 행 라벨 아이콘 20 (clapperboard / pen-line / refresh-cw / sparkles / settings-2)
- KG 열 circle-check 18 + 굵은 글자, 일반 열 아이콘 없음 --muted
- 640 이하 카드형 동일, 행 높이 전후 ±2px

14-6. 법정 기준 표 LB44 (§4-8)
- 교육명 CourseIcon 18, 구분 KindBadge

14-7. 허브 헤더 수치 스트립 LB45 (§4-3)
- 7 과정 / 3 문항 진단 / 4 단계 도입 / 1일 내 연락, dl/dt/dd
- 1041 이상 4칸 / 560 이하 2×2, 헤더 높이 증가 ≤ 90px (1440)

14-8. 텍스트 다이어트 LB46 (§5)
- 수정 전 글자 수 A 측정 (1440, D23 예외 제외) → 리드·보조문 규칙 적용 → B 측정, 감소율 ≥ 15%
- 리드 초안(§5-3) 적용, 그 밖 리드는 규칙대로 정리
- 법적 고지·과정 원문·법정 표 셀 수정 금지

14-9. 아이콘 규칙 I1~I8 자체 점검
- 라벨당 1개, 문단 안 0, 화면당 ≤ 24, 아이콘만 있는 버튼 aria-label

[검증 (TECHSPEC §8)]
- 시각 앵커: 1440×900 허브 900px 단위 화면마다 앵커 ≥ 1 (화면별 앵커 종류 표)
- 아이콘 밀도·라벨당 1개·문단 0
- 과정 아이콘 5곳 일치 (과정별 data-icon 비교 표)
- 진단 요약: N·막대·범례 동시 갱신 (부분 응답, 완료, 변경 3케이스)
- 글자 수: A, B, 감소율
- 밸런스 유지: 진단·자료·차이·절차·상담 짝 행 높이 비 0.95~1.05
- 대비: 배지 글자 4.5, 아이콘 3 (D18 방식)
- 공통: 9폭 가로 스크롤 0, 44px, 금지어 0 (홈·/content), CLS < 0.05, 콘솔 0, 외부 요청 images.unsplash.com 만, 회귀 0
- 캡처: test-results/legal-b/up03/14/ 전후 비교 (헤더, 진단, 과정 상세, 비교표, 법정 표) 1440·390

커밋: feat(content): 시각 고도화 (과정 아이콘·진단 요약·수치 스트립·비교표)
- ref/legal 새 문서 4개 포함
절차: npx tsc --noEmit → npm run build → commit (Co-Authored-By 유지)
하나씩: git push law-b feat/legal-b → git push law-b feat/legal-b:main → git ls-remote law-b
차단 시 우회 금지 후 보고, stash@{0} 유지

[보고 (짧게)]
- 문서 이해 요약 3줄
- 명세와 다르게 구현한 곳과 이유
- 선택된 과정 아이콘 7종 표
- 텍스트 다이어트 전후 문구 표 + 글자 수 A/B/감소율
- 검증 표 (시각 앵커 화면별, 아이콘 밀도, 밸런스 수치)
- 캡처 경로 (전후 비교), 커밋 해시와 푸시 결과
보고 후 멈추세요.
```

---

## 단계 15. 통합 검수 + 최종 보고 (커밋 15)

```
[커밋 14 판단]
(여기에 커밋 14 보고에 대한 승인·수정 사항 기입)

- ref/legal/PROMPT_build_legal-B_upgrade-02.md 의 '단계 14' 코드 블록 전체를 수행하되 아래를 추가
  1. TECHSPEC upgrade-03 §8 (LB47) 검수 항목을 verify-legal-b.mjs 에 포함
  2. 높이 예산은 D16 기준 (읽는 블록 합계 / 과업 블록 분리 보고)
  3. REPORT 파일명: ref/legal/REPORT_legal-B_upgrade-03.md
  4. REPORT 에 '대표 피드백 대응' 절 추가: 시각 앵커 화면별 결과, 글자 수 감소율, 전후 캡처 목록
  5. REPORT 의 '사이트 공통 개선 항목' 에 기존 항목(h1 다수, .hs-tag 대비, 기존 사진 출처) 유지
- 커밋: test(legal-b): 짝 설계·시각 앵커·상용화 검수·최종 보고
- 절차·보고 형식은 upgrade-02 단계 14 와 동일
보고 후 멈추세요.
```

---

## 공통 주의
- 아이콘은 의미 전달용만. 장식·반복 금지, 라벨당 1개, 본문 문장 안 금지
- 새 색·토큰·라운드·브레이크포인트 금지, 필요하면 코드 작성 전 보고
- Lucide 단일 세트, 런타임 API 호출 금지
- 법적 고지·과정 원문 문구 수정 금지
- 푸시는 law-b 로만, 명령 3개 하나씩, --force·태그 푸시 금지
