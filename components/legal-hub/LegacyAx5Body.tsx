import { AX5 } from '@/data/content';

/**
 * 임시 블록 — 기존 #ax5 본문(시리즈 타임라인·법정 카드·차별점 표)을 허브 #mandatory-law 자리에 그대로 옮긴 것.
 * 배포본에서 내용이 사라지지 않도록 단계 5~6 동안만 쓴다.
 * 단계 7 에서 LawTable(LB8)·Difference(LB10)로 교체 예정 — 교체 시 이 파일 삭제.
 * 기존 대비 차이: 타임라인 cc(외부 작품명)는 렌더하지 않는다(legal-B §0-8).
 */
export default function LegacyAx5Body() {
  return (
    <>
      <div className="substep">{AX5.seriesSub}</div>
      <div className="timeline">
        {AX5.timeline.map((t) => (
          <div className={`tnode${t.cur ? ' cur' : ''}`} key={t.yr}><div className="dot" /><div className="yr">{t.yr}</div><div className="nm">{t.nm}</div>{t.cur && <div className="bn">현재 시리즈</div>}</div>
        ))}
      </div>
      <div className="substep">{AX5.lawSub}</div>
      <div className="lawgrid">
        {AX5.laws.map((l) => (
          <div className="lawcard" key={l.h3}><span className="must">의무</span><h3>{l.h3}</h3>
            <div className="frow"><dt>근거</dt><dd>{l.근거}</dd></div>
            <div className="frow"><dt>대상</dt><dd>{l.대상}</dd></div>
            <div className="frow"><dt>주기</dt><dd>{l.주기}</dd></div>
          </div>
        ))}
      </div>
      <div className="substep">{AX5.diffSub}</div>
      {/* overflow-x:auto로 가로 스크롤을 의도한 3열 비교표 — 모바일 계측(C2) 예외 표식 */}
      <div className="difftable" data-hscroll>
        <table><thead><tr>{AX5.diffHead.map((h) => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>{AX5.diff.map((r) => <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>)}</tbody></table>
      </div>
      <p className="samplenote">{AX5.note}</p>
    </>
  );
}
