/**
 * 사이트 계측 (26827 카드뉴스 고도화 CN-12, 플로팅 문의 바 FI-13).
 * window.dataLayer(GTM) 배열이 있을 때만 { event, ...params } 를 넣는다. 없으면 아무 동작 없음 (현재 사이트는 GTM 미탑재, data-ga-id 표식과 병행).
 */
type Params = Record<string, string | number | boolean>;

export function track(event: string, params?: Params) {
  if (typeof window === 'undefined') return;
  const dl = (window as unknown as { dataLayer?: unknown }).dataLayer;
  if (Array.isArray(dl)) dl.push({ event, ...params });
}

/**
 * 세션 안 첫 호출이면 true (sessionStorage 에 표시). sessionStorage 를 못 쓰면(사생활 보호 모드 등) 페이지 안에서만 1회.
 * key 는 저장 키 그대로 쓴다.
 */
const seenMem = new Set<string>();
export function firstInSession(key: string): boolean {
  if (seenMem.has(key)) return false;
  seenMem.add(key);
  try {
    if (sessionStorage.getItem(key)) return false;
    sessionStorage.setItem(key, '1');
  } catch { /* 메모리 기록으로 대신 */ }
  return true;
}

/** 세션당 1회만 track (저장 키 keess_track_{key}) */
export function trackOncePerSession(key: string, event: string, params?: Params) {
  if (firstInSession(`keess_track_${key}`)) track(event, params);
}
