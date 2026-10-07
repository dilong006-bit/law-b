// /kium 회귀 단언 (F39 수강신청 종료 회차 숨김 + F38·F37·F36·F34 누적 · 261007)
// 기준: ref/kium/spec/KEESS_kium_회차숨김_F39_기술명세서_최종_v1.0_261007.md §4
// verify-kium-f38의 B2(15개)·B3·B4(15 복귀) 수치는 F39로 10이 되며 이 스크립트가 대체한다.
// 실행: BASE=http://localhost:3001 node scripts/verify-kium-f39.mjs   (선택: PW_CHROMIUM=브라우저 실행 경로)
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
  // B1 전체과정 보기: 필터 영역 미생성 · 카드 11 · 삭제 과정 0 · 세그먼트 11/5
  await page.goto(`${BASE}/kium?tab=courses#courses`, NAV);
  await page.waitForTimeout(600);
  const r1 = await rows();
  ok('B1 전체과정 보기: 필터 영역 미생성(분야·기간·상태 0)', !r1.vf && !r1.cat && !r1.month && !r1.st, JSON.stringify(r1));
  const ids = await cardIds();
  ok('B1 전체 카드 11장', ids.length === 11 && KEEP.every((k) => ids.includes(k)), ids.join(','));
  const html = await page.content();
  const leaked = DELETED_NAMES.filter((n) => html.includes(n));
  ok('B1 삭제 과정명 DOM 0건', leaked.length === 0, leaked.join(',') || '0');
  const seg = await page.evaluate(() => document.body.innerText.match(/전체과정\s*(\d+)[\s\S]{0,40}?공개교육\s*(\d+)/)?.slice(1));
  ok('B1 세그먼트 11 / 5', seg?.[0] === '11' && seg?.[1] === '5', JSON.stringify(seg));
  const labels = await page.$$eval('[id^="kium-cardwrap-"] .kium-lab.cat', (els) => els.length);
  ok('B1 카드 분야 라벨 유지(11)', labels === 11, `labels ${labels}`);

  // B2 공개교육 보기: 분야·기간 행 0 · 모집 상태 행 존재(검토용 시드·칩) · 회차 15 · 카드 5
  await page.goto(`${BASE}/kium?tab=courses&mode=open#courses`, NAV);
  await page.waitForTimeout(600);
  const r2 = await rows();
  ok('B2 공개교육 보기: 분야·기간 행 미생성', !r2.cat && !r2.month, JSON.stringify(r2));
  ok('B2 모집 상태 행 노출(F37: 상태 2종 이상 또는 검토용 칩)', r2.st && r2.vf, JSON.stringify(r2));
  const head = await page.$eval('.kium-modehead-t', (e) => e.textContent.replace(/\s+/g, ' ').trim()).catch(() => '');
  ok('B2 헤더 범위·회차 수 파생(11~12월 · 10개)', /11~12월/.test(head) && /10\s*개/.test(head), head);
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
    ok('B3 [전체] 복귀 → 10개', /10\s*개/.test(h2), h2);
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
    ok('B4 Empty Case → 필터 초기화 → 10개 복귀', empty === 1 && /10\s*개/.test(h3), `empty=${empty} | ${h3}`);
  } else {
    ok('B4 검토용 칩(SHOW_REVIEW_CHIP)', true, '미노출 설정: 생략');
  }

  // B9 숨김 회차 5건(10월 1회차) 미노출 · 전체 일정 펼침 포함
  await page.goto(`${BASE}/kium?tab=courses&mode=open#courses`, NAV);
  await page.waitForTimeout(600);
  const more = page.locator('button', { hasText: /전체 일정/ }).first();
  if (await more.count()) { await more.click().catch(() => {}); await page.waitForTimeout(400); }
  const txt = await page.evaluate(() => document.body.innerText);
  const dates = txt.match(/\d{1,2}\.\d{1,2}\([월화수목금토일]\)/g) || [];
  const HIDDEN = ['10.12(', '10.14(', '10.19(', '10.21(', '10.26('];
  const leakedDates = HIDDEN.filter((d) => txt.includes(d));
  ok('B9 숨김 회차 일자 미노출(10.12·10.14·10.19·10.21·10.26)', dates.length > 0 && leakedDates.length === 0, `노출 일자 ${dates.length}건 · 누출 ${leakedDates.join(',') || 0}`);
  ok('B9 가장 빠른 노출 회차 11.2(월)', dates.includes('11.2(월)') && !dates.some((d) => d.startsWith('10.')), dates.slice(0, 4).join(' '));
  errors.length = 0;
  const r9 = await page.goto(`${BASE}/kium?tab=courses&mode=open&consult=1&course=kium-09&session=agent-r1#courses`, NAV);
  await page.waitForTimeout(600);
  ok('B9 숨김 회차 딥링크(agent-r1) 오류 없음', r9.status() === 200 && errors.length === 0 && (await cardIds()).length === 5, `status ${r9.status()} err ${errors.length}`);

  // B5 구 딥링크: ?cat= · ?month= 는 두 보기 모두 무시하고 주소창에서 제거
  errors.length = 0;
  const DL = [
    ['cat=ai', 11],
    ['cat=roleup', 11],
    ['cat=ai&month=11', 11],
    ['mode=open&cat=ai', 5],
    ['mode=open&month=12', 5],
    ['mode=open&cat=ai&month=11', 5],
  ];
  for (const [q, want] of DL) {
    const res = await page.goto(`${BASE}/kium?tab=courses&${q}#courses`, NAV);
    await page.waitForTimeout(500);
    const url = new URL(page.url());
    const n = (await cardIds()).length;
    ok(`B5 ${q} → 카드 ${want} · 쿼리 제거`, res.status() === 200 && n === want && !url.searchParams.has('cat') && !url.searchParams.has('month'), `status ${res.status()} cards ${n} url ${url.search}`);
  }

  // B6 보기 전환 왕복: 카드 11 ↔ 5, URL에 cat·month 없음
  await page.goto(`${BASE}/kium?tab=courses#courses`, NAV);
  await page.waitForTimeout(500);
  await page.locator('.kium-modeseg .kium-viewseg-btn').nth(1).click();
  await page.waitForTimeout(500);
  const uo = new URL(page.url());
  const on = (await cardIds()).length;
  await page.locator('.kium-modeseg .kium-viewseg-btn').nth(0).click();
  await page.waitForTimeout(500);
  const ua = new URL(page.url());
  const an = (await cardIds()).length;
  ok('B6 왕복: 공개 5장 → 전체 11장 · URL 정상', on === 5 && an === 11 && !uo.searchParams.has('cat') && !ua.searchParams.has('cat') && !ua.searchParams.has('month'), `open ${on} ${uo.search} / all ${an} ${ua.search}`);
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
