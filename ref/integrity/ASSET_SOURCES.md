# KEESS 청렴훈련 캠페인 자산 출처 기록

- 기준: ref/integrity/TECHSPEC_KEESS_integrity-campaign_v1.0.md §10, PRD IC3
- 캠페인 주체: 한국산업인력공단 '청렴훈련 캠페인' (게재 형식 제한 없음, 사이트 내 게재로 충족)
- 기록일: 2026-09-29

## 사이트 사용 파일

| 파일 | 크기 | 용도 |
|---|---|---|
| public/images/integrity/integrity-campaign-visual.png | 730×328 | 부정훈련 모달 '청렴훈련 캠페인' 탭 비주얼 (webp 미지원 브라우저용) |
| public/images/integrity/integrity-campaign-visual.webp | 730×328 | 같은 비주얼 (기본 로드) |

- 가공 완료본. 크기 변경·보정·재압축 금지, 화면에서도 730px 를 넘겨 확대하지 않는다
- 대체 텍스트: `캠페인 청렴훈련, #건강한 훈련문화, 부당영업 NO, 청렴훈련 YES` (data/integrity.ts `INTEGRITY_COPY.visual.alt`)

## 원본 소스 (보관용, 사이트 미사용)

| 파일 | 내용 | 사용 |
|---|---|---|
| ref/integrity/src/integrity_banner_1920x384.jpg | 청렴훈련 캠페인 게재 배너 캡처 (1920×384) | 위 사이트 파일의 원본 |
| ref/integrity/src/integrity_poster_popup.png | 캠페인 팝업 캡처 | 참고용, 사이트 미사용 (저해상도, 타 기관 팝업 틀 포함) |

### 자른 영역
- 소스: `integrity_banner_1920x384.jpg`
- 영역: x 840, y 28, w 730, h 328 (일러스트 영역만)
- 제외: 배너 좌측 글자 영역, 타 기관 UI·문구

## 교체 예정
- 한국산업인력공단 원본 파일 수령 시 **같은 파일명**(integrity-campaign-visual.png / .webp)으로 교체한다. 코드 수정 없음
- 비율이 730:328 과 다르면 `INTEGRITY_COPY.visual.width·height` 와 대체 면 비율(`.ic-ph` aspect-ratio)을 함께 바꾼다
