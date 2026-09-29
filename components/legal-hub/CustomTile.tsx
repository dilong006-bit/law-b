'use client';

import { HUB_COPY } from '@/data/legalHub';
import { CONSULT_HASH, onConsultClick } from '@/lib/legal/goConsult';

const T = HUB_COPY.lineup.customTile;

/**
 * 맞춤 구성 상담 타일 (legal-B upgrade-01 LB23, §6-3). 과정 그리드의 마지막 칸을 채운다.
 * span = cols - (count % cols) (나머지 0 이면 cols). span ≥ 2 면 가로 배치(is-wide), 1 이면 세로.
 * 버튼은 goConsult — 빠른 상담으로 이동 후 폼 첫 칸 포커스.
 */
export default function CustomTile({ span }: { span: number }) {
  return (
    <div className={`lg-tile lg-box is-accent${span >= 2 ? ' is-wide' : ''}`} style={{ gridColumn: `span ${span}` }}>
      <div className="lg-tile-copy">
        <h3 className="lg-tile-title">{T.title}</h3>
        <p className="lg-tile-desc">{T.desc}</p>
      </div>
      <div className="lg-box-foot">
        <a className="btn btn-line-dark lg-tile-cta" href={CONSULT_HASH} onClick={onConsultClick} data-ga-id={T.gaId}>{T.cta}</a>
      </div>
    </div>
  );
}
