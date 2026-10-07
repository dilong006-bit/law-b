// /kium 인재키움 과정 축소 19 → 11 회귀 단언 (F34·F35 · 261007)
// 기준: ref/kium/spec/KEESS_kium_과정축소19to11_기술명세서_최종_v2.0_261007.md §4
// 실행: BASE=http://localhost:3001 node scripts/verify-kium-f34.mjs
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://localhost:3001';
const DELETED = ['kium-03', 'kium-05', 'kium-06', 'kium-07', 'kium-12', 'kium-13', 'kium-14', 'kium-18'];
const DELETED_NAMES = ['On-Powering', 'Role Up', '협상 스킬', '스피치&프레젠테이션', '구두보고', '플레잉 코치'];
const KEEP = ['kium-01', 'kium-02', 'kium-04', 'kium-08', 'kium-09', 'kium-10', 'kium-11', 'kium-15', 'kium-16', 'kium-17', 'kium-19'];
const OPEN = ['kium-04', 'kium-09', 'kium-10', 'kium-11', 'kium-19'];
const CATS = { '신입·온보딩': 2, '리더십·관리자': 2, 'AI활용': 3, '커뮤니케이션·조직활성화': 3, 'CS·민원응대': 1 };

const results = [];
const ok = (id, pass, detail = '') => { results.push({ id, pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'} ${id} ${detail}`); };

const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

const chips = async () => page.$$eval('[aria-labelledby="kium-cf-cat"] .kium-chip', (els) =>
  els.map((e) => ({ t: e.childNodes[0].textContent.trim(), n: Number(e.querySelector('.cnt')?.textContent) })));
const cardIds = async () => page.$$eval('[id^="kium-cardwrap-"]', (els) => els.map((e) => e.id.replace('kium-cardwrap-', '')));

// A1·A2·A3 전체 보기
await page.goto(`${BASE}/kium?tab=courses#courses`, { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
const ids = await cardIds();
ok('A1 전체 카드 11장', ids.length === 11 && KEEP.every((k) => ids.includes(k)), ids.join(','));
const html = await page.content();
const leaked = DELETED_NAMES.filter((n) => html.includes(n));
ok('A1 삭제 과정명 DOM 0건', leaked.length === 0 && !DELETED.some((d) => ids.includes(d)), leaked.join(',') || '0');
const c1 = await chips();
const catOk = c1[0]?.t === '전체' && c1[0]?.n === 11 && c1.length === 6 &&
  Object.entries(CATS).every(([t, n]) => c1.some((c) => c.t === t && c.n === n));
ok('A2 분야 칩 전체11·5종 카운트', catOk, JSON.stringify(c1));
ok('A2 승진자·비즈니스 역량 칩 0', !c1.some((c) => c.t === '승진자' || c.t === '비즈니스 역량'));
const seg = await page.evaluate(() => document.body.innerText.match(/전체과정\s*(\d+)[\s\S]{0,40}?공개교육\s*(\d+)/)?.slice(1));
ok('A3 세그먼트 전체과정 11 / 공개교육 5', seg?.[0] === '11' && seg?.[1] === '5', JSON.stringify(seg));

// A4·A5·A6 공개교육 보기
await page.goto(`${BASE}/kium?tab=courses&mode=open#courses`, { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
const total = await page.$eval('[aria-labelledby="kium-cf-month"] .kium-chip', (e) => e.getAttribute('aria-label')).catch(() => '');
ok('A4 공개교육 회차 합계 15', /15개 회차/.test(total), total);
const months = await page.$$eval('[aria-labelledby="kium-cf-month"] .kium-chip', (els) => els.map((e) => e.getAttribute('aria-label')));
ok('A5 월별 10월 5 · 11월 6 · 12월 4', months.includes('10월, 5개 회차') && months.includes('11월, 6개 회차') && months.includes('12월, 4개 회차'), months.join(' | '));
const oids = await cardIds();
ok('A6 공개교육 카드 5장', oids.length === 5 && OPEN.every((k) => oids.includes(k)), oids.join(','));
const c2 = await chips();
ok('A6 공개교육 분야 칩 0건 없음', c2.every((c) => c.n > 0) && c2[0]?.n === 5, JSON.stringify(c2));

// A7 죽은 딥링크
errors.length = 0;
for (const q of ['course=kium-05', 'cat=roleup', 'cat=business', 'course=kium-14&session=report-r1&consult=1']) {
  const r = await page.goto(`${BASE}/kium?tab=courses&${q}#courses`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const n = (await cardIds()).length;
  ok(`A7 ${q} 정상`, r.status() === 200 && n >= 5, `status ${r.status()} cards ${n}`);
}
ok('A7 콘솔·페이지 에러 0', errors.length === 0, errors.slice(0, 3).join(' / '));

// A8 잔여 과정 상세 오픈
await page.goto(`${BASE}/kium?tab=courses#courses`, { waitUntil: 'networkidle' });
for (const id of ['kium-04', 'kium-01']) {
  await page.locator(`#kium-cardwrap-${id} .kium-card`).first().click();
  await page.waitForTimeout(500);
  const exp = await page.locator(`#kium-cardwrap-${id} .kium-card`).first().getAttribute('aria-expanded');
  ok(`A8 ${id} 상세 오픈`, exp === 'true', `aria-expanded=${exp}`);
}

// A9 타 라우트
for (const p of ['/', '/content', '/hrd', '/leadership', '/ax-ai']) {
  const r = await page.goto(`${BASE}${p}`, { waitUntil: 'domcontentloaded' });
  ok(`A9 ${p} 200`, r.status() === 200);
}

await browser.close();
const fail = results.filter((r) => !r.pass).length;
console.log(`\n${results.length - fail}/${results.length} PASS`);
process.exit(fail ? 1 : 0);
