// 인재키움 공개교육 신청 유도 회귀 단언 (F40 히어로 · F41 GNB 칩 · F42 소개서 · F43 /kium CTA · 261007)
// 기준: ref/kium/spec/KEESS_kium_공개교육신청유도_F40-F43_기술명세서_v1.0_261007.md §7
// 브라우저 없이 서버 HTML(SSG)·CSS만 확인한다. 실행: BASE=http://localhost:3001 node scripts/verify-kium-f40.mjs
const BASE = process.env.BASE || 'http://localhost:3001';
const results = [];
const ok = (id, pass, detail = '') => { results.push(pass); console.log(`${pass ? 'PASS' : 'FAIL'} ${id} ${detail}`); };
const text = (h) => h.replace(/<!-- -->/g, '').replace(/&amp;/g, '&');

try {
  /* ── F40 홈 히어로 ─────────────────────────────────────────── */
  const hr = await fetch(`${BASE}/`);
  const home = text(await hr.text());
  ok('H1 / 200', hr.status === 200, `status ${hr.status}`);
  const iLegal = home.indexOf('data-slide="legal"');
  const iKium = home.indexOf('data-slide="kium-open"');
  ok('H2 법정 1 · 공개교육 2 (SSG 순서)', iLegal > 0 && iKium > iLegal, `legal@${iLegal} kium@${iKium}`);
  ok('H3 슬라이드 7장', (home.match(/class="hero-slide/g) || []).length === 7);
  const kium = home.slice(iKium, home.indexOf('class="hero-slide', iKium + 10));
  ok('H4 태그 「공개교육」', />공개교육</.test(kium));
  const badge = kium.match(/다음 개강 <b>(\d{1,2}\.\d{1,2}\(.\))<\/b>/);
  ok('H5 다음 개강 배지', !!badge, badge ? badge[1] : '없음(회차 0건이면 정상)');
  ok('H6 메인 카피', kium.includes('필요한 직원만,<br/>필요한 교육으로') || kium.includes('필요한 직원만,<br>필요한 교육으로'));
  ok('H7 서브 카피(원고 그대로)', kium.replace(/<br[^>]*>/g, '').includes('단 1명도 신청 가능한 공개교육으로 교육 운영의 부담은 낮추고, 필요한 역량은 바로 채워보세요.'));
  const a1 = kium.match(/<a[^>]*data-ga-id="hero_kium_open"[^>]*>([^<]*)</);
  ok('H8 1차 [공개교육 신청] → 공개교육 보기', !!a1 && a1[1] === '공개교육 신청' && a1[0].includes('href="/kium?tab=courses&mode=open"'), a1 ? a1[1] : '없음');
  ok('H9 보조 링크 → /kium', kium.includes('href="/kium"') && kium.includes('인재키움 프리미엄 알아보기'));
  ok('H10 C안 첫 장 스크립트', home.includes("keess_hero_start") && home.includes('data-hero-start'));
  ok('H11 정부지원 슬라이드 비노출', !home.includes('훈련비의 90~95%는 환급 받고'));

  /* ── F42 과정 소개서(게시 스위치 off 기준) ─────────────────── */
  const kr = await fetch(`${BASE}/kium`);
  const kiumHtml = text(await kr.text());
  const brochureOn = home.includes('hero_kium_brochure') || kiumHtml.includes('kium_brochure_download');
  if (brochureOn) {
    const m = kiumHtml.match(/class="kium-brochure" href="([^"]+)"/);
    const pr = m ? await fetch(`${BASE}${encodeURI(m[1])}`) : null;
    ok('B1 소개서 on: PDF 200', !!pr && pr.status === 200, m ? m[1] : '링크 없음');
  } else {
    ok('B1 소개서 off: 버튼 0건', !home.includes('과정 소개서 받기') && !kiumHtml.includes('과정 소개서 받기'));
  }

  /* ── F43 /kium 상단 CTA ───────────────────────────────────── */
  ok('K1 /kium 200', kr.status === 200, `status ${kr.status}`);
  const s = kiumHtml.indexOf('class="kium-hero-cta');
  const cta = kiumHtml.slice(s, kiumHtml.indexOf('</div>', s));
  const i1 = cta.indexOf('>공개교육 신청하기<');
  const i2 = cta.indexOf('>문의하기<');
  ok('K2 순서 [공개교육 신청하기] → [문의하기]', s > 0 && i1 > 0 && i2 > i1);
  ok('K3 1차 딥링크 · GA', /class="btn btn-ink" href="\/kium\?tab=courses&mode=open" data-ga-id="kium_hero_open"/.test(cta));
  ok('K4 2차 #inq · GA', /class="kium-btn-ghost" href="#inq" data-ga-id="kium_hero_inquiry"/.test(cta));
  ok('K5 구 라벨 0건(상단)', !cta.includes('지원대상 확인') && !cta.includes('신청 문의'));
  ok('K6 FAQ 하단 [신청 문의] 유지(범위 밖)', /faq-cta[^>]*>신청 문의</.test(kiumHtml));

  /* ── F41 GNB 칩 · F40 CSS ─────────────────────────────────── */
  const hrefs = [...new Set([...home.matchAll(/href="(\/_next\/static\/css\/[^"]+\.css)"/g)].map((m) => m[1]))];
  let css = '';
  for (const h of hrefs) css += await (await fetch(`${BASE}${h}`)).text();
  ok('C1 CSS 수집', css.length > 0, `${hrefs.length}개`);
  const chip = css.match(/\.nav-chip\{[^}]*\}/)?.[0] || '';
  ok('C2 칩 높이 36 · 글자 14', /height:36px/.test(chip) && /font-size:14px/.test(chip), chip.slice(0, 80));
  const shim = css.match(/\.nav-chip \.shimmer\{[^}]*\}/)?.[0] || '';
  ok('C3 반짝임 2회 후 정지(무한 반복 0)', /animation:chip-shimmer 2\.2s[^;}]*\.4s 2 both/.test(shim) && !/infinite/.test(shim), shim.match(/animation:[^;}]*/)?.[0] || '');
  ok('C4 C안 하이드레이션 전 규칙', css.includes('html[data-hero-start=kium] .hero:not([data-hero-ready])') || css.includes('html[data-hero-start="kium"] .hero:not([data-hero-ready])'));
} catch (e) {
  ok('실행 오류', false, String(e).split('\n')[0]);
}
const fail = results.filter((p) => !p).length;
console.log(`\n${results.length - fail}/${results.length} PASS`);
process.exit(fail ? 1 : 0);
