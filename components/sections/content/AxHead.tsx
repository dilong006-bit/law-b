/**
 * /content 축 헤더 — Sections.tsx 에서 분리(마크업·클래스 동일).
 * 법정 허브(LegalHub)도 같은 헤더를 쓰므로 공용 파일로 둔다.
 * titleId: 선택 prop. 지정 시 h2 에 id 를 붙인다(허브 section 의 aria-labelledby 대상). 미지정이면 기존과 동일.
 */
export default function AxHead({ kicker, icon: Icon, title, lead, tag, extra, titleId }: { no?: string; kicker: string; icon: () => JSX.Element; title: React.ReactNode; lead?: string; tag?: string; extra?: React.ReactNode; titleId?: string }) {
  return (
    <div className="axhead">
      <div>
        <span className="ct-eyebrow r"><Icon /> {kicker}</span>
        <h2 id={titleId}>{title}</h2>
        {lead && <p className="lead">{lead}</p>}
      </div>
      {tag && <span className="axtag">{tag}</span>}
      {extra}
    </div>
  );
}
