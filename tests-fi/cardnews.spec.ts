import fs from 'node:fs';
import path from 'node:path';
import { test, expect, type Page } from '@playwright/test';

/**
 * 카드뉴스 E2E (26827 카드뉴스 고도화 기술명세서 v1.0 §8). 실행: npm run test:e2e:fi
 * 측정: 카드·확대 보기 4장 × 360·1280. 확대 아이콘 겹침, 우하단 비움(16.667cqw) 침범, 카드 밖 넘침, 판독 크기, 3장 마지막 줄 끝.
 * 동작: 키보드 넘김·낭독 영역·4장 상담 CTA·계측·리사이즈·Unsplash 차단·움직임 줄이기.
 */

const QA = path.join(process.cwd(), 'qa', 'cardnews');
fs.mkdirSync(QA, { recursive: true });

type DL = { event: string; index?: number; mode?: string }[];
/** K12: 장 이동 완료 = 번호 표시 갱신 + 트랙 스크롤이 그 장 위치에 정착 */
async function atSlide(p: Page, k: number) {
  await expect(p.locator('.lg-cn > .lg-cn-ctrl .lg-cn-count')).toHaveText(`${k + 1} / 4`);
  await expect.poll(() => p.evaluate((i) => {
    const t = document.querySelector<HTMLElement>('.lg-cn-track')!;
    const sl = t.children as HTMLCollectionOf<HTMLElement>;
    return Math.abs(Math.round(t.scrollLeft) - Math.round(sl[i].offsetLeft - sl[0].offsetLeft));
  }, k)).toBeLessThanOrEqual(1);
}

const events = (p: Page) => p.evaluate(() => (window as unknown as { dataLayer: DL }).dataLayer.filter((e) => e.event.startsWith('legal_cardnews')));

/** 화면에 있는 카드(.cnx)마다 글자 위치·크기 측정. 단위는 카드 폭 대비 cqw */
function measureCards(page: Page) {
  return page.evaluate(() => [...document.querySelectorAll<HTMLElement>('.lg-cn-track .cnx, .lg-lb .cnx')].map((card) => {
    const cr = card.getBoundingClientRect();
    const zoom = card.closest('.lg-cn-open')?.querySelector('.lg-cn-zoom')?.getBoundingClientRect();
    const safeL = cr.right - cr.width / 6, safeT = cr.bottom - cr.width / 6;
    let minPx = 99, bodyPx = 0, overlap = 0, inSafe = 0, outside = 0, maxBottom = 0;
    const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (!n.textContent?.trim()) continue;
      const el = n.parentElement!;
      const fs = parseFloat(getComputedStyle(el).fontSize);
      minPx = Math.min(minPx, fs);
      if (el.classList.contains('cnx-body')) bodyPx = fs;
      const range = document.createRange(); range.selectNodeContents(n);
      for (const r of range.getClientRects()) {
        if (!r.width) continue;
        maxBottom = Math.max(maxBottom, ((r.bottom - cr.top) / cr.width) * 100);
        if (zoom && r.right > zoom.left && r.left < zoom.right && r.bottom > zoom.top && r.top < zoom.bottom) overlap++;
        if (r.right > safeL && r.bottom > safeT) inSafe++;
        if (r.left < cr.left - 0.5 || r.right > cr.right + 0.5 || r.top < cr.top - 0.5 || r.bottom > cr.bottom + 0.5) outside++;
      }
    }
    const ptLines = [...card.querySelectorAll('.cnx-pt-d')].map((d) => d.getClientRects().length);
    return {
      lb: !!card.closest('.lg-lb'), tpl: card.dataset.template ?? card.dataset.mode, w: Math.round(cr.width), h: Math.round(cr.height),
      minPx: +minPx.toFixed(1), bodyPx: +bodyPx.toFixed(1), overlap, inSafe, outside, maxBottom: +maxBottom.toFixed(1), ptLines,
    };
  }).filter((r) => r.w > 0));
}

for (const width of [360, 1280]) {
  test(`카드 측정 ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 800 ? 800 : 1000 });
    await page.goto('/content#mandatory-resources', { waitUntil: 'networkidle' });
    await page.locator('.lg-story-media').scrollIntoViewIfNeeded();
    const rows: Record<string, unknown>[] = [];
    for (let k = 0; k < 4; k++) {
      if (k) { await page.locator('.lg-cn > .lg-cn-ctrl .lg-cn-btn').nth(1).click(); await atSlide(page, k); }
      const card = (await measureCards(page)).filter((r) => !r.lb)[k];
      rows.push({ k: k + 1, ...card });
      await page.locator('.lg-story-media').screenshot({ path: path.join(QA, `e2e-w${width}-card${k + 1}.png`) });
      await page.locator('.lg-cn-slide').nth(k).locator('.lg-cn-open').click();
      await expect(page.locator('.lg-lb .cnx')).toBeVisible();
      const lb = (await measureCards(page)).find((r) => r.lb)!;
      rows.push({ k: k + 1, ...lb });
      await page.keyboard.press('Escape');
      await expect(page.locator('.lg-lb')).toHaveCount(0);
    }
    fs.writeFileSync(path.join(QA, `e2e-measure-${width}.json`), JSON.stringify(rows, null, 1));
    for (const r of rows as { k: number; w: number; h: number; overlap: number; inSafe: number; outside: number; maxBottom: number; minPx: number; bodyPx: number; tpl: string; ptLines: number[] }[]) {
      expect(r.overlap, `${r.k}장 확대 아이콘 겹침`).toBe(0);
      expect(r.inSafe, `${r.k}장 우하단 비움 침범`).toBe(0);
      expect(r.outside, `${r.k}장 카드 밖 넘침`).toBe(0);
      expect(Math.abs(r.h / r.w - 1.25)).toBeLessThan(0.01);
      if (r.tpl === 'solution') {
        expect(r.maxBottom, '3장 마지막 줄 끝 (106cqw 근처, 비움 경계 108.3 미만)').toBeLessThan(106.5);
        expect(r.ptLines, '3장 포인트 설명 1줄').toEqual([1, 1, 1]);
      }
    }
    if (width === 360) {
      const card = rows.find((r) => !(r as { lb: boolean }).lb) as { w: number; minPx: number; bodyPx: number };
      expect(card.w).toBeGreaterThanOrEqual(297);
      expect(card.bodyPx).toBeGreaterThanOrEqual(13);
      expect(card.minPx).toBeGreaterThanOrEqual(12);
    }
  });
}

test('카드뉴스 동작: 키보드·낭독·상담 CTA·계측', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.addInitScript(() => { (window as unknown as { dataLayer: unknown[] }).dataLayer = []; });
  const page = await ctx.newPage();
  await page.goto('/content', { waitUntil: 'networkidle' });
  expect(await events(page)).toEqual([]);
  await page.locator('.lg-cn').scrollIntoViewIfNeeded();
  await expect.poll(() => events(page)).toEqual([{ event: 'legal_cardnews_view', index: 1, mode: 'html' }]);

  const link = page.locator('.lg-cn-next-link');
  await expect(link).toHaveAttribute('tabindex', '-1');
  expect(await link.evaluate((l) => getComputedStyle(l).visibility)).toBe('hidden');

  await page.locator('.lg-cn-open').first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.lg-cn > .lg-cn-ctrl .lg-cn-count')).toHaveText('2 / 4');
  expect(await page.evaluate(() => [...document.querySelectorAll('.lg-cn-open')].indexOf(document.activeElement as Element))).toBe(1);
  await expect(page.locator('.lg-story-media .lg-sr')).toHaveText('2 / 4, 교육만 열면 끝일까요?');
  // view 는 장 전환이 정착(0.7초)한 뒤 장별 1회: 장마다 그 장의 view 가 기록될 때까지 기다린 뒤 다음 장으로
  const viewed = (n: number) => expect.poll(async () => (await events(page)).some((e) => e.event === 'legal_cardnews_view' && e.index === n)).toBe(true);
  await viewed(2);
  for (let i = 3; i <= 4; i++) { await page.keyboard.press('ArrowRight'); await atSlide(page, i - 1); await viewed(i); }
  await page.keyboard.press('ArrowRight'); // 4장에서 더 넘기지 않음
  await expect(page.locator('.lg-cn > .lg-cn-ctrl .lg-cn-count')).toHaveText('4 / 4');
  await expect.poll(async () => (await events(page)).filter((e) => e.event === 'legal_cardnews_view').map((e) => e.index)).toEqual([1, 2, 3, 4]);

  // 4장 상담 CTA: goConsult 로 상담 블록 이동 + 첫 입력칸 포커스, 진단 참조 없음
  await expect(link).toHaveText('도입 상담하기');
  await expect(link).toHaveAttribute('href', '#mandatory-inquiry');
  expect(await page.locator('.lg-story-media [href*="mandatory-diagnose"]').count()).toBe(0);
  await link.click();
  await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe('f-company');
  await expect.poll(() => page.evaluate(() => Math.round(document.getElementById('mandatory-inquiry')!.getBoundingClientRect().top))).toBeLessThan(220);
  const ev = (await events(page)).map((e) => e.event);
  expect(ev).toContain('legal_cardnews_consult');
  expect(ev).not.toContain('legal_cardnews_diagnose');
  await ctx.close();
});

test('카드뉴스 리사이즈·확대 보기 키보드', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/content', { waitUntil: 'networkidle' });
  await page.locator('.lg-cn').scrollIntoViewIfNeeded();
  for (let i = 1; i <= 3; i++) { await page.locator('.lg-cn > .lg-cn-ctrl .lg-cn-btn').nth(1).click(); await atSlide(page, i); }
  const pos = () => page.evaluate(() => {
    const t = document.querySelector<HTMLElement>('.lg-cn-track')!;
    const s = t.children as HTMLCollectionOf<HTMLElement>;
    return Math.abs(Math.round(t.scrollLeft) - Math.round(s[3].offsetLeft - s[0].offsetLeft));
  });
  for (const w of [1280, 360]) {
    await page.setViewportSize({ width: w, height: 900 });
    await expect.poll(pos, { message: `리사이즈 ${w} 위치 유지` }).toBeLessThanOrEqual(1);
  }
  await page.locator('.lg-cn-slide').nth(3).locator('.lg-cn-open').click();
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('.lg-lb .lg-cn-count')).toHaveText('3 / 4');
  await expect(page.locator('.lg-story-media .lg-sr')).toHaveAttribute('aria-live', 'off');
  await page.keyboard.press('Escape');
  await expect(page.locator('.lg-cn > .lg-cn-ctrl .lg-cn-count')).toHaveText('3 / 4');
});

test('카드뉴스 Unsplash 차단·움직임 줄이기', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 360, height: 800 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.route(/images\.unsplash\.com/, (r) => r.abort());
  await page.goto('/content', { waitUntil: 'networkidle' });
  await page.locator('.lg-story-media').scrollIntoViewIfNeeded();
  await expect.poll(() => page.evaluate(() => document.querySelectorAll('.lg-cn-track .cnx-photo[data-failed]').length)).toBe(4);
  const r = await page.evaluate(() => ({
    failed: document.querySelectorAll('.lg-cn-track .cnx-photo[data-failed]').length,
    disabled: document.querySelectorAll('.lg-cn-open:disabled').length,
    h: Math.round(document.querySelector('.lg-cn-track .cnx')!.getBoundingClientRect().height),
    bg: getComputedStyle(document.querySelector('.cnx-photo')!).backgroundImage,
  }));
  expect(r.failed).toBe(4);
  expect(r.disabled).toBe(0);
  expect(r.h).toBe(390);
  expect(r.bg).toContain('linear-gradient');
  await page.locator('.lg-cn > .lg-cn-ctrl .lg-cn-btn').nth(1).click();
  // 시간 자체가 검사 대상: 움직임 줄이기면 부드러운 스크롤 없이 120ms 안에 이미 도착해 있어야 한다
  await page.waitForTimeout(120);
  const moved = await page.evaluate(() => {
    const t = document.querySelector<HTMLElement>('.lg-cn-track')!;
    return Math.abs(Math.round(t.scrollLeft) - Math.round((t.children[1] as HTMLElement).offsetLeft - (t.children[0] as HTMLElement).offsetLeft));
  });
  expect(moved, '움직임 줄이기: 즉시 이동').toBeLessThanOrEqual(1);
  await ctx.close();
});
