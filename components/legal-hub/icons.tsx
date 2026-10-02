import { LG_ICONS, type LgIconName } from '@/lib/legal/iconData';

/**
 * 법정 허브 아이콘 (legal-B upgrade-02 D10, TECHSPEC upgrade-02 §3-2).
 * Iconify Lucide 단일 세트에서 빌드 전에 추출한 SVG body(lib/legal/iconData.ts)만 쓴다 — 런타임 외부 요청 없음.
 * 24px 격자, stroke 1.5, currentColor. label 이 없으면 장식(aria-hidden).
 * data-icon: 검수용 이름 표기 (upgrade-03 §8, 렌더 영향 없음).
 */
/**
 * 아이콘별 { __html } 객체를 모듈 수준에서 한 번만 만든다 (F2).
 * Next 14 App Router 의 내장 React(canary)는 prop 을 객체 동일성으로 비교해, 렌더마다 새 객체를 넘기면 문자열이 같아도 innerHTML 을 다시 설정한다
 * (누르는 도중 다시 렌더되면 path 가 교체되어 click 이 사라질 수 있음). 같은 객체를 넘기면 다시 설정하지 않는다. 서버 렌더 결과는 같다
 */
const HTML = Object.fromEntries(Object.entries(LG_ICONS).map(([k, v]) => [k, { __html: v }])) as Record<LgIconName, { __html: string }>;

export function LgIcon({ name, size = 20, label, className }: { name: LgIconName; size?: number; label?: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`lg-ico${className ? ' ' + className : ''}`}
      data-icon={name}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true, focusable: 'false' })}
      dangerouslySetInnerHTML={HTML[name]}
    />
  );
}
