// /kium 필터 간소화 회귀 단언 (F36 공개교육 보기 분야·기간 필터 제거 · F37 모집 상태 행 노출 조건 · 261007)
// 기준: ref/kium/spec/KEESS_kium_필터간소화_F36F37_기술명세서_최종_v1.0_261007.md §6
// 선행: F34·F35(과정 11 · 공개교육 5과정 15회차). verify-kium-f34의 A5(기간 칩)·A6(공개교육 분야 칩) 단언은 이 스크립트가 대체한다.
// 실행: BASE=http://localhost:3001 node scripts/verify-kium-f36.mjs   (선택: PW_CHROMIUM=브라우저 실행 경로)
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://localhost:3001';
const KEEP = ['kium-01', 'kium-02', 'kium-04', 'kium-08', 'kium-09', 'kium-10', 'kium-11', 'kium-15', 'kium-16', 'kium-17', 'kium-19'];
const OPEN = ['kium-04', 'kium-09', 'kium-10', 'kium-11', 'kium-19'];
const DELETED_NAMES = ['On-Powering', 'Role Up', '협상 스킬', '스피치&프레젠테이션', '구두보고', '플레잉 코치'];
const NAV = { waitUntil: 'networkidle', timeout: 90000 };

const results = [];
const ok = (id, pass, detail = '') => { results.push({ id, pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'} ${id} ${detail}`); };

const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

const cardIds = () => page.$$eval('[id^="kium-cardwrap-"]', (els) => els.map((e) => e.id.replace('kium-cardwrap-', '')));
const rows = () => page.evaluate(() => ({
  cat: !!document.querySelector('#kium-cf-cat'),
  month: !!document.querySelector('#kium-cf-month'),
  st: !!document.querySelector('#kium-cf-st'),
  vf: !!document.querySelector('.kium-vfilters'),
}));

try {
  // B1 전체과정 보기: 분야 행 유지(전체 11 · 5종) · 기간·상태 행 없음 · 카드 11 · 삭제 과정 0
  await page.goto(`${BASE}/kium?tab=courses#courses`, NAV);
  await page.waitForTimeout(600);
  const r1 = await rows();
  ok('B1 전체과정 보기: 분야 행만 노출', r1.cat && !r1.month && !r1.st, JSON.stringify(r1));
  const c1 = await page.$$eval('[aria-labelledby="kium-cf-cat"] .kium-chip', (els) =>
    els.map((e) => ({ t: e.childNodes[0].textContent.trim(), n: Number(e.querySelector('.cnt')?.textContent) })));
  const CATS = { '신입·온보딩': 2, '리더십·관리자': 2, 'AI활용': 3, '커뮤니케이션·조직활성화': 3, 'CS·민원응대': 1 };
  ok('B1 분야 칩 전체 11 · 5종 카운트', c1.length === 6 && c1[0]?.n === 11 && Object.entries(CATS).every(([t, n]) => c1.some((c) => c.t === t && c.n === n)), JSON.stringify(c1));
  const ids = await cardIds();
  ok('B1 전체 카드 11장', ids.length === 11 && KEEP.every((k) => ids.includes(k)), ids.join(','));
  const html = await page.content();
  const leaked = DELETED_NAMES.filter((n) => html.includes(n));
  ok('B1 삭제 과정명 DOM 0건', leaked.length === 0, leaked.join(',') || '0');
  const seg = await page.evaluate(() => document.body.innerText.match(/전체과정\s*(\d+)[\s\S]{0,40}?공개교육\s*(\d+)/)?.slice(1));
  ok('B1 세그먼트 11 / 5', seg?.[0] === '11' && seg?.[1] === '5', JSON.stringify(seg));
  await page.locator('[aria-labelledby="kium-cf-cat"] .kium-chip', { hasText: 'AI활용' }).click();
  await page.waitForTimeout(400);
  const aiIds = await cardIds();
  ok('B1 분야 필터 동작(AI활용 → 3장 · ?cat=ai)', aiIds.length === 3 && new URL(page.url()).searchParams.get('cat') === 'ai', `${aiIds.join(',')} ${new URL(page.url()).search}`);

  // B2 공개교육 보기: 분야·기간 행 0 · 모집 상태 행 존재(검토용 시드·칩) · 회차 15 · 카드 5
  await page.goto(`${BASE}/kium?tab=courses&mode=open#courses`, NAV);
  await page.waitForTimeout(600);
  const r2 = await rows();
  ok('B2 공개교육 보기: 분야·기간 행 미생성', !r2.cat && !r2.month, JSON.stringify(r2));
  ok('B2 모집 상태 행 노출(F37: 상태 2종 이상 또는 검토용 칩)', r2.st && r2.vf, JSON.stringify(r2));
  const head = await page.$eval('.kium-modehead-t', (e) => e.textContent.replace(/\s+/g, ' ').trim()).catch(() => '');
  ok('B2 헤더 범위·회차 수 파생(10~12월 · 15개)', /10~12월/.test(head) && /15\s*개/.test(head), head);
  const oids = await cardIds();
  ok('B2 공개교육 카드 5장', oids.length === 5 && OPEN.every((k) => oids.includes(k)), oids.join(','));

  // B3 모집 상태 필터 동작: 첫 상태 칩 → 헤더 반영 · 회차 감소 · 필터 초기화로 복귀
  const stChips = await page.$$('[aria-labelledby="kium-cf-st"] .kium-chip-st');
  if (stChips.length >= 1) {
    const label = (await stChips[0].innerText()).replace(/\d+/g, '').trim();
    const n = Number((await stChips[0].$eval('.cnt', (e) => e.textContent)).trim());
    await stChips[0].click();
    await page.waitForTimeout(400);
    const h = await page.$eval('.kium-modehead-t', (e) => e.textContent.replace(/\s+/g, ' ').trim()).catch(() => '');
    ok('B3 상태 칩 선택 → 헤더에 상태명 · 회차 수 반영', h.includes(label) && new RegExp(`${n}\\s*개`).test(h), `${label} ${n} | ${h}`);
    await page.locator('[aria-labelledby="kium-cf-st"] .kium-chip').first().click();
    await page.waitForTimeout(300);
    const h2 = await page.$eval('.kium-modehead-t', (e) => e.textContent.replace(/\s+/g, ' ').trim()).catch(() => '');
    ok('B3 [전체] 복귀 → 15개', /15\s*개/.test(h2), h2);
  } else {
    ok('B3 상태 칩 존재', false, '상태 칩 0개');
  }

  // B4 Empty Case(검토용) → 빈 상태 → [필터 초기화] 복귀
  const review = page.locator('.kium-chip-review');
  if (await review.count()) {
    await review.click();
    await page.waitForTimeout(300);
    const empty = await page.locator('.kium-empty2').count();
    await page.locator('.kium-empty2 .kium-chip').click();
    await page.waitForTimeout(300);
    const h3 = await page.$eval('.kium-modehead-t', (e) => e.textContent.replace(/\s+/g, ' ').trim()).catch(() => '');
    ok('B4 Empty Case → 필터 초기화 → 15개 복귀', empty === 1 && /15\s*개/.test(h3), `empty=${empty} | ${h3}`);
  } else {
    ok('B4 검토용 칩(SHOW_REVIEW_CHIP)', true, '미노출 설정: 생략');
  }

  // B5 딥링크: 전체과정 ?cat= 유지 · 공개교육 ?cat= 무시·제거 · ?month= 항상 제거
  errors.length = 0;
  const DL = [
    ['cat=ai', 3, 'ai'],
    ['cat=roleup', 11, 'roleup'],
    ['cat=ai&month=11', 3, 'ai'],
    ['mode=open&cat=ai', 5, null],
    ['mode=open&month=12', 5, null],
    ['mode=open&cat=ai&month=11', 5, null],
  ];
  for (const [q, want, keepCat] of DL) {
    const res = await page.goto(`${BASE}/kium?tab=courses&${q}#courses`, NAV);
    await page.waitForTimeout(500);
    const url = new URL(page.url());
    const n = (await cardIds()).length;
    const catOk = keepCat === null ? !url.searchParams.has('cat') : true;
    ok(`B5 ${q} → 카드 ${want}`, res.status() === 200 && n === want && catOk && !url.searchParams.has('month'), `status ${res.status()} cards ${n} url ${url.search}`);
  }

  // B6 보기 전환 왕복: 분야 선택은 전체과정 보기에만 유지, 공개교육 보기 URL에는 cat 없음
  await page.goto(`${BASE}/kium?tab=courses&cat=ai#courses`, NAV);
  await page.waitForTimeout(500);
  await page.locator('.kium-modeseg .kium-viewseg-btn').nth(1).click();
  await page.waitForTimeout(500);
  const uo = new URL(page.url());
  const on = (await cardIds()).length;
  await page.locator('.kium-modeseg .kium-viewseg-btn').nth(0).click();
  await page.waitForTimeout(500);
  const ua = new URL(page.url());
  const an = (await cardIds()).length;
  ok('B6 왕복: 공개 5장·cat 없음 → 전체 복귀 AI 3장·cat=ai', on === 5 && !uo.searchParams.has('cat') && an === 3 && ua.searchParams.get('cat') === 'ai', `open ${on} ${uo.search} / all ${an} ${ua.search}`);
  ok('B6 콘솔·페이지 에러 0', errors.length === 0, errors.slice(0, 3).join(' / '));
  await page.goto(`${BASE}/kium?tab=courses#courses`, NAV);
  await page.waitForTimeout(400);

  // B7 상세 패널 · 모바일 레이아웃
  await page.locator('#kium-cardwrap-kium-04 .kium-card').first().click();
  await page.waitForTimeout(500);
  ok('B7 kium-04 상세 오픈', (await page.locator('#kium-cardwrap-kium-04 .kium-card').first().getAttribute('aria-expanded')) === 'true');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE}/kium?tab=courses&mode=open#courses`, NAV);
  await page.waitForTimeout(600);
  const ovf = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  ok('B7 MO 390 가로 넘침 0', ovf <= 0, `overflow ${ovf}px`);

  // B8 타 라우트
  for (const p of ['/', '/content', '/hrd', '/leadership', '/ax-ai']) {
    const res = await page.goto(`${BASE}${p}`, { waitUntil: 'domcontentloaded', timeout: 90000 });
    ok(`B8 ${p} 200`, res.status() === 200);
  }
} catch (e) {
  ok('실행 오류', false, String(e).split('\n')[0]);
}

await browser.close();
const fail = results.filter((r) => !r.pass).length;
console.log(`\n${results.length - fail}/${results.length} PASS`);
process.exit(fail ? 1 : 0);
