import { expect, type Page } from '@playwright/test';

/**
 * E2E 공용 헬퍼 (UI/UX 품질검수 K8·K12). 고정 대기 대신 상태로 기다린다.
 */

/** 스크롤 정착: 연속 3프레임 scrollY 동일 (최대 timeout) */
export function scrollSettled(page: Page, timeout = 8000) {
  return page.evaluate((limit) => new Promise<void>((done) => {
    let last = -1, same = 0;
    const t0 = performance.now();
    const tick = () => {
      const y = Math.round(window.scrollY);
      same = y === last ? same + 1 : 0; last = y;
      if (same >= 3 || performance.now() - t0 > limit) done(); else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }), timeout);
}

/** 두 프레임 대기: 관찰자(IntersectionObserver) 콜백과 그 결과 렌더가 반영될 시간 */
export function frames(page: Page, n = 2) {
  return page.evaluate((count) => new Promise<void>((done) => {
    let i = 0;
    const tick = () => (++i >= count ? done() : requestAnimationFrame(tick));
    requestAnimationFrame(tick);
  }), n);
}

/** 요소 상단을 화면 세로 frac 지점으로 즉시 이동 후 정착 */
export async function jumpTo(page: Page, sel: string, frac: number) {
  await page.evaluate(([s, f]) => {
    const el = document.querySelector(s as string);
    if (!el) throw new Error('missing ' + s);
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - window.innerHeight * (f as number), behavior: 'instant' as ScrollBehavior });
  }, [sel, frac] as const);
  await scrollSettled(page);
  await frames(page);
}

/** 문서 맨 위·맨 아래로 즉시 이동 후 정착 */
export async function jumpY(page: Page, where: 'top' | 'bottom') {
  await page.evaluate((w) => window.scrollTo({ top: w === 'top' ? 0 : document.documentElement.scrollHeight, behavior: 'instant' as ScrollBehavior }), where);
  await scrollSettled(page);
  await frames(page);
}

export const isOn = (page: Page) => page.evaluate(() => !!document.querySelector('.fi.is-on'));

/** 바 노출 상태가 기대값이 될 때까지 폴링 */
export const expectBar = (page: Page, on: boolean, message?: string) => expect.poll(() => isOn(page), { message }).toBe(on);

/** 바 등장 전환(.32s)이 끝날 때까지: 카드가 최종 위치(transform 0)에 오면 끝 */
export const barSettled = (page: Page) => expect.poll(() => page.evaluate(() => {
  const fi = document.querySelector<HTMLElement>('.fi.is-on');
  return !!fi && getComputedStyle(fi).opacity === '1' && new DOMMatrix(getComputedStyle(fi).transform).m42 === 0;
})).toBe(true);

/** 가림 경계: GNB 하단과 보이는 SubNav 하단 중 큰 값 */
export const occlusion = (page: Page) => page.evaluate(() => {
  const nav = document.querySelector('header.nav')!.getBoundingClientRect().bottom;
  const sub = document.querySelector<HTMLElement>('.subnav');
  const subB = sub && sub.offsetParent ? sub.getBoundingClientRect().bottom : 0;
  return Math.round(Math.max(nav, subB));
});

/** 웹폰트 적용 완료 */
export const fontsReady = (page: Page) => page.evaluate(() => document.fonts.ready.then(() => undefined));
