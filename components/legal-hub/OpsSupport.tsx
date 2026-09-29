import { HUB_COPY } from '@/data/legalHub';

const S = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, width: 22, height: 22, 'aria-hidden': true };
/** HUB_COPY.ops.items 순서와 같은 아이콘 — 전담 운영자 / 방문 관리 / 이수 현황 / 학습 독려 */
const ICONS = [
  () => <svg {...S}><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0112 0" /><circle cx="17" cy="9" r="2.4" /><path d="M15 20a5 5 0 016-4.5" /></svg>,
  () => <svg {...S}><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4M8.5 14.5l2 2 4-4" /></svg>,
  () => <svg {...S}><path d="M4 20V4M4 20h16" /><path d="M8 16v-4M12 16V8M16 16v-6" /></svg>,
  () => <svg {...S}><path d="M6 17V11a6 6 0 0112 0v6l1.5 2h-15z" /><path d="M10 21h4" /></svg>,
];

/**
 * 운영 지원 (legal-B LB9). show:true 항목만 렌더한다 — 확인 전 항목은 화면·HTML 에 나가지 않는다.
 * 열 수는 항목 수로 정한다(2개: PC 2열 / 4개: 4 → 880 이하 2 → 560 이하 1). 번호 매김 없음.
 */
export default function OpsSupport() {
  const O = HUB_COPY.ops;
  const items = O.items.map((it, i) => ({ ...it, Icon: ICONS[i] })).filter((it) => it.show);
  if (!items.length) return null;
  return (
    <div className="lg-block">
      <h3 className="substep">{O.title}</h3>
      <ul className={`lg-ops n${items.length}`}>
        {items.map(({ t, d, Icon }) => (
          <li className="lg-op" key={t}>
            <span className="lg-op-ic"><Icon /></span>
            <div>
              <p className="lg-op-t">{t}</p>
              {d && <p className="lg-op-d">{d}</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
