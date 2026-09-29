import type { LegalKind } from '@/data/legal';
import { HUB_COPY } from '@/data/legalHub';
import { LgIcon } from './icons';

const L = HUB_COPY.lineup;

/**
 * 구분 배지 (legal-B upgrade-03 D22, TECHSPEC §4-2). 과정 카드·상세·진단 그룹 제목·법정 표가 공유한다.
 * 색 체계는 기존 .lg-kind 그대로(의무 P4 10% 면 / 권고 surface / 업종별 흰 면 + line), 아이콘 16 추가.
 * label: 기본은 kindLabel(법정 의무·권고·업종별), 진단 그룹 제목처럼 다른 표기가 필요할 때만 지정.
 * count: 진단 그룹 제목에서 개수를 붙여 구분 막대의 범례를 겸한다(D26).
 */
export default function KindBadge({ kind, label, note, count }: { kind: LegalKind; label?: string; note?: string; count?: number }) {
  return (
    <span className={`lg-kind k-${kind}`}>
      <LgIcon name={L.kindIcons[kind]} size={16} />
      {label ?? L.kindLabel[kind]}{note && ` · ${note}`}
      {count != null && <b className="lg-kind-n">{count}</b>}
    </span>
  );
}
