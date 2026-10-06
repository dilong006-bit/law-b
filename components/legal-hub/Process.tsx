'use client';

import { HUB_COPY } from '@/data/legalHub';
import { CONSULT_HASH, onConsultClick } from '@/lib/legal/goConsult';
import { COMPLETE_ICON, type LgIconName } from '@/lib/legal/iconData';
import BlockHead from './BlockHead';
import { LgIcon } from './icons';

const P = HUB_COPY.process;
/** upgrade-04 LB52: 신청 → 구성 확정 → 운영·독려 → 수료. 수료 아이콘은 후보 중 선택 결과(COMPLETE_ICON) */
const ICON: Record<string, LgIconName> = { select: 'list-checks', confirm: 'calendar-check', operate: 'monitor-play', complete: COMPLETE_ICON };

/**
 * 도입 절차 독립 블록 (legal-B upgrade-02 LB35, upgrade-01 LB25).
 * 4단계 카드(짝 관계 peer, 높이 동일) + 연결선. 시각적 숫자 없음(ol 의미만). 블록 1차 버튼 1개.
 * 1041 이상 가로 연결선 / 561~1040 연결선 없음(880 이하 2×2) / 560 이하 세로 타임라인.
 * 1차 버튼은 goConsult — 빠른 상담으로 이동 후 폼 첫 칸 포커스.
 */
export default function Process() {
  return (
    <div className="lg-block lg-anchor" id={P.id}>
      <BlockHead kicker={P.kicker} title={P.title} />
      <ol className="lg-row lg-steps" data-balance-row data-pair="peer">
        {P.steps.map((s) => (
          <li className="lg-c3 lg-box lg-step" key={s.key}>
            <span className="lg-ico-tile"><LgIcon name={ICON[s.key]} size={24} /></span>
            <strong className="lg-step-label">{s.label}</strong>
            <p className="lg-step-desc">{s.desc}</p>
          </li>
        ))}
      </ol>
      <div className="lg-steps-foot">
        <a className="btn btn-ink lg-steps-cta" href={CONSULT_HASH} onClick={onConsultClick} data-ga-id={P.cta.gaId}>
          {P.cta.label} <LgIcon name="arrow-right" size={18} />
        </a>
      </div>
    </div>
  );
}
