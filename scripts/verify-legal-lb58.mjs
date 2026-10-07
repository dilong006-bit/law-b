// /content 법정 허브 교육 프로세스 문구 회귀 단언 (legal-B upgrade-05 LB58 · 261007)
// 기준: ref/legal/TECHSPEC_KEESS_26827_legal-B_v1.0_upgrade-05.md §4
// 브라우저 없이 서버 HTML(SSG)만 확인한다. 실행: BASE=http://localhost:3001 node scripts/verify-legal-lb58.mjs
const BASE = process.env.BASE || 'http://localhost:3001';
const results = [];
const ok = (id, pass, detail = '') => { results.push(pass); console.log(`${pass ? 'PASS' : 'FAIL'} ${id} ${detail}`); };

try {
  const res = await fetch(`${BASE}/content`);
  const html = await res.text();
  ok('L1 /content 200', res.status === 200, `status ${res.status}`);
  const block = html.slice(html.indexOf('id="mandatory-process"'));
  ok('L2 블록 존재(#mandatory-process)', html.includes('id="mandatory-process"'));
  ok('L3 키커 「교육 프로세스」', block.includes('>교육 프로세스<'));
  ok('L4 제목 「신청부터 수료까지 손쉽게!」', block.includes('신청부터 수료까지 손쉽게!'));
  ok('L5 구 문구 0건(도입 절차 · 수료까지 4단계)', !html.includes('>도입 절차<') && !html.includes('신청부터 수료까지 4단계'));
  const labels = ['과정 선택 및 신청', '맞춤 구성 확정', '교육 운영 및 독려', '손쉬운 수료 완료'];
  ok('L6 4단계 라벨 무변경', labels.every((l) => block.includes(l)));
  ok('L7 [빠른 상담 신청] 버튼 유지', block.includes('빠른 상담 신청'));
} catch (e) {
  ok('실행 오류', false, String(e).split('\n')[0]);
}
const fail = results.filter((p) => !p).length;
console.log(`\n${results.length - fail}/${results.length} PASS`);
process.exit(fail ? 1 : 0);
