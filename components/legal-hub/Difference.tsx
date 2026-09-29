import { AX5 } from '@/data/content';
import { HUB_COPY } from '@/data/legalHub';

/**
 * 차별점·시리즈 (legal-B LB10).
 * 타임라인은 기존 .timeline/.tnode 재사용, 연도·시리즈명·현재 표시만(외부 작품명 cc 렌더 금지).
 * 차별점은 기존 .difftable(641 이상) + 640 이하 항목별 카드(.lg-diff-m) — 같은 AX5.diff 데이터.
 */
export default function Difference() {
  const [hKey, hGen, hOwn] = AX5.diffHead;
  return (
    <div className="lg-block lg-diff">
      <h3 className="substep">{HUB_COPY.diff.title}</h3>
      <h4 className="lg-subh">{AX5.seriesSub}</h4>
      <div className="timeline">
        {AX5.timeline.map((t) => (
          <div className={`tnode${t.cur ? ' cur' : ''}`} key={t.yr}>
            <div className="dot" /><div className="yr">{t.yr}</div><div className="nm">{t.nm}</div>
            {t.cur && <div className="bn">{HUB_COPY.diff.current}</div>}
          </div>
        ))}
      </div>
      <h4 className="lg-subh">{AX5.diffSub}</h4>
      <div className="difftable">
        <table>
          <thead><tr><th scope="col">{hKey}</th><th scope="col">{hGen}</th><th scope="col">{hOwn}</th></tr></thead>
          <tbody>{AX5.diff.map((r) => <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>)}</tbody>
        </table>
      </div>
      <ul className="lg-diff-m">
        {AX5.diff.map((r) => (
          <li key={r[0]}>
            <p className="lg-diff-t">{r[0]}</p>
            <dl>
              <div><dt>{hGen}</dt><dd>{r[1]}</dd></div>
              <div className="own"><dt>{hOwn}</dt><dd>{r[2]}</dd></div>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
