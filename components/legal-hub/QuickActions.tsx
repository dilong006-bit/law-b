import { HUB_COPY } from '@/data/legalHub';
import { LgIcon } from './icons';
import type { LgIconName } from '@/lib/legal/iconData';
import { onConsultClick } from '@/lib/legal/goConsult';
import HubStats from './HubStats';

/** 빠른 실행 아이콘 (TECHSPEC upgrade-02 §3-3): 필요 과정 찾기 / 과정 보기 / 빠른 상담 */
const QUICK_ICONS: LgIconName[] = ['search-check', 'layout-grid', 'message-circle'];

/**
 * 허브 빠른 실행 3개 (legal-B upgrade-01 LB21, §6-1). 같은 폭 보조 버튼(btn-line-dark).
 * 1041 이상 한 줄 (12열 중 8열 폭), 560 이하 1열 전체 폭.
 * '빠른 상담'(consult) 은 goConsult — 빠른 상담으로 이동 후 폼 첫 칸 포커스 (upgrade-01 §6-8).
 */
export default function QuickActions() {
  return (
    // upgrade-03 D25: 빠른 실행 8열 ↔ 수치 스트립 4열 짝(peer). 1040 이하는 스트립이 CSS order 로 리드 바로 아래로 올라간다
    <div className="lg-row lg-head-row" data-balance-row data-pair="peer">
      <nav className="lg-c8 lg-quick" aria-label="법정필수교육 바로가기">
        <ul>
          {HUB_COPY.head.quick.map((q, i) => (
            <li key={q.href}>
              <a className="btn btn-line-dark lg-quick-a" href={q.href} onClick={'consult' in q ? onConsultClick : undefined} data-ga-id={q.gaId}><LgIcon name={QUICK_ICONS[i]} size={18} /> {q.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <HubStats />
    </div>
  );
}
