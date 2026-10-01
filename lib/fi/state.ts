/**
 * 플로팅 문의 바 순수 로직 (기술명세서 최종 v2.0 §4·§7). DOM·React 의존 없음, 단위 테스트 대상.
 * 신호 수집은 lib/useFloatingInquiry.ts, 판정은 여기서만 한다.
 */
import type { FiCopy, FiPage } from '@/data/floatingInquiry';

export type FiSignals = {
  configured: boolean; dismissed: boolean; reached: boolean;
  hideTargetSeen: boolean; footerSeen: boolean; blocked: boolean;
  mobile: boolean; inputFocused: boolean; shortViewport: boolean;
};

/** 명세 4장 식 그대로 */
export function computeVisible(s: FiSignals): boolean {
  return s.configured
    && !s.dismissed
    && s.reached
    && !s.hideTargetSeen
    && !s.footerSeen
    && !s.blocked
    && !(s.mobile && s.inputFocused)
    && !s.shortViewport;
}

/** 현재 구간 문구. activeZone 은 zones[].selector 중 하나 또는 null(기본 구간) */
export function pickCopy(page: FiPage, activeZone: string | null): FiCopy {
  if (!activeZone) return page.copy;
  return page.zones?.find((z) => z.selector === activeZone)?.copy ?? page.copy;
}

/** 계측용 구간 이름: 'default' 또는 셀렉터에서 '#' 을 뺀 값 ('#mandatory' → 'mandatory') */
export function zoneName(activeZone: string | null): string {
  return activeZone ? activeZone.replace(/^#/, '') : 'default';
}

/**
 * 링크 href. 같은 페이지면 target(#inq), external 이면 target 그대로.
 * JS 가 꺼져 있어도 이동은 되도록 실제 주소를 쓴다 (관심 영역 재적용은 JS 클릭 처리에서).
 */
export function resolveHref(page: FiPage, copy: FiCopy): string {
  void copy; // 구간이 바뀌어도 이동 대상은 페이지 단위로 같다 (명세 7장)
  return page.target;
}

/** 경로 → 설정. 끝 슬래시는 무시, 설정 없는 경로는 null */
export function findPage(pages: readonly FiPage[], pathname: string | null): FiPage | null {
  if (!pathname) return null;
  const p = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return pages.find((x) => x.path === p) ?? null;
}
