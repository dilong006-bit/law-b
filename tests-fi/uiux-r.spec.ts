import { test, expect, type Page } from '@playwright/test';
import { jumpTo, expectBar, scrollSettled, occlusion } from './helpers';

/** 시니어 코드 리뷰 R1~R4 회귀 */
const touch = { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true };
const pc = { viewport: { width: 1440, height: 900 } };
const offsetOf = async (page: Page, sel: string) =>
  Math.round((await page.evaluate((s) => document.querySelector(s)!.getBoundingClientRect().top, sel)) - ((await occlusion(page)) + 16));

test('R1 바 밖 포커스 기록 없이 닫아도 포커스가 사라지지 않음', async ({ browser }) => {
  const c = await browser.newContext(pc);
  const page = await c.newPage();
  await page.goto('/hrd', { waitUntil: 'networkidle' });
  await jumpTo(page, '#arch', 0.5);
  await expectBar(page, true);
  // 바 밖 요소를 거치지 않고 곧바로 닫기 버튼으로 (키보드 사용자가 문서 처음에서 역방향으로 들어온 경우와 같음)
  await page.locator('.fi-close').focus();
  await page.keyboard.press('Enter');
  await expectBar(page, false);
  const a = await page.evaluate(() => ({ body: document.activeElement === document.body, id: document.activeElement?.id }));
  expect(a.body, '포커스 사라짐 0').toBe(false);
  expect(a.id).toBe('main');
  await c.close();
});

for (const [name, opt] of [['1440', pc], ['390', touch]] as const) {
  test(`R2 이미지 지연(1초) 중 바 이동 도착 위치 ±4 (${name})`, async ({ browser }) => {
    const c = await browser.newContext(opt);
    const page = await c.newPage();
    await page.route(/images\.unsplash\.com/, async (r) => { await new Promise((ok) => setTimeout(ok, 1000)); await r.continue(); }); // 테스트 조건: 네트워크 지연
    await page.goto('/content', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#ax1');
    // domcontentloaded 직후라 바 본체(지연 로드)가 아직 없을 수 있다: 마운트된 뒤 스크롤
    await page.waitForSelector('.fi', { state: 'attached', timeout: 20000 });
    await jumpTo(page, '#ax1', 0.5);
    await expectBar(page, true);
    if (name === '390') await page.locator('.fi-cta').tap(); else await page.locator('.fi-cta').click();
    await expect.poll(() => page.evaluate(() => location.hash), { timeout: 8000 }).toBe('#mandatory-inquiry');
    await scrollSettled(page);
    expect(Math.abs(await offsetOf(page, '#mandatory-inquiry'))).toBeLessThanOrEqual(4);
    await c.close();
  });
}

test('R2 이미지 지연(1초) 중 goConsult(빠른 실행) 도착 위치 ±4', async ({ browser }) => {
  const c = await browser.newContext(pc);
  const page = await c.newPage();
  await page.route(/images\.unsplash\.com/, async (r) => { await new Promise((ok) => setTimeout(ok, 1000)); await r.continue(); });
  await page.goto('/content', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#mandatory');
  await jumpTo(page, '#mandatory', 0.1);
  await page.locator('.lg-quick-a[data-ga-id="legal_quick_consult"]').click();
  await expect.poll(() => page.evaluate(() => document.activeElement?.id), { timeout: 8000 }).toBe('f-company');
  await scrollSettled(page);
  expect(Math.abs(await offsetOf(page, '#mandatory-inquiry'))).toBeLessThanOrEqual(4);
  await c.close();
});

/**
 * R2 재보정 로직 확인: 이동 도중 대상 위쪽에 300px 블록을 끼워 목적지를 바꾼다.
 * 대조(사용자 조작 없음): 도착 후 재보정해 ±4. 휠 조작 있음: 재보정하지 않아 블록 높이만큼 어긋난 채 남는다 (사용자 조작 우선).
 */
for (const wheel of [false, true]) {
  test(`R2 이동 중 레이아웃 변화 재보정 (${wheel ? '휠 조작 있음: 보정 안 함' : '조작 없음: 보정'})`, async ({ browser }) => {
    const c = await browser.newContext(pc);
    const page = await c.newPage();
    await page.goto('/', { waitUntil: 'networkidle' });
    await jumpTo(page, 'main section:nth-of-type(2)', 0.5);
    await expectBar(page, true);
    // 클릭 → (사용자 휠 신호) → 레이아웃 변화를 한 작업 안에서 순서대로: 도착 전에 일어난 것이 확실하도록
    await page.evaluate((w) => {
      (document.querySelector('.fi-cta') as HTMLElement).click();
      if (w) window.dispatchEvent(new WheelEvent('wheel', { deltaY: -10 }));
      const d = document.createElement('div');
      d.style.height = '300px';
      document.getElementById('inq')!.before(d);
    }, wheel);
    await scrollSettled(page);
    await scrollSettled(page);
    const off = await offsetOf(page, '#inq');
    if (wheel) expect(off, `사용자 조작 우선: 어긋난 채 유지 (${off})`).toBeGreaterThan(200);
    else expect(Math.abs(off), `재보정 (${off})`).toBeLessThanOrEqual(4);
    await c.close();
  });
}

test('R3 1.2초 안에 다시 도착하면 테두리가 새로 1.2초 유지', async ({ browser }) => {
  const c = await browser.newContext(touch);
  const page = await c.newPage();
  await page.goto('/content', { waitUntil: 'networkidle' });
  await page.locator('.lg-cn').scrollIntoViewIfNeeded();
  for (let i = 1; i <= 3; i++) {
    await page.locator('.lg-cn > .lg-cn-ctrl .lg-cn-btn').nth(1).tap();
    await expect(page.locator('.lg-cn > .lg-cn-ctrl .lg-cn-count')).toHaveText(`${i + 1} / 4`);
  }
  const panel = page.locator('#mandatory-inquiry .lg-consult-panel');
  await page.locator('.lg-cn-next-link').tap();
  await expect(panel).toHaveClass(/is-arrive/);
  // 시간 자체가 검사 대상: 첫 표시 0.7초 뒤 다시 도착 → 첫 표시 기준 1.2초(재도착 후 0.5초)에도 남아 있어야 한다
  await page.waitForTimeout(700);
  await page.evaluate(() => (document.querySelector('.lg-cn-next-link') as HTMLElement).click());
  await page.waitForTimeout(600);
  await expect(panel, '앞 타이머가 새 표시를 지우지 않음').toHaveClass(/is-arrive/);
  await expect(panel).not.toHaveClass(/is-arrive/, { timeout: 3000 });
  await c.close();
});

test('R4 클라이언트 이동 해시 진입(AX·AI 바 → 홈 #inq) 위치', async ({ browser }) => {
  const c = await browser.newContext(pc);
  const page = await c.newPage();
  await page.goto('/ax-ai', { waitUntil: 'networkidle' });
  await jumpTo(page, '#offer', 0.5);
  await expectBar(page, true);
  await page.locator('.fi-cta').click();
  await page.waitForURL('**/?interest=ax-ai#inq');
  await scrollSettled(page);
  await scrollSettled(page);
  expect(Math.abs(await offsetOf(page, '#inq'))).toBeLessThanOrEqual(4);
  expect(await page.evaluate(() => document.documentElement.dataset.hashFix ?? null), '클라이언트 이동에서는 HashFontFix 미동작').toBeNull();
  await c.close();
});
