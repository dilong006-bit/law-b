'use client';

import { useState } from 'react';
import { courseById, type LegalCourseId } from '@/data/legal';
import { HUB_COPY } from '@/data/legalHub';
import { diagnose, type DiagAnswer } from '@/lib/legal/diagnose';
import { usePick } from '@/lib/legal/pick';

const D = HUB_COPY.diagnose;
const GROUPS = ['mandatory', 'recommended', 'industry'] as const;

/**
 * 필요 과정 진단 (legal-B LB5).
 * 네이티브 라디오(방향키·스크린리더 기본 지원) + 라벨 칩. 3문항이 모두 선택되면 버튼 없이 결과를 보여 준다.
 * '추천 과정 모두 담기' 상태는 선택 상태에서 파생한다 — 추천 과정이 모두 담겨 있으면 '담았습니다' 문구가 되고,
 * 그때 누르면 과정 라인업(#mandatory-courses)으로 이동한다. 카드·폼에서 빼면 다시 '모두 담기'로 돌아온다.
 */
export default function Diagnose() {
  const [a, setA] = useState<DiagAnswer>({});
  const pick = usePick();
  const result = diagnose(a);
  const ids: LegalCourseId[] = result ? [...result.mandatory, ...result.recommended, ...result.industry] : [];
  const allPicked = ids.length > 0 && ids.every((id) => pick.has(id));

  const onAdd = () => {
    if (!allPicked) { pick.addMany(ids); return; }
    const to = document.getElementById('mandatory-courses');
    if (!to) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    to.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <div className="lg-block lg-anchor" id="mandatory-diagnose">
      <h3 className="substep">{D.title}</h3>
      <p className="lg-block-sub">{D.sub}</p>
      <div className="lg-diag">
        <div className="lg-diag-q">
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

        <div className="lg-diag-r" aria-live="polite">
          {!result ? (
            <p className="lg-diag-empty">{D.empty}</p>
          ) : (
            // 선택이 바뀔 때마다 결과를 다시 그려 등장 전환(240ms)을 태운다
            <div className="lg-diag-res" key={ids.join('|') + (result.smallNote ? '|s' : '')} data-ga-id="legal-diag-done">
              {GROUPS.map((g) => (
                <div className="lg-diag-group" key={g}>
                  <h4>{D.groups[g]}</h4>
                  <ul>
                    {result[g].map((id) => <li className="lg-rchip" key={id}>{courseById(id)!.short}</li>)}
                  </ul>
                </div>
              ))}
              {result.smallNote && <p className="lg-diag-small">{D.smallNote}</p>}
              <p className="lg-diag-note">{D.note}</p>
              <button type="button" className="btn btn-ink lg-diag-add" onClick={onAdd} data-ga-id="legal-diag-addall">
                {allPicked ? D.added : D.addAll}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
