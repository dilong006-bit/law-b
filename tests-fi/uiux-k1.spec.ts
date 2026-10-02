import { test, expect, type Page } from '@playwright/test';

/**
 * K1: 첫 방문(폰트 캐시 없음) 해시 진입에서 Pretendard 적용으로 줄바꿈이 바뀌어 부드러운 해시 스크롤 목적지가 어긋나던 문제.
 * 매 회 새 컨텍스트(캐시 없음)로 진입해 정착 후 섹션 상단 = 가림 경계 + 16 (±4px) 을 5/5 확인한다.
 * 사용자가 그 사이 직접 스크롤하면 재보정하지 않는다.
 */

/** 스크롤 정착: 연속 3프레임 scrollY 동일 + 웹폰트 적용 완료 */
async function settled(page: Page, fonts = true) {
  if (fonts) await page.evaluate(() => document.fonts.ready.then(() => undefined));
  await page.evaluate(() => new Promise<void>((done) => {
    let last = -1, same = 0;
    const t0 = performance.now();
    const tick = () => {
      const y = Math.round(scrollY);
      same = y === last ? same + 1 : 0; last = y;
      if (same >= 3 || performance.now() - t0 > 8000) done(); else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }));
}

const offset = (page: Page, id: string) => page.evaluate((i) => {
  const nav = document.querySelector('header.nav')!.getBoundingClientRect().bottom;
  const sub = document.querySelector<HTMLElement>('.subnav');
  const subB = sub && sub.offsetParent ? sub.getBoundingClientRect().bottom : 0;
  return Math.round(document.getElementById(i)!.getBoundingClientRect().top - (Math.max(nav, subB) + 16));
}, id);

for (const [path, width, height] of [['/leadership', 1440, 900], ['/leadership', 390, 844], ['/hrd', 1440, 900], ['/hrd', 390, 844]] as const) {
  test(`K1 첫 방문 해시 진입 정렬 ${path} ${width}`, async ({ browser }) => {
    const offs: number[] = [];
    for (let i = 0; i < 5; i++) {
      const ctx = await browser.newContext({ viewport: { width, height } });
      const page = await ctx.newPage();
      await page.goto(`${path}#inq`, { waitUntil: 'networkidle' });
      // 재보정은 폰트 적용 뒤 스크롤이 멈춘 다음에 일어난다: 정착을 두 번 확인
      await settled(page);
      await settled(page);
      offs.push(await offset(page, 'inq'));
      await ctx.close();
    }
    expect(offs.every((o) => Math.abs(o) <= 4), `5회 오차 ${JSON.stringify(offs)}`).toBe(true);
  });
}

test('K1 사용자가 직접 스크롤하면 재보정하지 않음', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  // 테스트 조건: 폰트 응답을 2.5초 늦춰 해시 스크롤이 끝난 뒤 폰트가 적용되게 한다 (네트워크 지연 재현, 판정 대기 아님)
  await page.route(/\.woff2$/, async (r) => { await new Promise((ok) => setTimeout(ok, 2500)); await r.continue(); });
  await page.goto('/leadership#inq', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Math.abs(document.getElementById('inq')!.getBoundingClientRect().top) < 400);
  // 해시 스크롤이 멈출 때까지 (폰트는 아직 오지 않음)
  await settled(page, false);
  expect(await page.evaluate(() => document.fonts.status), '폰트 적용 전').toBe('loading');
  // 폰트 적용 전에 사용자가 휠로 위로 400px 이동
  await page.mouse.move(700, 450);
  await page.mouse.wheel(0, -400);
  await settled(page, false);
  const yUser = await page.evaluate(() => Math.round(scrollY));
  // 재보정 시점(폰트 적용 + 스크롤 정착)까지 기다려도 #inq 로 끌려가지 않아야 한다
  await settled(page);
  await settled(page);
  const yAfter = await page.evaluate(() => Math.round(scrollY));
  // 폰트 적용으로 생긴 레이아웃 변화(스크롤 앵커링) 외에 #inq 로 끌려가지 않아야 한다
  expect(Math.abs(await offset(page, 'inq')), '#inq 로 되돌아가지 않음').toBeGreaterThan(200);
  expect(Math.abs(yAfter - yUser), '사용자 위치 유지 (폰트 리플로 범위)').toBeLessThan(120);
  await ctx.close();
});

test('K1 /kium 은 재보정 제외 (대조: /leadership 은 적용)', async ({ browser }) => {
  const marker = async (url: string) => {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    await settled(page);
    await settled(page);
    const v = await page.evaluate(() => document.documentElement.dataset.hashFix ?? null);
    await ctx.close();
    return v;
  };
  expect(await marker('/kium#kium-faq'), '/kium 미동작').toBeNull();
  expect(await marker('/leadership#inq'), '/leadership 동작').toBe('applied');
});
