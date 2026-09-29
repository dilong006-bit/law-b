# Claude Code 빌드 프롬프트: 청렴훈련 캠페인 게재 v1.0

## 사전 준비 (사람이 직접)
| 파일 | 넣을 위치 |
|---|---|
| PRD_KEESS_integrity-campaign_v1.0.md | KEESS_law-B/ref/integrity/ |
| TECHSPEC_KEESS_integrity-campaign_v1.0.md | KEESS_law-B/ref/integrity/ |
| PROMPT_build_integrity-campaign_v1.0.md | KEESS_law-B/ref/integrity/ |
| integrity-campaign-visual.png | KEESS_law-B/public/images/integrity/ |
| integrity-campaign-visual.webp | KEESS_law-B/public/images/integrity/ |
| 배너 원본 (1920×384 jpg) | KEESS_law-B/ref/integrity/src/integrity_banner_1920x384.jpg |
| 팝업 캡처 (272×401 png, 참고용) | KEESS_law-B/ref/integrity/src/integrity_poster_popup.png |

- 순서: 법정필수 B안 커밋 14 보고 확인 후 이 프롬프트 입력 (커밋 15)

---

## 입력 프롬프트 (커밋 15)

```
[커밋 14 판단]
(여기에 커밋 14 보고에 대한 승인·수정 사항 기입)

[이번 작업: 청렴훈련 캠페인 게재 (커밋 15)]
플로우 G3. 운영 · 요청대응 태스크. 법정필수 B안과 같은 배포로 반영합니다.
- 목적: 훈련기관으로서 부당영업을 하지 않는다는 청렴 의지를 이용자에게 공개 (한국산업인력공단 청렴훈련 캠페인)
- 게재 형식 제한 없음. 새 팝업 없이 기존 '부정훈련 예방 및 신고' 모달에 탭 1개 추가

[읽을 문서 (ref/integrity/)]
1. PRD_KEESS_integrity-campaign_v1.0.md (IC1~IC7)
2. TECHSPEC_KEESS_integrity-campaign_v1.0.md (§0 절대 규칙, §1 실측, §3 카피, §4~§8)
- 법정필수 B안의 공통 규칙(토큰, 브레이크포인트, 대비 D18, 대시 금지)은 그대로 적용

[진행]
15-0. 실측 (TECHSPEC §1)
- 모달·푸터 위치, 탭 상태 구현 방식, 진입점과 각 기본 탭, 딥링크 유무, 모달 아이콘 방식, 360 탭 표시 방식
- 표로 정리. 명세대로 진행하는 데 막히는 점이 없으면 보고를 이번 최종 보고에 포함하고 바로 진행
- 막히는 점(기존 탭 동작을 바꿔야 하는 경우 등)이 있으면 그 지점에서 멈추고 보고

15-1. 자산 확인
- public/images/integrity/ 의 png·webp 가 730×328 인지 확인 (다르면 멈추고 보고)
- 이미지 가공 금지 (크기 변경·보정·재압축 금지)
- ref/integrity/ASSET_SOURCES.md 작성: 소스 배너 경로, 자른 영역 (x 840, y 28, w 730, h 328), 일러스트 영역만 사용·타 기관 UI 배제, 공단 원본 수령 시 교체 예정

15-2. 모달 (TECHSPEC §4)
- 제목 '청렴훈련 · 부정훈련 신고'
- 탭 [청렴훈련 캠페인] [예방안내] [신고 접수] [신고 조회], 탭 상태는 문자열 키 권장
- openIntegrity(tab?) 기본값 'campaign', 신고 진입은 'report'
- 푸터 링크: '청렴훈련 · 부정훈련 예방' → 캠페인 탭 / '부정훈련 신고' → 신고 접수 탭
- 기존 3개 탭 마크업·동작·API 변경 금지

15-3. 캠페인 탭 (TECHSPEC §3, §5)
- INTEGRITY_COPY 한 곳에 정의
- 비주얼 카드(picture webp/png, width·height 지정, 캡션) → 태그 → 제목 → 핵심 문구 → NO/YES 칩 → 공단 문구 → 신고 연결
- 경고 박스 스타일 사용 금지, KEESS 토큰만 (P4 8%·25% 는 D5 기존 값)
- 아이콘 3개(금지, 체크, 이동)는 모달 기존 아이콘 방식. LgIcon 재사용 가능하면 재사용, 선택 보고
- '신고 접수로 이동': 탭 전환 + 포커스 이동 + 모달 스크롤 맨 위
- 이미지 실패 시 같은 비율 대체 면

15-4. 자사 카피 점검 (TECHSPEC §7)
- 정규식 3개로 app·components·data 검색, 결과 표 보고 (수정하지 말 것)

[검증 (TECHSPEC §8)]
- 기본 탭 2종, 신고 연결, 기존 탭 회귀(패널 innerHTML 비교, 신고 폼 검증·제출 흐름), 키보드·ESC·포커스 트랩
- 이미지 CLS 0, webp 로드, 실패 대체
- 대비, 8개 폭 가로 스크롤 0, 360 탭 라벨 줄바꿈 0
- 캠페인 탭 안 경고 박스 클래스 0, 대시 문자 0
- tsc·build 통과, 콘솔 0, verify-legal-b 통과 유지 (법정 허브 회귀 0)
- 캡처: test-results/integrity/ (모달 1440·390·360 캠페인 탭, 신고 이동 후)

커밋: feat(common): 청렴훈련 캠페인 탭 (부정훈련 모달)
- ref/integrity 문서·ASSET_SOURCES, public/images/integrity 자산 포함
절차: npx tsc --noEmit → npm run build → commit (Co-Authored-By 유지)
하나씩: git push law-b feat/legal-b → git push law-b feat/legal-b:main → git ls-remote law-b
차단 시 우회 금지 후 보고, stash@{0} 유지

[보고 (짧게)]
- 15-0 실측 표
- 명세와 다르게 구현한 곳과 이유
- 자사 카피 점검 결과 표
- 검증 표
- 캡처 경로, 커밋 해시와 푸시 결과
보고 후 멈추세요.
```

---

## 이후
- 법정필수 B안 통합 검수·최종 보고는 커밋 16 (upgrade-03 단계 15 프롬프트를 커밋 16 으로 사용, 이 기능 검증 결과 포함)
