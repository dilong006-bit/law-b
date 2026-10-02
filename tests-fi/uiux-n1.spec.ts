import { test, expect, type Page } from '@playwright/test';

/**
 * N1: Tab 으로 플로팅 바에 들어간 직후 바가 숨겨지며(inert) 포커스가 body 로 사라지던 문제.
 * 바 안에 포커스가 있는 동안은 숨기지 않고, 닫기로 바가 사라지면 바에 들어오기 전 요소로 포커스를 돌려준다.
 */
const lost = (p: Page) => p.evaluate(() => document.activeElement === document.body || !!document.activeElement?.closest('[inert]'));
const onBar = (p: Page) => p.evaluate(() => !!document.querySelector('.fi.is-on'));

test('N1 푸터 다음 Tab 으로 바에 들어가도 포커스 유지', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/hrd', { waitUntil: 'networkidle' });
  // 기준 섹션 도달 → 바 노출
  await page.evaluate(() => { const el = document.querySelector('#arch')!; scrollTo({ top: el.getBoundingClientRect().top + scrollY - innerHeight * 0.5, behavior: 'instant' as ScrollBehavior }); });
  await expect.poll(() => onBar(page)).toBe(true);
  // 푸터 마지막 요소에 화면 이동 없이 포커스 (Tab 순서상 바 바로 앞)
  await page.evaluate(() => [...document.querySelectorAll<HTMLElement>('#site-footer a, #site-footer button')].pop()!.focus({ preventScroll: true }));
  await page.keyboard.press('Tab');
  await expect.poll(() => page.evaluate(() => document.activeElement?.className)).toBe('fi-cta');
  // 포커스가 바 안에 있는 동안 화면이 푸터로 이동해도 포커스가 사라지지 않는다
  await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' as ScrollBehavior }));
  await expect.poll(() => onBar(page), { message: '포커스가 바 안에 있으면 숨기지 않음' }).toBe(true);
  expect(await lost(page)).toBe(false);
  // Tab 으로 닫기, 다시 Tab 으로 바 밖으로 나가면 그때 숨김
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => document.activeElement?.className)).toBe('fi-close');
  await page.keyboard.press('Tab');
  await expect.poll(() => onBar(page), { message: '바를 벗어나면 숨김 규칙 복귀' }).toBe(false);
  expect(await lost(page)).toBe(false);
});

test('N1 키보드로 닫으면 바에 들어오기 전 요소로 포커스 복귀', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/hrd', { waitUntil: 'networkidle' });
  await page.evaluate(() => { const el = document.querySelector('#arch')!; scrollTo({ top: el.getBoundingClientRect().top + scrollY - innerHeight * 0.5, behavior: 'instant' as ScrollBehavior }); });
  await expect.poll(() => onBar(page)).toBe(true);
  await page.evaluate(() => [...document.querySelectorAll<HTMLElement>('#site-footer a, #site-footer button')].pop()!.focus({ preventScroll: true }));
  const before = await page.evaluate(() => document.activeElement!.outerHTML.slice(0, 80));
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => document.activeElement?.className)).toBe('fi-close');
  await page.keyboard.press('Enter');
  await expect.poll(() => onBar(page)).toBe(false);
  expect(await lost(page), '닫은 뒤 포커스 사라짐 0').toBe(false);
  expect(await page.evaluate(() => document.activeElement!.outerHTML.slice(0, 80))).toBe(before);
});

test('N1 본문에서 문서 끝까지 Tab: 포커스 사라지는 지점 0', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/hrd', { waitUntil: 'networkidle' });
  await page.evaluate(() => { const el = document.querySelector('#arch')!; scrollTo({ top: el.getBoundingClientRect().top + scrollY - innerHeight * 0.5, behavior: 'instant' as ScrollBehavior }); });
  await expect.poll(() => onBar(page)).toBe(true);
  await page.evaluate(() => document.querySelector<HTMLElement>('#arch a, #arch button')?.focus());
  const seen: string[] = [];
  for (let i = 0; i < 160; i++) {
    await page.keyboard.press('Tab');
    const s = await page.evaluate(() => ({ body: document.activeElement === document.body, inert: !!document.activeElement?.closest('[inert]'), cls: String((document.activeElement as HTMLElement)?.className ?? '') }));
    expect(s.body || s.inert, `Tab ${i + 1}번째에서 포커스 사라짐`).toBe(false);
    seen.push(s.cls);
    if (s.cls.includes('to-top') || seen.length > 150) break;
  }
});
