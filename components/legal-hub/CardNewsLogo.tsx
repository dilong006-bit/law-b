/**
 * 카드뉴스 좌상단 로고 (26827 카드뉴스 고도화 기술명세서 v1.0 §3.3 공통). HTML 임시본 전용.
 * 공식 CI 수령 시 이 파일만 바꾼다:
 *   public/images/ci/kgeduone.svg (밝은 면, opening·사진 위 흰 칩)
 *   public/images/ci/kgeduone-white.svg (어두운 면, closing)
 * 지금은 CI 파일이 없어 텍스트 워드마크 "KG에듀원" (Pretendard 800, 4.074cqw) 로 둔다.
 * 디자이너 최종 JPG 에는 공식 CI 가 들어가므로 JPG 모드에서는 쓰지 않는다.
 *
 * tone: ink(밝은 배경, --p1 글자) / white(보라 오버레이, 흰 글자) / chip(사진 위, 흰 칩 + --p1 글자)
 */
export default function CardNewsLogo({ tone }: { tone: 'ink' | 'white' | 'chip' }) {
  return (
    <span className={`cnx-logo cnx-logo--${tone}`} aria-hidden="true">
      <span className="cnx-logo-w">KG에듀원</span>
    </span>
  );
}
