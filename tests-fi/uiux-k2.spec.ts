import { test, expect } from '@playwright/test';

/**
 * K2: /content 법정 대표 과정 블록 가로 넘침 0.
 * upgrade-04 LB50 (26827 검토 #65): 구분 필터 칩 줄(.lg-filter-in)이 삭제되어 대상이 사라졌다 (TECHSPEC upgrade-04 §11-3).
 * → 대표 과정 블록 전체가 컨테이너 폭 안에 들어오고 문서 가로 넘침이 없는지로 교체한다.
 */
for (const width of [320, 340, 360, 390, 768, 1440]) {
  test(`K2 대표 과정 블록 가로 넘침 ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/content', { waitUntil: 'networkidle' });
    const r = await page.evaluate(() => {
      const block = document.getElementById('mandatory-courses')!;
      const box = block.getBoundingClientRect();
      const over = [...block.querySelectorAll<HTMLElement>('*')].filter((el) => {
        const b = el.getBoundingClientRect();
        return b.width > 0 && (b.right > box.right + 0.5 || b.left < box.left - 0.5);
      }).length;
      return { docW: document.documentElement.scrollWidth, vw: document.documentElement.clientWidth, blockW: block.scrollWidth, boxW: Math.round(box.width), over };
    });
    expect(r.docW, '문서 가로 넘침 0').toBe(r.vw);
    expect(r.blockW, '블록 가로 넘침 0').toBeLessThanOrEqual(r.boxW);
    expect(r.over, '블록 밖으로 나간 요소 0').toBe(0);
  });
}
