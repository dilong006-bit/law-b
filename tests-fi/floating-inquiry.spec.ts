import fs from 'node:fs';
import path from 'node:path';
import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * 플로팅 문의 바 E2E (B안 기술명세서 최종 v2.0 §11, 프롬프트 v2.1 6-2·6-3).
 * 실행: npm run test:e2e:fi
 * 스크린샷 qa/floating-inquiry/{page}-{viewport}-{state}.png, 측정값 qa/floating-inquiry/measure/*.json
 */

const QA = path.join(process.cwd(), 'qa', 'floating-inquiry');
fs.mkdirSync(path.join(QA, 'measure'), { recursive: true });

type Vp = { name: string; width: number; height: number; touch: boolean };
const VPS: Vp[] = [
  { name: '320x640', width: 320, height: 640, touch: true },
  { name: '360x740', width: 360, height: 740, touch: true },
  { name: '390x844', width: 390, height: 844, touch: true },
  { name: '768x1024', width: 768, height: 1024, touch: true },
  { name: '1024x768', width: 1024, height: 768, touch: false },
  { name: '1440x900', width: 1440, height: 900, touch: false },
  { name: '1920x1080', width: 1920, height: 1080, touch: false },
];
const LANDSCAPE: Vp = { name: '844x390', width: 844, height: 390, touch: true };

const PAGES = [
  { key: 'home', path: '/', trigger: 'main section:nth-of-type(2)', inq: '#inq' },
  { key: 'ax-ai', path: '/ax-ai', trigger: '#offer', inq: '#inq' },
  { key: 'leadership', path: '/leadership', trigger: '#pain', inq: '#inq' },
  { key: 'hrd', path: '/hrd', trigger: '#arch', inq: '#inq' },
  { key: 'content', path: '/content', trigger: '#ax1', inq: '#mandatory-inquiry' },
] as const;

async function newCtx(browser: import('@playwright/test').Browser, vp: Vp): Promise<BrowserContext> {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, hasTouch: vp.touch, isMobile: vp.touch && vp.width < 800 });
  await ctx.addInitScript(() => { (window as unknown as { dataLayer: unknown[] }).dataLayer = []; });
  return ctx;
}

/** 콘솔 오류·하이드레이션 경고 수집 */
function watchConsole(page: Page) {
  const bad: string[] = [];
  page.on('console', (m) => {
    const t = m.text();
    if (m.type() === 'error' || /hydrat|did not match|Minified React error #(418|423|425)/i.test(t)) bad.push(t.slice(0, 160));
  });
  page.on('pageerror', (e) => bad.push('pageerror ' + e.message.slice(0, 160)));
  return bad;
}

const isOn = (page: Page) => page.evaluate(() => !!document.querySelector('.fi.is-on'));
const settle = (page: Page, ms = 450) => page.waitForTimeout(ms);

/** 요소 상단을 화면 세로 frac 지점에 맞춘다 (scroll 즉시) */
async function scrollElTo(page: Page, sel: string, frac: number) {
  await page.evaluate(([s, f]) => {
    const el = document.querySelector(s as string);
    if (!el) throw new Error('missing ' + s);
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - window.innerHeight * (f as number), behavior: 'instant' as ScrollBehavior });
  }, [sel, frac] as const);
  await settle(page);
}

/** 스크린샷 저장. 이 PC 는 보안 프로그램이 새 PNG 를 잠깐 잠그는 일이 있어 저장 실패 시 다시 시도한다 (판정과 무관) */
async function shot(page: Page, pageKey: string, vp: string, state: string) {
  const file = path.join(QA, `${pageKey}-${vp}-${state}.png`);
  for (let i = 0; i < 3; i++) {
    try { await page.screenshot({ path: file }); return; } catch (e) { if (i === 2) console.warn(`screenshot skipped: ${file} ${(e as Error).message.slice(0, 60)}`); await page.waitForTimeout(300); }
  }
}

/**
 * 해시 진입 위치 검사용: 같은 페이지를 먼저 열어 웹폰트를 받아 둔다.
 * 첫 방문은 부드러운 해시 스크롤 도중 Pretendard 적용으로 위 문단 줄바꿈이 바뀌어 목적지가 어긋날 수 있다 (기존 현상, 별도 보고).
 * 여기서는 이번 scroll-margin 보정 자체를 판정한다
 */
async function warmFonts(page: Page, url: string) {
  await page.goto(url.split('#')[0], { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
}

/** 바 측정: 크기·글자·넘침·버튼·to-top/toast 간격 */
async function measureBar(page: Page) {
  return page.evaluate(() => {
    const fi = document.querySelector('.fi') as HTMLElement;
    const card = fi.querySelector('.fi-card')!.getBoundingClientRect();
    const vis = (el: Element | null) => !!el && getComputedStyle(el).display !== 'none';
    const title = fi.querySelector('.fi-title')!;
    const short = fi.querySelector('.fi-short')!;
    const text = vis(title) ? title : short;
    const cs = getComputedStyle(text);
    const fs = parseFloat(cs.fontSize);
    const lh = parseFloat(cs.lineHeight) || fs * 1.4;
    const msg = fi.querySelector('.fi-msg') as HTMLElement;
    const overflow = [msg, ...msg.querySelectorAll<HTMLElement>('strong, span')].filter((e) => vis(e)).some((e) => e.scrollWidth > e.clientWidth + 0.5)
      || [...fi.querySelectorAll<HTMLElement>('.fi-cta, .fi-cta span')].filter((e) => vis(e)).some((e) => e.scrollWidth > e.clientWidth + 0.5);
    const cta = fi.querySelector('.fi-cta')!.getBoundingClientRect();
    const close = fi.querySelector('.fi-close')!.getBoundingClientRect();
    const sub = fi.querySelector('.fi-sub')!;
    // to-top 간격 (보일 때)
    const tt = document.querySelector('.to-top.show');
    const ttGap = tt ? Math.round(card.top - tt.getBoundingClientRect().bottom) : null;
    // toast 간격: 같은 클래스의 임시 요소로 bottom 규칙만 확인 후 제거
    const t = document.createElement('div');
    t.className = 'toast show';
    t.textContent = '측정용';
    document.body.appendChild(t);
    const toastGap = Math.round(card.top - t.getBoundingClientRect().bottom);
    t.remove();
    return {
      barW: Math.round(card.width), barH: Math.round(card.height),
      textFs: fs, textLines: Math.round(text.getBoundingClientRect().height / lh), subShown: vis(sub),
      overflow, ctaW: Math.round(cta.width), ctaH: Math.round(cta.height), closeW: Math.round(close.width), closeH: Math.round(close.height),
      ttGap, toastGap, barOverlapsTotop: tt ? !(tt.getBoundingClientRect().bottom <= card.top || tt.getBoundingClientRect().top >= card.bottom || tt.getBoundingClientRect().right <= card.left || tt.getBoundingClientRect().left >= card.right) : false,
    };
  });
}

/**
 * 기준 섹션부터 문서 끝까지 화면 절반씩 내려가며, 바가 보일 때 문의 폼 컨트롤·푸터와 겹치는지 검사.
 * 같은 구간에서 longtask·layout-shift 를 함께 수집한다.
 */
async function sweep(page: Page, trigger: string) {
  await page.evaluate(() => {
    const w = window as unknown as { __lt: number; __cls: number };
    w.__lt = 0; w.__cls = 0;
    try { new PerformanceObserver((l) => { w.__lt += l.getEntries().length; }).observe({ type: 'longtask' }); } catch { /* 미지원 */ }
    try {
      new PerformanceObserver((l) => {
        for (const e of l.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) if (!e.hadRecentInput) w.__cls += e.value;
      }).observe({ type: 'layout-shift' });
    } catch { /* 미지원 */ }
  });
  await scrollElTo(page, trigger, 0.5);
  const res = { steps: 0, onSteps: 0, formCover: 0, footerCover: 0 };
  for (;;) {
    const r = await page.evaluate(() => {
      const fi = document.querySelector('.fi.is-on .fi-card');
      const out = { on: !!fi, form: 0, footer: 0, end: window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2 };
      if (fi) {
        const b = fi.getBoundingClientRect();
        const hit = (r: DOMRect) => r.width > 0 && r.height > 0 && r.bottom > b.top && r.top < b.bottom && r.right > b.left && r.left < b.right;
        out.form = [...document.querySelectorAll('#inq input, #inq select, #inq textarea, #inq button, #mandatory-inquiry input, #mandatory-inquiry button')]
          .filter((e) => hit(e.getBoundingClientRect())).length;
        const f = document.querySelector('#site-footer');
        out.footer = f && hit(f.getBoundingClientRect()) ? 1 : 0;
      }
      window.scrollBy({ top: window.innerHeight * 0.5, behavior: 'instant' as ScrollBehavior });
      return out;
    });
    res.steps++;
    if (r.on) res.onSteps++;
    res.formCover += r.form;
    res.footerCover += r.footer;
    if (r.end || res.steps > 200) break;
    await page.waitForTimeout(140);
  }
  const perf = await page.evaluate(() => {
    const w = window as unknown as { __lt: number; __cls: number };
    return { longtasks: w.__lt, cls: Number(w.__cls.toFixed(4)) };
  });
  return { ...res, ...perf };
}

// ── 1. 5개 페이지 × 7개 폭: 첫 화면 / 기준 섹션 도달 / 맨 위 복귀 / 문의 섹션 / 푸터 + 측정·가림 스윕 ──
for (const vp of VPS) {
  for (const pg of PAGES) {
    test(`상태 흐름 ${pg.key} ${vp.name}`, async ({ browser }) => {
      const ctx = await newCtx(browser, vp);
      const page = await ctx.newPage();
      const bad = watchConsole(page);
      await page.goto(pg.path, { waitUntil: 'networkidle' });
      await settle(page, 600);
      expect(await isOn(page), '첫 화면 미노출').toBe(false);
      await shot(page, pg.key, vp.name, 'top');

      await scrollElTo(page, pg.trigger, 0.5);
      await expect.poll(() => isOn(page), { message: '기준 섹션 도달 노출' }).toBe(true);
      await page.waitForTimeout(400); // 등장 전환 끝
      const m = await measureBar(page);
      await shot(page, pg.key, vp.name, 'reached');

      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }));
      await expect.poll(() => isOn(page), { message: '맨 위 복귀 미노출' }).toBe(false);

      await scrollElTo(page, pg.inq, 0.1);
      await expect.poll(() => isOn(page), { message: '문의 섹션 20% 이상 미노출' }).toBe(false);
      await shot(page, pg.key, vp.name, 'inquiry');

      await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' as ScrollBehavior }));
      await settle(page);
      expect(await isOn(page), '푸터 노출 시 미노출').toBe(false);
      await shot(page, pg.key, vp.name, 'footer');

      const sw = await sweep(page, pg.trigger);
      fs.writeFileSync(path.join(QA, 'measure', `${pg.key}-${vp.name}.json`), JSON.stringify({ page: pg.key, vp: vp.name, ...m, sweep: sw, console: bad }, null, 1));
      expect(m.overflow, '넘침 0').toBe(false);
      expect(m.textLines, '문구 1줄').toBe(1);
      expect(sw.formCover, '폼 가림 0').toBe(0);
      expect(sw.footerCover, '푸터 가림 0').toBe(0);
      expect(m.barOverlapsTotop, 'to-top 겹침 0').toBe(false);
      if (vp.width <= 760) {
        expect(m.ctaH).toBeGreaterThanOrEqual(44);
        expect(m.closeW).toBeGreaterThanOrEqual(44);
      }
      expect(bad, '콘솔 오류·하이드레이션 경고 0').toEqual([]);
      await ctx.close();
    });
  }
}

// ── 2. 클릭 이동: 같은 페이지 4곳 + AX·AI (포인터 기기 1440, 터치 기기 390) ──
for (const vp of [VPS[5], VPS[2]]) {
  for (const pg of PAGES) {
    test(`클릭 이동 ${pg.key} ${vp.name}`, async ({ browser }) => {
      const ctx = await newCtx(browser, vp);
      const page = await ctx.newPage();
      await page.goto(pg.path, { waitUntil: 'networkidle' });
      await scrollElTo(page, pg.trigger, 0.5);
      await expect.poll(() => isOn(page)).toBe(true);
      if (vp.touch) await page.locator('.fi-cta').tap(); else await page.locator('.fi-cta').click();
      if (pg.key === 'ax-ai') {
        await page.waitForURL('**/?interest=ax-ai#inq');
        await expect(page.locator('#inq .mchip', { hasText: 'AX·AI 전환' })).toHaveAttribute('aria-pressed', 'true');
        await page.waitForTimeout(1200);
        // 홈 #inq 로 바로 들어와도 바가 한 번도 켜지지 않아야 한다 (view 는 /ax-ai 의 1회뿐)
        const views = await page.evaluate(() => (window as unknown as { dataLayer: { event: string; page?: string }[] }).dataLayer.filter((e) => e.event === 'floating_inquiry_view').map((e) => e.page));
        expect(views).toEqual(['/ax-ai']);
      } else {
        // 이동 완료 후 replaceState 로 해시가 바뀐다 (scrollend 또는 700ms). /content 는 상담 블록
        await expect.poll(() => page.evaluate(() => location.hash), { timeout: 6000 }).toBe(pg.key === 'content' ? '#mandatory-inquiry' : '#inq');
        await page.waitForTimeout(300);
      }
      const r = await page.evaluate(() => {
        const nav = document.querySelector('header.nav')!.getBoundingClientRect().bottom;
        const sub = document.querySelector<HTMLElement>('.subnav');
        const subB = sub && sub.offsetParent ? sub.getBoundingClientRect().bottom : 0;
        const inq = document.querySelector('#inq')!;
        const lead = inq.querySelector('.inq-side .lead');
        const title = (lead && lead.getClientRects().length ? lead : inq.querySelector('h2')) ?? inq;
        const a = document.activeElement as HTMLElement;
        return {
          occl: Math.max(nav, subB), titleTop: title.getBoundingClientRect().top, inqTop: inq.getBoundingClientRect().top,
          panelTop: document.querySelector('#mandatory-inquiry .lg-consult-panel')?.getBoundingClientRect().top ?? null,
          active: a.id || a.tagName, activeInInq: inq.contains(a) || !!a.closest('.lg-inq'),
          pressed: [...document.querySelectorAll('#inq .mchip[aria-pressed="true"]')].map((e) => e.textContent?.trim()),
          events: (window as unknown as { dataLayer: { event: string; zone?: string }[] }).dataLayer.map((e) => `${e.event}${e.zone ? ':' + e.zone : ''}`),
        };
      });
      fs.writeFileSync(path.join(QA, 'measure', `click-${pg.key}-${vp.name}.json`), JSON.stringify(r, null, 1));
      await shot(page, pg.key, vp.name, 'click-arrive');
      expect(r.titleTop, '폼 제목이 GNB·SubNav 아래').toBeGreaterThanOrEqual(r.occl);
      if (pg.key === 'content') {
        expect(r.pressed).toContain('콘텐츠 제작·도입');
        // 상담 패널부터 보인다: 패널 상단이 GNB·SubNav 아래
        expect(r.panelTop, '상담 패널 가림 0').not.toBeNull();
        expect(r.panelTop!).toBeGreaterThanOrEqual(r.occl);
      }
      if (pg.key !== 'ax-ai') {
        expect(r.activeInInq, '폼 영역 포커스').toBe(true);
        if (!vp.touch) expect(r.active).not.toBe('H2');
      }
      expect(r.events).toContain('floating_inquiry_click:default');
      await ctx.close();
    });
  }
}

// ── 3. 닫기: 같은 세션 다른 페이지에서도 미노출 ──
test('닫기 후 다른 페이지 미노출', async ({ browser }) => {
  const ctx = await newCtx(browser, VPS[5]);
  const page = await ctx.newPage();
  await page.goto('/hrd', { waitUntil: 'networkidle' });
  await scrollElTo(page, '#arch', 0.5);
  await expect.poll(() => isOn(page)).toBe(true);
  await page.locator('.fi-close').click();
  await expect.poll(() => isOn(page)).toBe(false);
  const ev = await page.evaluate(() => (window as unknown as { dataLayer: { event: string }[] }).dataLayer.map((e) => e.event));
  expect(ev).toContain('floating_inquiry_close');
  await page.goto('/leadership', { waitUntil: 'networkidle' });
  await scrollElTo(page, '#pain', 0.5);
  await page.waitForTimeout(600);
  expect(await isOn(page)).toBe(false);
  // 클라이언트 이동(GNB)으로 가도 미노출
  await page.locator('header.nav a[href="/content"]').first().click();
  await page.waitForURL('**/content');
  await scrollElTo(page, '#ax1', 0.5);
  await page.waitForTimeout(600);
  expect(await isOn(page)).toBe(false);
  await ctx.close();
});

// ── 4. view 계측: 세션·페이지당 1회, 클라이언트 이동 후 재설정 ──
test('view 계측과 라우트 재설정', async ({ browser }) => {
  const ctx = await newCtx(browser, VPS[5]);
  const page = await ctx.newPage();
  await page.goto('/hrd', { waitUntil: 'networkidle' });
  await scrollElTo(page, '#arch', 0.5);
  await expect.poll(() => isOn(page)).toBe(true);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }));
  await expect.poll(() => isOn(page)).toBe(false);
  await scrollElTo(page, '#arch', 0.5);
  await expect.poll(() => isOn(page)).toBe(true);
  // 클라이언트 이동: 새 페이지 맨 위에서는 숨김 (reached 초기화)
  await page.locator('header.nav a[href="/leadership"]').first().click();
  await page.waitForURL('**/leadership');
  await page.waitForTimeout(700);
  expect(await isOn(page), '라우트 변경 후 첫 화면 미노출').toBe(false);
  await scrollElTo(page, '#pain', 0.5);
  await expect.poll(() => isOn(page)).toBe(true);
  const views = await page.evaluate(() => (window as unknown as { dataLayer: { event: string; page?: string }[] }).dataLayer
    .filter((e) => e.event === 'floating_inquiry_view').map((e) => e.page));
  expect(views).toEqual(['/hrd', '/leadership']);
  await ctx.close();
});

// ── 5. /content: 법정 구간 문구 전환, lg-tray, 카드뉴스 확대 보기 ──
for (const vp of [VPS[5], VPS[2]]) {
  test(`/content 구간·공존 ${vp.name}`, async ({ browser }) => {
    const ctx = await newCtx(browser, vp);
    const page = await ctx.newPage();
    await page.goto('/content', { waitUntil: 'networkidle' });
    await scrollElTo(page, '#ax1', 0.5);
    await expect.poll(() => isOn(page)).toBe(true);
    const shortSel = vp.touch ? '.fi-short' : '.fi-title';
    await expect(page.locator(shortSel)).toHaveText(vp.touch ? '콘텐츠 도입 상담' : '필요한 교육 콘텐츠, 맞춤 구성으로 제안해 드립니다');
    // 법정 구간 진입
    await scrollElTo(page, '#mandatory-courses', 0.3);
    await expect.poll(() => isOn(page)).toBe(true);
    await expect(page.locator(shortSel)).toHaveText(vp.touch ? '법정교육 상담' : '올해 법정교육, 필요한 과정부터 확인해 드립니다');
    await shot(page, 'content', vp.name, 'mandatory-zone');
    // 과정 담기 → lg-tray 노출 중 바 숨김
    await page.locator('.lg-pick').first().click();
    await expect.poll(() => page.evaluate(() => document.body.classList.contains('legal-tray-on'))).toBe(true);
    await settle(page);
    expect(await isOn(page), 'lg-tray 노출 중 미노출').toBe(false);
    await shot(page, 'content', vp.name, 'lg-tray');
    // 담기 해제 → 다시 노출
    await page.locator('.lg-pick[aria-pressed="true"]').first().click();
    await expect.poll(() => page.evaluate(() => document.body.classList.contains('legal-tray-on'))).toBe(false);
    await expect.poll(() => isOn(page)).toBe(true);
    // 카드뉴스 확대 보기
    await scrollElTo(page, '#mandatory-resources', 0.15);
    await expect.poll(() => isOn(page)).toBe(true);
    await page.locator('.lg-cn-slide').first().locator('.lg-cn-open').click();
    await expect(page.locator('.lg-lb')).toBeVisible();
    await settle(page);
    expect(await isOn(page), '확대 보기 중 미노출').toBe(false);
    await shot(page, 'content', vp.name, 'lightbox');
    await page.keyboard.press('Escape');
    await expect.poll(() => isOn(page), { message: '확대 보기 닫은 뒤 복귀' }).toBe(true);
    // 법정 구간 클릭: compliance 는 이미 선택 (클릭 없음), 계측 zone=mandatory
    await scrollElTo(page, '#mandatory-courses', 0.3);
    await expect.poll(() => isOn(page)).toBe(true);
    if (vp.touch) await page.locator('.fi-cta').tap(); else await page.locator('.fi-cta').click();
    await expect.poll(() => page.evaluate(() => location.hash), { timeout: 6000 }).toBe('#mandatory-inquiry');
    const r = await page.evaluate(() => ({
      pressed: [...document.querySelectorAll('#inq .mchip[aria-pressed="true"]')].map((e) => e.textContent?.trim()),
      ev: (window as unknown as { dataLayer: { event: string; zone?: string }[] }).dataLayer.filter((e) => e.event === 'floating_inquiry_click').map((e) => e.zone),
    }));
    expect(r.pressed).toEqual(['법정 필수']);
    expect(r.ev).toEqual(['mandatory']);
    await ctx.close();
  });
}

// ── 6. 휴대폰: 입력 중 숨김, 모바일 메뉴 열림 숨김 / 가로 휴대폰 미노출 ──
test('휴대폰 입력 중·메뉴 열림 미노출', async ({ browser }) => {
  const ctx = await newCtx(browser, VPS[2]);
  const page = await ctx.newPage();
  await page.goto('/', { waitUntil: 'networkidle' });
  await scrollElTo(page, 'main section:nth-of-type(2)', 0.5);
  await expect.poll(() => isOn(page)).toBe(true);
  await page.evaluate(() => document.querySelector<HTMLInputElement>('#f-company')!.focus({ preventScroll: true }));
  await expect.poll(() => isOn(page), { message: '입력 중 미노출' }).toBe(false);
  await shot(page, 'home', '390x844', 'input-focus');
  await page.evaluate(() => (document.activeElement as HTMLElement).blur());
  await expect.poll(() => isOn(page)).toBe(true);
  await page.locator('.hamb').tap();
  await expect.poll(() => isOn(page), { message: '모바일 메뉴 열림 미노출' }).toBe(false);
  await shot(page, 'home', '390x844', 'menu-open');
  await ctx.close();
});

for (const pg of PAGES) {
  test(`가로 휴대폰 미노출 ${pg.key}`, async ({ browser }) => {
    const ctx = await newCtx(browser, LANDSCAPE);
    const page = await ctx.newPage();
    await page.goto(pg.path, { waitUntil: 'networkidle' });
    await scrollElTo(page, pg.trigger, 0.5);
    await page.waitForTimeout(500);
    expect(await isOn(page)).toBe(false);
    expect(await page.evaluate(() => getComputedStyle(document.querySelector('.fi')!).display)).toBe('none');
    await shot(page, pg.key, LANDSCAPE.name, 'reached');
    await ctx.close();
  });
}

// ── 7. 미노출 경로 ──
for (const p of ['/kium', '/csr', '/no-such-page']) {
  test(`미설정 경로 렌더 없음 ${p}`, async ({ page }) => {
    await page.goto(p);
    await page.waitForTimeout(400);
    expect(await page.locator('.fi').count()).toBe(0);
  });
}

// ── 8. 접근성: axe(.fi 영역), 숨김 시 포커스 불가, 노출 시 본문 뒤 순서 ──
for (const vp of [VPS[5], VPS[2]]) {
  test(`접근성 ${vp.name}`, async ({ browser }) => {
    const ctx = await newCtx(browser, vp);
    const page = await ctx.newPage();
    await page.goto('/hrd', { waitUntil: 'networkidle' });
    // 숨김 상태: inert 라 포커스 불가
    await page.locator('.fi-cta').focus().catch(() => undefined);
    expect(await page.evaluate(() => !!document.activeElement?.closest('.fi')), '숨김 시 포커스 불가').toBe(false);
    expect(await page.evaluate(() => (document.querySelector('.fi') as HTMLElement).inert)).toBe(true);

    await scrollElTo(page, '#arch', 0.5);
    await expect.poll(() => isOn(page)).toBe(true);
    await page.waitForTimeout(400);
    const axe = await new AxeBuilder({ page }).include('.fi').analyze();
    const whole = await new AxeBuilder({ page }).analyze();
    fs.writeFileSync(path.join(QA, 'measure', `axe-${vp.name}.json`), JSON.stringify({
      fiViolations: axe.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })),
      pageViolations: whole.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })),
    }, null, 1));
    expect(axe.violations, 'axe .fi 위반 0').toEqual([]);

    // 노출 상태: DOM 순서 footer 뒤, 포커스 가능, Tab 으로 닫기까지
    const order = await page.evaluate(() => {
      const f = document.querySelector('#site-footer')!;
      const fi = document.querySelector('.fi')!;
      return !!(f.compareDocumentPosition(fi) & Node.DOCUMENT_POSITION_FOLLOWING) && !(fi as HTMLElement).inert;
    });
    expect(order, 'footer 뒤, 노출 시 inert 해제').toBe(true);
    await page.locator('.fi-cta').focus();
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement?.className)).toBe('fi-close');
    // Esc 로 닫지 않음
    await page.keyboard.press('Escape');
    expect(await isOn(page)).toBe(true);
    await ctx.close();
  });
}

// ── 9. 움직임 줄이기: 전환 없음 ──
test('reduced-motion', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/hrd', { waitUntil: 'networkidle' });
  await scrollElTo(page, '#arch', 0.5);
  await expect.poll(() => isOn(page)).toBe(true);
  const tr = await page.evaluate(() => getComputedStyle(document.querySelector('.fi')!).transitionDuration);
  expect(tr.split(',').every((d) => parseFloat(d) < 0.01)).toBe(true);
  await ctx.close();
});

// ── 10. #inq 해시 직접 진입: 섹션 제목이 GNB·SubNav 에 가리지 않음 (명세 10장 이슈 보정) ──
const HASH_CASES = [
  { key: 'home', url: '/#inq' },
  { key: 'home-ax', url: '/?interest=ax-ai#inq' },
  { key: 'leadership', url: '/leadership#inq' },
  { key: 'hrd', url: '/hrd#inq' },
  { key: 'content', url: '/content#inq' },
];
for (const vp of [VPS[5], VPS[2]]) {
  for (const c of HASH_CASES) {
    test(`해시 진입 ${c.key} ${vp.name}`, async ({ browser }) => {
      const ctx = await newCtx(browser, vp);
      const page = await ctx.newPage();
      await warmFonts(page, c.url);
      await page.goto('about:blank');
      await page.goto(c.url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1200);
      const r = await page.evaluate(() => {
        const nav = document.querySelector('header.nav')!.getBoundingClientRect().bottom;
        const sub = document.querySelector<HTMLElement>('.subnav');
        const subB = sub && sub.offsetParent ? sub.getBoundingClientRect().bottom : 0;
        const inq = document.querySelector('#inq')!;
        const lead = inq.querySelector('.inq-side .lead');
        const title = (lead && lead.getClientRects().length ? lead : inq.querySelector('h2')) ?? inq;
        return { occl: Math.round(Math.max(nav, subB)), sectionTop: Math.round(inq.getBoundingClientRect().top), titleTop: Math.round(title.getBoundingClientRect().top) };
      });
      fs.writeFileSync(path.join(QA, 'measure', `hash-${c.key}-${vp.name}.json`), JSON.stringify(r, null, 1));
      expect(r.titleTop, '섹션 제목 가림 0').toBeGreaterThanOrEqual(r.occl);
      expect(r.sectionTop, '섹션 상단 가림 0').toBeGreaterThanOrEqual(r.occl);
      expect(Math.abs(r.sectionTop - (r.occl + 16)), '섹션 상단 = 가림 경계 + 16').toBeLessThanOrEqual(4);
      await ctx.close();
    });
  }
}

// ── 11. 회귀: 법정 허브 .lg-anchor 해시 위치는 그대로, 플로팅 바 이동은 이중 보정 없음 ──
for (const vp of [VPS[5], VPS[2]]) {
  test(`앵커 회귀 ${vp.name}`, async ({ browser }) => {
    const ctx = await newCtx(browser, vp);
    const page = await ctx.newPage();
    // .lg-anchor scroll-margin 기존 계산: 블록 상단 = 화면 상단 + 72 + 53 + 16 (720 이하도 같은 결과). 스크롤·지연 로드 정착까지 폴링
    await warmFonts(page, '/content');
    for (const id of ['mandatory-courses', 'mandatory-resources', 'mandatory-inquiry']) {
      await page.goto('about:blank');
      await page.goto(`/content#${id}`, { waitUntil: 'networkidle' });
      await expect.poll(() => page.evaluate((i) => Math.abs(Math.round(document.getElementById(i)!.getBoundingClientRect().top) - 141), id), { message: `${id} 위치 유지`, timeout: 6000 })
        .toBeLessThanOrEqual(4);
    }
    // 플로팅 바 이동 (자체 보정): /hrd #inq 상단 = 가림 경계 + 16
    await page.goto('/hrd', { waitUntil: 'networkidle' });
    await scrollElTo(page, '#arch', 0.5);
    await expect.poll(() => isOn(page)).toBe(true);
    if (vp.touch) await page.locator('.fi-cta').tap(); else await page.locator('.fi-cta').click();
    await expect.poll(() => page.evaluate(() => location.hash), { timeout: 6000 }).toBe('#inq');
    // 먼 거리 부드러운 스크롤은 1.5초 이상 걸린다 (해시는 700ms 에 먼저 바뀜). 정착 위치 = 가림 경계 + 16
    await expect.poll(() => page.evaluate(() => Math.abs(Math.round(document.querySelector('#inq')!.getBoundingClientRect().top) - (125 + 16))),
      { message: '바 이동 이중 보정 없음', timeout: 6000 }).toBeLessThanOrEqual(4);
    await ctx.close();
  });
}
