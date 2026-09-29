import { LG_ICONS, type LgIconName } from '@/lib/legal/iconData';

/**
 * 법정 허브 아이콘 (legal-B upgrade-02 D10, TECHSPEC upgrade-02 §3-2).
 * Iconify Lucide 단일 세트에서 빌드 전에 추출한 SVG body(lib/legal/iconData.ts)만 쓴다 — 런타임 외부 요청 없음.
 * 24px 격자, stroke 1.5, currentColor. label 이 없으면 장식(aria-hidden).
 */
export function LgIcon({ name, size = 20, label, className }: { name: LgIconName; size?: number; label?: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`lg-ico${className ? ' ' + className : ''}`}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true, focusable: 'false' })}
      dangerouslySetInnerHTML={{ __html: LG_ICONS[name] }}
    />
  );
}
