/**
 * Unsplash 핫링크 URL·srcset (legal-B upgrade-02 D11, TECHSPEC upgrade-02 §4-1).
 * base 는 쿼리 없는 images.unsplash.com 주소. 로컬 경로면 그대로 쓴다(LgPhoto 가 판별).
 * fp(초점 0~1)를 주면 crop=focalpoint 로 자른다 (26827 카드뉴스 기술명세서 §3.4). 없으면 기존 URL 과 같다.
 */
const W = [640, 1080, 1600, 2000] as const;

export type FocalPoint = { x: number; y: number };

export function isUnsplash(src: string) { return src.startsWith('https://images.unsplash.com/'); }

export function unsplashUrl(base: string, w: number, ratio?: readonly [number, number], fp?: FocalPoint) {
  const h = ratio ? `&h=${Math.round((w * ratio[1]) / ratio[0])}` : '';
  const f = fp ? `&crop=focalpoint&fp-x=${fp.x}&fp-y=${fp.y}` : '';
  return `${base.split('?')[0]}?auto=format&fit=crop&q=78&w=${w}${h}${f}`;
}

export function unsplashSrcSet(base: string, ratio?: readonly [number, number], widths: readonly number[] = W, fp?: FocalPoint) {
  return widths.map((w) => `${unsplashUrl(base, w, ratio, fp)} ${w}w`).join(', ');
}
