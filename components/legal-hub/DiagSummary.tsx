import { HUB_COPY } from '@/data/legalHub';

const D = HUB_COPY.diagnose;
type G = 'mandatory' | 'recommended' | 'industry';
const ORDER: readonly G[] = ['mandatory', 'recommended', 'industry'];

/**
 * 진단 결과 요약 (legal-B upgrade-03 LB41, TECHSPEC §4-4).
 * '추천 N 과정' 큰 숫자 + 구분 막대(의무 P4 / 권고 P4 45% / 업종별 --line). 막대는 개수 비율(flex-grow)로 그린다.
 * 범례는 따로 두지 않는다 — 바로 아래 그룹 제목 배지(아이콘 + 글자 + 개수)가 막대와 같은 순서로 범례를 겸한다(D26).
 * 막대는 role=img + 개수 전부를 담은 aria-label. 전환 240ms (reduced-motion 즉시, CSS).
 */
export default function DiagSummary({ counts }: { counts: Record<G, number> }) {
  const n = ORDER.reduce((s, g) => s + counts[g], 0);
  const label = D.summary.bar(ORDER.filter((g) => counts[g] > 0).map((g) => `${D.groups[g]} ${counts[g]}`));
  return (
    <div className="lg-dg-sum">
      <p className="lg-dg-total"><span>{D.summary.pre}</span><b className="lg-dg-n">{n}</b><span>{D.summary.post}</span></p>
      <div className="lg-dg-bar" role="img" aria-label={label}>
        {ORDER.map((g, i) => {
          // 0개 구간도 DOM 에 남겨 폭 전환이 이어지게 한다. 구간 사이 3px 틈은 앞에 0이 아닌 구간이 있을 때만(is-sep)
          const sep = counts[g] > 0 && ORDER.slice(0, i).some((x) => counts[x] > 0);
          return <span key={g} className={`seg--${g}${sep ? " is-sep" : ""}`} style={{ flexGrow: counts[g] }} data-n={counts[g]} />;
        })}
      </div>
    </div>
  );
}
