// 인재키움 과정 소개서 다운로드 회귀 단언 (F44 게시 · F45 라벨·메타 고도화 · 261013) · 22단언
// 기준: F44 기술명세서 §6 + ref/kium/spec/KEESS_kium_과정소개서라벨_F45_전략및기술명세서_v1.0_261013.md §5
// 브라우저 없이 서버 HTML(SSG)·정적 파일만 확인한다.
// 실행: BASE=http://localhost:3001 EXPECT_BYTES=<실측 바이트> node scripts/verify-kium-f44.mjs
const BASE = process.env.BASE || 'http://localhost:3001';
const EXPECT_BYTES = Number(process.env.EXPECT_BYTES || 0);
const SERVER_PATH = '/downloads/kgeduone_kium_premium_course_overview_2026.pdf';
const VERSION = '261008';
const DL_NAME = 'KG에듀원_2026_인재키움프리미엄_과정개요서.pdf';
const results = [];
const ok = (id, pass, detail = '') => { results.push(pass); console.log(`${pass ? 'PASS' : 'FAIL'} ${id} ${detail}`); };
const text = (h) => h.replace(/<!-- -->/g, '').replace(/&amp;/g, '&');

try {
  const kr = await fetch(`${BASE}/kium`);
  const kium = text(await kr.text());
  ok('D1 /kium 200', kr.status === 200, `status ${kr.status}`);

  const tags = kium.match(/<a[^>]*class="kium-brochure"[^>]*>/g) || [];
  ok('D2 다운로드 링크 1건', tags.length === 1, `${tags.length}건`);
  const tag = tags[0] || '';
  const attr = (n) => (tag.match(new RegExp(`\\s${n}="([^"]*)"`)) || [])[1];
  ok('D3 href = 영문 서버 파일 + ?v=', attr('href') === `${SERVER_PATH}?v=${VERSION}`, attr('href') || '없음');
  ok('D4 download = 표시명', attr('download') === DL_NAME, attr('download') || '없음');
  ok('D5 GA id', attr('data-ga-id') === 'kium_brochure_download');
  ok('D6 type=application/pdf', attr('type') === 'application/pdf');

  const s = kium.indexOf('class="kium-brochure"');
  const body = kium.slice(s, kium.indexOf('</a>', s));
  ok('D7 라벨 「과정 소개서 받기」 (수치 접두 없음)', body.includes('과정 소개서 받기') && !/\d+개 과정 소개서/.test(body));
  const meta = body.match(/class="meta">([^<]*)</);
  ok('D8 메타 「(PDF NNNKB)」 형식', !!meta && /^\(PDF (\d{1,4}KB|\d+\.\dMB)\)$/.test(meta[1]), meta ? meta[1] : '없음');

  const segRow = kium.lastIndexOf('class="kium-modeseg-row"', s);
  const segEnd = kium.indexOf('class="kium-viewseg kium-modeseg"', segRow);
  ok('D9 위치: 세그먼트 행 안 (세그먼트 뒤)', segRow > 0 && segEnd > segRow && s > segEnd);

  const pr = await fetch(`${BASE}${SERVER_PATH}?v=${VERSION}`);
  const buf = Buffer.from(await pr.arrayBuffer());
  ok('P1 PDF 200', pr.status === 200, `status ${pr.status}`);
  ok('P2 content-type pdf', (pr.headers.get('content-type') || '').includes('application/pdf'), pr.headers.get('content-type') || '');
  ok('P3 평문 PDF (%PDF- · DRM 아님)', buf.subarray(0, 5).toString('latin1') === '%PDF-', JSON.stringify(buf.subarray(0, 5).toString('latin1')));
  ok('P4 바이트 = 실측값', EXPECT_BYTES > 0 && buf.length === EXPECT_BYTES, `${buf.length} / 기대 ${EXPECT_BYTES || '미지정'}`);
  const p0 = await fetch(`${BASE}${SERVER_PATH}`, { method: 'HEAD' });
  ok('P5 ?v 없는 경로 200 (교체 운영)', p0.status === 200, `status ${p0.status}`);
  const old = await fetch(`${BASE}${encodeURI('/downloads/KG에듀원_인재키움프리미엄_공개교육_과정소개서.pdf')}`, { method: 'HEAD' });
  ok('P6 구 한글 경로 404', old.status === 404, `status ${old.status}`);

  const hr = await fetch(`${BASE}/`);
  const home = text(await hr.text());
  ok('H1 홈 200', hr.status === 200);
  ok('H2 홈 히어로 개요서 버튼 0건 (showInHero=false)', !home.includes('hero_kium_brochure') && !home.includes('과정개요서 받기'));
  ok('H3 홈 공개교육 슬라이드 1차·보조 링크 유지', home.includes('data-ga-id="hero_kium_open"') && home.includes('data-ga-id="hero_kium_more"'));

  ok('R1 구 라벨 0건 (F44 「과정개요서 받기」)', !kium.includes('과정개요서 받기'));
  ok('R2 구 파일명 0건', !kium.includes('공개교육_과정소개서'));

  /* ── F45 메타 시각 위계 (CSS) ── */
  const hrefs = [...new Set([...kium.matchAll(/href="(\/_next\/static\/css\/[^"]+\.css)"/g)].map((m) => m[1]))];
  let css = '';
  for (const h of hrefs) css += await (await fetch(`${BASE}${h}`)).text();
  const metaRule = css.match(/\.kium-brochure \.meta\{[^}]*\}/)?.[0] || '';
  ok('C1 메타 12px · 400 (가늘게)', /font-size:12px/.test(metaRule) && /font-weight:400/.test(metaRule), metaRule.slice(0, 120));
  ok('C2 메타 색 #6b7079 (AA 4.77:1)', /color:#6b7079/i.test(metaRule));
} catch (e) {
  ok('실행 오류', false, String(e).split('\n')[0]);
}
const fail = results.filter((p) => !p).length;
console.log(`\n${results.length - fail}/${results.length} PASS`);
process.exit(fail ? 1 : 0);
