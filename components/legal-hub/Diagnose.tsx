'use client';

import { useEffect, useRef, useState } from 'react';
import { courseById, type LegalCourseId } from '@/data/legal';
import { HUB_COPY } from '@/data/legalHub';
import { diagnose, type DiagAnswer } from '@/lib/legal/diagnose';
import { usePick } from '@/lib/legal/pick';
import BlockHead from './BlockHead';

const D = HUB_COPY.diagnose;
const GROUPS = ['mandatory', 'recommended', 'industry'] as const;

/**
 * 필요 과정 진단 (legal-B upgrade-01 LB22 — LB5 변경).
 * 5+7 행(문항 | 결과), 두 칸 높이 맞춤. 결과는 처음부터 공통 추천을 보여 주고 답할 때마다 갱신한다.
 * 새로 추가된 과정 칩만 240ms 강조(reduced-motion 즉시). '추천 과정 모두 담기' 가 블록 유일 1차 버튼.
 * 모두 담기 상태는 선택 상태에서 파생 — 추천 과정이 모두 담겨 있으면 '담았습니다' 문구, 누르면 라인업으로 이동.
 */
export default function Diagnose() {
  const [a, setA] = useState<DiagAnswer>({});
  const pick = usePick();
  const result = diagnose(a);
  const ids: LegalCourseId[] = [...result.mandatory, ...result.recommended, ...result.industry];
  const allPicked = ids.every((id) => pick.has(id));

  // 직전 결과와 비교해 새로 들어온 과정만 강조 (gen 이 바뀌면 칩을 다시 그려 애니메이션을 다시 태운다)
  const sig = ids.join('|');
  const prev = useRef<string[] | null>(null);
  const [fresh, setFresh] = useState<{ ids: Set<string>; gen: number }>({ ids: new Set(), gen: 0 });
  useEffect(() => {
    const before = prev.current;
    prev.current = sig.split('|');
    if (!before) return; // 첫 렌더는 강조하지 않는다
    const added = prev.current.filter((id) => !before.includes(id));
    if (added.length) setFresh((f) => ({ ids: new Set(added), gen: f.gen + 1 }));
  }, [sig]);

  const onAdd = () => {
    if (!allPicked) { pick.addMany(ids); return; }
    const to = document.getElementById('mandatory-courses');
    if (!to) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    to.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <div className="lg-block lg-anchor" id="mandatory-diagnose">
      <BlockHead kicker={D.kicker} title={D.title} lead={D.sub} />
      <div className="lg-row" data-balance-row>
        <div className="lg-c5 lg-box lg-diag-q">
          {D.q.map((q) => (
            <fieldset className="lg-q" key={q.key}>
              <legend id={`lg-q-${q.key}`}>{q.label}</legend>
              <div className="lg-chips" role="radiogroup" aria-labelledby={`lg-q-${q.key}`}>
                {q.options.map(([v, label]) => (
                  <label className="lg-chip" key={v}>
                    <input
                      className="lg-sr"
                      type="radio"
                      name={`lg-diag-${q.key}`}
                      value={v}
                      checked={a[q.key as keyof DiagAnswer] === v}
                      onChange={() => setA((s) => ({ ...s, [q.key]: v }))}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>

        <div className="lg-c7 lg-box lg-diag-r" aria-live="polite" data-ga-id={result.complete ? 'legal-diag-done' : undefined}>
          <div className="lg-diag-res">
            {GROUPS.filter((g) => result[g].length > 0).map((g) => (
              <div className="lg-diag-group" key={g}>
                <h4>{D.groups[g]}</h4>
                <ul>
                  {result[g].map((id) => {
                    const isNew = fresh.ids.has(id);
                    return <li className={`lg-rchip${isNew ? ' is-new' : ''}`} key={isNew ? `${id}-${fresh.gen}` : id}>{courseById(id)!.short}</li>;
                  })}
                </ul>
              </div>
            ))}
            {result.smallNote && <p className="lg-diag-small">{D.smallNote}</p>}
            <p className="lg-diag-note">{result.complete ? D.note : D.defaultNote}</p>
          </div>
          <div className="lg-box-foot">
            <button type="button" className="btn btn-ink lg-diag-add" onClick={onAdd} data-ga-id="legal-diag-addall">
              {allPicked ? D.added : D.addAll}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
