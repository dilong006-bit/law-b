import { test, expect, type Page, type Browser } from '@playwright/test';
import { jumpTo, jumpY, expectBar, scrollSettled, occlusion, fontsReady } from '../tests-fi/helpers';

/**
 * 프로덕션 스모크: 플로팅 문의 바·카드뉴스·해시 진입. 폼 제출 금지 (입력·제출 없음).
 */
const PC = { viewport: { width: 1440, height: 900 } };
const TOUCH = { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true };
const PAGES = [
  { key: 'home', path: '/', trigger: 'main section:nth-of-type(2)', target: '#inq' },
  { key: 'ax-ai', path: '/ax-ai', trigger: '#offer', target: '#inq' },
  { key: 'leadership', path: '/leadership', trigger: '#pain', target: '#inq' },
  { key: 'hrd', path: '/hrd', trigger: '#arch', target: '#inq' },
  { key: 'content', path: '/content', trigger: '#ax1', target: '#mandatory-inquiry' },
];

function watchConsole(page: Page) {
  const bad: string[] = [];
  page.on('console', (m) => { if (m.type() === 'error') bad.push(m.text().slice(0, 160)); });
  page.on('pageerror', (e) => bad.push('pageerror ' + e.message.slice(0, 160)));
  return bad;
}
const offsetOf = async (page: Page, sel: string) =>
  Math.round((await page.evaluate((s) => document.querySelector(s)!.getBoundingClientRect().top, sel)) - ((await occlusion(page)) + 16));
async function open(browser: Browser, opt: Record<string, unknown>, url: string) {
  const c = await browser.newContext(opt);
  const page = await c.newPage();
  const bad = watchConsole(page);
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForSelector('.fi', { state: 'attached', timeout: 20000 }).catch(() => undefined);
  return { c, page, bad };
}

for (const [vpName, vp] of [['1440', PC], ['390', TOUCH]] as const) {
  for (const pg of PAGES) {
    test(`바 등장·퇴장 ${pg.key} ${vpName}`, async ({ browser }) => {
      const { c, page, bad } = await open(browser, vp, pg.path);
      await scrollSettled(page);
      expect(await page.evaluate(() => !!document.querySelector('.fi.is-on')), '첫 화면 미노출').toBe(false);
      await jumpTo(page, pg.trigger, 0.5);
      await expectBar(page, true, '기준 섹션 도달 노출');
      await jumpY(page, 'top');
      await expectBar(page, false, '맨 위 복귀 미노출');
      await jumpY(page, 'bottom');
      await expectBar(page, false, '푸터 미노출');
      expect(bad, '콘솔 오류 0').toEqual([]);
      await c.close();
    });

    test(`바 클릭 이동 ${pg.key} ${vpName}`, async ({ browser }) => {
      const { c, page, bad } = await open(browser, vp, pg.path);
      await jumpTo(page, pg.trigger, 0.5);
      await expectBar(page, true);
      if (vpName === '390') await page.locator('.fi-cta').tap(); else await page.locator('.fi-cta').click();
      if (pg.key === 'ax-ai') {
        await page.waitForURL('**/?interest=ax-ai#inq');
        await expect(page.locator('#inq .mchip', { hasText: 'AX·AI 전환' })).toHaveAttribute('aria-pressed', 'true');
      } else {
        await expect.poll(() => page.evaluate(() => location.hash), { timeout: 8000 }).toBe(pg.target);
      }
      await scrollSettled(page);
      await scrollSettled(page);
      expect(Math.abs(await offsetOf(page, pg.target)), '도착 위치 ±4').toBeLessThanOrEqual(4);
      if (pg.key !== 'ax-ai') {
        const inForm = await page.evaluate((t) => !!document.activeElement?.closest(t) || !!document.activeElement?.closest('.lg-inq'), pg.target);
        expect(inForm, '폼 영역 포커스').toBe(true);
      }
      if (pg.key === 'content') await expect(page.locator('#inq .mchip', { hasText: '콘텐츠 제작·도입' })).toHaveAttribute('aria-pressed', 'true');
      expect(bad, '콘솔 오류 0').toEqual([]);
      await c.close();
    });
  }
}

test('바 닫기: 같은 세션 다른 페이지 미노출', async ({ browser }) => {
  const { c, page } = await open(browser, PC, '/hrd');
  await jumpTo(page, '#arch', 0.5);
  await expectBar(page, true);
  await page.locator('.fi-close').click();
  await expectBar(page, false);
  await page.goto('/leadership', { waitUntil: 'networkidle' });
  await page.waitForSelector('.fi', { state: 'attached' });
  await jumpTo(page, '#pain', 0.5);
  expect(await page.evaluate(() => !!document.querySelector('.fi.is-on'))).toBe(false);
  await c.close();
});

test('/content 법정 구간 문구 전환·과정 담기 중 바 숨김', async ({ browser }) => {
  const { c, page, bad } = await open(browser, PC, '/content');
  await jumpTo(page, '#ax1', 0.5);
  await expectBar(page, true);
  await expect(page.locator('.fi-title')).toHaveText('필요한 교육 콘텐츠, 맞춤 구성으로 제안해 드립니다');
  await jumpTo(page, '#mandatory-courses', 0.3);
  await expect(page.locator('.fi-title')).toHaveText('올해 법정교육, 필요한 과정부터 확인해 드립니다');
  await page.locator('.lg-pick').first().click(); // 브라우저 안 상태만 바뀜 (제출 없음)
  await expect.poll(() => page.evaluate(() => document.body.classList.contains('legal-tray-on'))).toBe(true);
  await expectBar(page, false, '과정 담기 바 노출 중 숨김');
  expect(bad).toEqual([]);
  await c.close();
});

for (const [vpName, vp] of [['1440', PC], ['390', TOUCH]] as const) {
  test(`카드뉴스 4장·확대 보기·상담 CTA ${vpName}`, async ({ browser }) => {
    const { c, page, bad } = await open(browser, vp, '/content');
    await page.locator('.lg-cn').scrollIntoViewIfNeeded();
    expect(await page.locator('.lg-cn-track .cnx').count()).toBe(4);
    for (let k = 0; k < 4; k++) {
      if (k) {
        const next = page.locator('.lg-cn > .lg-cn-ctrl .lg-cn-btn').nth(1);
        if (vpName === '390') await next.tap(); else await next.click();
      }
      await expect(page.locator('.lg-cn > .lg-cn-ctrl .lg-cn-count')).toHaveText(`${k + 1} / 4`);
    }
    await page.locator('.lg-cn-slide').nth(3).locator('.lg-cn-open').click();
    await expect(page.locator('.lg-lb .cnx')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('.lg-lb')).toHaveCount(0);
    const cta = page.locator('.lg-cn-next-link');
    await expect(cta).toHaveText('도입 상담하기');
    if (vpName === '390') await cta.tap(); else await cta.click();
    await expect.poll(() => page.evaluate(() => document.activeElement?.id), { timeout: 8000 }).toBe('f-company');
    await scrollSettled(page);
    expect(Math.abs(await offsetOf(page, '#mandatory-inquiry'))).toBeLessThanOrEqual(4);
    expect(bad).toEqual([]);
    await c.close();
  });
}

for (const url of ['/#inq', '/leadership#inq', '/hrd#inq', '/content#inq']) {
  for (const [vpName, vp] of [['1440', PC], ['390', TOUCH]] as const) {
    test(`해시 진입 ${url} ${vpName}`, async ({ browser }) => {
      const { c, page, bad } = await open(browser, vp, url);
      await fontsReady(page);
      await scrollSettled(page);
      await scrollSettled(page);
      expect(Math.abs(await offsetOf(page, '#inq')), '섹션 상단 = 가림 경계 + 16 (±4)').toBeLessThanOrEqual(4);
      expect(bad).toEqual([]);
      await c.close();
    });
  }
}
