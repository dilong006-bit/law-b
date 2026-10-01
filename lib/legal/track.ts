/**
 * 법정 허브 계측 (26827 카드뉴스 고도화 CN-12).
 * window.dataLayer(GTM) 배열이 있을 때만 { event, ...params } 를 넣는다. 없으면 아무 동작 없음 (현재 사이트는 GTM 미탑재, data-ga-id 표식과 병행).
 */
type Params = Record<string, string | number | boolean>;

export function track(event: string, params?: Params) {
  if (typeof window === 'undefined') return;
  const dl = (window as unknown as { dataLayer?: unknown }).dataLayer;
  if (Array.isArray(dl)) dl.push({ event, ...params });
}

/** 세션당 1회만 track. sessionStorage 를 못 쓰면(사생활 보호 모드 등) 페이지 안에서만 1회 */
const seenMem = new Set<string>();
export function trackOncePerSession(key: string, event: string, params?: Params) {
  const k = `keess_track_${key}`;
  try {
    if (sessionStorage.getItem(k)) return;
    sessionStorage.setItem(k, '1');
  } catch {
    if (seenMem.has(k)) return;
  }
  seenMem.add(k);
  track(event, params);
}
