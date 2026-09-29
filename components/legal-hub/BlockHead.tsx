/**
 * 허브 블록 헤더 (legal-B upgrade-01 §3-1, 결정 D3).
 * kicker = 기존 .substep 값(P4 선 + 14px/800), 제목 h3 = 기존 홈 .ptext h3 값 clamp(20px,2.3vw,28px)/800, 리드 선택.
 * 블록 안 하위 묶음 제목은 h4.lg-sub-title.
 */
export default function BlockHead({ kicker, title, lead, id }: { kicker: string; title: string; lead?: string; id?: string }) {
  return (
    <div className="lg-bh">
      <p className="lg-bh-kicker">{kicker}</p>
      <h3 className="lg-bh-title" id={id}>{title}</h3>
      {lead && <p className="lg-bh-lead">{lead}</p>}
    </div>
  );
}
