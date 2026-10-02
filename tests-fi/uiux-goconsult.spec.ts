import { test, expect, type Page } from '@playwright/test';
import { jumpTo, scrollSettled, occlusion } from './helpers';

/**
 * goConsult 변경(N4 공용 이동) 회귀: 법정 허브의 상담 이동 4곳이 상담 블록에 같은 위치로 도착하고 첫 입력칸에 포커스한다.
 * 빠른 실행 '빠른 상담' / 도입 절차 '빠른 상담 신청' / 맞춤 구성 타일 / 과정 담기 바 상담 버튼. 도착 단서(K9)는 표시하지 않는다.
 */
const SOURCES: { name: string; prep: (p: Page) => Promise<void>; sel: string }[] = [
  { name: '빠른 실행', prep: (p) => jumpTo(p, '#mandatory', 0.1), sel: '.lg-quick-a[data-ga-id="legal_quick_consult"]' },
  { name: '도입 절차', prep: (p) => jumpTo(p, '.lg-steps-cta', 0.5), sel: '.lg-steps-cta' },
  { name: '맞춤 타일', prep: (p) => jumpTo(p, '.lg-tile-cta', 0.5), sel: '.lg-tile-cta' },
  {
    name: '과정 담기 바',
    prep: async (p) => {
      await jumpTo(p, '#mandatory-courses', 0.1);
      await p.locator('.lg-pick').first().click();
      await expect(p.locator('.lg-tray-cta')).toBeVisible();
    },
    sel: '.lg-tray-cta',
  },
];

for (const vp of [{ width: 1440, height: 900, touch: false }, { width: 390, height: 844, touch: true }]) {
  for (const s of SOURCES) {
    test(`goConsult 회귀 ${s.name} ${vp.width}`, async ({ browser }) => {
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, hasTouch: vp.touch, isMobile: vp.touch });
      const page = await ctx.newPage();
      await page.goto('/content', { waitUntil: 'networkidle' });
      await s.prep(page);
      await page.evaluate(() => {
        const w = window as unknown as { __cue: number };
        w.__cue = 0;
        new MutationObserver(() => { if (document.querySelector('.lg-consult-panel.is-arrive')) w.__cue++; })
          .observe(document.querySelector('#mandatory-inquiry .lg-consult-panel')!, { attributes: true, attributeFilter: ['class'] });
      });
      if (vp.touch) await page.locator(s.sel).first().tap(); else await page.locator(s.sel).first().click();
      await expect.poll(() => page.evaluate(() => document.activeElement?.id), { message: '첫 입력칸 포커스' }).toBe('f-company');
      await scrollSettled(page);
      const top = await page.evaluate(() => Math.round(document.getElementById('mandatory-inquiry')!.getBoundingClientRect().top));
      expect(Math.abs(top - ((await occlusion(page)) + 16)), `도착 위치 ${top}`).toBeLessThanOrEqual(4);
      expect(await page.evaluate(() => (window as unknown as { __cue: number }).__cue), '도착 단서 없음').toBe(0);
      await ctx.close();
    });
  }
}
