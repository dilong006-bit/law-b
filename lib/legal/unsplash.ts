/**
 * Unsplash 핫링크 URL·srcset (legal-B upgrade-02 D11, TECHSPEC upgrade-02 §4-1).
 * base 는 쿼리 없는 images.unsplash.com 주소. 로컬 경로면 그대로 쓴다(LgPhoto 가 판별).
 */
const W = [640, 1080, 1600, 2000] as const;

export function isUnsplash(src: string) { return src.startsWith('https://images.unsplash.com/'); }

export function unsplashUrl(base: string, w: number, ratio?: readonly [number, number]) {
  const h = ratio ? `&h=${Math.round((w * ratio[1]) / ratio[0])}` : '';
  return `${base.split('?')[0]}?auto=format&fit=crop&q=78&w=${w}${h}`;
}

export function unsplashSrcSet(base: string, ratio?: readonly [number, number], widths: readonly number[] = W) {
  return widths.map((w) => `${unsplashUrl(base, w, ratio)} ${w}w`).join(', ');
}
