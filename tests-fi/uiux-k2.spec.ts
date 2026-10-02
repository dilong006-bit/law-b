import { test, expect } from '@playwright/test';

/**
 * K2: /content 법정 필터 칩 줄이 640 이하에서 컨테이너 폭을 넘어 문서가 가로로 넘치던 문제.
 * 320 에서 문서 폭 = 화면 폭, 칩 줄은 자체 가로 스크롤.
 * 칩 전체 폭(약 308px)이 컨테이너보다 넓은 340~355 는 칩 줄이 컨테이너 폭으로 줄고 가로 스크롤로 바뀐다 (피할 수 없는 변화, 보고).
 * 360 이상은 칩 줄 폭이 그대로(컨테이너 + 좌우 -4px)여야 한다.
 */
for (const width of [320, 340, 360, 390, 768, 1440]) {
  test(`K2 법정 필터 칩 줄 가로 넘침 ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/content', { waitUntil: 'networkidle' });
    const r = await page.evaluate(() => {
      const f = document.querySelector<HTMLElement>('.lg-filter-in')!;
      const box = f.parentElement!.getBoundingClientRect();
      return {
        docW: document.documentElement.scrollWidth, vw: document.documentElement.clientWidth,
        filterW: Math.round(f.getBoundingClientRect().width), containerW: Math.round(box.width),
        scrolls: f.scrollWidth > f.clientWidth,
      };
    });
    expect(r.docW, '문서 가로 넘침 0').toBe(r.vw);
    if (width <= 340) expect(r.scrolls, '칩 줄 가로 스크롤').toBe(true);
    if (width >= 340 && width <= 640) expect(Math.abs(r.filterW - (r.containerW + 8)), '칩 줄 폭 유지').toBeLessThanOrEqual(1);
  });
}
