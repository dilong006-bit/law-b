import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * N2: 카드뉴스 트랙이 ul 인데 li 에 role=group 을 줘서 목록 구조가 깨지던 문제 (axe list, aria-allowed-role).
 * 슬라이드는 group "n / 4" 로, 카드 버튼은 그 안에서 순서대로 읽혀야 한다.
 */
test('N2 카드뉴스 슬라이드 구조', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('/content', { waitUntil: 'networkidle' });
  await page.locator('.lg-cn').scrollIntoViewIfNeeded();
  const axe = await new AxeBuilder({ page }).include('.lg-story-media').analyze();
  expect(axe.violations.map((v) => v.id), 'axe 위반 0 (list, aria-allowed-role 포함)').toEqual([]);

  const snap = await page.locator('.lg-cn').ariaSnapshot();
  fs.mkdirSync(path.join(process.cwd(), 'qa', 'uiux-review', '1'), { recursive: true });
  fs.writeFileSync(path.join(process.cwd(), 'qa', 'uiux-review', '1', 'N2-aria-snapshot.txt'), snap);
  // 낭독 순서: 슬라이드 1~4 (각각 크게 보기 버튼), 그 뒤 이전·다음
  let at = 0;
  for (let n = 1; n <= 4; n++) {
    const g = snap.indexOf(`group "${n} / 4"`, at);
    expect(g, `슬라이드 ${n} group`).toBeGreaterThan(at - 1);
    const btn = snap.indexOf(`button "카드뉴스 ${n}번 크게 보기"`, g);
    expect(btn, `슬라이드 ${n} 버튼`).toBeGreaterThan(g);
    at = btn;
  }
  expect(snap.indexOf('button "이전 카드"')).toBeGreaterThan(at);
  expect(snap).not.toContain('listitem');
  await ctx.close();
});
