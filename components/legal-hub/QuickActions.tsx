import type { CSSProperties } from 'react';
import { HUB_COPY, hubOn } from '@/data/legalHub';
import { LgIcon } from './icons';
import type { LgIconName } from '@/lib/legal/iconData';
import { onConsultClick } from '@/lib/legal/goConsult';
import HubStats from './HubStats';

/** 빠른 실행 아이콘 (TECHSPEC upgrade-02 §3-3). upgrade-04 D28: 항목 필터 후 어긋나지 않게 href 키 맵 */
const QUICK_ICONS: Record<string, LgIconName> = {
  '#mandatory-diagnose': 'search-check',
  '#mandatory-courses': 'layout-grid',
  '#mandatory-inquiry': 'message-circle',
};

/**
 * 허브 빠른 실행 (legal-B upgrade-01 LB21, §6-1). 같은 폭 보조 버튼(btn-line-dark).
 * upgrade-04 LB49: needs 표식 항목은 플래그로 걸러 2개('과정 보기'·'빠른 상담'), 열 수는 --lg-n.
 * 지표 스트립 비표시(statsShow=false)면 바로가기는 6열 폭, 880 이하 전폭 2개 균등, 560 이하 1열.
 * '빠른 상담'(consult) 은 goConsult — 빠른 상담으로 이동 후 폼 첫 칸 포커스 (upgrade-01 §6-8).
 */
export default function QuickActions() {
  const H = HUB_COPY.head;
  const items = H.quick.filter(hubOn);
  return (
    // upgrade-03 D25: 빠른 실행 8열 ↔ 수치 스트립 4열 짝(peer). 1040 이하는 스트립이 CSS order 로 리드 바로 아래로 올라간다
    // upgrade-04 D29: 스트립이 없으면 짝이 없는 한 칸 행이라 높이 맞춤 검사(data-balance-row) 대상에서 뺀다
    <div
      className={`lg-row lg-head-row${H.statsShow ? '' : ' no-stats'}`}
      data-balance-row={H.statsShow ? '' : undefined}
      data-pair={H.statsShow ? 'peer' : undefined}
    >
      <nav className={`${H.statsShow ? 'lg-c8' : 'lg-c6'} lg-quick`} aria-label="법정필수교육 바로가기">
        <ul style={{ '--lg-n': items.length } as CSSProperties}>
          {items.map((q) => (
            <li key={q.href}>
              <a className="btn btn-line-dark lg-quick-a" href={q.href} onClick={'consult' in q ? onConsultClick : undefined} data-ga-id={q.gaId}><LgIcon name={QUICK_ICONS[q.href]} size={18} /> {q.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      {H.statsShow && <HubStats />}
    </div>
  );
}
