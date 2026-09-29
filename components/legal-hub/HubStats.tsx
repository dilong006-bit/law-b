import { HUB_COPY } from '@/data/legalHub';

/**
 * 허브 헤더 수치 스트립 (legal-B upgrade-03 LB45, TECHSPEC §4-3, 결정 D25).
 * dl/dt/dd — dt 가 숫자라 '7 과정' 으로 읽힌다. 1041 이상 빠른 실행 옆 4열(짝 peer), 1040 이하 리드 아래(CSS order),
 * 560 이하 4칸 한 줄 우선(라벨 줄바꿈·44px 침범 시 2×2 — 보고 기준).
 */
export default function HubStats() {
  return (
    <dl className="lg-c4 lg-stats">
      {HUB_COPY.head.stats.map((s) => (
        <div className="lg-stat" key={s.label}>
          <dt className="lg-stat-num">{s.num}</dt>
          <dd className="lg-stat-label">{s.label}</dd>
        </div>
      ))}
    </dl>
  );
}
