/**
 * 허브 블록 헤더 (legal-B upgrade-01 §3-1, 결정 D3).
 * kicker = 기존 .substep 값(P4 선 + 14px/800), 제목 h3 = 기존 홈 .ptext h3 값 clamp(20px,2.3vw,28px)/800, 리드 선택.
 * 블록 안 하위 묶음 제목은 h4.lg-sub-title.
 * titleSr: 시각 제목이 블록 안 다른 곳(빠른 상담 패널)에 있을 때 h3 를 보조기기 전용으로 둔다(제목 구조 유지).
 */
export default function BlockHead({ kicker, title, lead, id, titleSr }: { kicker: string; title: string; lead?: string; id?: string; titleSr?: boolean }) {
  return (
    <div className="lg-bh">
      <p className="lg-bh-kicker">{kicker}</p>
      <h3 className={titleSr ? 'lg-sr' : 'lg-bh-title'} id={id}>{title}</h3>
      {lead && <p className="lg-bh-lead">{lead}</p>}
    </div>
  );
}
